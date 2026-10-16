// POST /api/contacto — recibe el formulario de consultoría y lo envía al correo de Omar
// por Resend. Sin base de datos ni pago: el correo ES el registro.
// Rate limit: 5 envíos / hora por IP (vía Upstash Redis, opcional).
// Si falta RESEND_API_KEY responde 503 y el navegador ofrece escribir por correo.

export const prerender = false;

import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import {
  CONTACT_BODY_MAX_BYTES,
  CONTACT_EMAIL,
  CONTACT_LIMITS,
  isContactEmail,
  isContactPhone,
} from '../../lib/consulting';
import { SERVICE_SYSTEM_STAGES } from '../../lib/framework';

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

type ContactField = 'name' | 'email' | 'phone' | 'business' | 'frameworkStage' | 'problem' | 'accepted';

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

const invalid = (field: ContactField, error: string) => json(400, { error, field });

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Quita saltos de línea y caracteres de control para que nada del visitante pueda partir un
// encabezado del correo (asunto, reply_to) ni ensuciar la tabla del aviso.
const singleLine = (value: string) =>
  value.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

// Texto libre: conserva saltos de línea, elimina el resto de caracteres de control.
const multiLine = (value: string) =>
  value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u2028\u2029]/g, '')
    .trim();

function readField(body: Record<string, unknown>, key: string, max: number): string {
  const value = body[key];
  if (typeof value !== 'string') return '';
  // Si el corte cae en medio de un emoji, se descarta la mitad suelta del par.
  return value.trim().slice(0, max).replace(/[\uD800-\uDBFF]$/, '');
}

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

  const name = singleLine(readField(body, 'name', CONTACT_LIMITS.name));
  const email = singleLine(readField(body, 'email', CONTACT_LIMITS.email));
  const phone = singleLine(readField(body, 'phone', CONTACT_LIMITS.phone));
  const business = singleLine(readField(body, 'business', CONTACT_LIMITS.business));
  const problem = multiLine(readField(body, 'problem', CONTACT_LIMITS.problemMax));
  const stageId = readField(body, 'frameworkStage', 40);
  const stage = SERVICE_SYSTEM_STAGES.find((item) => item.id === stageId);

  if (!stage) return invalid('frameworkStage', 'Elige dónde se está trabando tu negocio.');
  if (!name) return invalid('name', 'Escribe tu nombre.');
  if (!isContactEmail(email)) return invalid('email', 'Revisa tu correo: no parece válido.');
  if (phone && !isContactPhone(phone)) {
    return invalid('phone', 'Revisa tu WhatsApp: usa solo números, espacios o guiones (7 a 15 dígitos).');
  }
  if (!business) return invalid('business', 'Cuéntame qué negocio operas.');
  if (problem.length < CONTACT_LIMITS.problemMin) {
    return invalid(
      'problem',
      `Cuéntame el problema con un poco más de contexto (mínimo ${CONTACT_LIMITS.problemMin} caracteres).`,
    );
  }
  if (body.accepted !== true) {
    return invalid('accepted', 'Necesito tu autorización para usar estos datos y responderte.');
  }

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
  const stageLabel = `${stage.number} · ${stage.name}`;

  const rows: Array<[string, string]> = [
    ['Nombre', name],
    ['Correo', email],
    ['WhatsApp', phone || '—'],
    ['Negocio', business],
    ['Dónde se traba', stageLabel],
  ];

  const text = [
    'Nueva solicitud de consultoría desde omaralvarezo.co',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Qué está pasando:',
    problem,
  ].join('\n');

  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#131118;line-height:1.5">
<h2 style="margin:0 0 16px">Nueva solicitud de consultoría</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([label, value]) => `<tr><td style="color:#666">${escapeHtml(label)}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`)
    .join('')}</table>
<h3 style="margin:20px 0 8px">Qué está pasando</h3>
<p style="white-space:pre-wrap;margin:0">${escapeHtml(problem)}</p>
<p style="color:#888;font-size:12px;margin-top:24px">Responde a este correo para escribirle directamente.</p>
</body></html>`;

  // Un reintento del mismo mensaje (doble clic, timeout del navegador) no genera un segundo
  // correo: Resend deduplica por esta llave durante 24 horas.
  const idempotencyKey = `contacto-${await sha256Hex(JSON.stringify([email, name, business, stageId, phone, problem]))}`;

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
        subject: Array.from(`Consultoría · ${name} · ${business}`).slice(0, 160).join(''),
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
