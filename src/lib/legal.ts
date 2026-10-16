// Datos de las páginas legales (/privacidad, /terminos) y de /sobre-mi.
//
// Aprobado por Omar el 2026-10-16: el responsable es Omar Álvarez como persona natural.
// `draft: true` vuelve a mostrar el aviso de borrador, pone `noindex` y saca las páginas
// del sitemap. Los campos opcionales (`null`) no se imprimen; el Decreto 1377 de 2013 pide
// dirección y teléfono del responsable, así que conviene llenarlos cuando Omar decida cuáles
// publicar. No inventarlos.

export interface LegalData {
  draft: boolean;
  /** Fecha de la última versión aprobada (YYYY-MM-DD). */
  updated: string;
  controllerName: string;
  controllerType: string;
  /** Correo para consultas y reclamos de datos personales (habeas data). */
  privacyEmail: string;
  /** Opcionales: se imprimen solo si tienen valor. */
  controllerId: string | null;
  address: string | null;
  phone: string | null;
}

export const LEGAL: LegalData = {
  draft: false,
  updated: '2026-10-16',
  controllerName: 'Omar Álvarez',
  controllerType: 'persona natural',
  privacyEmail: 'omaraalvarezo@gmail.com',
  controllerId: null,
  address: null,
  phone: null,
};

export const LEGAL_CITY = 'Cúcuta, Norte de Santander, Colombia';

export const LEGAL_PAGES = [
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/terminos', label: 'Términos' },
] as const;
