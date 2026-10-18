import { describe, expect, it } from 'vitest';
import { LADDER, PRIMARY_RUNG, buildLadder, sistemaRungGets } from '../src/lib/ladder';
import { getProduct, type Product } from '../src/lib/products';

const realSistema = getProduct('enzo-detailing')!;
const withData = (patch: Partial<Product>): Product => ({ ...realSistema, ...patch });

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

  it('la garantía sale de guaranteeDays del producto, no de un número escrito a mano', () => {
    expect(sistemaRungGets(withData({ guaranteeDays: 7 }), true)).toContain('garantía de 7 días');
    expect(sistemaRungGets(withData({ guaranteeDays: 10 }), true)).toContain('garantía de 10 días');
    expect(sistemaRungGets(withData({ guaranteeDays: null }), true)).not.toMatch(/garantía/);
    expect(sistemaRungGets(withData({ guaranteeDays: 0 }), true)).not.toMatch(/garantía/);
  });

  it('la preventa abierta dice preventa; cerrada no promete compra', () => {
    expect(sistemaRungGets(realSistema, true)).toContain('Es preventa');
    const closed = sistemaRungGets(realSistema, false);
    expect(closed).not.toContain('Es preventa');
    expect(closed).toContain('no cobro hasta fijar la fecha de los videos');
  });

  it('buildLadder usa la fecha: sin fecha o vencida, cerrada; vigente, abierta', () => {
    const gets = (today: string) => buildLadder(today).find((rung) => rung.id === 'sistema-enzo')!.gets;
    const due = realSistema.presale?.videosDueDate;
    if (due) {
      expect(gets(due)).toContain('Es preventa');
      expect(gets('9999-12-31')).not.toContain('Es preventa');
    } else {
      expect(gets('2026-10-17')).not.toContain('Es preventa');
    }
    expect(LADDER.find((rung) => rung.id === 'sistema-enzo')!.gets).toContain(
      `garantía de ${realSistema.guaranteeDays} días`,
    );
  });

  it('el PDF no promete un correo: se descarga en la página', () => {
    const pdf = LADDER.find((rung) => rung.id === 'pdf')!;
    expect(pdf.gets).not.toMatch(/mando al correo/i);
    expect(pdf.gets).toMatch(/descargas/);
  });
});
