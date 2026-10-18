export const prerender = false;

import type { APIRoute } from 'astro';
import { parseDirectoryReference } from '../../../lib/directory';
import { settleDirectoryPayment } from '../../../lib/directory-payment';
import { settleKitPayment } from '../../../lib/kit-payment';
import { parseProductReference } from '../../../lib/products';
import { trackSistemaSale } from '../../../lib/track-server';
import { verifyWompiEvent } from '../../../lib/wompi-events';
import { fetchTransaction } from '../../../lib/wompi';

function json(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function referenceOf(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const reference = (payload as { data?: { transaction?: { reference?: unknown } } }).data?.transaction?.reference;
  return typeof reference === 'string' ? reference : '';
}

export const POST: APIRoute = async ({ request }) => {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 100_000) return json(413, { error: 'payload' });

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 100_000) return json(413, { error: 'payload' });
    payload = JSON.parse(raw);
  } catch {
    return json(400, { error: 'json' });
  }

  let verified: { transactionId: string } | null = null;
  try {
    verified = await verifyWompiEvent(payload);
  } catch (error) {
    console.error('[directorio] eventos de Wompi sin configurar', error);
    return json(503, { error: 'eventos no configurados' });
  }
  if (!verified) return json(401, { error: 'firma invalida' });

  const reference = referenceOf(payload);
  if (reference.startsWith('oa-consultoria-2h')) return json(200, { ignored: 'consultoria' });
  const directoryReference = parseDirectoryReference(reference);
  const kitReference = parseProductReference(reference);
  if (!directoryReference && !kitReference) return json(200, { ignored: 'referencia' });

  try {
    const transaction = await fetchTransaction(verified.transactionId);
    if (!transaction || transaction.id !== verified.transactionId) return json(503, { error: 'transaccion' });
    if (transaction.reference !== reference) return json(401, { error: 'referencia' });

    const channel = directoryReference ? 'directorio' : 'kit';
    const settled = directoryReference
      ? await settleDirectoryPayment(transaction)
      : kitReference
        ? await settleKitPayment(transaction, kitReference)
        : null;
    if (!settled) return json(200, { ignored: 'referencia' });
    if (!settled.ok) {
      console.error(`[${channel}] evento sin orden aplicable`, settled.reason, reference);
      return json(200, { ignored: settled.reason });
    }
    // La venta se mide aquí y no en `settleKitPayment` ni en las páginas de pedido: esta URL no lleva
    // secretos. Da igual quién liquidó primero (el regreso del comprador casi siempre llega antes que el
    // webhook): `purchaseTrackedAt` y un candado evitan contarla dos veces. El tope de tiempo acota la respuesta.
    if (kitReference) await trackSistemaSale(settled.order);
    // 503 hace que Wompi reintente. El aviso a Omar y el del comprador tienen cada uno su clave,
    // así que el reintento solo reenvía el que falló.
    if (settled.email === 'failed' || ('buyerEmail' in settled && settled.buyerEmail === 'failed')) {
      return json(503, { error: 'aviso' });
    }
    return json(200, { ok: true, status: settled.order.status, email: settled.email });
  } catch (error) {
    console.error('[directorio] no se pudo registrar el evento', error);
    return json(503, { error: 'registro' });
  }
};
