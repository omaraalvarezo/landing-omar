#!/usr/bin/env node
// Lista el directorio para un agente operador.
//   npm run tool:list

import { loadCategories, loadTools } from './lib/tools-io.mjs';

const labels = new Map(loadCategories().map((category) => [category.slug, category.label]));
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Bogota',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

function live(flag, until) {
  if (!flag) return 'no';
  if (!until) return 'sí';
  return until >= today ? `sí hasta ${until}` : `vencido ${until}`;
}

for (const tool of loadTools()) {
  console.log(
    [
      tool.slug.padEnd(22),
      (labels.get(tool.categoria) || tool.categoria).padEnd(22),
      `destacado ${live(tool.featured, tool.featuredUntil)}`.padEnd(28),
      `portada ${live(tool.sponsor, tool.sponsorUntil)}`,
    ].join('  '),
  );
}
