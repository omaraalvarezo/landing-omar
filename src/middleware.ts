// Middleware Astro: protege /admin verificando la cookie HMAC.
// Si la cookie es válida, expone Astro.locals.adminUnlocked = true.
// Si NO, expone false → la página renderiza un login form en lugar del dashboard.

import { defineMiddleware } from 'astro:middleware';
import { verify } from './lib/admin-session';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === '/admin' || context.url.pathname === '/admin/') {
    const cookie = context.cookies.get('__admin_session');
    const secret = import.meta.env.SESSION_SECRET;

    context.locals.adminUnlocked =
      !!cookie?.value && !!secret && !!verify(cookie.value, secret);
  }
  return next();
});
