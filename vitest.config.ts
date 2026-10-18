import { getViteConfig } from 'astro/config';
import type { InlineConfig } from 'vitest/node';

// Astro trae su propia Vite (8.x) y vitest la de la raíz (6.x): los tipos de `test`
// no se mezclan, así que se tipa aparte y se entrega a Astro como config de Vite.
const test: InlineConfig = {
  include: ['tests/**/*.test.ts'],
  environment: 'node',
};

export default getViteConfig({ test } as Parameters<typeof getViteConfig>[0]);
