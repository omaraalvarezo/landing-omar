// Integración de build: después de que `@astrojs/vercel` escribe `.vercel/output/config.json`
// (Astro pone el adaptador primero en la lista de integraciones), las rutas de los links cortos
// aceptan también la barra final. Solo la importa `astro.config.mjs`: usa `node:fs`.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { allowShortLinkTrailingSlash } from './short-links-core.mjs';

/**
 * @param {readonly { slug: string }[]} links
 * @returns {import('astro').AstroIntegration}
 */
export function shortLinksTrailingSlash(links) {
  /** @type {URL | undefined} */
  let root;
  return {
    name: 'short-links-trailing-slash',
    hooks: {
      'astro:config:done': ({ config }) => {
        root = config.root;
      },
      'astro:build:done': ({ logger }) => {
        if (!root) throw new Error('SHORT_LINKS_SIN_ROOT');
        const file = fileURLToPath(new URL('.vercel/output/config.json', root));
        if (!existsSync(file)) throw new Error(`SHORT_LINKS_SIN_CONFIG_VERCEL:${file}`);
        const config = JSON.parse(readFileSync(file, 'utf8'));
        const { routes, missing } = allowShortLinkTrailingSlash(config.routes ?? [], links);
        if (missing.length) throw new Error(`SHORT_LINKS_SIN_RUTA:${missing.join(',')}`);
        writeFileSync(file, `${JSON.stringify({ ...config, routes }, null, '\t')}\n`);
        logger.info(`barra final aceptada en ${links.length} links cortos`);
      },
    },
  };
}
