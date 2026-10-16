import type { APIRoute } from 'astro';
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
  SITE,
  trendPath,
  weekPath,
} from '../../lib/editorial';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const GET: APIRoute = async () => {
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

  const items = [
    ...news.map((entry) => ({ title: entry.data.title, path: newsPath(entry.id), description: entry.data.description, date: entry.data.published })),
    ...paras.map((entry) => ({ title: entry.data.title, path: paraPath(entry.id), description: entry.data.description, date: entry.data.published })),
    ...prompts.map((entry) => ({ title: entry.data.title, path: promptsPath(entry.id), description: entry.data.description, date: entry.data.published })),
    ...weeks.map((entry) => ({ title: entry.data.title, path: weekPath(entry.id), description: entry.data.description, date: entry.data.published })),
    ...comparisons.map((entry) => ({ title: entry.data.title, path: comparePath(entry.id), description: entry.data.description, date: entry.data.published })),
    ...alternatives.map((entry) => ({ title: entry.data.title, path: alternativesPath(entry.id), description: entry.data.description, date: entry.data.published })),
    ...cases.map((entry) => ({ title: entry.data.title, path: casePath(entry.id), description: entry.data.description, date: entry.data.published })),
    ...trends.map((entry) => ({ title: entry.data.title, path: trendPath(entry.id), description: entry.data.description, date: entry.data.published })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Herramientas de IA para pymes — Omar Álvarez</title>
    <link>${SITE}/herramientas-ia</link>
    <description>Noticias, guías, comparativas y casos del directorio de IA para pymes.</description>
    <language>es</language>
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${SITE}${item.path}</link>
      <guid>${SITE}${item.path}</guid>
      <pubDate>${new Date(`${item.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`,
      )
      .join('\n    ')}
  </channel>
</rss>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
