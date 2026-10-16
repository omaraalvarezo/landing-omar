export const prerender = false;

import type { APIRoute } from 'astro';
import {
  categoryLabel,
  createDirectoryReference,
  getCategory,
  isDirectoryPlan,
  planAmountInCents,
} from '../../../lib/directory';
import {
  consumeDirectoryRateLimit,
  createDirectoryAccessToken,
  createDirectoryOrder,
  createDirectoryOrderId,
  directoryAccessCookieName,
} from '../../../lib/directory-orders';
import { createCheckoutUrl } from '../../../lib/wompi';

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
      ...extraHeaders,
    },
  });
}

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.includes('.') && !/^(localhost|127\.0\.0\.1)$/i.test(url.hostname);
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 20_000) return json(413, { error: 'Solicitud demasiado grande.' });

  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  const configuredSite = String(import.meta.env.PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const allowedOrigins = new Set([requestOrigin, configuredSite].filter(Boolean));
  if (origin && !allowedOrigins.has(origin)) return json(403, { error: 'Origen no permitido.' });

  let input: Record<string, unknown>;
  try {
    // Lee como texto para acotar también cuerpos sin Content-Length; null o un arreglo no son un formulario.
    const raw = await request.text();
    if (raw.length > 20_000) return json(413, { error: 'Solicitud demasiado grande.' });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('BAD_BODY');
    input = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: 'No pudimos leer el formulario.' });
  }

  if (clean(input.company, 80)) return json(400, { error: 'No pudimos iniciar el pago.' });

  const plan = input.plan;
  const toolName = clean(input.toolName, 80);
  const toolUrl = clean(input.toolUrl, 300);
  const email = clean(input.email, 254).toLowerCase();
  const category = clean(input.category, 40);
  const description = clean(input.description, 500);

  if (!isDirectoryPlan(plan) || !getCategory(category)) {
    return json(400, { error: 'Elige un plan y una categoría del directorio.' });
  }
  if (toolName.length < 2 || !isHttpsUrl(toolUrl) || !EMAIL.test(email) || description.length < 20) {
    return json(400, { error: 'Revisa nombre, URL https, correo y una descripción de al menos 20 caracteres.' });
  }

  const siteUrl = configuredSite || requestOrigin;
  try {
    if (!(await consumeDirectoryRateLimit(clientAddress || 'unknown'))) {
      return json(429, { error: 'Demasiados intentos. Espera unos minutos.' });
    }

    const amountInCents = planAmountInCents(plan);
    const reference = createDirectoryReference(plan);
    const orderId = createDirectoryOrderId();
    const accessToken = createDirectoryAccessToken();
    const redirectUrl = new URL(`/herramientas-ia/pedido/${orderId}`, siteUrl).toString();
    const checkoutUrl = await createCheckoutUrl({
      reference,
      amountInCents,
      redirectUrl,
      customerName: toolName,
      customerEmail: email,
    });

    await createDirectoryOrder({
      id: orderId,
      reference,
      plan,
      amountInCents,
      toolName,
      toolUrl,
      email,
      description,
      category,
      accessToken,
    });

    const secure = new URL(siteUrl).protocol === 'https:' ? '; Secure' : '';
    return json(
      200,
      {
        checkoutUrl,
        reference,
        orderId,
        plan,
        amountInCents,
        category: categoryLabel(category),
      },
      {
        'Set-Cookie': `${directoryAccessCookieName(orderId)}=${accessToken}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=2592000`,
      },
    );
  } catch (error) {
    console.error('[directorio] no se pudo crear el checkout', error);
    return json(503, { error: 'El pago no está disponible en este momento. Intenta de nuevo en unos minutos.' });
  }
};
