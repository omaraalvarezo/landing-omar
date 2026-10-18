import { beforeEach, describe, expect, it, vi } from 'vitest';

const store = vi.hoisted(() => ({ values: new Map<string, unknown>() }));

vi.mock('astro:env/server', () => ({
  getSecret: (name: string) =>
    ({ UPSTASH_REDIS_REST_URL: 'https://redis.test', UPSTASH_REDIS_REST_TOKEN: 'token' })[name] ?? undefined,
}));

vi.mock('@upstash/redis', () => ({
  Redis: class {
    async get(key: string) {
      return store.values.get(key) ?? null;
    }
    async set(key: string, value: unknown) {
      store.values.set(key, value);
    }
    async lpush() {
      return 1;
    }
  },
}));

import { createKitOrder, getKitOrderById, getKitOrderByReference, saveKitOrder } from '../src/lib/kit-orders';

const ID = '11111111-1111-4111-8111-111111111111';
const KEY = `oa:kit:test:order:${ID}`;

function stored(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    version: 1,
    id: ID,
    environment: 'test',
    reference: 'oa-kit-talleres-q8100000-d20261017-t1760000000000-abcdef12',
    amountInCents: 8_100_000,
    currency: 'COP',
    status: 'CREATED',
    ...overrides,
  };
}

beforeEach(() => store.values.clear());

describe('órdenes del kit: producto al leer', () => {
  it('una orden vieja sin product se lee como talleres', async () => {
    store.values.set(KEY, stored({}));
    expect((await getKitOrderById(ID))?.product).toBe('talleres');
  });

  it('también por referencia', async () => {
    store.values.set(KEY, stored({}));
    store.values.set('oa:kit:test:ref:abc', ID);
    expect((await getKitOrderByReference('abc'))?.product).toBe('talleres');
  });

  it('conserva enzo-detailing', async () => {
    store.values.set(KEY, stored({ product: 'enzo-detailing' }));
    expect((await getKitOrderById(ID))?.product).toBe('enzo-detailing');
  });

  it('un product desconocido no se lee como orden', async () => {
    store.values.set(KEY, stored({ product: 'cafe' }));
    expect(await getKitOrderById(ID)).toBeNull();
  });

  it('createKitOrder exige un producto del catálogo y guarda el elegido', async () => {
    const base = {
      id: ID,
      reference: 'ref-1',
      amountInCents: 17_900_000,
      buyerName: 'A',
      email: 'a@example.com',
      business: 'B',
      accessToken: 'a'.repeat(64),
    };
    await expect(createKitOrder({ ...base, product: 'cafe' as never })).rejects.toThrow('KIT_ORDER_PRODUCT_INVALID');
    const order = await createKitOrder({ ...base, product: 'enzo-detailing' });
    expect(order.product).toBe('enzo-detailing');
    expect((store.values.get(KEY) as { product: string }).product).toBe('enzo-detailing');
  });

  it('saveKitOrder rechaza un producto desconocido', async () => {
    const order = (await createKitOrder({
      id: ID,
      reference: 'ref-2',
      product: 'talleres',
      amountInCents: 8_100_000,
      buyerName: 'A',
      email: 'a@example.com',
      business: 'B',
      accessToken: 'a'.repeat(64),
    })) as unknown as Record<string, unknown>;
    await expect(saveKitOrder({ ...order, product: 'cafe' } as never)).rejects.toThrow('KIT_ORDER_INVALID');
  });
});
