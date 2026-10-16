#!/usr/bin/env node
// Crea un borrador de contenido editorial.
//
//   npm run content:new -- --type para --title "IA para cobrar"
//   npm run content:new:noticias -- --title "Nota de la semana" --slug nota-semana
//
// El archivo sale con draft: true. No se publica hasta quitar el borrador,
// completar el texto y pasar npm run content:check.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { slugify, todayBogota } from './lib/tools-io.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const today = todayBogota();
const month = today.slice(0, 7);
const draftLead =
  'COMPLETAR: borrador. Sustituye este párrafo por la respuesta directa, quita draft y pasa npm run content:check antes de publicar.';

const TYPES = ['para', 'noticias', 'prompts', 'semana', 'comparar', 'alternativas', 'casos', 'tendencias'];

const { values } = parseArgs({
  options: {
    type: { type: 'string' },
    title: { type: 'string' },
    slug: { type: 'string' },
    tools: { type: 'string' },
  },
  strict: true,
});

function usage() {
  console.log('Uso: npm run content:new -- --type para|noticias|prompts|semana|comparar|alternativas|casos|tendencias --title "..." [--slug ...] [--tools a,b,c]');
}

function toolsFrom(flag, fallback) {
  const list = String(flag || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length ? list : fallback;
}

function stub(type, title, tools) {
  const base = { title, description: draftLead, published: today, draft: true };
  if (type === 'para') {
    return {
      ...base,
      tools: toolsFrom(tools, ['chatgpt', 'claude', 'gemini']),
      steps: [
        'COMPLETAR el primer paso con una acción que el operador pueda hacer esta semana.',
        'COMPLETAR el segundo paso sin inventar una métrica ni un precio.',
        'COMPLETAR el tercer paso y deja claro qué decide una persona.',
      ],
      prompt: 'COMPLETAR el prompt. Pide datos entre comillas y prohíbe inventar cifras.',
      faqs: [
        { q: 'COMPLETAR la primera pregunta frecuente', a: 'COMPLETAR la respuesta con un dato verificable o sin cifra si no hay fuente.' },
        { q: 'COMPLETAR la segunda pregunta frecuente', a: 'COMPLETAR la respuesta y enlaza la ficha del directorio que corresponda.' },
      ],
      related: [],
    };
  }
  if (type === 'noticias') {
    return {
      ...base,
      edition: today,
      sourceDate: today,
      sourceName: 'COMPLETAR',
      sourceUrl: 'https://example.com/',
      meaning: 'COMPLETAR qué cambia en la operación de una pyme. Sin cifra que no esté en la fuente.',
      tools: toolsFrom(tools, ['chatgpt']),
      para: [],
    };
  }
  if (type === 'prompts') {
    const role = (id, label) => ({
      id,
      label,
      prompts: [{ title: 'COMPLETAR', text: 'COMPLETAR el prompt de este rol. No inventes una tasa de respuesta ni un precio.' }],
    });
    return {
      ...base,
      roles: [role('ventas', 'Ventas'), role('atencion', 'Atención'), role('contenido', 'Contenido'), role('finanzas', 'Finanzas')],
    };
  }
  if (type === 'semana') {
    return {
      ...base,
      tool: toolsFrom(tools, ['chatgpt'])[0],
      steps: [1, 2, 3, 4, 5].map((n) => `COMPLETAR el paso ${n} con una acción concreta sobre la herramienta.`),
      verdict: 'COMPLETAR el veredicto: para qué sí sirve esta semana y qué no resuelve.',
      alternatives: ['claude'],
      sponsorName: '',
      sponsorUrl: '',
      sponsorNote: '',
    };
  }
  if (type === 'comparar') {
    const [left, right] = toolsFrom(tools, ['chatgpt', 'claude']);
    return {
      ...base,
      checked: today,
      left,
      right: right || 'claude',
      rows: [
        { label: 'Qué es', left: 'COMPLETAR con la ficha del directorio.', right: 'COMPLETAR con la ficha del directorio.' },
        { label: 'Precio publicado', left: 'COMPLETAR solo si la fuente oficial lo dice, con fecha.', right: 'COMPLETAR solo si la fuente oficial lo dice, con fecha.' },
        { label: 'Cuándo usarla', left: 'COMPLETAR el caso de uso sin un ranking inventado.', right: 'COMPLETAR el caso de uso sin un ranking inventado.' },
      ],
      recommendation: 'COMPLETAR la recomendación por caso. No declares un ganador global.',
    };
  }
  if (type === 'alternativas') {
    const [insteadOf, ...rest] = toolsFrom(tools, ['chatgpt', 'claude', 'gemini']);
    return {
      ...base,
      checked: today,
      insteadOf,
      alternatives: rest.length >= 2 ? rest : ['claude', 'gemini'],
    };
  }
  if (type === 'casos') {
    return {
      ...base,
      sourceDate: today,
      sourceName: 'COMPLETAR',
      sourceUrl: 'https://example.com/',
      tools: toolsFrom(tools, ['chatgpt']),
      para: [],
      resultNote: 'COMPLETAR qué cifra o resultado está en la fuente y deja escrito que este sitio no lo auditó.',
    };
  }
  return {
    ...base,
    month,
    tools: toolsFrom(tools, ['chatgpt']),
    para: [],
    themes: [1, 2, 3].map((n) => ({
      title: `COMPLETAR tema ${n}`,
      detail: 'COMPLETAR el tema con lo que dice la fuente. No cuentes menciones que no mediste.',
      sourceName: 'COMPLETAR',
      sourceUrl: 'https://example.com/',
    })),
  };
}

async function ask(rl, prompt) {
  return (await rl.question(`${prompt}: `)).trim();
}

let type = values.type?.trim();
let title = values.title?.trim();
let slug = values.slug?.trim();
const tools = values.tools;

if (!type && !title && !slug && !tools) {
  if (!input.isTTY) {
    usage();
    process.exit(1);
  }
  const rl = readline.createInterface({ input, output });
  try {
    console.log(`Tipos: ${TYPES.join(', ')}`);
    type = await ask(rl, 'Tipo');
    title = await ask(rl, 'Título');
    slug = await ask(rl, 'Slug (vacío = desde el título)');
  } finally {
    rl.close();
  }
}

if (!TYPES.includes(type || '')) {
  usage();
  console.error(`Tipo inválido: ${type || '(vacío)'}`);
  process.exit(1);
}
if (!title || title.length < 8) {
  console.error('El título es obligatorio y necesita al menos 8 caracteres.');
  process.exit(1);
}

slug = slugify(slug || title);
if (!slug || slug.length > 60) {
  console.error('Slug inválido.');
  process.exit(1);
}

const dir = path.join(root, 'src/content', type);
const file = path.join(dir, `${slug}.md`);
if (existsSync(file)) {
  console.error(`Ya existe ${path.relative(root, file)}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });
const yaml = stringify(stub(type, title, tools), { lineWidth: 0 }).trimEnd();
const body = 'COMPLETAR el cuerpo con palabras propias. Enlaza la fuente si hay una cifra. No copies el texto original.\n';
writeFileSync(file, `---\n${yaml}\n---\n\n${body}`);
console.log(`Borrador: ${path.relative(root, file)}`);
console.log('No se publica mientras draft sea true. Completa, quita draft y corre npm run content:check.');
