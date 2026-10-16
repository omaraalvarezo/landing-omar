// POST /api/admin-auth — valida password con bcrypt + rate limit.
// Si OK, devuelve cookie HTTP-only firmada con HMAC. Si no, 401 (sin filtrar info).
// Rate limit: 5 intentos / 15 minutos por IP (vía Upstash Redis, opcional).

export const prerender = false;

import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { sign } from '../../lib/admin-session';

// Redis solo se inicializa si las env vars están seteadas.
const redis =
  import.meta.env.UPSTASH_REDIS_REST_URL && import.meta.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: import.meta.env.UPSTASH_REDIS_REST_URL,
        token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(5, '15 m'),
      analytics: false,
      prefix: 'rl:admin-auth',
      timeout: 3_000,
    })
  : null;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const jsonResponse = (status: number, body: object, extraHeaders: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
    });

  // Cuerpos enormes no llegan a bcrypt ni al parser.
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 2_000) return jsonResponse(413, { error: 'Bad request' });

  // Rate limit (si Upstash configurado). Si Upstash falla se cierra: sin límite no hay login.
  if (ratelimit) {
    try {
      const { success, reason } = await ratelimit.limit(clientAddress || 'unknown');
      // Ante un timeout la librería deja pasar; aquí preferimos no aceptar intentos sin contar.
      if (reason === 'timeout') return jsonResponse(503, { error: 'Unavailable' });
      if (!success) {
        return jsonResponse(429, { error: 'Demasiados intentos. Espera 15 minutos.' });
      }
    } catch {
      return jsonResponse(503, { error: 'Unavailable' });
    }
  }

  // Parse body
  let password: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2_000) return jsonResponse(413, { error: 'Bad request' });
    const body = JSON.parse(raw) as { password?: unknown } | null;
    password = body && typeof body === 'object' ? body.password : undefined;
  } catch {
    return jsonResponse(400, { error: 'Bad request' });
  }
  if (typeof password !== 'string' || password.length < 1 || password.length > 128) {
    return jsonResponse(400, { error: 'Bad request' });
  }

  // Server config
  const hash = import.meta.env.ADMIN_PASSWORD_HASH;
  const secret = import.meta.env.SESSION_SECRET;
  if (!hash || !secret) {
    return jsonResponse(500, { error: 'Server not configured' });
  }

  // Compare bcrypt
  let valid = false;
  try {
    valid = await bcrypt.compare(password, hash);
  } catch {
    return jsonResponse(500, { error: 'Server not configured' });
  }
  if (!valid) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }

  // Firma session token (1h)
  const token = await sign({ sub: 'admin', exp: Date.now() + 3600_000 }, secret);

  return jsonResponse(
    200,
    { ok: true },
    {
      'Set-Cookie': `__admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
    }
  );
};

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Allow: 'POST' },
  });
