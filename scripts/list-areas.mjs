#!/usr/bin/env node
// Lista todas las áreas con conteo de recursos.
// Uso: npm run area:list

import { loadAreas, loadResources } from './lib/resources-io.mjs';

const areas = await loadAreas();
const resources = await loadResources();

const rows = areas
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((a) => {
    const all = resources.filter((r) => r.area === a.slug);
    const visibles = all.filter((r) => !r.hidden).length;
    return {
      orden: String(a.order).padStart(2, '0'),
      slug: a.slug,
      label: a.label,
      hidden: a.hidden ? '✓' : '',
      visibles,
      totales: all.length,
    };
  });

console.table(rows);

const totalAreas = areas.length;
const areasVisibles = areas.filter((a) => !a.hidden).length;
console.log(`\nÁreas: ${totalAreas} · Visibles: ${areasVisibles} · Apagadas: ${totalAreas - areasVisibles}`);
