import { describe, expect, it } from 'vitest';
import content from '../src/data/sistema-enzo-detailing-contenido.json';
import tools from '../src/data/tools.json';
import { buildSistemaZip } from '../src/lib/printable';
import type { SistemaContent } from '../src/lib/sistema';

const sistema = content as SistemaContent;
const directorySlugs = new Set((tools as { slug: string }[]).map((tool) => tool.slug));
const templates = sistema.pieces.flatMap((piece) => piece.templates);
const allText = JSON.stringify(sistema);

// Lo que la guía PDF puede pintar: ASCII, Latin-1 y los extra de Windows-1252 que
// `printable.ts` traduce. Cualquier otro carácter sale como "?" en el PDF.
const WIN1252_EXTRA = new Set([
  0x20ac, 0x201a, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030, 0x0160, 0x2039, 0x0152, 0x017d, 0x2018,
  0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014, 0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x017e, 0x0178,
]);
const encodable = (text: string) =>
  [...text].every((char) => {
    const code = char.codePointAt(0) ?? 0;
    return code === 0x0a || (code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || WIN1252_EXTRA.has(code);
  });

describe('contenido del sistema de Enzo · detailing', () => {
  it('trae las cuatro piezas exactas, en el orden del trabajo', () => {
    expect(sistema.pieces.map((piece) => piece.id)).toEqual(['recepcion', 'checklist', 'entrega', 'seguimiento']);
  });

  it('cada pieza tiene de 3 a 8 pasos y al menos una plantilla con cuerpo', () => {
    for (const piece of sistema.pieces) {
      expect(piece.steps.length, piece.id).toBeGreaterThanOrEqual(3);
      expect(piece.steps.length, piece.id).toBeLessThanOrEqual(8);
      expect(piece.templates.length, piece.id).toBeGreaterThanOrEqual(1);
      for (const template of piece.templates) {
        expect(template.file, piece.id).toMatch(/^[a-z0-9-]+\.txt$/);
        expect(template.body.trim().length, template.file).toBeGreaterThan(80);
      }
    }
  });

  it('trae guía de montaje e introducción reales, sin marcadores pendientes', () => {
    expect(sistema.setupOrder.length).toBeGreaterThanOrEqual(3);
    expect(sistema.intro.length).toBeGreaterThan(80);
    expect(allText).not.toMatch(/PENDIENTE/);
  });

  it('todo slug de herramienta está en tools.json y cada pieza usa herramientas declaradas', () => {
    expect(sistema.tools.length).toBeGreaterThan(0);
    const declared = new Set(sistema.tools.map((tool) => tool.slug));
    for (const tool of sistema.tools) expect(directorySlugs.has(tool.slug), tool.slug).toBe(true);
    for (const piece of sistema.pieces) {
      expect(piece.tools.length, piece.id).toBeGreaterThan(0);
      for (const slug of piece.tools) {
        expect(directorySlugs.has(slug), `${piece.id}: ${slug}`).toBe(true);
        expect(declared.has(slug), `${piece.id}: ${slug} sin ficha de costo`).toBe(true);
      }
    }
  });

  it('toda herramienta tiene checkedOn ISO, sourceUrl https y costos coherentes', () => {
    for (const tool of sistema.tools) {
      expect(tool.checkedOn, tool.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(`${tool.checkedOn}T00:00:00Z`)), tool.slug).toBe(false);
      expect(new URL(tool.sourceUrl).protocol, tool.slug).toBe('https:');
      for (const cost of [tool.monthlyCostUsd, tool.monthlyCostCop]) {
        expect(cost === null || (Number.isFinite(cost) && cost >= 0), tool.slug).toBe(true);
      }
      expect(tool.role.length, tool.slug).toBeGreaterThan(20);
      expect(tool.plan.length, tool.slug).toBeGreaterThan(5);
      expect(typeof tool.enzoUses, tool.slug).toBe('boolean');
    }
  });

  it('ninguna plantilla trae $ seguido de dígitos en una línea que no diga "ejemplo"', () => {
    for (const template of templates) {
      for (const line of `${template.title}\n${template.body}`.split('\n')) {
        if (/\$\s?\d/.test(line)) expect(line.toLowerCase(), template.file).toContain('ejemplo');
      }
    }
  });

  it('ninguna plantilla trae algo que parezca una placa colombiana ni un celular', () => {
    for (const template of templates) {
      const text = `${template.title}\n${template.body}`;
      expect(text, template.file).not.toMatch(/\b[A-Z]{3}\s?\d{3}\b/);
      expect(text, template.file).not.toMatch(/\b3\d{2}\s?\d{3}\s?\d{4}\b/);
    }
    expect(allText).not.toMatch(/\b[A-Z]{3}\s?\d{3}\b/);
  });

  it('el texto no contiene "transforma", "potencia", "desbloquea" ni "garantizado"', () => {
    expect(allText).not.toMatch(/transforma|potencia|desbloquea|garantizado/i);
  });

  it('lo que va a la guía PDF se puede codificar sin perder caracteres', () => {
    const pdfText = [sistema.intro, ...sistema.setupOrder, ...sistema.pieces.flatMap((p) => [p.title, p.why, ...p.steps])];
    for (const text of pdfText) expect(encodable(text), text).toBe(true);
    for (const template of templates) expect(encodable(template.body), template.file).toBe(true);
  });

  it('trae las plantillas que promete la página', () => {
    const files = templates.map((template) => template.file);
    for (const expected of [
      'orden-de-fotos.txt',
      'checklist-inspeccion-final.txt',
      'acta-de-entrega.txt',
      'mensajes-whatsapp.txt',
    ]) {
      expect(files).toContain(expected);
    }
    const messages = templates.find((template) => template.file === 'mensajes-whatsapp.txt')?.body.toLowerCase() || '';
    for (const word of ['listo', 'garantía', 'posventa', 'reseña']) expect(messages).toContain(word);
  });

  it('arma el zip con una carpeta por pieza', () => {
    const text = new TextDecoder('latin1').decode(buildSistemaZip(sistema));
    for (const folder of ['1-recepcion/pasos.txt', '2-checklist/pasos.txt', '3-entrega/pasos.txt', '4-seguimiento/pasos.txt']) {
      expect(text).toContain(folder);
    }
    expect(text).toContain('3-entrega/acta-de-entrega.txt');
  });
});
