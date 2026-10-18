import { describe, expect, it } from 'vitest';
import data from '../src/data/recibos.json';

type Recibo = {
  id: string;
  value: string;
  label: string;
  origin: string;
  negocio: 'enzo' | 'arkhe' | 'grupo';
  source: string;
  method: string;
  date: string;
};

const recibos = data as Recibo[];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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

  it('value incluye "aprox."', () => {
    for (const recibo of recibos) {
      expect(recibo.value, recibo.id).toContain('aprox.');
    }
  });

  it('label y origin no están vacíos y origin no filtra la ruta interna', () => {
    for (const recibo of recibos) {
      expect(recibo.label.trim(), recibo.id).not.toBe('');
      expect(recibo.origin.trim(), recibo.id).not.toBe('');
      expect(recibo.origin, recibo.id).not.toContain('/');
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
});
