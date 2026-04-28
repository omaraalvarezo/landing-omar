// Datos de contacto centralizados — cambiar aquí impacta toda la landing.

export const WHATSAPP_NUMBER = '573202569486';
export const EMAIL = 'omaraalvarezo@gmail.com';
export const LOCATION = 'Colombia';
export const TIMEZONE = 'GMT-5';

export const SOCIALS = {
  instagram: 'https://www.instagram.com/omaraalvarezo',
  tiktok: 'https://www.tiktok.com/@omaraalvarezo',
  linkedin: 'https://www.linkedin.com/in/omaraalvarezo',
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildLeadMessage({
  nombre,
  negocio,
  problema,
}: {
  nombre: string;
  negocio: string;
  problema: string;
}): string {
  return `Hola Omar, soy ${nombre} de ${negocio}.\nQuiero resolver: ${problema}.\nVi tu landing y quiero agendar una consultoría.`;
}
