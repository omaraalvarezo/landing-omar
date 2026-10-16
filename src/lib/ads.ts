// Google AdSense: cuenta verificable, sin anuncios todavía.
//
// Con `enabled: true` el Layout imprime la meta `google-adsense-account` en las páginas
// públicas (una página puede excluirse con `<Layout ads={false}>`). El ID debe coincidir
// con la línea de `public/ads.txt` (allí va sin el prefijo `ca-`).
// Antes de mostrar anuncios: activar el CMP de AdSense (EEE/UK/CH), cargar el script de
// anuncios y mover a la CSP real los dominios que hoy solo están en
// `Content-Security-Policy-Report-Only`.

export const ADSENSE = {
  enabled: true,
  publisherId: 'ca-pub-9860528927079608',
} as const;

const PUBLISHER_ID_PATTERN = /^ca-pub-\d{16}$/;

/** El placeholder nunca llega al HTML: solo se imprime un ID con formato válido. */
export function adsenseAccount(): string | null {
  return PUBLISHER_ID_PATTERN.test(ADSENSE.publisherId) ? ADSENSE.publisherId : null;
}
