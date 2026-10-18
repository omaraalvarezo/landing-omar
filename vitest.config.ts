import { getViteConfig } from 'astro/config';
import type { InlineConfig } from 'vitest/node';

// Astro trae su propia Vite (8.x) y vitest la de la raíz (6.x): los tipos de `test`
// no se mezclan, así que se tipa aparte y se entrega a Astro como config de Vite.
const test: InlineConfig = {
  include: ['tests/**/*.test.ts'],
  environment: 'node',
  // Las pruebas que renderizan una página con el contenedor de Astro (p. ej. /terminos) compilan la
  // página en frío: en CI, sin caché de Vite, pasan de los 5 s por defecto.
  testTimeout: 30_000,
};

// `@vercel/analytics/astro` publica un `.ts`/`.astro` dentro de node_modules (Layout lo importa): Node no
// quita tipos ahí, así que Vite tiene que transformarlo en vez de dejarlo como dependencia externa.
export default getViteConfig({
  test,
  ssr: { noExternal: ['@vercel/analytics'] },
} as Parameters<typeof getViteConfig>[0]);
