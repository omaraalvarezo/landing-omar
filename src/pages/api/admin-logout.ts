// POST /api/admin-logout — borra la cookie de sesión.

export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = () => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Set-Cookie': '__admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    },
  });
};
