import { describe, expect, it } from 'vitest';
import { parseKitReference } from '../src/lib/kit';

describe('arnés', () => {
  it('lee una referencia del kit actual', () => {
    expect(parseKitReference('oa-kit-talleres-q8100000-d20261016-t1710000000000-abcdef12'))
      .toMatchObject({ amountInCents: 8_100_000 });
  });
});
