import { describe, expect, it } from 'vitest';
import { validateWaitlist, wantFromQuery, WAITLIST_WANTS } from '../src/lib/waitlist';

const valid = {
  name: 'Ana Pérez',
  email: 'ana@example.com',
  want: 'instalacion',
  oficio: 'detailing',
  country: 'CO',
  accepted: true,
};

const failure = (patch: Record<string, unknown>) => {
  const result = validateWaitlist({ ...valid, ...patch });
  if (result.ok) throw new Error('se esperaba un error');
  return result;
};

describe('validateWaitlist', () => {
  it('acepta el caso mínimo y completa los opcionales vacíos', () => {
    expect(validateWaitlist(valid)).toEqual({
      ok: true,
      value: {
        name: 'Ana Pérez',
        email: 'ana@example.com',
        phone: '',
        business: '',
        want: 'instalacion',
        oficio: 'detailing',
        oficioOtro: '',
        country: 'CO',
        message: '',
      },
    });
  });

  it('acepta oficio otro con su texto y los demás campos', () => {
    const result = validateWaitlist({
      ...valid,
      oficio: 'otro',
      oficioOtro: '  Lavado   de tapetes ',
      phone: '+57 300 123 4567',
      business: 'Tapetes Ana',
      message: 'Hola',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.oficioOtro).toBe('Lavado de tapetes');
      expect(result.value.business).toBe('Tapetes Ana');
    }
  });

  it('ignora oficioOtro si el oficio no es otro', () => {
    const result = validateWaitlist({ ...valid, oficioOtro: 'algo' });
    expect(result.ok && result.value.oficioOtro).toBe('');
  });

  it('acepta accepted como "on" o "true"', () => {
    expect(validateWaitlist({ ...valid, accepted: 'on' }).ok).toBe(true);
    expect(validateWaitlist({ ...valid, accepted: 'true' }).ok).toBe(true);
  });

  it('rechaza want inválido', () => {
    expect(failure({ want: 'comprar' }).field).toBe('want');
    expect(failure({ want: undefined }).field).toBe('want');
  });

  it('rechaza oficio desconocido', () => {
    expect(failure({ oficio: 'astronauta' }).field).toBe('oficio');
  });

  it('exige oficioOtro cuando el oficio es otro, y lo limita a 60', () => {
    expect(failure({ oficio: 'otro' }).field).toBe('oficioOtro');
    expect(failure({ oficio: 'otro', oficioOtro: '   ' }).field).toBe('oficioOtro');
    expect(failure({ oficio: 'otro', oficioOtro: 'a'.repeat(61) }).field).toBe('oficioOtro');
    expect(validateWaitlist({ ...valid, oficio: 'otro', oficioOtro: 'a'.repeat(60) }).ok).toBe(true);
  });

  it('rechaza países fuera de la lista', () => {
    expect(failure({ country: 'US' }).field).toBe('country');
    expect(failure({ country: '' }).field).toBe('country');
  });

  it('exige mensaje de 20 caracteres en pregunta-sistema', () => {
    expect(failure({ want: 'pregunta-sistema', message: 'corto' }).field).toBe('message');
    expect(failure({ want: 'pregunta-sistema' }).field).toBe('message');
    expect(validateWaitlist({ ...valid, want: 'pregunta-sistema', message: 'x'.repeat(20) }).ok).toBe(true);
  });

  it('limita el mensaje a 600 caracteres', () => {
    expect(failure({ message: 'x'.repeat(601) }).field).toBe('message');
    expect(validateWaitlist({ ...valid, message: 'x'.repeat(600) }).ok).toBe(true);
  });

  it('valida nombre, correo, teléfono y negocio', () => {
    expect(failure({ name: '' }).field).toBe('name');
    expect(failure({ name: 'A' }).field).toBe('name');
    expect(failure({ email: 'no-es-correo' }).field).toBe('email');
    expect(failure({ phone: 'abc' }).field).toBe('phone');
    expect(failure({ business: 'x'.repeat(121) }).field).toBe('business');
  });

  it('quita < y > de los campos de una línea', () => {
    const result = validateWaitlist({ ...valid, name: 'Ana <b>Pérez</b>' });
    expect(result.ok && result.value.name).toBe('Ana bPérez/b');
  });

  it('exige la autorización', () => {
    const { accepted: _accepted, ...rest } = valid;
    const missing = validateWaitlist(rest);
    expect(!missing.ok && missing.field).toBe('accepted');
    expect(failure({ accepted: false }).field).toBe('accepted');
    expect(failure({ accepted: 'no' }).field).toBe('accepted');
  });

  it('el error va en español', () => {
    expect(failure({ name: '' }).error).toMatch(/nombre/i);
  });
});

describe('wantFromQuery', () => {
  it('devuelve el valor válido y null en el resto', () => {
    expect(wantFromQuery('instalacion')).toBe('instalacion');
    expect(wantFromQuery('<x>')).toBeNull();
    expect(wantFromQuery(null)).toBeNull();
    expect(wantFromQuery('')).toBeNull();
    for (const want of WAITLIST_WANTS) expect(wantFromQuery(want)).toBe(want);
  });
});
