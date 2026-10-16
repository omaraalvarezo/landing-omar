#!/usr/bin/env node
// Prende o apaga el destacado de una herramienta que ya está en src/data/tools.json.
//
//   npm run tool:feature -- --slug chatgpt --until 2026-11-16
//   npm run tool:feature -- --slug chatgpt --until 2026-11-16 --sponsor
//   npm run tool:feature -- --slug chatgpt --clear

import { parseArgs } from 'node:util';
import { isIsoDate, loadTools, saveTools } from './lib/tools-io.mjs';

const { values } = parseArgs({
  options: {
    slug: { type: 'string' },
    until: { type: 'string' },
    sponsor: { type: 'boolean', default: false },
    clear: { type: 'boolean', default: false },
  },
  strict: true,
});

if (!values.slug) {
  console.error('Uso: npm run tool:feature -- --slug SLUG --until YYYY-MM-DD [--sponsor]');
  console.error('      npm run tool:feature -- --slug SLUG --clear');
  process.exit(1);
}
if (values.clear && (values.until || values.sponsor)) {
  console.error('--clear no se combina con --until ni --sponsor.');
  process.exit(1);
}
if (!values.clear && !isIsoDate(values.until || '')) {
  console.error('--until tiene que ser una fecha real YYYY-MM-DD.');
  process.exit(1);
}

const tools = loadTools();
const tool = tools.find((item) => item.slug === values.slug);
if (!tool) {
  console.error(`No está en el directorio: ${values.slug}`);
  process.exit(1);
}

if (values.clear) {
  tool.featured = false;
  tool.featuredUntil = null;
  tool.sponsor = false;
  tool.sponsorUntil = null;
} else {
  tool.featured = true;
  tool.featuredUntil = values.until;
  if (values.sponsor) {
    tool.sponsor = true;
    tool.sponsorUntil = values.until;
  }
}

saveTools(tools);
console.log(
  `${tool.slug}: destacado=${tool.featured} hasta ${tool.featuredUntil || '—'} · portada=${tool.sponsor} hasta ${tool.sponsorUntil || '—'}`,
);
