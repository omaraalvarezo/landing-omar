import { beforeEach, describe, expect, it, vi } from 'vitest';

const DAY = 24 * 60 * 60 * 1_000;
const TOKEN = 'a'.repeat(64);

const state = vi.hoisted(() => ({ order: null as Record<string, unknown> | null }));

vi.mock('../src/lib/kit-orders', () => ({
  saveKitOrder: vi.fn(async (order: Record<string, unknown>) => {
    state.order = { ...order };
  }),
  getKitOrderByReference: vi.fn(async (reference: string) =>
    state.order && state.order.reference === reference ? { ...state.order } : null,
  ),
  claimKitMailLock: vi.fn(async () => true),
  releaseKitMailLock: vi.fn(async () => undefined),
  createKitDownloadToken: vi.fn(() => TOKEN),
  isKitDownloadToken: vi.fn((value: unknown) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)),
}));

vi.mock('../src/lib/kit-mail', () => ({
  notifyKitPayment: vi.fn(async () => 'sent'),
}));

import { notifyKitPayment } from '../src/lib/kit-mail';
import { createKitDownloadToken, saveKitOrder } from '../src/lib/kit-orders';
import { settleKitPayment } from '../src/lib/kit-payment';
import { parseProductReference, productAmountInCents, type ProductId } from '../src/lib/products';

function referenceFor(product: ProductId): string {
  return `oa-kit-${product}-q${productAmountInCents(product)}-d20261017-t1760000000000-abcdef12`;
}

function seedOrder(product: ProductId | undefined, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const order: Record<string, unknown> = {
    version: 1,
    id: '11111111-1111-4111-8111-111111111111',
    environment: 'test',
    reference: referenceFor(product ?? 'talleres'),
    product,
    amountInCents: productAmountInCents(product ?? 'talleres'),
    currency: 'COP',
    buyerName: 'Comprador de prueba',
    email: 'comprador@example.com',
    business: 'Taller de prueba',
    accessTokenHash: 'h',
    accessExpiresAt: '2026-11-17T00:00:00.000Z',
    status: 'CREATED',
    createdAt: '2026-10-17T00:00:00.000Z',
    updatedAt: '2026-10-17T00:00:00.000Z',
    ...overrides,
  };
  state.order = order;
  return order;
}

function transactionFor(reference: string, overrides: Record<string, unknown> = {}) {
  const parsed = parseProductReference(reference);
  return {
    id: 'tx-1',
    status: 'APPROVED' as const,
    reference,
    amount_in_cents: parsed?.amountInCents ?? 0,
    currency: 'COP',
    payment_method_type: 'CARD',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  state.order = null;
});

describe('settleKitPayment por producto', () => {
  it('MISMATCH si la orden es talleres y la referencia dice enzo-detailing; no concede descarga', async () => {
    const order = seedOrder('talleres');
    const parsed = parseProductReference(referenceFor('enzo-detailing'))!;
    const result = await settleKitPayment(
      transactionFor(order.reference as string, { amount_in_cents: parsed.amountInCents }),
      parsed,
    );
    expect(result).toEqual({ ok: false, reason: 'MISMATCH' });
    expect(createKitDownloadToken).not.toHaveBeenCalled();
    expect(saveKitOrder).not.toHaveBeenCalled();
    expect(notifyKitPayment).not.toHaveBeenCalled();
    expect(state.order!.status).toBe('CREATED');
    expect(state.order!.downloadToken).toBeUndefined();
  });

  it('MISMATCH si la orden es enzo-detailing y la referencia dice talleres', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(referenceFor('talleres'))!;
    const result = await settleKitPayment(
      transactionFor(order.reference as string, { amount_in_cents: parsed.amountInCents }),
      parsed,
    );
    expect(result).toEqual({ ok: false, reason: 'MISMATCH' });
    expect(createKitDownloadToken).not.toHaveBeenCalled();
    expect(notifyKitPayment).not.toHaveBeenCalled();
  });

  it('MISMATCH si el monto de Wompi difiere del de la referencia', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference as string)!;
    const result = await settleKitPayment(
      transactionFor(order.reference as string, { amount_in_cents: parsed.amountInCents - 100 }),
      parsed,
    );
    expect(result).toEqual({ ok: false, reason: 'MISMATCH' });
    expect(createKitDownloadToken).not.toHaveBeenCalled();
    expect(saveKitOrder).not.toHaveBeenCalled();
  });

  it('MISMATCH si la moneda no es COP', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference as string)!;
    const result = await settleKitPayment(transactionFor(order.reference as string, { currency: 'USD' }), parsed);
    expect(result).toEqual({ ok: false, reason: 'MISMATCH' });
    expect(createKitDownloadToken).not.toHaveBeenCalled();
  });

  it('MISMATCH si el monto guardado en la orden difiere del de la referencia', async () => {
    const order = seedOrder('enzo-detailing', { amountInCents: 100 });
    const parsed = parseProductReference(order.reference as string)!;
    const result = await settleKitPayment(transactionFor(order.reference as string), parsed);
    expect(result).toEqual({ ok: false, reason: 'MISMATCH' });
    expect(createKitDownloadToken).not.toHaveBeenCalled();
  });

  it('MISMATCH si parsed trae un monto que no es el del catálogo', async () => {
    const order = seedOrder('enzo-detailing');
    const result = await settleKitPayment(transactionFor(order.reference as string, { amount_in_cents: 100 }), {
      product: 'enzo-detailing',
      amountInCents: 100,
    });
    expect(result).toEqual({ ok: false, reason: 'MISMATCH' });
    expect(createKitDownloadToken).not.toHaveBeenCalled();
  });

  it('NOT_FOUND si no hay orden para la referencia', async () => {
    const reference = referenceFor('enzo-detailing');
    const result = await settleKitPayment(transactionFor(reference), parseProductReference(reference)!);
    expect(result).toEqual({ ok: false, reason: 'NOT_FOUND' });
  });

  it('enzo-detailing APPROVED: descarga a 120 días desde approvedAt', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference as string)!;
    const result = await settleKitPayment(transactionFor(order.reference as string), parsed);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order.status).toBe('APPROVED');
    expect(result.order.product).toBe('enzo-detailing');
    expect(result.order.downloadToken).toBe(TOKEN);
    expect(result.email).toBe('sent');
    const approvedAt = Date.parse(result.order.approvedAt!);
    expect(Number.isNaN(approvedAt)).toBe(false);
    expect(Date.parse(result.order.downloadExpiresAt!)).toBe(approvedAt + 120 * DAY);
  });

  it('talleres APPROVED: sigue con 14 días', async () => {
    const order = seedOrder('talleres');
    const parsed = parseProductReference(order.reference as string)!;
    const result = await settleKitPayment(transactionFor(order.reference as string), parsed);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order.status).toBe('APPROVED');
    expect(Date.parse(result.order.downloadExpiresAt!)).toBe(Date.parse(result.order.approvedAt!) + 14 * DAY);
  });

  it('orden vieja sin product se trata como talleres (14 días)', async () => {
    const order = seedOrder(undefined);
    const parsed = parseProductReference(order.reference as string)!;
    expect(parsed.product).toBe('talleres');
    const result = await settleKitPayment(transactionFor(order.reference as string), parsed);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Date.parse(result.order.downloadExpiresAt!)).toBe(Date.parse(result.order.approvedAt!) + 14 * DAY);
  });

  it('orden vieja sin product no se liquida con una referencia de enzo-detailing', async () => {
    const order = seedOrder(undefined);
    const parsed = parseProductReference(referenceFor('enzo-detailing'))!;
    const result = await settleKitPayment(
      transactionFor(order.reference as string, { amount_in_cents: parsed.amountInCents }),
      parsed,
    );
    expect(result).toEqual({ ok: false, reason: 'MISMATCH' });
    expect(createKitDownloadToken).not.toHaveBeenCalled();
  });

  it('DECLINED no concede descarga', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference as string)!;
    const result = await settleKitPayment(transactionFor(order.reference as string, { status: 'DECLINED' }), parsed);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order.status).toBe('DECLINED');
    expect(result.order.downloadToken).toBeUndefined();
    expect(createKitDownloadToken).not.toHaveBeenCalled();
  });
});
