import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getProduct } from '../src/lib/products';

// Renderiza /terminos con distintas versiones del producto para fijar lo que dice la preventa y la
// garantía en cada caso. El producto real se parte con spread para no tocar el JSON.
async function renderTerminos(patch: { guaranteeDays?: number | null; videosDueDate?: string | null; onSale: boolean }) {
  vi.resetModules();
  const real = getProduct('enzo-detailing')!;
  vi.doMock('../src/lib/products', async (importOriginal) => {
    const original = await importOriginal<typeof import('../src/lib/products')>();
    const product = {
      ...real,
      guaranteeDays: patch.guaranteeDays === undefined ? real.guaranteeDays : patch.guaranteeDays,
      presale: { ...real.presale!, videosDueDate: patch.videosDueDate === undefined ? null : patch.videosDueDate },
    };
    return { ...original, getProduct: () => product, isProductOnSale: () => patch.onSale };
  });
  const { default: Page } = await import('../src/pages/terminos.astro');
  const container = await AstroContainer.create({ astroConfig: { site: 'https://omaralvarezo.co' } } as never);
  const html = await container.renderToString(Page, { request: new Request('https://omaralvarezo.co/terminos') });
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

afterEach(() => vi.doUnmock('../src/lib/products'));

describe('/terminos: el sistema de Enzo', () => {
  it('sin fecha de videos describe la regla sin fecha', async () => {
    const text = await renderTerminos({ onSale: false });
    expect(text).toContain('Sin fecha no cobro');
    expect(text).toContain('Garantía de 7 días calendario');
    expect(text).toContain('reemplaza la excepción del retracto por archivo descargado');
    expect(text).toContain('máximo 30 días calendario');
    expect(text).not.toContain('Escríbeme a');
  });

  it('con fecha vigente promete la devolución si los videos no llegan', async () => {
    const text = await renderTerminos({ videosDueDate: '2099-12-31', onSale: true });
    expect(text).toContain('Los videos llegan antes del 31 de diciembre de 2099');
    expect(text).not.toContain('ya pasó');
  });

  it('con fecha vencida no lee como promesa futura y conserva la devolución', async () => {
    const text = await renderTerminos({ videosDueDate: '2020-01-31', onSale: false });
    expect(text).toContain('ya pasó');
    expect(text).not.toContain('Los videos llegan antes del');
    expect(text).toContain('Si compraste antes y los videos no llegaron para esa fecha');
  });

  it('sin garantía no habla de reemplazar el retracto', async () => {
    const text = await renderTerminos({ guaranteeDays: null, onSale: false });
    expect(text).not.toContain('Garantía de');
    expect(text).not.toContain('reemplaza la excepción del retracto');
  });
});
