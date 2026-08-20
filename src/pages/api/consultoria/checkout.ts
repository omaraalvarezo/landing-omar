export const prerender = false;

import type { APIRoute } from 'astro';
import { createConsultingReference } from '../../../lib/consulting';
import { isServiceSystemStage } from '../../../lib/framework';
import { getConsultingQuote } from '../../../lib/trm';
import { createCheckoutUrl } from '../../../lib/wompi-consulting';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number): string {
  return typeof value === 'string'
    ? value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)
    : '';
}

function json(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 20_000) return json(413, { error: 'Solicitud demasiado grande.' });

  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  const configuredSite = String(import.meta.env.PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const allowedOrigins = new Set([requestOrigin, configuredSite].filter(Boolean));
  if (origin && !allowedOrigins.has(origin)) return json(403, { error: 'Origen no permitido.' });

  let input: Record<string, unknown>;
  try {
    input = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { error: 'No pudimos leer los datos de la sesión.' });
  }

  const name = clean(input.name, 100);
  const email = clean(input.email, 254).toLowerCase();
  const business = clean(input.business, 120);
  const frameworkStage = clean(input.frameworkStage, 20);
  const problem = clean(input.problem, 1_200);
  const accepted = input.accepted === true;

  if (
    name.length < 3 ||
    !EMAIL.test(email) ||
    business.length < 2 ||
    !isServiceSystemStage(frameworkStage) ||
    problem.length < 20
  ) {
    return json(400, {
      error: 'Completa nombre, correo, negocio, etapa del Marco 4C y un problema concreto.',
    });
  }
  if (!accepted) return json(400, { error: 'Debes aceptar las condiciones de la sesión.' });

  const siteUrl = configuredSite || requestOrigin;
  const redirectUrl = new URL('/consultoria/agendar', siteUrl).toString();

  try {
    const quote = await getConsultingQuote();
    const reference = createConsultingReference(quote.amountInCents, quote.effectiveDate);
    const checkoutUrl = await createCheckoutUrl({
      reference,
      amountInCents: quote.amountInCents,
      redirectUrl,
      customerName: name,
      customerEmail: email,
    });

    return json(200, { checkoutUrl, reference, quote });
  } catch (error) {
    console.error('[consultoria] no se pudo crear el checkout', error);
    return json(503, {
      error: 'El pago no está disponible en este momento. Intenta de nuevo en unos minutos.',
    });
  }
};
