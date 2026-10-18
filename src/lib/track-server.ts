// Evento de servidor de la venta del sistema. Solo lo llama el webhook de Wompi
// (`/api/herramientas/evento`), cuya URL no lleva secretos.
//
// El `track` de `@vercel/analytics/server` copia al evento la URL de la petición en curso, su cookie,
// su user-agent y su IP. Pasar `headers: {}` (explícito) hace que no se reenvíe ni cookie ni IP ni
// user-agent; sin esa opción tomaría los de la petición. Por eso NO se llama desde las páginas de
// pedido (su URL lleva el id del pedido y a veces el token de descarga, y viaja la cookie de acceso).
import { track } from '@vercel/analytics/server';
import type { ProductId } from './products';

export const TRACK_TIMEOUT_MS = 2_500;

/** Nunca lanza ni retiene la respuesta más de `TRACK_TIMEOUT_MS`: un pago no puede fallar por medir. Solo `product`. */
export async function trackSistemaPurchase(product: ProductId): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      track('sistema_comprado', { product }, { headers: {} }),
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, TRACK_TIMEOUT_MS);
      }),
    ]);
  } catch {
    // Medir no es parte del pago.
  } finally {
    clearTimeout(timer);
  }
}
