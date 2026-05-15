#!/usr/bin/env node
// Toggle / hide / show de un recurso por slug.
// Uso:
//   npm run resource:toggle <slug>       → alterna hidden
//   npm run resource:hide <slug>         → fuerza hidden:true
//   npm run resource:show <slug>         → fuerza hidden:false

import { loadResources, saveResources, parseArgs } from './lib/resources-io.mjs';

const { positional, flags } = parseArgs(process.argv.slice(2));
const slug = positional[0];

if (!slug) {
  console.error('✗ Falta el slug. Uso: npm run resource:toggle <slug>');
  process.exit(1);
}

const resources = await loadResources();
const idx = resources.findIndex((r) => r.slug === slug);
if (idx === -1) {
  console.error(`✗ No encontré ningún recurso con slug "${slug}".`);
  console.error('  Tip: npm run resource:list');
  process.exit(1);
}

const r = resources[idx];
const prev = r.hidden;

let next;
if (flags.state === 'hide') next = true;
else if (flags.state === 'show') next = false;
else next = !prev;

if (next === prev) {
  console.log(`= ${slug} ya estaba en hidden:${prev}. Sin cambios.`);
  process.exit(0);
}

r.hidden = next;
resources[idx] = r;
await saveResources(resources);

console.log(`✓ ${slug}: hidden ${prev} → ${next}`);
console.log(`  git add src/data/resources.json && git commit -m "chore(recursos): ${next ? 'ocultar' : 'mostrar'} ${slug}" && git push`);
