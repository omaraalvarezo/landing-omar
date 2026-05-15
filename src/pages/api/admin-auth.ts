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
    })
  : null;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const jsonResponse = (status: number, body: object, extraHeaders: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
    });

  // Rate limit (si Upstash configurado)
  if (ratelimit) {
    const { success } = await ratelimit.limit(clientAddress);
    if (!success) {
      return jsonResponse(429, { error: 'Demasiados intentos. Esperá 15 minutos.' });
    }
  }

  // Parse body
  let password: unknown;
  try {
    const body = (await request.json()) as { password?: unknown };
    password = body.password;
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
  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }

  // Firma session token (1h)
  const token = sign({ sub: 'admin', exp: Date.now() + 3600_000 }, secret);

  return jsonResponse(
    200,
    { ok: true },
    {
      'Set-Cookie': `__admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
    }
  );
};
