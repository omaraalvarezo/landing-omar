// Validación de la lista de espera. La usan el navegador y el endpoint con las mismas reglas.
// Los helpers de texto (`singleLine`, `multiLine`) los usa también `/api/contacto`.
import oficios from '../data/oficios.json';
import paises from '../data/paises.json';
import { CONTACT_LIMITS, isContactEmail, isContactPhone } from './consulting';

export const WAITLIST_WANTS = ['instalacion', 'sesion', 'otro-oficio', 'pregunta-sistema'] as const;

// Etiqueta de cada opción: va en el asunto y en la tabla del correo a Omar.
export const WAITLIST_WANT_LABELS: Record<(typeof WAITLIST_WANTS)[number], string> = {
  instalacion: 'Instalación',
  sesion: 'Sesión privada',
  'otro-oficio': 'Sistema para otro oficio',
  'pregunta-sistema': 'Pregunta del sistema',
};

export interface WaitlistInput {
  name: string;
  email: string;
  phone: string;
  business: string;
  want: (typeof WAITLIST_WANTS)[number];
  oficio: string;
  oficioOtro: string;
  country: string;
  message: string;
}

export const OTHER_OFICIO_ID = 'otro';
export const QUESTION_MESSAGE_MIN = 20;

// Quita saltos de línea y caracteres de control para que nada del visitante parta un encabezado.
export const singleLine = (value: string) =>
  value.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

// Texto libre: conserva saltos de línea, elimina el resto de caracteres de control.
export const multiLine = (value: string) =>
  value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u2028\u2029]/g, '')
    .trim();

const stripAngles = (value: string) => value.replace(/[<>]/g, '');

type Failure = { ok: false; field: keyof WaitlistInput | 'accepted'; error: string };

const fail = (field: Failure['field'], error: string): Failure => ({ ok: false, field, error });

const text = (body: Record<string, unknown>, key: string) => {
  const value = body[key];
  return typeof value === 'string' ? value : '';
};

const isWant = (value: unknown): value is WaitlistInput['want'] =>
  typeof value === 'string' && (WAITLIST_WANTS as readonly string[]).includes(value);

export function wantFromQuery(value: string | null): WaitlistInput['want'] | null {
  return isWant(value) ? value : null;
}

/**
 * Props del evento `lista_espera_enviada`: solo los ids ya validados de opción, oficio y país.
 * Nunca `oficioOtro`, mensaje, nombre, correo, teléfono ni negocio.
 */
export function waitlistTrackProps(value: Pick<WaitlistInput, 'want' | 'oficio' | 'country'>): {
  want: string;
  oficio: string;
  country: string;
} {
  return { want: value.want, oficio: value.oficio, country: value.country };
}

export function validateWaitlist(
  body: Record<string, unknown>,
): { ok: true; value: WaitlistInput } | Failure {
  const name = stripAngles(singleLine(text(body, 'name')));
  const email = singleLine(text(body, 'email'));
  const phone = singleLine(text(body, 'phone'));
  const business = stripAngles(singleLine(text(body, 'business')));
  const want = body.want;
  const oficio = singleLine(text(body, 'oficio'));
  const oficioOtroRaw = stripAngles(singleLine(text(body, 'oficioOtro')));
  const country = singleLine(text(body, 'country'));
  const message = stripAngles(multiLine(text(body, 'message')));

  // Primero lo primero del formulario: qué quiere.
  if (!isWant(want)) return fail('want', 'Elige qué quieres de mí.');
  if (name.length < 2) return fail('name', 'Escribe tu nombre.');
  if (name.length > CONTACT_LIMITS.name) {
    return fail('name', `Tu nombre es muy largo (máximo ${CONTACT_LIMITS.name} caracteres).`);
  }
  if (!isContactEmail(email)) return fail('email', 'Revisa tu correo: no parece válido.');
  if (phone && !isContactPhone(phone)) {
    return fail('phone', 'Revisa tu WhatsApp: usa solo números, espacios o guiones (7 a 15 dígitos).');
  }
  if (phone.length > CONTACT_LIMITS.phone) {
    return fail('phone', 'Revisa tu WhatsApp: es muy largo.');
  }
  if (business.length < 2) return fail('business', 'Cuéntame qué negocio operas.');
  if (business.length > CONTACT_LIMITS.business) {
    return fail('business', `El nombre del negocio es muy largo (máximo ${CONTACT_LIMITS.business} caracteres).`);
  }
  if (!oficios.some((item) => item.id === oficio)) return fail('oficio', 'Elige tu oficio.');

  let oficioOtro = '';
  if (oficio === OTHER_OFICIO_ID) {
    if (!oficioOtroRaw) return fail('oficioOtro', 'Cuéntame cuál es tu oficio.');
    if (oficioOtroRaw.length > CONTACT_LIMITS.oficioOtro) {
      return fail('oficioOtro', `Tu oficio es muy largo (máximo ${CONTACT_LIMITS.oficioOtro} caracteres).`);
    }
    oficioOtro = oficioOtroRaw;
  }

  if (!paises.some((item) => item.id === country)) return fail('country', 'Elige tu país.');

  if (message.length > CONTACT_LIMITS.message) {
    return fail('message', `El mensaje es muy largo (máximo ${CONTACT_LIMITS.message} caracteres).`);
  }
  if (want === 'pregunta-sistema' && message.length < QUESTION_MESSAGE_MIN) {
    return fail(
      'message',
      `Escribe tu pregunta con un poco más de contexto (mínimo ${QUESTION_MESSAGE_MIN} caracteres).`,
    );
  }

  const accepted = body.accepted;
  if (!(accepted === true || accepted === 'on' || accepted === 'true')) {
    return fail('accepted', 'Necesito tu autorización para usar estos datos y responderte.');
  }

  return {
    ok: true,
    value: { name, email, phone, business, want, oficio, oficioOtro, country, message },
  };
}
