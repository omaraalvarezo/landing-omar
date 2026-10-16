import { getCollection, type CollectionEntry } from 'astro:content';
import { getTool, type Tool } from './directory';
import { personRef } from './schema';

export const SITE = 'https://omaralvarezo.co';

type Dated = { data: { draft?: boolean; published: string; priority?: number }; id: string };

export function publicEntries<T extends Dated>(entries: T[]): T[] {
  return entries
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => {
      const byPriority = (b.data.priority ?? 0) - (a.data.priority ?? 0);
      if (byPriority !== 0) return byPriority;
      return b.data.published.localeCompare(a.data.published) || a.id.localeCompare(b.id);
    });
}

export async function publishedPara() {
  return publicEntries(await getCollection('para'));
}
export async function publishedNews() {
  return publicEntries(await getCollection('noticias'));
}
export async function publishedPrompts() {
  return publicEntries(await getCollection('prompts'));
}
export async function publishedWeeks() {
  return publicEntries(await getCollection('semana'));
}
export async function publishedComparisons() {
  return publicEntries(await getCollection('comparar'));
}
export async function publishedAlternatives() {
  return publicEntries(await getCollection('alternativas'));
}
export async function publishedCases() {
  return publicEntries(await getCollection('casos'));
}
export async function publishedTrends() {
  return publicEntries(await getCollection('tendencias'));
}

export function toolsOf(slugs: string[]): Tool[] {
  return slugs.map((slug) => {
    const tool = getTool(slug);
    if (!tool) throw new Error(`Herramienta ausente del directorio: ${slug}`);
    return tool;
  });
}

export function paraPath(slug = '') {
  return slug ? `/herramientas-ia/para/${slug}` : '/herramientas-ia/para';
}
export function newsPath(slug = '') {
  return slug ? `/herramientas-ia/noticias/${slug}` : '/herramientas-ia/noticias';
}
export function promptsPath(slug = '') {
  return slug ? `/herramientas-ia/prompts/${slug}` : '/herramientas-ia/prompts';
}
export function weekPath(slug = '') {
  return slug ? `/herramientas-ia/semana/${slug}` : '/herramientas-ia/semana';
}
export function comparePath(slug = '') {
  return slug ? `/herramientas-ia/comparar/${slug}` : '/herramientas-ia/comparar';
}
export function alternativesPath(slug = '') {
  return slug ? `/herramientas-ia/alternativas/${slug}` : '/herramientas-ia/alternativas';
}
export function casePath(slug = '') {
  return slug ? `/herramientas-ia/casos/${slug}` : '/herramientas-ia/casos';
}
export function trendPath(slug = '') {
  return slug ? `/herramientas-ia/tendencias/${slug}` : '/herramientas-ia/tendencias';
}

export interface GuideSection {
  href: string;
  label: string;
  text: string;
  count: number;
}

export async function guideSections(): Promise<GuideSection[]> {
  const [para, news, prompts, weeks, comparisons, alternatives, cases, trends] = await Promise.all([
    publishedPara(),
    publishedNews(),
    publishedPrompts(),
    publishedWeeks(),
    publishedComparisons(),
    publishedAlternatives(),
    publishedCases(),
    publishedTrends(),
  ]);
  return [
    { href: paraPath(), label: 'IA para una tarea', text: 'Problema, herramientas del directorio, pasos, prompts y preguntas. Talleres y detailing van primero.', count: para.length },
    { href: newsPath(), label: 'Noticias', text: 'Qué pasó, qué significa para el negocio y el enlace a la fuente.', count: news.length },
    { href: promptsPath(), label: 'Prompts por rol', text: 'Ventas, atención, contenido y finanzas, con botón para copiar.', count: prompts.length },
    { href: weekPath(), label: 'Herramienta de la semana', text: 'Cinco pasos y un espacio de patrocinio.', count: weeks.length },
    { href: comparePath(), label: 'Comparar', text: 'X frente a Y, con la fecha en que se revisó la fuente.', count: comparisons.length },
    { href: alternativesPath(), label: 'Alternativas', text: 'Otras fichas del directorio cuando una herramienta no encaja.', count: alternatives.length },
    { href: casePath(), label: 'Casos', text: 'Un uso real, contado con la fuente al lado.', count: cases.length },
    { href: trendPath(), label: 'Tendencias del mes', text: 'Temas del mes a partir de las fuentes, sin conteos inventados.', count: trends.length },
  ];
}

export interface ToolMention {
  href: string;
  title: string;
  kind: string;
}

export async function piecesForTool(slug: string): Promise<ToolMention[]> {
  const [paras, news, weeks, comparisons, alternatives, cases, trends] = await Promise.all([
    publishedPara(),
    publishedNews(),
    publishedWeeks(),
    publishedComparisons(),
    publishedAlternatives(),
    publishedCases(),
    publishedTrends(),
  ]);
  const mentions: ToolMention[] = [];
  for (const entry of paras) {
    if (entry.data.tools.includes(slug)) mentions.push({ href: paraPath(entry.id), title: entry.data.title, kind: 'Guía' });
  }
  for (const entry of news) {
    if (entry.data.tools.includes(slug)) mentions.push({ href: newsPath(entry.id), title: entry.data.title, kind: 'Noticia' });
  }
  for (const entry of weeks) {
    if (entry.data.tool === slug || entry.data.alternatives.includes(slug)) {
      mentions.push({ href: weekPath(entry.id), title: entry.data.title, kind: 'Semana' });
    }
  }
  for (const entry of comparisons) {
    if (entry.data.left === slug || entry.data.right === slug) {
      mentions.push({ href: comparePath(entry.id), title: entry.data.title, kind: 'Comparar' });
    }
  }
  for (const entry of alternatives) {
    if (entry.data.insteadOf === slug || entry.data.alternatives.includes(slug)) {
      mentions.push({ href: alternativesPath(entry.id), title: entry.data.title, kind: 'Alternativa' });
    }
  }
  for (const entry of cases) {
    if (entry.data.tools.includes(slug)) mentions.push({ href: casePath(entry.id), title: entry.data.title, kind: 'Caso' });
  }
  for (const entry of trends) {
    if (entry.data.tools.includes(slug)) mentions.push({ href: trendPath(entry.id), title: entry.data.title, kind: 'Tendencia' });
  }
  return mentions;
}

export async function newsForPara(slug: string) {
  const news = await publishedNews();
  return news.filter((entry) => entry.data.para.includes(slug));
}

export function requireRelated<T extends { id: string }>(ids: string[], entries: T[], from: string): T[] {
  return ids.map((id) => {
    const found = entries.find((entry) => entry.id === id);
    if (!found) throw new Error(`Enlace interno roto: ${from} → ${id}`);
    return found;
  });
}

export function articleNode(input: {
  url: string;
  title: string;
  description: string;
  published: string;
  updated?: string;
  section: string;
  citation?: string;
}) {
  return {
    '@type': 'Article',
    '@id': `${input.url}#article`,
    headline: input.title,
    description: input.description,
    inLanguage: 'es',
    datePublished: input.published,
    dateModified: input.updated || input.published,
    articleSection: input.section,
    mainEntityOfPage: input.url,
    ...(input.citation ? { citation: input.citation } : {}),
    author: personRef(),
    publisher: personRef(),
    isPartOf: { '@type': 'WebSite', name: 'Omar Álvarez', url: SITE },
  };
}

export function faqNode(url: string, faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: 'es',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

export function softwareNodes(tools: Tool[]) {
  return tools.map((tool) => ({
    '@type': 'SoftwareApplication',
    '@id': `${SITE}/herramientas-ia/${tool.slug}#software`,
    name: tool.nombre,
    description: tool.desc,
    url: tool.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    sameAs: `${SITE}/herramientas-ia/${tool.slug}`,
  }));
}

export function breadcrumb(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function collectionNode(input: { url: string; name: string; description: string; items: { name: string; url: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': input.url,
        name: input.name,
        description: input.description,
        inLanguage: 'es',
        url: input.url,
        isPartOf: { '@type': 'WebSite', name: 'Omar Álvarez', url: SITE },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: input.items.length,
          itemListElement: input.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: item.url,
          })),
        },
      },
      breadcrumb([
        { name: 'Inicio', url: SITE },
        { name: 'Herramientas de IA', url: `${SITE}/herramientas-ia` },
        { name: input.name, url: input.url },
      ]),
    ],
  };
}

export type ParaEntry = CollectionEntry<'para'>;
export type NewsEntry = CollectionEntry<'noticias'>;
export type PromptEntry = CollectionEntry<'prompts'>;
export type WeekEntry = CollectionEntry<'semana'>;
export type CompareEntry = CollectionEntry<'comparar'>;
export type AlternativeEntry = CollectionEntry<'alternativas'>;
export type CaseEntry = CollectionEntry<'casos'>;
export type TrendEntry = CollectionEntry<'tendencias'>;
