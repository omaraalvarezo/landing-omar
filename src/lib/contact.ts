// Datos públicos centralizados — cambiar aquí impacta toda la landing.
//
// Conversión 100% por Cal.com (modal + inline). Cero canal directo de contacto
// (sin WhatsApp, sin email visible) en la landing pública.

export const CAL_LINK = 'omaralvarezo/onboarding-20min';
export const CAL_NAMESPACE = 'onboarding-20min';
export const CAL_BASE_URL = 'https://cal.com';
export const LOCATION = 'Colombia';
export const TIMEZONE = 'GMT-5';

export const SOCIALS = {
  instagram: 'https://www.instagram.com/omaraalvarezo',
  tiktok: 'https://www.tiktok.com/@omaraalvarezo',
  linkedin: 'https://www.linkedin.com/in/omaraalvarezo',
} as const;

// Atributos a desplegar en cualquier <button> que dispare el modal Cal.
// Opcional: `notes` se pre-rellena en el formulario de Cal.com.
export function calButtonAttrs(opts?: { notes?: string }) {
  const config: Record<string, string> = { layout: 'month_view', theme: 'light' };
  if (opts?.notes) config.notes = opts.notes;
  return {
    'data-cal-link': CAL_LINK,
    'data-cal-namespace': CAL_NAMESPACE,
    'data-cal-config': JSON.stringify(config),
  } as const;
}

// Fallback duro: link plano por si JS está deshabilitado o el modal no monta.
export function calBookUrl(): string {
  return `${CAL_BASE_URL}/${CAL_LINK}`;
}
