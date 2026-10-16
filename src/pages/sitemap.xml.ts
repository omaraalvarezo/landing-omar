import type { APIRoute } from 'astro';
import { categoryPath, getCategories, getTools, getToolsByCategory } from '../lib/directory';
import {
  alternativesPath,
  casePath,
  comparePath,
  newsPath,
  paraPath,
  promptsPath,
  publishedAlternatives,
  publishedCases,
  publishedComparisons,
  publishedNews,
  publishedPara,
  publishedPrompts,
  publishedTrends,
  publishedWeeks,
  trendPath,
  weekPath,
} from '../lib/editorial';
import { getVisibleAreas, getResourcesByArea } from '../lib/resources';

const SITE = 'https://omaralvarezo.co';

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);

  const visibleAreas = getVisibleAreas();
  const detailUrls = visibleAreas.flatMap((a) =>
    getResourcesByArea(a.slug).map((r) => ({
      loc: `${SITE}/recursos/${a.slug}/${r.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
    }))
  );

  const directoryTools = getTools();
  const directoryCategories = getCategories().filter((category) => getToolsByCategory(category.slug).length > 0);

  const [paras, news, prompts, weeks, comparisons, alternatives, cases, trends] = await Promise.all([
    publishedPara(),
    publishedNews(),
    publishedPrompts(),
    publishedWeeks(),
    publishedComparisons(),
    publishedAlternatives(),
    publishedCases(),
    publishedTrends(),
  ]);

  const contentUrls = [
    { loc: `${SITE}/herramientas-ia/guias`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE}${paraPath()}`, changefreq: 'weekly', priority: '0.7' },
    ...paras.map((entry) => ({ loc: `${SITE}${paraPath(entry.id)}`, changefreq: 'monthly', priority: '0.6' })),
    { loc: `${SITE}${newsPath()}`, changefreq: 'weekly', priority: '0.7' },
    ...news.map((entry) => ({ loc: `${SITE}${newsPath(entry.id)}`, changefreq: 'monthly', priority: '0.6' })),
    { loc: `${SITE}${promptsPath()}`, changefreq: 'weekly', priority: '0.6' },
    ...prompts.map((entry) => ({ loc: `${SITE}${promptsPath(entry.id)}`, changefreq: 'monthly', priority: '0.5' })),
    { loc: `${SITE}${weekPath()}`, changefreq: 'weekly', priority: '0.6' },
    ...weeks.map((entry) => ({ loc: `${SITE}${weekPath(entry.id)}`, changefreq: 'weekly', priority: '0.5' })),
    { loc: `${SITE}${comparePath()}`, changefreq: 'weekly', priority: '0.6' },
    ...comparisons.map((entry) => ({ loc: `${SITE}${comparePath(entry.id)}`, changefreq: 'monthly', priority: '0.6' })),
    { loc: `${SITE}${alternativesPath()}`, changefreq: 'weekly', priority: '0.6' },
    ...alternatives.map((entry) => ({ loc: `${SITE}${alternativesPath(entry.id)}`, changefreq: 'monthly', priority: '0.6' })),
    { loc: `${SITE}${casePath()}`, changefreq: 'weekly', priority: '0.6' },
    ...cases.map((entry) => ({ loc: `${SITE}${casePath(entry.id)}`, changefreq: 'monthly', priority: '0.5' })),
    { loc: `${SITE}${trendPath()}`, changefreq: 'monthly', priority: '0.6' },
    ...trends.map((entry) => ({ loc: `${SITE}${trendPath(entry.id)}`, changefreq: 'monthly', priority: '0.5' })),
  ];

  const urls = [
    { loc: `${SITE}/`, changefreq: 'monthly', priority: '1.0' },
    { loc: `${SITE}/herramientas-ia`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${SITE}/herramientas-ia/destacar`, changefreq: 'monthly', priority: '0.4' },
    ...contentUrls,
    ...directoryCategories.map((category) => ({
      loc: `${SITE}${categoryPath(category.slug)}`,
      changefreq: 'weekly',
      priority: '0.6',
    })),
    ...directoryTools.map((tool) => ({
      loc: `${SITE}/herramientas-ia/${tool.slug}`,
      changefreq: 'monthly',
      priority: '0.5',
    })),
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
