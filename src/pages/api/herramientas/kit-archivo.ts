export const prerender = false;

import type { APIRoute } from 'astro';
import kitPack from '../../../data/kit-pack.json';
import prompts from '../../../data/lead-prompts.json';
import { getKitOrderById, isKitOrderId, kitTokensMatch } from '../../../lib/kit-orders';
import { buildKitZip, type KitPack, type PromptPack } from '../../../lib/printable';

function plain(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
    },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const orderId = url.searchParams.get('pedido') || '';
  const token = url.searchParams.get('t') || '';
  if (!isKitOrderId(orderId)) return plain(404, 'Enlace no válido.');

  try {
    const order = await getKitOrderById(orderId);
    if (!order || order.status !== 'APPROVED' || !order.downloadToken || !kitTokensMatch(token, order.downloadToken)) {
      return plain(404, 'Enlace no válido.');
    }
    if (!order.downloadExpiresAt || Date.parse(order.downloadExpiresAt) <= Date.now()) {
      return plain(410, 'El enlace venció. Escríbele a Omar con el correo con el que pagaste para pedir otro.');
    }
  } catch (error) {
    console.error('[kit] no se pudo abrir la descarga', error);
    return plain(503, 'El kit no está disponible ahora.');
  }

  const zip = buildKitZip(prompts as PromptPack, kitPack as KitPack);
  const body = zip.buffer.slice(zip.byteOffset, zip.byteOffset + zip.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="kit-ia-talleres-detailing.zip"',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
