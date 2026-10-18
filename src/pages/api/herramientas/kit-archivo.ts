export const prerender = false;

import type { APIRoute } from 'astro';
import kitPack from '../../../data/kit-pack.json';
import prompts from '../../../data/lead-prompts.json';
import sistemaContent from '../../../data/sistema-enzo-detailing-contenido.json';
import { getKitOrderById, isKitOrderId, kitTokensMatch } from '../../../lib/kit-orders';
import { buildKitZip, buildSistemaZip, type KitPack, type PromptPack } from '../../../lib/printable';
import { getProduct, type Product, type ProductId } from '../../../lib/products';
import type { SistemaContent } from '../../../lib/sistema';

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

function buildArchive(id: ProductId): Uint8Array {
  switch (id) {
    case 'talleres':
      return buildKitZip(prompts as PromptPack, kitPack as KitPack);
    case 'enzo-detailing':
      return buildSistemaZip(sistemaContent as SistemaContent);
    default: {
      const unreachable: never = id;
      throw new Error(`PRODUCT_ARCHIVE_MISSING:${String(unreachable)}`);
    }
  }
}

export const GET: APIRoute = async ({ url }) => {
  const orderId = url.searchParams.get('pedido') || '';
  const token = url.searchParams.get('t') || '';
  if (!isKitOrderId(orderId)) return plain(404, 'Enlace no válido.');

  let product: Product | null = null;
  try {
    const order = await getKitOrderById(orderId);
    if (!order || order.status !== 'APPROVED' || !order.downloadToken || !kitTokensMatch(token, order.downloadToken)) {
      return plain(404, 'Enlace no válido.');
    }
    if (!order.downloadExpiresAt || Date.parse(order.downloadExpiresAt) <= Date.now()) {
      return plain(410, 'El enlace venció. Escríbeme con el correo con el que pagaste y te mando otro.');
    }
    product = getProduct(order.product);
  } catch (error) {
    console.error('[kit] no se pudo abrir la descarga', error);
    return plain(503, 'La descarga no está disponible ahora.');
  }

  if (!product) return plain(404, 'Enlace no válido.');
  const zip = buildArchive(product.id);
  const body = zip.buffer.slice(zip.byteOffset, zip.byteOffset + zip.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${product.archiveName}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
