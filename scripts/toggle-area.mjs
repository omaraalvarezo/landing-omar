#!/usr/bin/env node
// Toggle / hide / show de un área por slug.
// Uso:
//   npm run area:toggle <slug>       → alterna hidden
//   npm run area:toggle <slug> --state hide|show

import { loadAreas, saveAreas, parseArgs } from './lib/resources-io.mjs';

const { positional, flags } = parseArgs(process.argv.slice(2));
const slug = positional[0];

if (!slug) {
  console.error('✗ Falta el slug. Uso: npm run area:toggle <slug>');
  process.exit(1);
}

const areas = await loadAreas();
const idx = areas.findIndex((a) => a.slug === slug);
if (idx === -1) {
  console.error(`✗ No encontré ningún área con slug "${slug}".`);
  console.error('  Tip: npm run area:list');
  process.exit(1);
}

const a = areas[idx];
const prev = a.hidden;

let next;
if (flags.state === 'hide') next = true;
else if (flags.state === 'show') next = false;
else next = !prev;

if (next === prev) {
  console.log(`= ${slug} ya estaba en hidden:${prev}. Sin cambios.`);
  process.exit(0);
}

a.hidden = next;
areas[idx] = a;
await saveAreas(areas);

console.log(`✓ Área "${a.label}" (${slug}): hidden ${prev} → ${next}`);
if (next) {
  console.log('  La card-carpeta desaparece del hub y /recursos/' + slug + ' devuelve 404.');
} else {
  console.log('  La card-carpeta aparece en el hub y /recursos/' + slug + ' se genera en el build.');
}
console.log(`  git add src/data/areas.json && git commit -m "chore(recursos): ${next ? 'apagar' : 'encender'} área ${slug}" && git push`);
