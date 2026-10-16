export const prerender = false;

import type { APIRoute } from 'astro';
import { createKitReference, isKitBusiness, kitAmountInCents } from '../../../lib/kit';
import {
  consumeKitRateLimit,
  createKitAccessToken,
  createKitOrder,
  createKitOrderId,
  kitAccessCookieName,
} from '../../../lib/kit-orders';
import { createCheckoutUrl } from '../../../lib/wompi-consulting';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

function json(status: number, body: object, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      ...extraHeaders,
    },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 8_000) return json(413, { error: 'Solicitud demasiado grande.' });

  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  const configuredSite = String(import.meta.env.PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const allowedOrigins = new Set([requestOrigin, configuredSite].filter(Boolean));
  if (origin && !allowedOrigins.has(origin)) return json(403, { error: 'Origen no permitido.' });

  let input: Record<string, unknown>;
  try {
    input = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { error: 'No pudimos leer el formulario.' });
  }

  if (clean(input.company, 80)) return json(400, { error: 'No pudimos iniciar el pago.' });

  const buyerName = clean(input.buyerName, 80);
  const email = clean(input.email, 254).toLowerCase();
  const business = clean(input.business, 20);
  if (buyerName.length < 2 || !EMAIL.test(email) || !isKitBusiness(business)) {
    return json(400, { error: 'Revisa nombre, correo y tipo de negocio.' });
  }

  const siteUrl = configuredSite || requestOrigin;
  try {
    if (!(await consumeKitRateLimit(clientAddress || 'unknown'))) {
      return json(429, { error: 'Demasiados intentos. Espera unos minutos.' });
    }

    const amountInCents = kitAmountInCents();
    const reference = createKitReference();
    const orderId = createKitOrderId();
    const accessToken = createKitAccessToken();
    const redirectUrl = new URL(`/herramientas-ia/kit/pedido/${orderId}`, siteUrl).toString();
    const checkoutUrl = await createCheckoutUrl({
      reference,
      amountInCents,
      redirectUrl,
      customerName: buyerName,
      customerEmail: email,
    });

    await createKitOrder({
      id: orderId,
      reference,
      amountInCents,
      buyerName,
      email,
      business,
      accessToken,
    });

    const secure = new URL(siteUrl).protocol === 'https:' ? '; Secure' : '';
    return json(
      200,
      { checkoutUrl, reference, orderId, amountInCents },
      {
        'Set-Cookie': `${kitAccessCookieName(orderId)}=${accessToken}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=2592000`,
      },
    );
  } catch (error) {
    console.error('[kit] no se pudo crear el checkout', error);
    return json(503, { error: 'El pago no está disponible en este momento. La página sigue abierta y no se cobra nada.' });
  }
};
