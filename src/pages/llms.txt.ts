import type { APIRoute } from 'astro';
import { getCategories, getTools } from '../lib/directory';
import {
  alternativesPath,
  casePath,
  comparePath,
  guideSections,
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
} from '../lib/editorial';

function line(title: string, path: string, description: string) {
  return `- [${title}](${SITE}${path}): ${description.replace(/\s+/g, ' ').trim()}`;
}

export const GET: APIRoute = async () => {
  const [sections, paras, news, prompts, weeks, comparisons, alternatives, cases, trends] = await Promise.all([
    guideSections(),
    publishedPara(),
    publishedNews(),
    publishedPrompts(),
    publishedWeeks(),
    publishedComparisons(),
    publishedAlternatives(),
    publishedCases(),
    publishedTrends(),
  ]);

  const categories = getCategories();
  const tools = getTools();
  const body = `# Omar Álvarez — herramientas de IA para pymes

> Directorio y guías en español. El primer párrafo de cada pieza es la respuesta directa. Las cifras citan la fuente y la fecha. No hay llamada gratuita ni paquetes de consultoría en estas páginas.

## Directorio

${line('Herramientas de IA', '/herramientas-ia', 'Lista de herramientas para pymes, con buscador y destacados primero.')}
${line('Destacar una herramienta', '/herramientas-ia/destacar', 'Planes de listado en COP. El pago no publica solo.')}
${categories.map((category) => line(category.label, `/herramientas-ia/categoria/${category.slug}`, `Categoría ${category.label}.`)).join('\n')}
${tools.map((tool) => line(tool.nombre, `/herramientas-ia/${tool.slug}`, tool.desc)).join('\n')}

## Guías

${sections.map((section) => line(section.label, section.href, section.text)).join('\n')}
${paras.map((entry) => line(entry.data.title, paraPath(entry.id), entry.data.description)).join('\n')}
${news.map((entry) => line(entry.data.title, newsPath(entry.id), entry.data.description)).join('\n')}
${prompts.map((entry) => line(entry.data.title, promptsPath(entry.id), entry.data.description)).join('\n')}
${weeks.map((entry) => line(entry.data.title, weekPath(entry.id), entry.data.description)).join('\n')}
${comparisons.map((entry) => line(entry.data.title, comparePath(entry.id), entry.data.description)).join('\n')}
${alternatives.map((entry) => line(entry.data.title, alternativesPath(entry.id), entry.data.description)).join('\n')}
${cases.map((entry) => line(entry.data.title, casePath(entry.id), entry.data.description)).join('\n')}
${trends.map((entry) => line(entry.data.title, trendPath(entry.id), entry.data.description)).join('\n')}

## Opcional

- [RSS](${SITE}/herramientas-ia/rss.xml): novedades de las guías.
- [Consultoría](${SITE}/#reservar): sesión privada de 120 minutos, aparte del directorio.
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
