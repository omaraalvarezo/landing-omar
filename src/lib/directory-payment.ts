import { parseDirectoryReference } from './directory';
import { notifyDirectoryPayment, type DirectoryMailKind, type DirectoryMailResult } from './directory-mail';
import {
  claimDirectoryMailLock,
  getDirectoryOrderByReference,
  releaseDirectoryMailLock,
  saveDirectoryOrder,
  type DirectoryOrder,
  type DirectoryPaymentStatus,
} from './directory-orders';
import type { WompiTransaction } from './wompi';

export type DirectorySettlement =
  | { ok: true; order: DirectoryOrder; email: DirectoryMailResult | 'skipped' }
  | { ok: false; reason: 'NOT_DIRECTORY' | 'NOT_FOUND' | 'MISMATCH' };

function statusFromTransaction(status: WompiTransaction['status']): DirectoryPaymentStatus {
  if (status === 'APPROVED' || status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') return status;
  return 'PENDING';
}

export async function settleDirectoryPayment(transaction: WompiTransaction): Promise<DirectorySettlement> {
  const parsed = parseDirectoryReference(transaction.reference);
  if (!parsed) return { ok: false, reason: 'NOT_DIRECTORY' };
  if (transaction.currency !== 'COP' || transaction.amount_in_cents !== parsed.amountInCents) {
    return { ok: false, reason: 'MISMATCH' };
  }

  const existing = await getDirectoryOrderByReference(transaction.reference);
  if (!existing) return { ok: false, reason: 'NOT_FOUND' };
  if (existing.amountInCents !== parsed.amountInCents || existing.plan !== parsed.plan) {
    return { ok: false, reason: 'MISMATCH' };
  }

  const now = new Date().toISOString();
  const order: DirectoryOrder = {
    ...existing,
    updatedAt: now,
    paymentMethod: String(transaction.payment_method_type || '').slice(0, 60) || existing.paymentMethod,
    statusMessage: String(transaction.status_message || '').slice(0, 240) || existing.statusMessage,
  };

  let emailKind: DirectoryMailKind | null = null;
  const approvedIds = new Set(order.approvedTransactionIds || []);

  if (transaction.status === 'APPROVED') {
    const double = order.status === 'APPROVED' && Boolean(order.transactionId) && order.transactionId !== transaction.id;
    approvedIds.add(transaction.id);
    order.approvedTransactionIds = [...approvedIds];
    order.status = 'APPROVED';
    if (!double) order.transactionId = transaction.id;
    order.approvedAt = order.approvedAt || now;
    if (double) emailKind = 'double';
    else if (!order.notifiedAt) emailKind = 'approved';
  } else if (transaction.status === 'VOIDED' && order.transactionId === transaction.id && approvedIds.has(transaction.id)) {
    order.status = 'VOIDED';
    order.voidedTransactionIds = [...new Set([...(order.voidedTransactionIds || []), transaction.id])];
    emailKind = 'voided';
  } else if (order.status !== 'APPROVED') {
    order.status = statusFromTransaction(transaction.status);
    order.transactionId = transaction.id;
  }

  await saveDirectoryOrder(order);
  if (!emailKind) return { ok: true, order, email: 'skipped' };

  const alerts = new Set(order.alertedTransactionIds || []);
  const alertKey = `${emailKind}:${transaction.id}`;
  if (alerts.has(alertKey)) return { ok: true, order, email: 'skipped' };

  const lockKey = `${order.id}:${alertKey}`;
  const claimed = await claimDirectoryMailLock(lockKey);
  if (!claimed) return { ok: true, order, email: 'skipped' };

  const email = await notifyDirectoryPayment({ ...order, transactionId: transaction.id }, emailKind);
  if (email === 'failed') {
    await releaseDirectoryMailLock(lockKey);
    order.notifyStatus = 'failed';
    await saveDirectoryOrder(order);
    return { ok: true, order, email };
  }

  alerts.add(alertKey);
  order.alertedTransactionIds = [...alerts];
  order.notifyStatus = email === 'sent' ? 'sent' : 'unconfigured';
  if (email === 'sent' && emailKind === 'approved') order.notifiedAt = now;
  await saveDirectoryOrder(order);
  return { ok: true, order, email };
}
