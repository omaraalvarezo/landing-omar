import type { APIRoute } from 'astro';
import { categoryPath, getCategories, getTools } from '../lib/directory';
import { categorySeo, DIRECTORY_INDEX, hubSeo, TASK_LINKS } from '../lib/directory-seo';
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
  publishedSistemas,
  publishedTrends,
  publishedWeeks,
  SITE,
  sistemaPath,
  trendPath,
  weekPath,
} from '../lib/editorial';

function line(title: string, path: string, description: string) {
  return `- [${title}](${SITE}${path}): ${description.replace(/\s+/g, ' ').trim()}`;
}

export const GET: APIRoute = async () => {
  const [sections, paras, news, prompts, weeks, comparisons, alternatives, cases, trends, sistemas] = await Promise.all([
    guideSections(),
    publishedPara(),
    publishedNews(),
    publishedPrompts(),
    publishedWeeks(),
    publishedComparisons(),
    publishedAlternatives(),
    publishedCases(),
    publishedTrends(),
    publishedSistemas(),
  ]);

  const categories = getCategories();
  const tools = getTools();
  const hubLead = new Map<string, string>([
    [paraPath(), hubSeo('para').lead],
    [newsPath(), hubSeo('noticias').lead],
    [promptsPath(), hubSeo('prompts').lead],
    [weekPath(), hubSeo('semana').lead],
    [comparePath(), hubSeo('comparar').lead],
    [alternativesPath(), hubSeo('alternativas').lead],
    [casePath(), hubSeo('casos').lead],
    [trendPath(), hubSeo('tendencias').lead],
  ]);
  const body = `# Omar Álvarez — herramientas de IA para pymes

> ${DIRECTORY_INDEX.lead} El primer párrafo de cada pieza es la respuesta directa. Las cifras citan la fuente y la fecha. No hay llamada gratuita ni paquetes de consultoría en estas páginas; hoy no se ofrecen sesiones ni instalaciones, solo una lista de espera.

## Para elegir

${TASK_LINKS.map((link) => line(link.label, link.href, link.note)).join('\n')}

## Sistemas

${line('Sistemas', sistemaPath(), 'Los sistemas con los que Omar opera Enzo Motorsport, por oficio, para montarlos con herramientas que ya existen. Pago único.')}
${sistemas.map((entry) => line(entry.data.title, sistemaPath(entry.id), entry.data.description)).join('\n')}

## Directorio

${line('Herramientas de IA', '/herramientas-ia', DIRECTORY_INDEX.lead)}
${line('PDF de prompts', '/herramientas-ia/prompts-gratis', 'Cuarenta prompts para talleres, detailing y pymes. El PDF se entrega después del correo.')}
${line('Kit de IA', '/herramientas-ia/kit', 'Prompts, mensajes de WhatsApp, flujos y CSV. Pago único en COP.')}
${line('Calculadoras', '/herramientas-ia/recursos', 'Ahorro, reseñas y cotizador de detailing. Los números los escribe el visitante.')}
${line('Calculadora de ahorro', '/herramientas-ia/recursos/ahorro', 'Tiempo y dinero a partir de minutos, frecuencia y costo por hora escritos por el visitante.')}
${line('Respuestas a reseñas', '/herramientas-ia/recursos/resenas', 'Plantillas en el navegador. No usan una API de modelo.')}
${line('Cotizador de detailing', '/herramientas-ia/recursos/cotizador-detailing', 'Suma de precios escritos por el visitante. Sin tarifas precargadas.')}
${line('Destacar una herramienta', '/herramientas-ia/destacar', 'Planes de listado en COP. El pago no publica solo.')}
${categories.map((category) => line(category.label, categoryPath(category.slug), categorySeo(category.slug).lead)).join('\n')}
${tools.map((tool) => line(tool.nombre, `/herramientas-ia/${tool.slug}`, tool.desc)).join('\n')}

## Guías

${line('Guías', '/herramientas-ia/guias', hubSeo('guias').lead)}
${sections.map((section) => line(section.label, section.href, hubLead.get(section.href) ?? section.text)).join('\n')}
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
- [Lista de espera](${SITE}/#contacto): instalaciones y sesiones no están abiertas hoy; anotarse no tiene costo ni compromiso.
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
