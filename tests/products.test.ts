import { describe, expect, it } from 'vitest';
import {
  PRODUCT_IDS,
  createProductReference,
  getProduct,
  isProductOnSale,
  parseProductReference,
  productAmountInCents,
} from '../src/lib/products';

describe('productos', () => {
  it('kit: $81.000 sigue la regla USD 25 × 3.230', () => {
    expect(getProduct('talleres')).toMatchObject({ amountCop: 81000, usdReference: 25 });
  });
  it('sistema: $179.000 fijo en pesos', () => {
    expect(productAmountInCents('enzo-detailing')).toBe(17_900_000);
  });
  it('referencia ida y vuelta para cada producto', () => {
    for (const id of PRODUCT_IDS) {
      const ref = createProductReference(id, new Date('2026-10-17T15:00:00Z'));
      expect(ref).toMatch(new RegExp(`^oa-kit-${id}-q\\d{7,12}-d20261017-t\\d{13}-[a-f0-9]{8}$`));
      expect(parseProductReference(ref)).toEqual({ product: id, amountInCents: productAmountInCents(id) });
    }
  });
  it('rechaza monto de otro producto', () => {
    expect(parseProductReference('oa-kit-enzo-detailing-q8100000-d20261017-t1710000000000-abcdef12')).toBeNull();
  });
  it('rechaza producto desconocido y prefijos ajenos', () => {
    expect(parseProductReference('oa-kit-cafe-q17900000-d20261017-t1710000000000-abcdef12')).toBeNull();
    expect(parseProductReference('oa-directorio-basico-q9400000-d20261017-t1710000000000-abcdef12')).toBeNull();
    expect(parseProductReference('oa-consultoria-2h-x')).toBeNull();
    expect(parseProductReference(42)).toBeNull();
  });
  it('sin fecha de videos no se vende', () => {
    const p = getProduct('enzo-detailing')!;
    expect(isProductOnSale({ ...p, presale: { videosDueDate: null, videos: [] } }, '2026-10-17')).toBe(false);
  });
  it('con fecha vencida no se vende; con fecha futura sí', () => {
    const p = getProduct('enzo-detailing')!;
    expect(isProductOnSale({ ...p, presale: { videosDueDate: '2026-10-16', videos: [] } }, '2026-10-17')).toBe(false);
    expect(isProductOnSale({ ...p, presale: { videosDueDate: '2026-11-30', videos: [] } }, '2026-10-17')).toBe(true);
  });
  it('el kit siempre está a la venta', () => {
    expect(isProductOnSale(getProduct('talleres')!, '2026-10-17')).toBe(true);
  });
});
