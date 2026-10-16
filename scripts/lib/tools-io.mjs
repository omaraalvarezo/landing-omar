import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const TOOLS_PATH = path.join(root, 'src/data/tools.json');
export const CATEGORIES_PATH = path.join(root, 'src/data/tool-categories.json');
export const RESERVED_SLUGS = new Set([
  'destacar',
  'categoria',
  'pedido',
  'api',
  'para',
  'noticias',
  'prompts',
  'semana',
  'comparar',
  'alternativas',
  'casos',
  'tendencias',
  'guias',
  'prompts-gratis',
  'kit',
  'recursos',
]);

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function todayBogota() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function loadCategories() {
  const categories = JSON.parse(readFileSync(CATEGORIES_PATH, 'utf8'));
  if (!Array.isArray(categories)) throw new Error('tool-categories.json no es una lista');
  return categories;
}

export function loadTools() {
  const tools = JSON.parse(readFileSync(TOOLS_PATH, 'utf8'));
  if (!Array.isArray(tools)) throw new Error('tools.json no es una lista');
  return tools;
}

export function validateTools(tools, categories = loadCategories()) {
  const allowed = new Set(categories.map((category) => category.slug));
  const slugs = new Set();
  for (const tool of tools) {
    if (!tool || typeof tool !== 'object') throw new Error('herramienta inválida');
    if (!SLUG.test(tool.slug) || tool.slug.length > 60 || RESERVED_SLUGS.has(tool.slug)) {
      throw new Error(`slug inválido: ${tool.slug}`);
    }
    if (slugs.has(tool.slug)) throw new Error(`slug repetido: ${tool.slug}`);
    slugs.add(tool.slug);
    let url;
    try {
      url = new URL(tool.url);
    } catch {
      throw new Error(`URL inválida en ${tool.slug}`);
    }
    if (url.protocol !== 'https:') throw new Error(`la URL de ${tool.slug} tiene que ser https`);
    if (!allowed.has(tool.categoria)) throw new Error(`categoría desconocida en ${tool.slug}: ${tool.categoria}`);
    if (typeof tool.nombre !== 'string' || tool.nombre.trim().length < 2) throw new Error(`nombre corto en ${tool.slug}`);
    if (typeof tool.desc !== 'string' || tool.desc.trim().length < 10) throw new Error(`descripción corta en ${tool.slug}`);
    if (typeof tool.featured !== 'boolean' || typeof tool.sponsor !== 'boolean') {
      throw new Error(`featured/sponsor tienen que ser boolean en ${tool.slug}`);
    }
    for (const field of ['featuredUntil', 'sponsorUntil']) {
      if (tool[field] !== null && (typeof tool[field] !== 'string' || !DATE.test(tool[field]))) {
        throw new Error(`${field} inválido en ${tool.slug}`);
      }
    }
    if (!DATE.test(tool.added)) throw new Error(`added inválido en ${tool.slug}`);
  }
  return tools;
}

export function saveTools(tools) {
  validateTools(tools);
  writeFileSync(TOOLS_PATH, `${JSON.stringify(tools, null, 2)}\n`);
}

export function isIsoDate(value) {
  if (typeof value !== 'string' || !DATE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  return utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day;
}
