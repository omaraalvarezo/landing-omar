#!/usr/bin/env node
// Revisa las colecciones antes de publicar.
// Falla si una pieza pública está incompleta, cita una herramienta que no existe
// o apunta a una guía que no está en src/content.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { loadTools } from './lib/tools-io.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = path.join(root, 'src/content');
const collections = ['para', 'noticias', 'prompts', 'semana', 'comparar', 'alternativas', 'casos', 'tendencias'];
const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const dateRe = /^\d{4}-\d{2}-\d{2}$/;
const toolSlugs = new Set(loadTools().map((tool) => tool.slug));
const errors = [];
const drafts = [];

function asDate(value) {
  if (typeof value === 'string' && dateRe.test(value)) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  return '';
}

function rel(file) {
  return path.relative(root, file);
}

function checkTools(file, slugs) {
  for (const slug of slugs || []) {
    if (!toolSlugs.has(slug)) errors.push(`${rel(file)}: herramienta desconocida «${slug}»`);
  }
}

function checkParaRefs(file, slugs) {
  for (const slug of slugs || []) {
    if (!existsSync(path.join(contentRoot, 'para', `${slug}.md`))) {
      errors.push(`${rel(file)}: guía para/${slug} no existe`);
    }
  }
}

for (const collection of collections) {
  const dir = path.join(contentRoot, collection);
  if (!existsSync(dir)) {
    errors.push(`falta el directorio src/content/${collection}`);
    continue;
  }
  const files = readdirSync(dir).filter((name) => name.endsWith('.md'));
  for (const name of files) {
    const slug = name.slice(0, -3);
    const file = path.join(dir, name);
    if (!slugRe.test(slug)) errors.push(`${rel(file)}: slug inválido`);
    const raw = readFileSync(file, 'utf8');
    if (!raw.startsWith('---\n')) {
      errors.push(`${rel(file)}: sin frontmatter`);
      continue;
    }
    const end = raw.indexOf('\n---', 3);
    if (end === -1) {
      errors.push(`${rel(file)}: frontmatter sin cierre`);
      continue;
    }
    let data;
    try {
      data = parse(raw.slice(4, end));
    } catch (error) {
      errors.push(`${rel(file)}: YAML inválido (${error.message})`);
      continue;
    }
    const body = raw.slice(end + 4).trim();
    if (data?.draft === true) {
      drafts.push(rel(file));
      continue;
    }
    if (!data?.title || !data.description || !asDate(data.published)) {
      errors.push(`${rel(file)}: faltan title, description o published`);
    }
    if (String(data.description || '').length < 80) errors.push(`${rel(file)}: la respuesta inicial es corta`);
    if (`${data.description}\n${body}`.includes('COMPLETAR')) errors.push(`${rel(file)}: sigue en COMPLETAR`);
    if (body.length < 80) errors.push(`${rel(file)}: el cuerpo es corto`);
    checkTools(file, data.tools);
    for (const guide of data.guides || []) checkTools(file, [guide?.tool]);
    checkParaRefs(file, data.para);
    checkParaRefs(file, data.related);
    if (data.tool) checkTools(file, [data.tool]);
    if (data.left) checkTools(file, [data.left, data.right]);
    if (data.insteadOf) checkTools(file, [data.insteadOf, ...(data.alternatives || [])]);
    if (data.alternatives && data.tool) checkTools(file, data.alternatives);
    if (data.sourceUrl && !String(data.sourceUrl).startsWith('https://')) {
      errors.push(`${rel(file)}: la fuente no es https`);
    }
    for (const theme of data.themes || []) {
      if (theme?.sourceUrl && !String(theme.sourceUrl).startsWith('https://')) {
        errors.push(`${rel(file)}: un tema no tiene fuente https`);
      }
    }
  }
}

// Fichas ampliadas: una por herramienta, sin frontmatter editorial.
const fichasDir = path.join(contentRoot, 'fichas');
const withFicha = new Set();
const fichaWords = (data) =>
  [data.task, data.useCase?.title, ...(data.useCase?.steps || []), ...(data.limits || []), ...(data.beforePaying || []), ...(data.alternatives || []).map((item) => item?.when)]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
for (const name of existsSync(fichasDir) ? readdirSync(fichasDir).filter((item) => item.endsWith('.md')) : []) {
  const slug = name.slice(0, -3);
  const file = path.join(fichasDir, name);
  const raw = readFileSync(file, 'utf8');
  const end = raw.indexOf('\n---', 3);
  let data;
  try {
    data = parse(raw.slice(4, end));
  } catch (error) {
    errors.push(`${rel(file)}: YAML inválido (${error.message})`);
    continue;
  }
  if (!toolSlugs.has(slug)) errors.push(`${rel(file)}: no hay herramienta «${slug}» en tools.json`);
  withFicha.add(slug);
  const alternatives = (data.alternatives || []).map((item) => item?.tool);
  checkTools(file, alternatives);
  if (alternatives.includes(slug)) errors.push(`${rel(file)}: se cita a sí misma como alternativa`);
  for (const source of data.sources || []) {
    if (!String(source?.url).startsWith('https://')) errors.push(`${rel(file)}: una fuente no es https`);
  }
  const words = fichaWords(data);
  if (words < 280) errors.push(`${rel(file)}: la ficha tiene ${words} palabras; el mínimo es 280`);
}
const withoutFicha = [...toolSlugs].filter((slug) => !withFicha.has(slug));
if (withoutFicha.length) console.log(`Herramientas sin ficha ampliada:\n- ${withoutFicha.join('\n- ')}`);

if (drafts.length) console.log(`Borradores (no se publican):\n- ${drafts.join('\n- ')}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('content:check ok');
