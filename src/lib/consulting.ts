// Datos comerciales de la consultoría. Desde 2026-10-16 no hay pago en línea:
// quien quiere la sesión escribe por el formulario y Omar responde por correo.
export const CONSULTING = {
  name: 'Sesión de arquitectura operativa con IA',
  shortName: 'Consultoría 2H',
  durationMinutes: 120,
} as const;

// Límites compartidos entre el formulario y el endpoint `/api/contacto`.
export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  phone: 24,
  business: 120,
  problemMin: 20,
  problemMax: 1200,
} as const;

// Validación compartida: el navegador y `/api/contacto` aplican exactamente las mismas reglas.
// El correo no admite espacios, comas, comillas ni `<>`: va como reply_to del aviso a Omar.
export const CONTACT_EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
export const CONTACT_PHONE_PATTERN = /^\+?[\d\s().-]{7,}$/;

export function isContactEmail(value: string): boolean {
  return value.length <= 254 && CONTACT_EMAIL_PATTERN.test(value);
}

// WhatsApp opcional: solo dígitos, espacios, paréntesis, puntos y guiones, con 7 a 15 dígitos.
export function isContactPhone(value: string): boolean {
  if (!CONTACT_PHONE_PATTERN.test(value)) return false;
  const digits = value.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
}

export const CONTACT_BODY_MAX_BYTES = 16_000;

// Fallback visible solo cuando el envío por servidor falla.
export const CONTACT_EMAIL = 'omaraalvarezo@gmail.com';
