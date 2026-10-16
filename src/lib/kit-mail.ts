import { getSecret } from 'astro:env/server';
import { formatCop } from './money';
import { KIT, kitDownloadPath } from './kit';
import type { KitOrder } from './kit-orders';

export type KitMailKind = 'approved' | 'voided' | 'double';
export type KitMailResult = 'sent' | 'unconfigured' | 'failed';

const DEFAULT_NOTIFY_EMAIL = 'omaraalvarezo@gmail.com';

function env(name: keyof ImportMetaEnv): string {
  return String(getSecret(String(name)) || '').trim();
}

function siteOrigin(): string {
  return env('PUBLIC_SITE_URL').replace(/\/$/, '') || 'https://omaralvarezo.co';
}

function message(order: KitOrder, kind: KitMailKind): { subject: string; text: string } {
  const amount = formatCop(order.amountInCents / 100);
  const subject =
    kind === 'double'
      ? `Kit IA · doble cobro · ${amount} · ${order.buyerName}`
      : kind === 'voided'
        ? `Kit IA · pago anulado · ${amount} · ${order.buyerName}`
        : `Kit IA · ${amount} · ${order.buyerName}`;

  const headline =
    kind === 'double'
      ? 'Llegó un segundo pago APPROVED para un kit que ya estaba aprobado.'
      : kind === 'voided'
        ? 'Wompi anuló el pago del kit. El enlace de descarga queda cerrado.'
        : 'Pago aprobado del kit de IA para talleres y detailing.';

  const download =
    kind === 'voided' || !order.downloadToken
      ? 'Sin enlace de descarga.'
      : `Enlace de descarga, vence ${order.downloadExpiresAt || 'sin fecha'}:\n${siteOrigin()}${kitDownloadPath(order.id, order.downloadToken)}`;

  const text = [
    headline,
    '',
    `Producto: ${KIT.name}`,
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
