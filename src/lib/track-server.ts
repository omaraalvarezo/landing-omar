// Evento de servidor de la venta del sistema. Solo lo llama el webhook de Wompi
// (`/api/herramientas/evento`), cuya URL no lleva secretos.
//
// El `track` de `@vercel/analytics/server` copia al evento la URL de la petición en curso, su cookie,
// su user-agent y su IP. Pasar `headers` explícito hace que no se reenvíe nada de la petición: solo un
// user-agent fijo y neutro (sin él, el SDK mandaría `user-agent: undefined`). Por eso NO se llama desde
// las páginas de pedido (su URL lleva el id del pedido y a veces el token de descarga, y viaja la
// cookie de acceso).
import { track } from '@vercel/analytics/server';
import { claimKitMailLock, getKitOrderByReference, releaseKitMailLock, saveKitOrder, type KitOrder } from './kit-orders';

export const TRACK_TIMEOUT_MS = 2_500;
export const TRACK_HEADERS = { 'user-agent': 'omaralvarezo-webhook' } as const;

/** 'sent' = el SDK respondió; 'timeout' = no respondió en 2,5 s (se da por enviado); 'failed' = lanzó. */
async function sendSistemaPurchase(product: string): Promise<'sent' | 'timeout' | 'failed'> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(track('sistema_comprado', { product }, { headers: { ...TRACK_HEADERS } })).then(() => 'sent' as const),
      new Promise<'timeout'>((resolve) => {
        timer = setTimeout(() => resolve('timeout'), TRACK_TIMEOUT_MS);
      }),
    ]);
  } catch {
    return 'failed';
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Mide `sistema_comprado { product }` una sola vez por orden, sin importar quién la liquidó primero:
 * solo si la orden es del sistema, está APPROVED y no trae `purchaseTrackedAt`. Un candado corto evita
 * que dos webhooks simultáneos la cuenten dos veces. Si el envío lanza no se marca y el siguiente
 * reintento de Wompi puede volver a intentarlo. Nunca lanza: un pago no puede fallar por medir.
 */
export async function trackSistemaSale(order: KitOrder): Promise<'tracked' | 'skipped' | 'failed'> {
  if (order.product !== 'enzo-detailing' || order.status !== 'APPROVED' || order.purchaseTrackedAt) return 'skipped';
  const lockKey = `track:${order.id}`;
  let claimed = false;
  try {
    claimed = await claimKitMailLock(lockKey);
    if (!claimed) return 'skipped';
    if ((await sendSistemaPurchase(order.product)) === 'failed') {
      await releaseKitMailLock(lockKey);
      return 'failed';
    }
    // Se relee antes de guardar para no pisar lo que la página de pedido haya escrito mientras tanto.
    const latest = (await getKitOrderByReference(order.reference)) ?? order;
    if (!latest.purchaseTrackedAt) await saveKitOrder({ ...latest, purchaseTrackedAt: new Date().toISOString() });
    return 'tracked';
  } catch {
    if (claimed) await releaseKitMailLock(lockKey).catch(() => undefined);
    return 'failed';
  }
}
