// Google AdSense: preparado, apagado.
//
// Para solicitar la revisión:
// 1. Reemplazar `publisherId` por el ID real de la cuenta (formato `ca-pub-` + 16 dígitos).
// 2. Descomentar la línea de `public/ads.txt` con el mismo ID (sin el prefijo `ca-`).
// 3. Pasar `enabled` a `true`: el Layout imprime la meta `google-adsense-account` en las
//    páginas públicas. Una página puede excluirse con `<Layout ads={false}>`.
// 4. Antes de mostrar anuncios: activar el CMP de AdSense (EEE/UK/CH) y mover a la CSP
//    real los dominios que hoy solo están en `Content-Security-Policy-Report-Only`.

export const ADSENSE = {
  enabled: false,
  publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
} as const;

const PUBLISHER_ID_PATTERN = /^ca-pub-\d{16}$/;

/** El placeholder nunca llega al HTML: solo se imprime un ID con formato válido. */
export function adsenseAccount(): string | null {
  return PUBLISHER_ID_PATTERN.test(ADSENSE.publisherId) ? ADSENSE.publisherId : null;
}
