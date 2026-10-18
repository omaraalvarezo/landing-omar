import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sdk = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('@vercel/analytics/server', () => ({ track: sdk.track }));

import { TRACK_TIMEOUT_MS, trackSistemaPurchase } from '../src/lib/track-server';

beforeEach(() => {
  sdk.track.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('trackSistemaPurchase', () => {
  it('manda solo { product } y headers vacíos explícitos', async () => {
    sdk.track.mockResolvedValue(undefined);
    await trackSistemaPurchase('enzo-detailing');
    expect(sdk.track).toHaveBeenCalledTimes(1);
    expect(sdk.track).toHaveBeenCalledWith('sistema_comprado', { product: 'enzo-detailing' }, { headers: {} });
  });

  it('no lanza si el SDK rechaza o lanza síncrono', async () => {
    sdk.track.mockRejectedValueOnce(new Error('caído'));
    await expect(trackSistemaPurchase('enzo-detailing')).resolves.toBeUndefined();
    sdk.track.mockImplementationOnce(() => {
      throw new Error('síncrono');
    });
    await expect(trackSistemaPurchase('enzo-detailing')).resolves.toBeUndefined();
  });

  it('si el SDK nunca responde, se suelta a los 2,5 s (y no antes)', async () => {
    vi.useFakeTimers();
    sdk.track.mockReturnValue(new Promise(() => undefined));
    let done = false;
    const pending = trackSistemaPurchase('enzo-detailing').then(() => {
      done = true;
    });
    await vi.advanceTimersByTimeAsync(TRACK_TIMEOUT_MS - 1);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(done).toBe(true);
    expect(TRACK_TIMEOUT_MS).toBe(2_500);
  });
});
