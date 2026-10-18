import { getSecret } from 'astro:env/server';
import { formatCop } from './money';
import { SITE } from './editorial';
import { kitDownloadPath } from './kit';
import { getProduct } from './products';
import type { KitOrder } from './kit-orders';

export type KitMailKind = 'approved' | 'voided' | 'double';
export type KitMailResult = 'sent' | 'unconfigured' | 'failed';

const DEFAULT_NOTIFY_EMAIL = 'omaraalvarezo@gmail.com';

function env(name: keyof ImportMetaEnv): string {
  return String(getSecret(String(name)) || '').trim();
}

function siteOrigin(): string {
  return env('PUBLIC_SITE_URL').replace(/\/$/, '') || SITE;
}

function message(order: KitOrder, kind: KitMailKind): { subject: string; text: string } {
  const amount = formatCop(order.amountInCents / 100);
  const productName = getProduct(order.product)?.name ?? 'Kit de IA';
  const subject =
    kind === 'double'
      ? `${productName} · doble cobro · ${amount} · ${order.buyerName}`
      : kind === 'voided'
        ? `${productName} · pago anulado · ${amount} · ${order.buyerName}`
        : `${productName} · ${amount} · ${order.buyerName}`;

  const headline =
    kind === 'double'
      ? 'Llegó un segundo pago APPROVED para una orden que ya estaba aprobada.'
      : kind === 'voided'
        ? 'Wompi anuló el pago. El enlace de descarga queda cerrado.'
        : `Pago aprobado: ${productName}.`;

  const download =
    kind === 'voided' || !order.downloadToken
      ? 'Sin enlace de descarga.'
      : `Enlace de descarga, vence ${order.downloadExpiresAt || 'sin fecha'}:\n${siteOrigin()}${kitDownloadPath(order.id, order.downloadToken)}`;

  const text = [
    headline,
    '',
    `Producto: ${productName}`,
    `Monto: ${amount} COP`,
    `Nombre: ${order.buyerName}`,
    `Correo: ${order.email}`,
    `Negocio: ${order.business}`,
    `Referencia: ${order.reference}`,
    `Transacción: ${order.transactionId || '—'}`,
    `Orden: ${order.id}`,
    '',
    download,
    '',
    'El enlace no es público. Si el comprador pierde la página de regreso, reenvíale este correo o el enlace.',
  ].join('\n');

  return { subject: subject.slice(0, 180), text };
}

export async function notifyKitPayment(order: KitOrder, kind: KitMailKind): Promise<KitMailResult> {
  const apiKey = env('RESEND_API_KEY');
  const from = env('DIRECTORY_NOTIFY_FROM');
  const to = env('DIRECTORY_NOTIFY_EMAIL') || DEFAULT_NOTIFY_EMAIL;
  if (!apiKey || !from || !to) return 'unconfigured';

  const { subject, text } = message(order, kind);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      console.error('[kit] Resend rechazó el aviso', response.status);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.error('[kit] no se pudo enviar el aviso', error);
    return 'failed';
  }
}

const MONTHS_FORMAT = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `2026-11-30` -> `30 de noviembre de 2026`. */
function longDate(isoDate: string): string {
  return MONTHS_FORMAT.format(new Date(`${isoDate}T12:00:00Z`));
}

/** Enlace que abre el pedido en cualquier dispositivo, sin la cookie del navegador que pagó. */
export function buyerOrderLink(order: KitOrder, siteUrl: string): string {
  const product = getProduct(order.product);
  if (!product) throw new Error('PRODUCT_UNKNOWN');
  return `${siteUrl.replace(/\/$/, '')}${product.orderPath}/${order.id}?t=${order.downloadToken}`;
}

function buyerMessage(order: KitOrder, siteUrl: string): { subject: string; text: string } {
  const product = getProduct(order.product)!;
  const amount = formatCop(order.amountInCents / 100);
  const due = product.presale?.videosDueDate;
  const videos = due
    ? `Los videos los publico antes del ${longDate(due)}. Cuando estén, te aviso por este mismo correo y los ves desde el mismo enlace. Si no llegan para esa fecha, te devuelvo la plata.`
    : 'Los videos van llegando después. Cuando estén, te aviso por este mismo correo y los ves desde el mismo enlace.';
  const guarantee = product.guaranteeDays
    ? `Garantía de ${product.guaranteeDays} días: si no te sirve, escríbeme a este correo en los ${product.guaranteeDays} días siguientes a la compra y dime qué no te sirvió. Te devuelvo la plata, yo mismo hago la devolución a mano.`
    : null;
  const name = order.buyerName.trim().split(/\s+/)[0] || 'hola';

  const text = [
    `Hola ${name},`,
    '',
    `Recibí tu pago de ${amount} COP por ${product.name}. Gracias por comprarlo.`,
    '',
    'Aquí está tu enlace. Funciona en cualquier dispositivo, no necesitas el navegador donde pagaste:',
    buyerOrderLink(order, siteUrl),
    '',
    'Guárdalo: es tu acceso a la descarga y a los videos. No lo compartas.',
    '',
    videos,
    ...(guarantee ? ['', guarantee] : []),
    '',
    'Omar',
  ].join('\n');

  return { subject: `Tu compra: ${product.name}`, text };
}

/** Recibo al comprador con el enlace que funciona sin cookie. Lo manda la liquidación del pago. */
export async function sendBuyerReceipt(order: KitOrder, siteUrl: string = siteOrigin()): Promise<KitMailResult> {
  const apiKey = env('RESEND_API_KEY');
  const from = env('DIRECTORY_NOTIFY_FROM');
  if (!apiKey || !from || !order.email) return 'unconfigured';
  if (!getProduct(order.product) || !order.downloadToken) {
    console.error('[kit] no hay producto o enlace para el recibo del comprador');
    return 'failed';
  }

  const replyTo = env('DIRECTORY_NOTIFY_EMAIL') || DEFAULT_NOTIFY_EMAIL;
  const { subject, text } = buyerMessage(order, siteUrl);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `buyer-receipt-${order.id}-${order.transactionId || 'tx'}`,
      },
      body: JSON.stringify({ from, to: [order.email], reply_to: replyTo, subject, text }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      console.error('[kit] Resend rechazó el recibo del comprador', response.status);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.error('[kit] no se pudo enviar el recibo del comprador', error);
    return 'failed';
  }
}
