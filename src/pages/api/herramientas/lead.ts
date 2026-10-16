export const prerender = false;

import type { APIRoute } from 'astro';
import { saveLeadAndGrant, consumeLeadRateLimit } from '../../../lib/lead-store';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

function json(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
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
    // Lee como texto para acotar también cuerpos sin Content-Length; null o un arreglo no son un formulario.
    const raw = await request.text();
    if (raw.length > 8_000) return json(413, { error: 'Solicitud demasiado grande.' });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('BAD_BODY');
    input = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: 'No pudimos leer el formulario.' });
  }

  if (clean(input.company, 80)) return json(400, { error: 'No pudimos guardar el correo.' });

  const email = clean(input.email, 254).toLowerCase();
  if (!EMAIL.test(email)) return json(400, { error: 'Escribe un correo válido.' });

  try {
    if (!(await consumeLeadRateLimit(clientAddress || 'unknown'))) {
      return json(429, { error: 'Demasiados intentos. Espera unos minutos.' });
    }
    const token = await saveLeadAndGrant(email);
    return json(200, { downloadUrl: `/api/herramientas/lead-archivo?t=${token}` });
  } catch (error) {
    console.error('[lead] no se pudo guardar el correo', error);
    return json(503, { error: 'El PDF no se puede entregar ahora. El formulario sigue aquí; no hay un enlace público del archivo.' });
  }
};
