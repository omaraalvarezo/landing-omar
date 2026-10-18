import { beforeEach, describe, expect, it, vi } from 'vitest';

const env = vi.hoisted(() => ({
  values: {} as Record<string, string>,
  order: null as Record<string, unknown> | null,
  locks: new Set<string>(),
}));

vi.mock('astro:env/server', () => ({
  getSecret: (name: string) => env.values[name] ?? undefined,
}));

// El módulo real habla con Upstash: aquí solo importa el contrato de los candados y del guardado.
vi.mock('../src/lib/kit-orders', () => ({
  saveKitOrder: vi.fn(async (order: Record<string, unknown>) => {
    env.order = { ...order };
  }),
  getKitOrderByReference: vi.fn(async (reference: string) =>
    env.order && env.order.reference === reference ? { ...env.order } : null,
  ),
  claimKitMailLock: vi.fn(async (key: string) => {
    if (env.locks.has(key)) return false;
    env.locks.add(key);
    return true;
  }),
  releaseKitMailLock: vi.fn(async (key: string) => {
    env.locks.delete(key);
  }),
  createKitDownloadToken: vi.fn(() => 'b'.repeat(64)),
  isKitDownloadToken: vi.fn((value: unknown) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)),
}));

vi.mock('../src/lib/editorial', () => ({ SITE: 'https://omaralvarezo.co' }));

import { buyerOrderLink, sendBuyerReceipt } from '../src/lib/kit-mail';
import { settleKitPayment } from '../src/lib/kit-payment';
import type { KitOrder } from '../src/lib/kit-orders';
import { getProduct, parseProductReference, productAmountInCents, type ProductId } from '../src/lib/products';

const ORDER_ID = '22222222-2222-4222-8222-222222222222';
const TOKEN = 'b'.repeat(64);

function referenceFor(product: ProductId): string {
  return `oa-kit-${product}-q${productAmountInCents(product)}-d20261017-t1760000000000-abcdef12`;
}

function seedOrder(product: ProductId): KitOrder {
  const order = {
    version: 1,
    id: ORDER_ID,
    environment: 'test',
    reference: referenceFor(product),
    product,
    amountInCents: productAmountInCents(product),
    currency: 'COP',
    buyerName: 'Laura Prueba',
    email: 'laura@example.com',
    business: 'Taller de prueba',
    accessTokenHash: 'h',
    accessExpiresAt: '2026-11-17T00:00:00.000Z',
    status: 'CREATED',
    createdAt: '2026-10-17T00:00:00.000Z',
    updatedAt: '2026-10-17T00:00:00.000Z',
  } as KitOrder;
  env.order = { ...order };
  return order;
}

function approved(reference: string, id = 'tx-1') {
  return {
    id,
    status: 'APPROVED' as const,
    reference,
    amount_in_cents: parseProductReference(reference)!.amountInCents,
    currency: 'COP',
    payment_method_type: 'CARD',
  };
}

type Sent = { headers: Record<string, string>; body: Record<string, unknown> };

function sent(fetchMock: ReturnType<typeof vi.fn>): Sent[] {
  return fetchMock.mock.calls.map(([, init]) => ({
    headers: (init as RequestInit).headers as Record<string, string>,
    body: JSON.parse(String((init as RequestInit).body)),
  }));
}

function sentTo(fetchMock: ReturnType<typeof vi.fn>, address: string): Sent[] {
  return sent(fetchMock).filter((call) => (call.body.to as string[])[0] === address);
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  env.order = null;
  env.locks.clear();
  env.values = {
    RESEND_API_KEY: 're_test',
    DIRECTORY_NOTIFY_FROM: 'Omar <hola@omaralvarezo.co>',
    DIRECTORY_NOTIFY_EMAIL: 'omar@example.com',
  };
  fetchMock = vi.fn(async () => new Response('{}', { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
});

describe('buyerOrderLink', () => {
  it('arma el enlace del pedido con el token del correo', () => {
    const order = { ...seedOrder('enzo-detailing'), downloadToken: TOKEN };
    const expected = `https://omaralvarezo.co/sistemas/pedido/${ORDER_ID}?t=${TOKEN}`;
    expect(buyerOrderLink(order, 'https://omaralvarezo.co')).toBe(expected);
    expect(buyerOrderLink(order, 'https://omaralvarezo.co/')).toBe(expected);
  });
});

describe('sendBuyerReceipt', () => {
  it('manda al comprador con reply_to a Omar, asunto, monto, enlace, garantía y aviso de videos', async () => {
    const order = { ...seedOrder('enzo-detailing'), downloadToken: TOKEN, transactionId: 'tx-1' };
    const result = await sendBuyerReceipt(order, 'https://omaralvarezo.co');
    expect(result).toBe('sent');
    const [call] = sent(fetchMock);
    expect(call.body.from).toBe('Omar <hola@omaralvarezo.co>');
    expect(call.body.to).toEqual(['laura@example.com']);
    expect(call.body.reply_to).toBe('omar@example.com');
    expect(call.body.subject).toBe('Tu compra: El sistema de Enzo · detailing');
    const text = String(call.body.text);
    expect(text).toContain('$179.000');
    expect(text).toContain(`/sistemas/pedido/${ORDER_ID}?t=${TOKEN}`);
    expect(text).toContain('Garantía de 7 días: si no te sirve, escríbeme a este correo en los 7 días siguientes a la compra');
    expect(text).toContain('Te devuelvo la plata');
    // Sin fecha de videos en el catálogo, avisa por correo.
    expect(text).toContain('te aviso por este mismo correo');
    expect(call.headers['Idempotency-Key']).toBe(`buyer-receipt-${ORDER_ID}-tx-1`);
  });

  it('con videosDueDate dice "antes del 30 de noviembre de 2026"', async () => {
    const presale = getProduct('enzo-detailing')!.presale!;
    const previous = presale.videosDueDate;
    presale.videosDueDate = '2026-11-30';
    try {
      const order = { ...seedOrder('enzo-detailing'), downloadToken: TOKEN };
      await sendBuyerReceipt(order, 'https://omaralvarezo.co');
      expect(String(sent(fetchMock)[0].body.text)).toContain('antes del 30 de noviembre de 2026');
      expect(String(sent(fetchMock)[0].body.text)).toContain('Si no llegan para esa fecha, te devuelvo la plata.');
    } finally {
      presale.videosDueDate = previous;
    }
  });

  it('reply_to cae al correo de Omar si no hay DIRECTORY_NOTIFY_EMAIL', async () => {
    delete env.values.DIRECTORY_NOTIFY_EMAIL;
    const order = { ...seedOrder('enzo-detailing'), downloadToken: TOKEN };
    await sendBuyerReceipt(order, 'https://omaralvarezo.co');
    expect(sent(fetchMock)[0].body.reply_to).toBe('omaraalvarezo@gmail.com');
  });

  it("sin RESEND_API_KEY devuelve 'unconfigured' y no llama a Resend ni lanza", async () => {
    delete env.values.RESEND_API_KEY;
    const order = { ...seedOrder('enzo-detailing'), downloadToken: TOKEN };
    await expect(sendBuyerReceipt(order, 'https://omaralvarezo.co')).resolves.toBe('unconfigured');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([400, 403, 422])("devuelve 'failed-permanent' si Resend rechaza con %i (reintentar no lo arregla)", async (status) => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status }));
    const order = { ...seedOrder('enzo-detailing'), downloadToken: TOKEN };
    await expect(sendBuyerReceipt(order, 'https://omaralvarezo.co')).resolves.toBe('failed-permanent');
  });

  it.each([429, 500, 503])("devuelve 'failed' (reintentable) si Resend responde %i", async (status) => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status }));
    const order = { ...seedOrder('enzo-detailing'), downloadToken: TOKEN };
    await expect(sendBuyerReceipt(order, 'https://omaralvarezo.co')).resolves.toBe('failed');
  });

  it("devuelve 'failed' (reintentable) si la red falla", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    const order = { ...seedOrder('enzo-detailing'), downloadToken: TOKEN };
    await expect(sendBuyerReceipt(order, 'https://omaralvarezo.co')).resolves.toBe('failed');
  });
});

describe('settleKitPayment: correo al comprador', () => {
  it('dos liquidaciones APPROVED de la misma transacción mandan un solo correo al comprador', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference)!;
    const tx = approved(order.reference);

    const first = await settleKitPayment(tx, parsed);
    const second = await settleKitPayment(tx, parsed);

    expect(first.ok && first.buyerEmail).toBe('sent');
    expect(second.ok && second.buyerEmail).toBe('skipped');
    const buyerCalls = sentTo(fetchMock, 'laura@example.com');
    expect(buyerCalls).toHaveLength(1);
    expect(String(buyerCalls[0].body.text)).toContain(`/sistemas/pedido/${ORDER_ID}?t=${TOKEN}`);
    expect(env.order!.alertedTransactionIds).toContain('buyer:tx-1');
    // Omar recibe su propio aviso, una vez, y con el nombre del sistema.
    const omarCalls = sentTo(fetchMock, 'omar@example.com');
    expect(omarCalls).toHaveLength(1);
    expect(String(omarCalls[0].body.text)).toContain('El sistema de Enzo · detailing');
    expect(String(omarCalls[0].body.subject)).not.toContain('Kit IA');
  });

  it('talleres no manda correo al comprador', async () => {
    const order = seedOrder('talleres');
    const result = await settleKitPayment(approved(order.reference), parseProductReference(order.reference)!);
    expect(result.ok && result.buyerEmail).toBe('skipped');
    expect(sentTo(fetchMock, 'laura@example.com')).toHaveLength(0);
    expect(env.order!.alertedTransactionIds).not.toContain('buyer:tx-1');
  });

  it('si el correo al comprador falla, no deja la clave y un reintento de Wompi lo reenvía', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference)!;
    const tx = approved(order.reference);
    // Omar (1.ª llamada) bien; comprador (2.ª) falla; en el reintento solo queda el del comprador.
    fetchMock
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 500 }));

    const first = await settleKitPayment(tx, parsed);
    expect(first.ok && first.buyerEmail).toBe('failed');
    expect(env.order!.alertedTransactionIds).not.toContain('buyer:tx-1');

    const retry = await settleKitPayment(tx, parsed);
    expect(retry.ok && retry.buyerEmail).toBe('sent');
    expect(env.order!.alertedTransactionIds).toContain('buyer:tx-1');
    expect(sentTo(fetchMock, 'laura@example.com')).toHaveLength(2);
    expect(sentTo(fetchMock, 'omar@example.com')).toHaveLength(1);
  });

  it('un rechazo permanente (4xx) guarda failed y la clave: el reintento de Wompi no lo vuelve a mandar', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference)!;
    const tx = approved(order.reference);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchMock
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 422 }));

    const first = await settleKitPayment(tx, parsed);
    expect(first.ok && first.buyerEmail).toBe('failed-permanent');
    expect(env.order!.buyerNotifyStatus).toBe('failed');
    expect(env.order!.alertedTransactionIds).toContain('buyer:tx-1');
    expect(errors).toHaveBeenCalled();

    const retry = await settleKitPayment(tx, parsed);
    expect(retry.ok && retry.buyerEmail).toBe('skipped');
    expect(sentTo(fetchMock, 'laura@example.com')).toHaveLength(1);
    errors.mockRestore();
  });

  it('sin RESEND_API_KEY registra la clave del comprador igual y no lanza', async () => {
    delete env.values.RESEND_API_KEY;
    const order = seedOrder('enzo-detailing');
    const result = await settleKitPayment(approved(order.reference), parseProductReference(order.reference)!);
    expect(result.ok && result.buyerEmail).toBe('unconfigured');
    expect(env.order!.alertedTransactionIds).toContain('buyer:tx-1');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('un segundo pago APPROVED con otra transacción no manda otro correo al comprador', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference)!;
    await settleKitPayment(approved(order.reference, 'tx-1'), parsed);
    const double = await settleKitPayment(approved(order.reference, 'tx-2'), parsed);
    expect(double.ok && double.buyerEmail).toBe('skipped');
    expect(sentTo(fetchMock, 'laura@example.com')).toHaveLength(1);
  });

  it('guarda buyerNotifyStatus: failed si Resend rechaza y sent en el reintento', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference)!;
    const tx = approved(order.reference);
    fetchMock
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 500 }));
    await settleKitPayment(tx, parsed);
    expect(env.order!.buyerNotifyStatus).toBe('failed');
    await settleKitPayment(tx, parsed);
    expect(env.order!.buyerNotifyStatus).toBe('sent');
  });

  it('sin RESEND_API_KEY guarda buyerNotifyStatus unconfigured', async () => {
    delete env.values.RESEND_API_KEY;
    const order = seedOrder('enzo-detailing');
    await settleKitPayment(approved(order.reference), parseProductReference(order.reference)!);
    expect(env.order!.buyerNotifyStatus).toBe('unconfigured');
  });

  it('el enlace del comprador usa PUBLIC_SITE_URL, igual que el correo de Omar', async () => {
    env.values.PUBLIC_SITE_URL = 'https://preview.example.vercel.app/';
    const order = seedOrder('enzo-detailing');
    await settleKitPayment(approved(order.reference), parseProductReference(order.reference)!);
    const text = String(sentTo(fetchMock, 'laura@example.com')[0].body.text);
    expect(text).toContain(`https://preview.example.vercel.app/sistemas/pedido/${ORDER_ID}?t=${TOKEN}`);
  });

  it.each(['DECLINED', 'VOIDED', 'ERROR'] as const)('%s no manda correo al comprador', async (status) => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference)!;
    const result = await settleKitPayment({ ...approved(order.reference), status }, parsed);
    expect(result.ok && result.buyerEmail).toBe('skipped');
    expect(sentTo(fetchMock, 'laura@example.com')).toHaveLength(0);
  });

  it('VOIDED tras un APPROVED no manda otro correo al comprador', async () => {
    const order = seedOrder('enzo-detailing');
    const parsed = parseProductReference(order.reference)!;
    await settleKitPayment(approved(order.reference), parsed);
    const voided = await settleKitPayment({ ...approved(order.reference), status: 'VOIDED' }, parsed);
    expect(voided.ok && voided.buyerEmail).toBe('skipped');
    expect(sentTo(fetchMock, 'laura@example.com')).toHaveLength(1);
  });
});
