import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  settleKitPayment: vi.fn(),
  reference: '',
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
