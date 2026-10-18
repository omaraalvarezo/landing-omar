import { notifyKitPayment, type KitMailKind, type KitMailResult } from './kit-mail';
import {
  claimKitMailLock,
  createKitDownloadToken,
  getKitOrderByReference,
  isKitDownloadToken,
  releaseKitMailLock,
  saveKitOrder,
  type KitOrder,
  type KitPaymentStatus,
} from './kit-orders';
import { getProduct, productAmountInCents, type ProductId } from './products';
import type { WompiTransaction } from './wompi';

export type KitSettlement =
  | { ok: true; order: KitOrder; email: KitMailResult | 'skipped' }
  | { ok: false; reason: 'NOT_FOUND' | 'MISMATCH' };

function statusFromTransaction(status: WompiTransaction['status']): KitPaymentStatus {
  if (status === 'APPROVED' || status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') return status;
  return 'PENDING';
}

function grantDownload(order: KitOrder, now: string, downloadDays: number): void {
  if (!isKitDownloadToken(order.downloadToken) || !order.downloadExpiresAt) {
    order.downloadToken = createKitDownloadToken();
    order.downloadExpiresAt = new Date(Date.parse(now) + downloadDays * 24 * 60 * 60 * 1_000).toISOString();
  }
}

export async function settleKitPayment(
  transaction: WompiTransaction,
  parsed: { product: ProductId; amountInCents: number },
): Promise<KitSettlement> {
  const { amountInCents } = parsed;
  const product = getProduct(parsed.product);
  if (
    !product ||
    amountInCents !== productAmountInCents(product.id) ||
    transaction.currency !== 'COP' ||
    transaction.amount_in_cents !== amountInCents
  ) {
    return { ok: false, reason: 'MISMATCH' };
  }

  const existing = await getKitOrderByReference(transaction.reference);
  if (!existing) return { ok: false, reason: 'NOT_FOUND' };
  // `getKitOrderByReference` ya normaliza las órdenes viejas sin `product` a `talleres`.
  if (existing.amountInCents !== amountInCents || existing.product !== product.id) {
    return { ok: false, reason: 'MISMATCH' };
  }

  const now = new Date().toISOString();
  const order: KitOrder = {
    ...existing,
    product: product.id,
    updatedAt: now,
    paymentMethod: String(transaction.payment_method_type || '').slice(0, 60) || existing.paymentMethod,
    statusMessage: String(transaction.status_message || '').slice(0, 240) || existing.statusMessage,
  };

  let emailKind: KitMailKind | null = null;
  const approvedIds = new Set(order.approvedTransactionIds || []);

  if (transaction.status === 'APPROVED') {
    const double = order.status === 'APPROVED' && Boolean(order.transactionId) && order.transactionId !== transaction.id;
    approvedIds.add(transaction.id);
    order.approvedTransactionIds = [...approvedIds];
    order.status = 'APPROVED';
    if (!double) order.transactionId = transaction.id;
    order.approvedAt = order.approvedAt || now;
    grantDownload(order, now, product.downloadDays);
    if (double) emailKind = 'double';
    else if (!order.notifiedAt) emailKind = 'approved';
  } else if (transaction.status === 'VOIDED' && order.transactionId === transaction.id && approvedIds.has(transaction.id)) {
    order.status = 'VOIDED';
    order.voidedTransactionIds = [...new Set([...(order.voidedTransactionIds || []), transaction.id])];
    delete order.downloadToken;
    delete order.downloadExpiresAt;
    emailKind = 'voided';
  } else if (order.status !== 'APPROVED') {
    order.status = statusFromTransaction(transaction.status);
    order.transactionId = transaction.id;
  }

  await saveKitOrder(order);
  if (!emailKind) return { ok: true, order, email: 'skipped' };

  const alerts = new Set(order.alertedTransactionIds || []);
  const alertKey = `${emailKind}:${transaction.id}`;
  if (alerts.has(alertKey)) return { ok: true, order, email: 'skipped' };

  const lockKey = `${order.id}:${alertKey}`;
  const claimed = await claimKitMailLock(lockKey);
  if (!claimed) return { ok: true, order, email: 'skipped' };

  const email = await notifyKitPayment({ ...order, transactionId: transaction.id }, emailKind);
  if (email === 'failed') {
    await releaseKitMailLock(lockKey);
    order.notifyStatus = 'failed';
    await saveKitOrder(order);
    return { ok: true, order, email };
  }

  alerts.add(alertKey);
  order.alertedTransactionIds = [...alerts];
  order.notifyStatus = email === 'sent' ? 'sent' : 'unconfigured';
  if (email === 'sent' && emailKind === 'approved') order.notifiedAt = now;
  await saveKitOrder(order);
  return { ok: true, order, email };
}
