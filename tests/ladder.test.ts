import { describe, expect, it } from 'vitest';
import { LADDER, PRIMARY_RUNG } from '../src/lib/ladder';

describe('escalera de ofertas', () => {
  it('mantiene el orden pdf, kit, sistema-enzo, lista', () => {
    expect(LADDER.map((rung) => rung.id)).toEqual(['pdf', 'kit', 'sistema-enzo', 'lista']);
  });

  it('toma los precios de los productos', () => {
    const byId = Object.fromEntries(LADDER.map((rung) => [rung.id, rung]));
    expect(byId.kit!.priceCop).toBe(81000);
    expect(byId.kit!.usdReference).toBe(25);
    expect(byId['sistema-enzo']!.priceCop).toBe(179000);
    expect(byId['sistema-enzo']!.usdReference).toBe(55);
    expect(byId.pdf!.priceCop).toBeNull();
    expect(byId.lista!.priceCop).toBeNull();
  });

  it('apunta a los destinos definidos', () => {
    expect(LADDER.map((rung) => rung.href)).toEqual([
      '/herramientas-ia/prompts-gratis',
      '/herramientas-ia/kit',
      '/sistemas/detailing',
      '/#contacto',
    ]);
    expect(LADDER.map((rung) => rung.action)).toEqual(['correo', 'compra', 'preventa', 'anotarse']);
  });

  it('el peldaño principal es el sistema de Enzo', () => {
    expect(PRIMARY_RUNG).toBe('sistema-enzo');
  });
});
