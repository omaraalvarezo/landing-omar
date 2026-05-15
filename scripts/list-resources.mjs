#!/usr/bin/env node
// Lista todos los recursos en tabla.
// Uso: npm run resource:list

import { loadResources, formatBytes } from './lib/resources-io.mjs';

const resources = await loadResources();

if (resources.length === 0) {
  console.log('No hay recursos cargados.');
  process.exit(0);
}

const rows = resources
  .slice()
  .sort((a, b) => a.area.localeCompare(b.area) || a.slug.localeCompare(b.slug))
  .map((r) => ({
    slug: r.slug,
    área: r.area,
    tipo: r.tipo,
    hidden: r.hidden ? '✓' : '',
    featured: r.featured ? '★' : '',
    tamaño: formatBytes(r.sizeBytes),
    fecha: r.updatedAt,
  }));

console.table(rows);

const total = resources.length;
const visibles = resources.filter((r) => !r.hidden).length;
console.log(`\nTotal: ${total} · Visibles: ${visibles} · Ocultos: ${total - visibles}`);
