import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  settleKitPayment: vi.fn(),
  track: vi.fn(async (..._args: unknown[]) => undefined),
  reference: '',
}));

vi.mock('@vercel/analytics/server', () => ({ track: mocks.track }));
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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('evento de Wompi: reintento por correos fallidos', () => {
  it('responde 503 aviso si el correo al comprador falla, para que Wompi reintente', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'sent', buyerEmail: 'failed' });
    const response = await post();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'aviso' });
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
  it('con firstApproval llama track una vez, con solo { product } y headers vacíos (sin cookie, IP ni URL de pedido)', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'sent', buyerEmail: 'sent', firstApproval: true });
    expect((await post()).status).toBe(200);
    expect(mocks.track).toHaveBeenCalledTimes(1);
    expect(mocks.track).toHaveBeenCalledWith('sistema_comprado', { product: 'enzo-detailing' }, { headers: {} });
  });

  it('sin firstApproval (reintento, cobro doble, kit) no llama track', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'skipped', buyerEmail: 'skipped', firstApproval: false });
    await post();
    expect(mocks.track).not.toHaveBeenCalled();
  });

  it('no mide si la orden no aplica (NOT_FOUND / MISMATCH)', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: false, reason: 'MISMATCH' });
    await post();
    expect(mocks.track).not.toHaveBeenCalled();
  });

  it('si track lanza, el webhook responde 200 igual', async () => {
    mocks.track.mockRejectedValueOnce(new Error('analytics caído'));
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'sent', buyerEmail: 'sent', firstApproval: true });
    expect((await post()).status).toBe(200);
  });

  it('si el correo falló mide igual la primera aprobación y responde 503 para el reintento de Wompi', async () => {
    mocks.settleKitPayment.mockResolvedValueOnce({ ok: true, order, email: 'sent', buyerEmail: 'failed', firstApproval: true });
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

  it.each(Object.entries(pages))('%s no importa track ni usa firstApproval', (_file, source) => {
    expect(source).not.toMatch(/track-server|@vercel\/analytics\/server|trackSistemaPurchase|firstApproval/);
  });
});
