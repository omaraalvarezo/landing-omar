import { describe, expect, it } from 'vitest';
import contenido from '../src/data/sistema-enzo-detailing-contenido.json';
import type { SistemaContent } from '../src/lib/sistema';
import {
  PIECE_STATE,
  costLabel,
  foreignAnswer,
  guaranteeAnswer,
  guaranteeTerms,
  hasGuarantee,
  longDate,
  offerAvailability,
  presaleTerms,
  toolsAnswer,
  toolsTotalLabel,
  videosAnswer,
} from '../src/lib/sistema-copy';

const content = contenido as SistemaContent;

describe('garantía', () => {
  it('redacción exacta de la condición', () => {
    expect(guaranteeTerms(7)).toBe(
      'Si no te sirve, escríbeme en los 7 días siguientes a la compra y dime qué no te sirvió. Te devuelvo la plata; la devolución la hago yo a mano.',
    );
  });

  it('redacción exacta de la respuesta de la FAQ', () => {
    expect(guaranteeAnswer(7)).toBe(
      'Tienes 7 días: si no te sirve, escríbeme en los 7 días siguientes a la compra y dime qué no te sirvió. Te devuelvo la plata; la devolución la hago yo a mano.',
    );
  });

  it('solo hay garantía con días mayores que cero', () => {
    expect(hasGuarantee(7)).toBe(true);
    expect(hasGuarantee(0)).toBe(false);
    expect(hasGuarantee(null)).toBe(false);
    expect(hasGuarantee(undefined)).toBe(false);
  });
});

describe('pago desde fuera de Colombia', () => {
  it('true: sí, sin enlace', () => {
    expect(foreignAnswer(true)).toEqual({
      q: '¿Puedo pagar desde fuera de Colombia?',
      a: 'Sí. El cobro sale en pesos colombianos y tu banco lo convierte a tu moneda.',
      linkLabel: null,
    });
  });

  it('false: no, y se anota con su país', () => {
    const answer = foreignAnswer(false);
    expect(answer.a).toBe(
      'Por ahora no; anótate con tu país. Así sé cuánta gente de fuera lo quiere y si vale la pena abrir otro medio de pago.',
    );
    expect(answer.linkLabel).toBe('Anotarme con mi país');
  });

  it('null: todavía se confirma con Wompi', () => {
    const answer = foreignAnswer(null);
    expect(answer.a).toBe(
      'Lo estoy confirmando con Wompi; escríbeme antes de pagar. Si tu tarjeta es de otro país, mándame la pregunta y te digo si pasa.',
    );
    expect(answer.linkLabel).toBe('Pregúntame aquí');
  });
});

describe('videos y preventa', () => {
  it('sin fecha no cobra, y nombra la página según dónde se lee', () => {
    expect(videosAnswer({ dueDate: '', onSale: false, place: 'producto' })).toBe(
      'Todavía no hay fecha. Sin fecha no cobro: la compra abre cuando fije el día en que entrego los videos, y esa fecha queda escrita en esta página.',
    );
    expect(videosAnswer({ dueDate: '', onSale: false, place: 'fuera' })).toMatch(/escrita en la página del sistema\.$/);
    expect(presaleTerms({ dueDate: '', onSale: false, place: 'producto' })).toBe(
      'Todavía no fijé la fecha de los videos. Sin fecha no cobro: la compra abre cuando la fecha quede escrita aquí.',
    );
    expect(presaleTerms({ dueDate: '', onSale: false, place: 'fuera' })).toMatch(/escrita en la página del sistema\.$/);
  });

  it('con fecha vigente promete los videos y la devolución', () => {
    const dueDate = longDate('2026-12-15');
    expect(dueDate).toBe('15 de diciembre de 2026');
    expect(videosAnswer({ dueDate, onSale: true, place: 'producto' })).toBe(
      'Los videos llegan antes del 15 de diciembre de 2026. Al pagar recibes la guía y las plantillas, y te aviso por correo cuando estén los videos. Si no llegan para esa fecha, te devuelvo la plata.',
    );
    expect(presaleTerms({ dueDate, onSale: true, place: 'fuera' })).toBe(
      'Los videos llegan antes del 15 de diciembre de 2026. Al pagar recibes la guía y las plantillas; los videos después. Si no llegan para esa fecha, te devuelvo la plata.',
    );
  });

  it('con fecha vencida no cobra', () => {
    const dueDate = longDate('2026-10-01');
    expect(videosAnswer({ dueDate, onSale: false, place: 'producto' })).toBe(
      'La fecha de esta preventa (1 de octubre de 2026) ya pasó. No estoy cobrando hasta fijar una nueva y escribirla aquí.',
    );
    expect(videosAnswer({ dueDate, onSale: false, place: 'fuera' })).toMatch(/escribirla en la página del sistema\.$/);
    expect(presaleTerms({ dueDate, onSale: false, place: 'producto' })).toBe(
      'La fecha de esta preventa (1 de octubre de 2026) ya pasó. No cobro hasta fijar una nueva.',
    );
  });
});

describe('costo de las herramientas', () => {
  it('gratis, dólares, pesos y sin precio publicado', () => {
    expect(costLabel({ monthlyCostUsd: 0, monthlyCostCop: 0 })).toBe('Gratis');
    expect(costLabel({ monthlyCostUsd: 49, monthlyCostCop: null })).toBe('USD 49 al mes');
    expect(costLabel({ monthlyCostUsd: null, monthlyCostCop: 25000 })).toBe('$25.000 al mes');
    expect(costLabel({ monthlyCostUsd: null, monthlyCostCop: null })).toBe('Sin precio publicado');
  });

  it('total: dólares más pesos de las que solo publican pesos', () => {
    expect(toolsTotalLabel([{ monthlyCostUsd: 0, monthlyCostCop: 0 }])).toBe('Gratis');
    expect(
      toolsTotalLabel([
        { monthlyCostUsd: 49, monthlyCostCop: null },
        { monthlyCostUsd: null, monthlyCostCop: 25000 },
        { monthlyCostUsd: 0, monthlyCostCop: 0 },
      ]),
    ).toBe('USD 49 + $25.000');
  });

  it('la respuesta del contenido real nombra cada herramienta y el total', () => {
    const answer = toolsAnswer(content.tools);
    expect(answer).toContain('Jotform: USD 49 al mes.');
    expect(answer).toMatch(/En total, USD 49 al mes, y eso se lo pagas a cada herramienta, no a mí\.$/);
  });
});

describe('estado de las piezas', () => {
  it('cubre las 4 piezas en coral, púrpura, cobalto y lima', () => {
    expect(content.pieces.map((piece) => PIECE_STATE[piece.id].color)).toEqual(['#ff6b45', '#c79aff', '#4b5fe3', '#c8ff3d']);
  });
});

describe('offerAvailability (JSON-LD)', () => {
  it('preventa abierta: PreOrder; cerrada: OutOfStock; sin preventa: InStock', () => {
    expect(offerAvailability({ presale: true, onSale: true })).toBe('https://schema.org/PreOrder');
    expect(offerAvailability({ presale: true, onSale: false })).toBe('https://schema.org/OutOfStock');
    expect(offerAvailability({ presale: false, onSale: true })).toBe('https://schema.org/InStock');
    expect(offerAvailability({ presale: false, onSale: false })).toBe('https://schema.org/OutOfStock');
  });
});
