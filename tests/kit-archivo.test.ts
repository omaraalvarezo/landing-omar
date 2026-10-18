import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({ order: null as Record<string, unknown> | null }));

vi.mock('astro:env/server', () => ({ getSecret: () => undefined }));

vi.mock('../src/lib/kit-orders', () => ({
  isKitOrderId: (value: unknown) => typeof value === 'string' && /^[a-f0-9-]{36}$/.test(value),
  kitTokensMatch: (left: string, right: string) => left.length === 64 && left === right,
  getKitOrderById: async () => db.order,
}));

import { GET } from '../src/pages/api/herramientas/kit-archivo';

const ID = '11111111-1111-4111-8111-111111111111';
const TOKEN = 'c'.repeat(64);
const FUTURE = new Date(Date.now() + 86_400_000).toISOString();

function order(overrides: Record<string, unknown>) {
  return { id: ID, status: 'APPROVED', downloadToken: TOKEN, downloadExpiresAt: FUTURE, product: 'talleres', ...overrides };
}

async function call(token: string = TOKEN, pedido: string = ID): Promise<Response> {
  const url = new URL(`https://omaralvarezo.co/api/herramientas/kit-archivo?pedido=${pedido}&t=${token}`);
  return (await GET({ url } as never)) as Response;
}

async function bodyText(response: Response): Promise<string> {
  return new TextDecoder('latin1').decode(new Uint8Array(await response.arrayBuffer()));
}

describe('kit-archivo por producto', () => {
  beforeEach(() => {
    db.order = null;
  });

  it('enzo-detailing recibe el zip del sistema con su nombre', async () => {
    db.order = order({ product: 'enzo-detailing' });
    const response = await call();
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="sistema-enzo-detailing.zip"');
    const text = await bodyText(response);
    expect(text).toContain('guia-sistema-enzo-detailing.pdf');
    expect(text).toContain('1-recepcion/');
    expect(text).not.toContain('prompts-ia-talleres-detailing-pymes.pdf');
  });

  it('talleres sigue recibiendo el zip del kit', async () => {
    db.order = order({ product: 'talleres' });
    const response = await call();
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="kit-ia-talleres-detailing.zip"');
    const text = await bodyText(response);
    expect(text).toContain('prompts-ia-talleres-detailing-pymes.pdf');
    expect(text).not.toContain('guia-sistema-enzo-detailing.pdf');
  });

  it('da 404 sin pedido, sin APPROVED o con token incorrecto', async () => {
    expect((await call()).status).toBe(404);
    db.order = order({ product: 'enzo-detailing', status: 'PENDING' });
    expect((await call()).status).toBe(404);
    db.order = order({ product: 'enzo-detailing' });
    expect((await call('d'.repeat(64))).status).toBe(404);
    expect((await call(TOKEN, 'no-es-un-id')).status).toBe(404);
  });

  it('da 410 con el enlace vencido', async () => {
    db.order = order({ product: 'enzo-detailing', downloadExpiresAt: new Date(Date.now() - 1000).toISOString() });
    const response = await call();
    expect(response.status).toBe(410);
    expect(await response.text()).toContain('Escríbeme');
  });
});
