import { describe, expect, it } from 'vitest';
import { publicRecibo, recibos } from '../src/lib/recibos';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MES_ANIO = /\b(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic) \d{4}\b/;

describe('recibos operativos con fuente', () => {
  it('trae recibos', () => {
    expect(recibos.length).toBeGreaterThan(0);
  });

  it('todo recibo tiene source, method y date ISO', () => {
    for (const recibo of recibos) {
      expect(recibo.source.trim(), recibo.id).not.toBe('');
      expect(recibo.method.trim(), recibo.id).not.toBe('');
      expect(recibo.date, recibo.id).toMatch(ISO_DATE);
      expect(Number.isNaN(Date.parse(recibo.date)), recibo.id).toBe(false);
    }
  });

  it('la fuente es una ruta interna del repo, nunca una URL ni una ruta absoluta', () => {
    for (const recibo of recibos) {
      expect(recibo.source, recibo.id).not.toMatch(/^(https?:|\/|~)/);
    }
  });

  it('value incluye "aprox.", salvo las reglas exactas marcadas con kind "exacto"', () => {
    for (const recibo of recibos) {
      if (recibo.kind === 'exacto') {
        expect(recibo.value, recibo.id).not.toContain('aprox.');
        expect(recibo.method, recibo.id).toMatch(/exact/i);
      } else {
        expect(recibo.value, recibo.id).toContain('aprox.');
      }
    }
  });

  it('label y origin no están vacíos y origin no filtra la ruta interna', () => {
    for (const recibo of recibos) {
      expect(recibo.label.trim(), recibo.id).not.toBe('');
      expect(recibo.origin.trim(), recibo.id).not.toBe('');
      expect(recibo.origin, recibo.id).not.toContain('/');
    }
  });

  it('origin dice mes y año', () => {
    for (const recibo of recibos) {
      expect(recibo.origin, recibo.id).toMatch(MES_ANIO);
    }
  });

  it('si el método es un estimado, el origin lo dice', () => {
    for (const recibo of recibos) {
      if (/estim/i.test(recibo.method)) {
        expect(recibo.origin, recibo.id).toContain('estimado');
      }
    }
  });

  it('si el total es inferido, el origin no dice contado ni medido', () => {
    for (const recibo of recibos) {
      if (/inferido/i.test(recibo.method)) {
        expect(recibo.origin, recibo.id).not.toMatch(/contado|medido/i);
      }
    }
  });

  it('los ids son únicos', () => {
    const ids = recibos.map((recibo) => recibo.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('negocio es enzo, arkhe o grupo', () => {
    for (const recibo of recibos) {
      expect(['enzo', 'arkhe', 'grupo'], recibo.id).toContain(recibo.negocio);
    }
  });

  it('hay al menos 2 recibos de Enzo', () => {
    expect(recibos.filter((recibo) => recibo.negocio === 'enzo').length).toBeGreaterThanOrEqual(2);
  });

  it('ningún recibo dice que el equipo entra al cotizador con su PIN', () => {
    for (const recibo of recibos) {
      expect(`${recibo.value} ${recibo.label} ${recibo.origin}`, recibo.id).not.toMatch(/\bPIN\b/);
    }
  });
});

describe('publicRecibo', () => {
  it('devuelve solo value, label y origin', () => {
    const recibo = publicRecibo('espera-recogida');
    expect(Object.keys(recibo).sort()).toEqual(['label', 'origin', 'value']);
    expect(recibo).not.toHaveProperty('source');
    expect(recibo).not.toHaveProperty('method');
  });

  it('falla con un id desconocido', () => {
    expect(() => publicRecibo('no-existe')).toThrow(/no-existe/);
  });
});
