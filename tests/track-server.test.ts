import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  track: vi.fn(),
  claim: vi.fn(),
  release: vi.fn(async () => undefined),
  get: vi.fn(),
  save: vi.fn(async () => undefined),
}));

vi.mock('@vercel/analytics/server', () => ({ track: mocks.track }));
vi.mock('../src/lib/kit-orders', () => ({
  claimKitMailLock: mocks.claim,
  releaseKitMailLock: mocks.release,
  getKitOrderByReference: mocks.get,
  saveKitOrder: mocks.save,
}));

import type { KitOrder } from '../src/lib/kit-orders';
import { TRACK_TIMEOUT_MS, trackSistemaSale } from '../src/lib/track-server';

const order = (overrides: Record<string, unknown> = {}) =>
  ({ id: 'o-1', reference: 'ref-1', product: 'enzo-detailing', status: 'APPROVED', ...overrides }) as unknown as KitOrder;

beforeEach(() => {
  vi.clearAllMocks();
  mocks.track.mockResolvedValue(undefined);
  mocks.claim.mockResolvedValue(true);
  mocks.get.mockImplementation(async () => order());
});

afterEach(() => {
  vi.useRealTimers();
});

describe('trackSistemaSale', () => {
  it('mide una vez con { product }, user-agent neutro (sin cookie, IP ni URL) y marca purchaseTrackedAt', async () => {
    expect(await trackSistemaSale(order())).toBe('tracked');
    expect(mocks.claim).toHaveBeenCalledWith('track:o-1');
    expect(mocks.track).toHaveBeenCalledTimes(1);
    expect(mocks.track).toHaveBeenCalledWith(
      'sistema_comprado',
      { product: 'enzo-detailing' },
      { headers: { 'user-agent': 'omaralvarezo-webhook' } },
    );
    const [saved] = mocks.save.mock.calls[0] as unknown as [KitOrder];
    expect(typeof saved.purchaseTrackedAt).toBe('string');
    expect(saved.id).toBe('o-1');
  });

  it('no mide si ya trae purchaseTrackedAt, si no es APPROVED o si es talleres', async () => {
    expect(await trackSistemaSale(order({ purchaseTrackedAt: '2026-10-17T00:00:00.000Z' }))).toBe('skipped');
    expect(await trackSistemaSale(order({ status: 'PENDING' }))).toBe('skipped');
    expect(await trackSistemaSale(order({ product: 'talleres' }))).toBe('skipped');
    expect(mocks.claim).not.toHaveBeenCalled();
    expect(mocks.track).not.toHaveBeenCalled();
  });

  it('con el candado tomado no mide ni guarda', async () => {
    mocks.claim.mockResolvedValue(false);
    expect(await trackSistemaSale(order())).toBe('skipped');
    expect(mocks.track).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('si el SDK rechaza o lanza síncrono: no marca, suelta el candado y no lanza', async () => {
    mocks.track.mockRejectedValueOnce(new Error('caído'));
    expect(await trackSistemaSale(order())).toBe('failed');
    mocks.track.mockImplementationOnce(() => {
      throw new Error('síncrono');
    });
    expect(await trackSistemaSale(order())).toBe('failed');
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.release).toHaveBeenCalledTimes(2);
  });

  it('si el almacén falla, no lanza', async () => {
    mocks.get.mockRejectedValueOnce(new Error('upstash'));
    await expect(trackSistemaSale(order())).resolves.toBe('failed');
  });

  it('relee la orden antes de guardar para no pisar cambios y no duplica la marca', async () => {
    mocks.get.mockResolvedValueOnce(order({ buyerNotifyStatus: 'sent' }));
    await trackSistemaSale(order());
    const [saved] = mocks.save.mock.calls[0] as unknown as [KitOrder];
    expect(saved.buyerNotifyStatus).toBe('sent');
    mocks.save.mockClear();
    mocks.get.mockResolvedValueOnce(order({ purchaseTrackedAt: '2026-10-17T00:00:00.000Z' }));
    await trackSistemaSale(order());
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('si el SDK nunca responde, se suelta a los 2,5 s (no antes) y se da por enviado', async () => {
    vi.useFakeTimers();
    mocks.track.mockReturnValue(new Promise(() => undefined));
    let result: string | undefined;
    const pending = trackSistemaSale(order()).then((value) => {
      result = value;
    });
    await vi.advanceTimersByTimeAsync(TRACK_TIMEOUT_MS - 1);
    expect(result).toBeUndefined();
    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(result).toBe('tracked');
    expect(mocks.save).toHaveBeenCalledTimes(1);
    expect(TRACK_TIMEOUT_MS).toBe(2_500);
  });
});
