import { describe, expect, it } from 'vitest';
import { canViewProductOrder } from '../src/lib/order-access';
import { buildSistemaZip } from '../src/lib/printable';
import type { SistemaContent } from '../src/lib/sistema';
import content from './fixtures/sistema-min.json';

const TOKEN = 'a'.repeat(64);
const OTHER = 'b'.repeat(64);

describe('canViewProductOrder', () => {
  it('da true con la cookie válida aunque no haya enlace', () => {
    expect(canViewProductOrder({ status: 'PENDING', downloadToken: TOKEN }, { cookieMatches: true, linkToken: null })).toBe(true);
    expect(canViewProductOrder({ status: 'CREATED' }, { cookieMatches: true, linkToken: null })).toBe(true);
  });

  it('da true con el enlace del correo cuando el pago está APPROVED', () => {
    expect(canViewProductOrder({ status: 'APPROVED', downloadToken: TOKEN }, { cookieMatches: false, linkToken: TOKEN })).toBe(true);
  });

  it('da false con el enlace correcto si el pago no está APPROVED', () => {
    expect(canViewProductOrder({ status: 'PENDING', downloadToken: TOKEN }, { cookieMatches: false, linkToken: TOKEN })).toBe(false);
  });

  it('da false con un enlace incorrecto, ausente o mal formado', () => {
    const order = { status: 'APPROVED', downloadToken: TOKEN };
    expect(canViewProductOrder(order, { cookieMatches: false, linkToken: OTHER })).toBe(false);
    expect(canViewProductOrder(order, { cookieMatches: false, linkToken: null })).toBe(false);
    expect(canViewProductOrder(order, { cookieMatches: false, linkToken: '' })).toBe(false);
    expect(canViewProductOrder(order, { cookieMatches: false, linkToken: TOKEN.slice(1) })).toBe(false);
    expect(canViewProductOrder({ status: 'APPROVED' }, { cookieMatches: false, linkToken: TOKEN })).toBe(false);
  });
});

describe('buildSistemaZip', () => {
  const zip = buildSistemaZip(content as SistemaContent);
  const text = new TextDecoder('latin1').decode(zip);

  it('trae el leeme, la guía en PDF y una carpeta por pieza', () => {
    expect(text).toContain('leeme.txt');
    expect(text).toContain('guia-sistema-enzo-detailing.pdf');
    for (const folder of ['1-recepcion/', '2-checklist/', '3-entrega/', '4-seguimiento/']) {
      expect(text).toContain(folder);
    }
  });

  it('es un zip válido con firma de directorio central', () => {
    expect(Array.from(zip.slice(0, 4))).toEqual([0x50, 0x4b, 0x03, 0x04]);
    expect(text).toContain('PK\u0005\u0006');
  });
});
