import { describe, expect, it } from 'vitest';
import { SHORT_LINKS, allowShortLinkTrailingSlash, shortLinkDestination, shortLinkRedirects } from '../src/lib/short-links';

// Todo lo que hay bajo src/pages (archivos en cualquier nivel); de ahí sale el primer segmento.
const pageFiles = Object.keys(import.meta.glob(['../src/pages/**/*.*'], { eager: false }));
const link = (slug: string) => {
  const found = SHORT_LINKS.find((item) => item.slug === slug);
  if (!found) throw new Error(`falta el slug ${slug}`);
  return found;
};

// Primer nivel de src/pages, con y sin extensión (admin.astro -> admin, api/x.ts -> api).
function topLevelRoutes(): Set<string> {
  return new Set(
    pageFiles.flatMap((file) => {
      const first = file.replace('../src/pages/', '').split('/')[0] ?? '';
      return [first, first.replace(/(\.[a-z]+)+$/i, '')];
    }),
  );
}

describe('direcciones cortas', () => {
  it('los slugs son únicos y sin barras', () => {
    const slugs = SHORT_LINKS.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('ningún slug choca con un archivo o carpeta de src/pages', () => {
    const taken = topLevelRoutes();
    // La regla ve de verdad lo que hay: un archivo y una carpeta reales.
    expect(taken.has('admin')).toBe(true);
    expect(taken.has('sistemas')).toBe(true);
    expect(taken.has('tiktok')).toBe(true);
    for (const { slug } of SHORT_LINKS) {
      expect(taken.has(slug), `/${slug} choca con src/pages`).toBe(false);
    }
  });

  it('todo destino empieza con una sola barra', () => {
    for (const { to } of SHORT_LINKS) {
      expect(to.startsWith('/')).toBe(true);
      expect(to.startsWith('//')).toBe(false);
    }
  });

  it('agrega ref y deja el hash al final', () => {
    expect(shortLinkDestination(link('entregas'))).toBe('/sistemas/detailing?ref=entregas');
    expect(shortLinkDestination(link('lista'))).toBe('/?ref=lista#contacto');
    expect(shortLinkDestination({ slug: 'x', to: '/a?b=1#c' })).toBe('/a?b=1&ref=x#c');
  });

  it('los redirects son 302 hacia el destino con ref', () => {
    const redirects = shortLinkRedirects();
    expect(Object.keys(redirects).sort()).toEqual(SHORT_LINKS.map((item) => `/${item.slug}`).sort());
    expect(redirects['/entregas']).toEqual({ status: 302, destination: '/sistemas/detailing?ref=entregas' });
    expect(redirects['/lista']).toEqual({ status: 302, destination: '/?ref=lista#contacto' });
  });
});

describe('direcciones cortas con barra final (/entregas/)', () => {
  // Así escribe @astrojs/vercel las rutas de los redirects en .vercel/output/config.json.
  const adapterRoutes = () => [
    ...SHORT_LINKS.map((item) => ({
      src: `^/${item.slug}$`,
      headers: { Location: shortLinkDestination(item) },
      status: 302,
    })),
    { src: '^/_astro(?:/(.*))$', headers: { 'cache-control': 'public' }, continue: true },
    { handle: 'filesystem' },
    { src: '^/kit-otra$', dest: '_render' },
  ];

  it('cada redirect corto acepta también la barra final, con el mismo destino y 302', () => {
    const { routes, missing } = allowShortLinkTrailingSlash(adapterRoutes(), SHORT_LINKS);
    expect(missing).toEqual([]);
    for (const item of SHORT_LINKS) {
      const route = routes.find((r) => 'src' in r && r.src === `^/${item.slug}/?$`) as Record<string, unknown>;
      expect(route, item.slug).toBeDefined();
      expect(route.status).toBe(302);
      expect(route.headers).toEqual({ Location: shortLinkDestination(item) });
      expect(new RegExp(String(route.src)).test(`/${item.slug}/`)).toBe(true);
      expect(new RegExp(String(route.src)).test(`/${item.slug}`)).toBe(true);
      expect(new RegExp(String(route.src)).test(`/${item.slug}/x`)).toBe(false);
    }
    expect(routes.find((r) => 'src' in r && r.src === '^/entregas/?$')).toMatchObject({
      status: 302,
      headers: { Location: '/sistemas/detailing?ref=entregas' },
    });
  });

  it('no toca rutas que no son de un link corto', () => {
    const { routes } = allowShortLinkTrailingSlash(adapterRoutes(), SHORT_LINKS);
    expect(routes.slice(SHORT_LINKS.length)).toEqual(adapterRoutes().slice(SHORT_LINKS.length));
  });

  it('avisa qué slug no encontró (si el adaptador cambia de formato, el build falla)', () => {
    const { missing } = allowShortLinkTrailingSlash([{ handle: 'filesystem' }], SHORT_LINKS);
    expect(missing.sort()).toEqual(SHORT_LINKS.map((item) => item.slug).sort());
  });
});
