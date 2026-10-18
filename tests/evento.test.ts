import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  settleKitPayment: vi.fn(),
  track: vi.fn(async (..._args: unknown[]) => undefined),
  reference: '',
  store: null as Record<string, unknown> | null,
  lockHeld: false,
}));

vi.mock('@vercel/analytics/server', () => ({ track: mocks.track }));
vi.mock('../src/lib/kit-orders', () => ({
  claimKitMailLock: vi.fn(async () => !mocks.lockHeld),
  releaseKitMailLock: vi.fn(async () => undefined),
  getKitOrderByReference: vi.fn(async () => (mocks.store ? { ...mocks.store } : null)),
  saveKitOrder: vi.fn(async (value: Record<string, unknown>) => {
    mocks.store = { ...value };
  }),
}));
vi.mock('../src/lib/kit-payment', () => ({ settleKitPayment: mocks.settleKitPayment }));
vi.mock('../src/lib/directory-payment', () => ({ settleDirectoryPayment: vi.fn() }));
vi.mock('../src/lib/wompi-events', () => ({
  verifyWompiEvent: vi.fn(async () => ({ transactionId: 'tx-1' })),
}));
vi.mock('../src/lib/wompi', () => ({
  fetchTransaction: vi.fn(async () => ({ id: 'tx-1', reference: mocks.reference, status: 'APPROVED' })),
}));

import { POST } from '../src/pages/api/herramientas/evento';
import { productAmountInCents } from '../src/lib/products';

const REFERENCE = `oa-kit-enzo-detailing-q${productAmountInCents('enzo-detailing')}-d20261017-t1760000000000-abcdef12`;
mocks.reference = REFERENCE;

async function post(): Promise<Response> {
  const body = JSON.stringify({ data: { transaction: { id: 'tx-1', reference: REFERENCE } } });
  const request = new Request('https://omaralvarezo.co/api/herramientas/evento', { method: 'POST', body });
  return (POST as unknown as (ctx: { request: Request }) => Promise<Response>)({ request });
}

const order = { status: 'APPROVED' };

function approvedOrder(overrides: Record<string, unknown> = {}) {
  return { id: 'o-1', reference: REFERENCE, product: 'enzo-detailing', status: 'APPROVED', ...overrides };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.store = null;
  mocks.lockHeld = false;
  mocks.track.mockImplementation(async () => undefined);
});

describe('evento de Wompi: reintento por correos fallidos', () => {
  it('responde 503 aviso si el correo al comprador falla, para que Wompi reintente', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'sent', buyerEmail: 'failed' });
    const response = await post();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'aviso' });
  });

  it('responde 200 si el recibo del comprador falló de forma permanente (4xx): reintentar no lo arregla', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'sent', buyerEmail: 'failed-permanent' });
    expect((await post()).status).toBe(200);
  });

  it('responde 503 aviso si falla el aviso a Omar', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'failed', buyerEmail: 'sent' });
    expect((await post()).status).toBe(503);
  });

  it('responde 200 si ambos salieron o no aplican', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'sent', buyerEmail: 'sent' });
    expect((await post()).status).toBe(200);
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'skipped', buyerEmail: 'unconfigured' });
    expect((await post()).status).toBe(200);
  });
});

describe('evento de Wompi: medición de la venta', () => {
  const settledWith = (value: Record<string, unknown>) => ({ ok: true, order: value, email: 'skipped', buyerEmail: 'skipped' });

  it('la página de pedido liquidó primero y luego llega el webhook: mide una vez, con { product } y solo el user-agent neutro', async () => {
    const stored = approvedOrder({ approvedAt: '2026-10-17T00:00:00.000Z' });
    mocks.store = stored;
    mocks.settleKitPayment.mockResolvedValueOnce(settledWith(stored));
    expect((await post()).status).toBe(200);
    expect(mocks.track).toHaveBeenCalledTimes(1);
    expect(mocks.track).toHaveBeenCalledWith(
      'sistema_comprado',
      { product: 'enzo-detailing' },
      { headers: { 'user-agent': 'omaralvarezo-webhook' } },
    );
    expect(typeof mocks.store!.purchaseTrackedAt).toBe('string');
  });

  it('un reintento de Wompi después de medida no vuelve a medir', async () => {
    mocks.store = approvedOrder();
    mocks.settleKitPayment.mockResolvedValueOnce(settledWith(mocks.store));
    await post();
    mocks.settleKitPayment.mockResolvedValueOnce(settledWith({ ...mocks.store }));
    await post();
    mocks.settleKitPayment.mockResolvedValueOnce(settledWith({ ...mocks.store }));
    await post();
    expect(mocks.track).toHaveBeenCalledTimes(1);
  });

  it('con el candado tomado por otro webhook no mide', async () => {
    mocks.lockHeld = true;
    mocks.store = approvedOrder();
    mocks.settleKitPayment.mockResolvedValueOnce(settledWith(mocks.store));
    expect((await post()).status).toBe(200);
    expect(mocks.track).not.toHaveBeenCalled();
    expect(mocks.store!.purchaseTrackedAt).toBeUndefined();
  });

  it('el kit de talleres nunca se mide', async () => {
    mocks.store = approvedOrder({ product: 'talleres' });
    mocks.settleKitPayment.mockResolvedValueOnce(settledWith(mocks.store));
    await post();
    expect(mocks.track).not.toHaveBeenCalled();
  });

  it('una orden que no está APPROVED no se mide', async () => {
    mocks.store = approvedOrder({ status: 'DECLINED' });
    mocks.settleKitPayment.mockResolvedValueOnce(settledWith(mocks.store));
    await post();
    expect(mocks.track).not.toHaveBeenCalled();
  });

  it('no mide si la orden no aplica (NOT_FOUND / MISMATCH)', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: false, reason: 'MISMATCH' });
    await post();
    expect(mocks.track).not.toHaveBeenCalled();
  });

  it('si track lanza, el webhook responde 200 y la orden queda sin marcar para que el reintento pruebe otra vez', async () => {
    mocks.store = approvedOrder();
    mocks.track.mockRejectedValueOnce(new Error('analytics caído'));
    mocks.settleKitPayment.mockResolvedValueOnce(settledWith(mocks.store));
    expect((await post()).status).toBe(200);
    expect(mocks.store!.purchaseTrackedAt).toBeUndefined();
    mocks.settleKitPayment.mockResolvedValueOnce(settledWith(mocks.store));
    await post();
    expect(mocks.track).toHaveBeenCalledTimes(2);
    expect(typeof mocks.store!.purchaseTrackedAt).toBe('string');
  });

  it('si el correo falló mide igual y responde 503 para el reintento de Wompi', async () => {
    mocks.store = approvedOrder();
    mocks.settleKitPayment.mockResolvedValueOnce({ ...settledWith(mocks.store), buyerEmail: 'failed' });
    expect((await post()).status).toBe(503);
    expect(mocks.track).toHaveBeenCalledTimes(1);
  });
});

describe('las páginas de pedido nunca miden', () => {
  const pages = import.meta.glob(['../src/pages/sistemas/pedido/*.astro', '../src/pages/herramientas-ia/kit/pedido/*.astro'], {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;

  it('encuentra las dos páginas de pedido', () => {
    expect(Object.keys(pages)).toHaveLength(2);
  });

  it.each(Object.entries(pages))('%s no importa track ni purchaseTrackedAt', (_file, source) => {
    expect(source).not.toMatch(/track-server|@vercel\/analytics\/server|trackSistemaSale|purchaseTrackedAt/);
  });
});
