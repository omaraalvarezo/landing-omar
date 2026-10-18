// POST /api/contacto — recibe el formulario de la lista de espera (instalación, sesión, otro
// oficio o pregunta del sistema) y lo envía al correo de Omar por Resend. Sin base de datos ni
// pago: el correo ES el registro.
// Rate limit: 5 envíos / hora por IP (vía Upstash Redis, opcional).
// Si falta RESEND_API_KEY responde 503 y el navegador ofrece escribir por correo.

export const prerender = false;

import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { CONTACT_BODY_MAX_BYTES, CONTACT_EMAIL } from '../../lib/consulting';
import { validateWaitlist, WAITLIST_WANT_LABELS } from '../../lib/waitlist';
import oficios from '../../data/oficios.json';
import paises from '../../data/paises.json';

const redis =
  getSecret('UPSTASH_REDIS_REST_URL') && getSecret('UPSTASH_REDIS_REST_TOKEN')
    ? new Redis({
        url: getSecret('UPSTASH_REDIS_REST_URL'),
        token: getSecret('UPSTASH_REDIS_REST_TOKEN'),
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(5, '1 h'),
      analytics: false,
      prefix: 'rl:contacto',
      // Si Upstash no responde en 3 s se deja pasar: no bloqueamos un contacto legítimo.
      timeout: 3_000,
    })
  : null;

const json = (status: number, body: object, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      ...extraHeaders,
    },
  });

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function isJsonContentType(header: string | null): boolean {
  // Compara el tipo MIME exacto: "text/plain; x=application/json" no debe pasar, porque
  // text/plain es una petición simple que otro sitio puede enviar sin preflight CORS.
  const essence = (header || '').split(';')[0]!.trim().toLowerCase();
  return essence === 'application/json';
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!isJsonContentType(request.headers.get('content-type'))) {
    return json(415, { error: 'Formato no soportado.' });
  }

  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  const configuredSite = String(import.meta.env.PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const allowedOrigins = new Set([requestOrigin, configuredSite].filter(Boolean));
  if (origin && !allowedOrigins.has(origin)) return json(403, { error: 'Origen no permitido.' });

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > CONTACT_BODY_MAX_BYTES) {
    return json(413, { error: 'El mensaje es demasiado largo.' });
  }

  let body: Record<string, unknown>;
  try {
    // Lee como texto para acotar también los cuerpos sin Content-Length (chunked).
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > CONTACT_BODY_MAX_BYTES) {
      return json(413, { error: 'El mensaje es demasiado largo.' });
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('BAD_BODY');
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: 'No pude leer el formulario. Recarga la página e intenta de nuevo.' });
  }

  // Honeypot: un humano nunca ve ni llena este campo. Respondemos OK para no darle pistas al bot.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json(200, { ok: true });
  }

  // El servidor revalida todo con las mismas reglas que el navegador (src/lib/waitlist.ts).
  const result = validateWaitlist(body);
  if (!result.ok) return json(400, { error: result.error, field: result.field });
  const { name, email, phone, business, want, oficio, oficioOtro, country, message } = result.value;

  if (ratelimit) {
    try {
      const { success } = await ratelimit.limit(clientAddress || 'unknown');
      if (!success) {
        return json(429, { error: 'Ya recibí varios mensajes desde esta conexión. Intenta de nuevo en una hora.' });
      }
    } catch {
      // Si Upstash falla no bloqueamos un contacto legítimo.
    }
  }

  const apiKey = getSecret('RESEND_API_KEY');
  if (!apiKey) {
    return json(503, { error: 'EMAIL_NOT_CONFIGURED', fallbackEmail: CONTACT_EMAIL });
  }

  const to = getSecret('CONTACT_TO_EMAIL') || CONTACT_EMAIL;
  const from =
    getSecret('CONTACT_FROM_EMAIL') ||
    getSecret('DIRECTORY_NOTIFY_FROM') ||
    'Web omaralvarezo.co <onboarding@resend.dev>';
  const wantLabel = WAITLIST_WANT_LABELS[want];
  const oficioLabel = oficios.find((item) => item.id === oficio)?.label ?? oficio;
  const countryLabel = paises.find((item) => item.id === country)?.label ?? country;

  const rows: Array<[string, string]> = [
    ['Qué quiere', wantLabel],
    ['Oficio', oficioOtro ? `Otro: ${oficioOtro}` : oficioLabel],
    ['País', countryLabel],
    ['Negocio', business],
    ['Nombre', name],
    ['Correo', email],
    ['WhatsApp', phone || '—'],
    ['Mensaje', message || '—'],
  ];

  const text = [
    'Nueva anotación en la lista de espera de omaralvarezo.co',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join('\n');

  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#131118;line-height:1.5">
<h2 style="margin:0 0 16px">Nueva anotación en la lista de espera</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="color:#666;vertical-align:top">${escapeHtml(label)}</td><td style="white-space:pre-wrap"><strong>${escapeHtml(value)}</strong></td></tr>`,
    )
    .join('')}</table>
<p style="color:#888;font-size:12px;margin-top:24px">Responde a este correo para escribirle directamente.</p>
</body></html>`;

  // Un reintento del mismo mensaje (doble clic, timeout del navegador) no genera un segundo
  // correo: Resend deduplica por esta llave durante 24 horas.
  const idempotencyKey = `contacto-${await sha256Hex(JSON.stringify([email, name, business, want, oficio, oficioOtro, country, phone, message]))}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: Array.from(`Lista de espera · ${wantLabel} · ${business}`).slice(0, 160).join(''),
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error('[contacto] Resend respondió', response.status);
      return json(502, { error: 'EMAIL_SEND_FAILED', fallbackEmail: CONTACT_EMAIL });
    }
  } catch (error) {
    console.error('[contacto] Error enviando correo', error instanceof Error ? error.name : 'unknown');
    return json(502, { error: 'EMAIL_SEND_FAILED', fallbackEmail: CONTACT_EMAIL });
  }

  return json(200, { ok: true });
};

export const ALL: APIRoute = () => json(405, { error: 'Método no permitido.' }, { Allow: 'POST' });
