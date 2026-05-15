import type { APIRoute } from 'astro';
import { getVisibleAreas, getResourcesByArea } from '../lib/resources';

const SITE = 'https://omaralvarezo.co';

export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);

  const visibleAreas = getVisibleAreas();
  const detailUrls = visibleAreas.flatMap((a) =>
    getResourcesByArea(a.slug).map((r) => ({
      loc: `${SITE}/recursos/${a.slug}/${r.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
    }))
  );

  const urls = [
    { loc: `${SITE}/`, changefreq: 'monthly', priority: '1.0' },
    { loc: `${SITE}/recursos`, changefreq: 'weekly', priority: '0.8' },
    ...visibleAreas.map((a) => ({
      loc: `${SITE}/recursos/${a.slug}`,
      changefreq: 'weekly',
      priority: '0.7',
    })),
    ...detailUrls,
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      )
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
