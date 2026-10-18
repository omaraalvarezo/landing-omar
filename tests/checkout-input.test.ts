import { describe, expect, it } from 'vitest';
import { validateCheckoutInput } from '../src/lib/products';

const kitBody = { buyerName: 'Ana Pérez', email: 'Ana@Taller.CO', business: 'taller' };
const sistemaBody = {
  product: 'enzo-detailing',
  buyerName: 'Ana Pérez',
  email: 'ana@brillo.co',
  business: 'Brillo Detailing',
  country: 'CO',
};

describe('validateCheckoutInput', () => {
  it('el kit sin product es válido como hoy', () => {
    expect(validateCheckoutInput(kitBody)).toEqual({
      ok: true,
      product: 'talleres',
      buyerName: 'Ana Pérez',
      email: 'ana@taller.co',
      business: 'taller',
      country: '',
    });
  });

  it('el kit conserva sus reglas: negocio fuera de la lista, correo o nombre inválidos', () => {
    expect(validateCheckoutInput({ ...kitBody, business: 'otro-negocio' }).ok).toBe(false);
    expect(validateCheckoutInput({ ...kitBody, email: 'ab.co' }).ok).toBe(false);
    expect(validateCheckoutInput({ ...kitBody, buyerName: 'A' }).ok).toBe(false);
  });

  it('enzo-detailing válido guarda negocio libre y país', () => {
    expect(validateCheckoutInput(sistemaBody)).toEqual({
      ok: true,
      product: 'enzo-detailing',
      buyerName: 'Ana Pérez',
      email: 'ana@brillo.co',
      business: 'Brillo Detailing',
      country: 'CO',
    });
  });

  it('enzo-detailing sin país da error', () => {
    const { country: _country, ...sinPais } = sistemaBody;
    expect(validateCheckoutInput(sinPais).ok).toBe(false);
    expect(validateCheckoutInput({ ...sistemaBody, country: 'ZZ' }).ok).toBe(false);
  });

  it('enzo-detailing exige negocio de 2 a 80 caracteres', () => {
    expect(validateCheckoutInput({ ...sistemaBody, business: 'B' }).ok).toBe(false);
    expect(validateCheckoutInput({ ...sistemaBody, business: 'x'.repeat(81) }).ok).toBe(false);
    expect(validateCheckoutInput({ ...sistemaBody, business: 'x'.repeat(80) }).ok).toBe(true);
  });

  it('un producto desconocido da error', () => {
    expect(validateCheckoutInput({ ...kitBody, product: 'otro' }).ok).toBe(false);
    expect(validateCheckoutInput({ ...kitBody, product: 42 }).ok).toBe(false);
  });

  it('un nombre con <script> queda saneado sin <>', () => {
    const result = validateCheckoutInput({
      ...sistemaBody,
      buyerName: '<script>Ana</script>',
      business: '<b>Brillo</b>',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.buyerName).not.toMatch(/[<>]/);
      expect(result.business).not.toMatch(/[<>]/);
      expect(result.buyerName).toBe('scriptAna/script');
    }
  });
});
