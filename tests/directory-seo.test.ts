import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { categoryLabel, getCategories, getTools } from '../src/lib/directory';
import {
  CATEGORY_SEO,
  DIRECTORY_INDEX,
  HUBS,
  TASK_LINKS,
  categorySeo,
  clipMeta,
  pageTitle,
  sentences,
  toolMeta,
} from '../src/lib/directory-seo';

function frontmatter(text: string): Record<string, string> {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  const data: Record<string, string> = {};
  if (!match) return data;
  for (const line of match[1].split('\n')) {
    if (line.startsWith(' ') || line.startsWith('-')) continue;
    const index = line.indexOf(':');
    if (index < 0) continue;
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[line.slice(0, index).trim()] = value;
  }
  return data;
}

describe('SEO del directorio', () => {
  const pages = [
    { id: 'indice', ...DIRECTORY_INDEX },
    ...getCategories().map((category) => ({ id: category.slug, ...categorySeo(category.slug) })),
    ...Object.entries(HUBS).map(([id, seo]) => ({ id, ...seo })),
  ];

  it('títulos y párrafos de respuesta son únicos y caben', () => {
    const titles = pages.map((page) => page.title);
    const leads = pages.map((page) => page.lead);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(leads).size).toBe(leads.length);
    for (const page of pages) {
      expect(page.title.length, page.id).toBeGreaterThan(24);
      expect(page.title.length, `${page.id}: ${page.title}`).toBeLessThanOrEqual(60);
      expect(page.lead.length, page.id).toBeGreaterThanOrEqual(80);
      expect(page.lead.length, `${page.id}: ${page.lead}`).toBeLessThanOrEqual(320);
      const meta = clipMeta(page.lead);
      expect(meta.length, `${page.id}: ${meta}`).toBeGreaterThanOrEqual(70);
      expect(meta.length, `${page.id}: ${meta}`).toBeLessThanOrEqual(160);
      expect(page.lead.startsWith(meta.replace(/…$/, '')) || meta === page.lead, page.id).toBe(true);
    }
  });

  it('las preguntas frecuentes del índice y de cada categoría responden en una a tres frases', () => {
    const withFaqs = pages.filter((page) => page.faqs?.length);
    expect(withFaqs.map((page) => page.id).sort()).toEqual(['indice', ...getCategories().map((category) => category.slug)].sort());
    for (const page of withFaqs) {
      const faqs = page.faqs ?? [];
      expect(faqs.length).toBeGreaterThanOrEqual(3);
      expect(faqs.length).toBeLessThanOrEqual(6);
      expect(new Set(faqs.map((faq) => faq.q)).size).toBe(faqs.length);
      for (const faq of faqs) {
        expect(faq.q.endsWith('?'), faq.q).toBe(true);
        expect(faq.q.length).toBeGreaterThanOrEqual(12);
        const count = sentences(faq.a).length;
        expect(count, faq.a).toBeGreaterThanOrEqual(1);
        expect(count, faq.a).toBeLessThanOrEqual(3);
        expect(faq.a.length).toBeGreaterThanOrEqual(40);
        expect(faq.a).not.toMatch(/%|por ciento/i);
      }
    }
  });

  it('las categorías relacionadas existen y no apuntan a sí mismas', () => {
    const slugs = new Set(getCategories().map((category) => category.slug));
    expect(Object.keys(CATEGORY_SEO).sort()).toEqual([...slugs].sort());
    for (const category of getCategories()) {
      const seo = categorySeo(category.slug);
      expect(seo.related.length).toBeGreaterThanOrEqual(2);
      for (const related of seo.related) {
        expect(related).not.toBe(category.slug);
        expect(slugs.has(related)).toBe(true);
      }
    }
  });

  it('los enlaces para elegir apuntan a páginas que existen', () => {
    const hrefs = TASK_LINKS.map((link) => link.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const link of TASK_LINKS) {
      expect(link.note.length).toBeGreaterThan(40);
      if (link.href.startsWith('/herramientas-ia/categoria/')) {
        expect(slugsOfCategories()).toContain(link.href.replace('/herramientas-ia/categoria/', ''));
        continue;
      }
      if (link.href.startsWith('/herramientas-ia/para/')) {
        const slug = link.href.replace('/herramientas-ia/para/', '');
        expect(readFileSync(join('src/content/para', `${slug}.md`), 'utf8').length).toBeGreaterThan(0);
        continue;
      }
      const page = link.href.replace('/herramientas-ia', 'src/pages/herramientas-ia');
      expect(readFileSync(`${page}/index.astro`, 'utf8').length).toBeGreaterThan(0);
    }
  });

  it('la meta de una ficha no se alarga con un sufijo y el título de sección se recorta', () => {
    expect(clipMeta('Frase corta y completa.')).toBe('Frase corta y completa.');
    expect(clipMeta(`${'ChatGPT y Respond.io sirven para la misma tarea de una pyme. '.repeat(4)}Sobra.`)).toContain('Respond.io');
    expect(clipMeta('El modelo es el Haiku 5.5. En prompts cortos baja el precio de la API y deja la ficha para el día en que Anthropic lo publicó, con la fuente al lado y sin convertir esa tarifa en una promesa.')).toContain('5.5');
    const long = `${'Una frase larga. '.repeat(20)}Segunda idea que ya no cabe en el resultado de búsqueda porque sigue y sigue.`;
    expect(clipMeta(long).length).toBeLessThanOrEqual(160);
    expect(pageTitle('Título corto', ' — guía para pymes')).toBe('Título corto — guía para pymes');
    expect(pageTitle('La búsqueda de Google sube los enlaces dentro de la respuesta', ' — noticias IA para pymes')).toBe(
      'La búsqueda de Google sube los enlaces dentro de la respuesta',
    );

    const metas = getTools().map((tool) => toolMeta(tool.desc, categoryLabel(tool.categoria)));
    expect(new Set(metas).size).toBe(metas.length);
    for (const [index, meta] of metas.entries()) {
      expect(meta.length, getTools()[index]?.slug).toBeGreaterThanOrEqual(70);
      expect(meta.length).toBeLessThanOrEqual(160);
    }
  });

  it('las metas de las guías quedan en 160 caracteres sin cortar la primera frase útil', () => {
    const columns = ['para', 'noticias', 'prompts', 'semana', 'comparar', 'alternativas', 'casos', 'tendencias'];
    for (const column of columns) {
      for (const file of readdirSync(join('src/content', column)).filter((name) => name.endsWith('.md'))) {
        const data = frontmatter(readFileSync(join('src/content', column, file), 'utf8'));
        const meta = clipMeta(data.description);
        expect(meta.length, file).toBeLessThanOrEqual(160);
        expect(meta.length, file).toBeGreaterThanOrEqual(70);
        expect(meta.endsWith('…'), `${file}: ${meta}`).toBe(false);
        expect(data.description.length, file).toBeGreaterThanOrEqual(80);
        expect(data.description.length, file).toBeLessThanOrEqual(320);
      }
    }
  });
});

function slugsOfCategories(): string[] {
  return getCategories().map((category) => category.slug);
}
