#!/usr/bin/env node
// Agrega una herramienta al directorio.
//
// Interactivo:
//   npm run tool:add
//
// Para un agente:
//   npm run tool:add -- --nombre "Acme" --url "https://acme.com" --categoria asistentes --desc "Qué hace en una frase clara."
//   npm run tool:add -- --nombre "Acme" --url "https://acme.com" --categoria asistentes --desc "..." --featured --until 2026-11-16
//   npm run tool:add -- --nombre "Acme" --url "https://acme.com" --categoria asistentes --desc "..." --featured --sponsor --until 2026-11-16

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { parseArgs } from 'node:util';
import { isIsoDate, loadCategories, loadTools, saveTools, slugify, todayBogota } from './lib/tools-io.mjs';

const { values } = parseArgs({
  options: {
    nombre: { type: 'string' },
    url: { type: 'string' },
    categoria: { type: 'string' },
    desc: { type: 'string' },
    featured: { type: 'boolean', default: false },
    sponsor: { type: 'boolean', default: false },
    until: { type: 'string' },
  },
  strict: true,
});

const categories = loadCategories();

function usage() {
  console.log('Uso: npm run tool:add -- --nombre "..." --url https://... --categoria slug --desc "..." [--featured] [--sponsor] [--until YYYY-MM-DD]');
  console.log('Categorías:');
  for (const category of categories) console.log(`  ${category.slug}  ${category.label}`);
}

async function ask(rl, prompt, fallback = '') {
  const hint = fallback ? ` (${fallback})` : '';
  const answer = (await rl.question(`${prompt}${hint}: `)).trim();
  return answer || fallback;
}

async function fromPrompt() {
  const rl = readline.createInterface({ input, output });
  try {
    console.log('Nueva herramienta. Enter vacío cancela un campo obligatorio.\n');
    categories.forEach((category, index) => console.log(`  ${index + 1}) ${category.label} [${category.slug}]`));
    const nombre = await ask(rl, 'Nombre');
    const url = await ask(rl, 'URL https');
    const choice = await ask(rl, 'Categoría (número o slug)');
    const index = Number.parseInt(choice, 10);
    const categoria = Number.isInteger(index) && categories[index - 1] ? categories[index - 1].slug : choice;
    const desc = await ask(rl, 'Descripción');
    const featuredAnswer = (await ask(rl, '¿Destacada? [s/N]')).toLowerCase();
    const featured = featuredAnswer === 's' || featuredAnswer === 'si' || featuredAnswer === 'y';
    const sponsorAnswer = (await ask(rl, '¿Portada / patrocinio? [s/N]')).toLowerCase();
    const sponsor = sponsorAnswer === 's' || sponsorAnswer === 'si' || sponsorAnswer === 'y';
    const until = featured || sponsor ? await ask(rl, 'Vigente hasta YYYY-MM-DD') : '';
    return { nombre, url, categoria, desc, featured, sponsor, until };
  } finally {
    rl.close();
  }
}

const provided = values.nombre || values.url || values.categoria || values.desc;
let entry = values;
if (!provided) {
  if (!input.isTTY) {
    usage();
    process.exit(1);
  }
  entry = await fromPrompt();
}

const nombre = String(entry.nombre || '').trim();
const url = String(entry.url || '').trim();
const categoria = String(entry.categoria || '').trim();
const desc = String(entry.desc || '').replace(/\s+/g, ' ').trim();
const featured = Boolean(entry.featured);
const sponsor = Boolean(entry.sponsor);
const until = entry.until ? String(entry.until).trim() : '';

if (!nombre || !url || !categoria || !desc) {
  usage();
  process.exit(1);
}
if ((featured || sponsor) && !isIsoDate(until)) {
  console.error('Si marcas destacado o patrocinio, pasa --until YYYY-MM-DD.');
  process.exit(1);
}
if (until && !isIsoDate(until)) {
  console.error('--until tiene que ser una fecha real YYYY-MM-DD.');
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(url);
} catch {
  console.error('URL inválida.');
  process.exit(1);
}
if (parsed.protocol !== 'https:') {
  console.error('La URL tiene que empezar por https://');
  process.exit(1);
}
if (!categories.some((category) => category.slug === categoria)) {
  console.error(`Categoría desconocida: ${categoria}`);
  usage();
  process.exit(1);
}
if (desc.length < 10 || desc.length > 500) {
  console.error('La descripción tiene que quedar entre 10 y 500 caracteres.');
  process.exit(1);
}

const tools = loadTools();
let slug = slugify(nombre);
if (!slug) {
  console.error('El nombre no produce un slug usable.');
  process.exit(1);
}
if (tools.some((tool) => tool.slug === slug)) {
  console.error(`Ya existe el slug ${slug}. Cambia el nombre o edita la ficha con tool:feature.`);
  process.exit(1);
}

const tool = {
  slug,
  nombre,
  url,
  categoria,
  desc,
  featured: featured || sponsor,
  featuredUntil: featured || sponsor ? until : null,
  sponsor,
  sponsorUntil: sponsor ? until : null,
  added: todayBogota(),
};

tools.push(tool);
saveTools(tools);
console.log(`Lista: ${tool.slug} · ${tool.categoria} · destacado=${tool.featured} · portada=${tool.sponsor}`);
