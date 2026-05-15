#!/usr/bin/env node
// Script interactivo para subir un recurso a la landing.
// Uso: npm run resource:add

import readline from 'node:readline/promises';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import {
  PATHS,
  VALID_TIPOS,
  loadAreas,
  loadResources,
  saveResources,
  copyResourceFile,
  slugify,
  today,
  fileExists,
  formatBytes,
} from './lib/resources-io.mjs';

const rl = readline.createInterface({ input, output });

async function ask(prompt, fallback) {
  const hint = fallback ? ` (${fallback})` : '';
  const ans = (await rl.question(`${prompt}${hint}: `)).trim();
  return ans === '' ? fallback ?? '' : ans;
}

async function askYesNo(prompt, def = false) {
  const hint = def ? '[Y/n]' : '[y/N]';
  const ans = (await rl.question(`${prompt} ${hint}: `)).trim().toLowerCase();
  if (ans === '') return def;
  return ans.startsWith('y') || ans === 's' || ans === 'si';
}

async function askChoice(prompt, choices) {
  console.log(prompt);
  choices.forEach((c, i) => console.log(`  ${i + 1}) ${c}`));
  while (true) {
    const ans = (await rl.question('> ')).trim();
    const idx = Number.parseInt(ans, 10);
    if (Number.isInteger(idx) && idx >= 1 && idx <= choices.length) {
      return choices[idx - 1];
    }
    console.log(`Elige un número entre 1 y ${choices.length}.`);
  }
}

// Lee varias líneas hasta una línea vacía. Devuelve string (joined con \n\n entre párrafos
// separados por línea vacía adentro). Para `longDescription`.
async function askMultiline(prompt) {
  console.log(prompt);
  console.log('  (escribe varias líneas; línea vacía dos veces para terminar)');
  const lines = [];
  let emptyCount = 0;
  while (true) {
    const ans = await rl.question('  ');
    if (ans.trim() === '') {
      emptyCount += 1;
      if (emptyCount >= 2 || lines.length === 0) break;
      lines.push('');
    } else {
      emptyCount = 0;
      lines.push(ans);
    }
  }
  // Compacta saltos consecutivos → "\n\n" entre párrafos
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Lee bullets (uno por línea). Devuelve array. Línea vacía termina.
async function askBullets(prompt) {
  console.log(prompt);
  console.log('  (uno por línea; línea vacía para terminar — déjalo vacío si no aplica)');
  const items = [];
  while (true) {
    const ans = (await rl.question(`  ${items.length + 1}) `)).trim();
    if (ans === '') break;
    items.push(ans);
  }
  return items;
}

async function main() {
  console.log('\n— Subir recurso a la landing —\n');

  const filePathRaw = await ask('Ruta al archivo .md a subir');
  const filePath = filePathRaw.replace(/^~(?=\/)/, process.env.HOME ?? '');
  if (!(await fileExists(filePath))) {
    console.error(`✗ No encontré el archivo en: ${filePath}`);
    rl.close();
    process.exit(1);
  }

  const baseName = path.basename(filePath, path.extname(filePath));
  const slugSugerido = slugify(baseName);
  const slug = slugify(await ask('Slug (URL-safe)', slugSugerido));

  const resources = await loadResources();
  if (resources.some((r) => r.slug === slug)) {
    console.error(`✗ Ya existe un recurso con slug "${slug}". Elegí otro.`);
    rl.close();
    process.exit(1);
  }

  const areas = await loadAreas();
  const areaSlugs = areas.map((a) => a.slug);
  const area = await askChoice('\n¿En qué área?', areaSlugs);

  const tipo = await askChoice('\n¿Qué tipo de recurso?', VALID_TIPOS);
  const title = await ask('\nTítulo visible');
  const description = await ask('Descripción corta (1-2 líneas, para la card de la grilla)');

  console.log('\n— Copy de la página de detalle —');
  console.log('  REGLA: todo en primera persona ("esto es lo que YO uso", "así lo hago"),');
  console.log('  no en tono manual. Cierra con un guiño de adaptabilidad.');

  const longDescription = await askMultiline(
    '\nlongDescription — ¿Qué es? (1-2 párrafos en primera persona, qué hago YO con esto)'
  );
  const usefulFor = await askBullets(
    '\nusefulFor — Para qué te sirve (bullets con voz propia)'
  );
  const includes = await askBullets(
    '\nincludes — Qué contiene el archivo (bullets descriptivos)'
  );
  const howToAdapt = await askBullets(
    '\nhowToAdapt — Cómo adaptarlo a tu negocio (bullets concretos: qué tiene que cambiar el visitante para que sirva en su vertical. Usa formato "cambia X por tu Y")'
  );

  let skillName;
  let skillTrigger;
  if (area === 'skills-claude') {
    skillName = await ask('\nNombre del skill (slug que va a ~/.claude/skills/{name}/)', slug);
    skillTrigger = await ask('Trigger corto (cuándo se activa)');
  }

  const featured = await askYesNo('\n¿Featured? (aparece primero en la grilla)', false);
  const hidden = await askYesNo('¿Subir oculto? (no visible en el sitio hasta show)', false);

  // Copiar archivo y calcular tamaño
  const { fileName, sizeBytes } = await copyResourceFile(filePath, slug);

  const entry = {
    slug,
    title,
    description,
    area,
    tipo,
    fileName,
    sizeBytes,
    updatedAt: today(),
    featured,
    hidden,
  };
  if (longDescription) entry.longDescription = longDescription;
  if (usefulFor.length) entry.usefulFor = usefulFor;
  if (includes.length) entry.includes = includes;
  if (howToAdapt.length) entry.howToAdapt = howToAdapt;
  if (skillName) entry.skillName = skillName;
  if (skillTrigger) entry.skillTrigger = skillTrigger;

  resources.push(entry);
  await saveResources(resources);

  console.log('\n✓ Recurso añadido.');
  console.log(`  Archivo: public/resources/${fileName} (${formatBytes(sizeBytes)})`);
  console.log(`  Entry  : src/data/resources.json`);
  console.log('\nSiguientes pasos:');
  console.log('  npm run dev                                    # ver localmente');
  console.log('  git add public/resources src/data/resources.json && \\');
  console.log(`    git commit -m "feat(recursos): añadir ${slug}" && git push   # deployar`);

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
