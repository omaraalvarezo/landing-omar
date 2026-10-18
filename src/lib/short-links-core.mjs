// Lógica única de las direcciones cortas. Es .mjs puro porque `astro.config.mjs` la importa
// antes de que exista el pipeline de TypeScript, y `short-links.ts` la reexporta tipada.

/**
 * @typedef {{ slug: string, to: string, label: string }} ShortLink
 * @typedef {{ status: 302, destination: string }} ShortLinkRedirect
 */

/**
 * Destino con `ref={slug}` en el query string y el hash (si lo hay) al final.
 * `lista` -> `/?ref=lista#contacto`.
 * @param {{ slug: string, to: string }} link
 * @returns {string}
 */
export function shortLinkDestination(link) {
  const hashAt = link.to.indexOf('#');
  const path = hashAt === -1 ? link.to : link.to.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : link.to.slice(hashAt);
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}ref=${encodeURIComponent(link.slug)}${hash}`;
}

/**
 * Mapa `redirects` de Astro: `/{slug}` -> 302 hacia el destino con ref.
 * @param {readonly ShortLink[]} links
 * @returns {Record<string, ShortLinkRedirect>}
 */
export function shortLinkRedirects(links) {
  return Object.fromEntries(
    links.map((link) => [`/${link.slug}`, { status: 302, destination: shortLinkDestination(link) }]),
  );
}

/**
 * `@astrojs/vercel` escribe cada redirect como `^/{slug}$`, así que `/entregas/` no coincide.
 * Astro no deja declarar `/entregas` y `/entregas/` a la vez (es la misma ruta), por eso la
 * variante con barra se agrega aquí, sobre las rutas ya generadas: `^/{slug}$` -> `^/{slug}/?$`,
 * mismo destino y mismo 302. `missing` son los slugs sin ruta: el build debe fallar si hay alguno.
 * @template {Record<string, unknown>} Route
 * @param {readonly Route[]} routes
 * @param {readonly { slug: string }[]} links
 * @returns {{ routes: Route[], missing: string[] }}
 */
export function allowShortLinkTrailingSlash(routes, links) {
  const exact = new Map(links.map((link) => [`^/${link.slug}$`, link.slug]));
  const seen = new Set();
  const next = routes.map((route) => {
    const src = route.src;
    if (typeof src !== 'string' || !exact.has(src) || !route.headers || route.dest !== undefined) return route;
    const slug = exact.get(src);
    seen.add(slug);
    return { ...route, src: `^/${slug}/?$` };
  });
  return { routes: next, missing: links.map((link) => link.slug).filter((slug) => !seen.has(slug)) };
}
