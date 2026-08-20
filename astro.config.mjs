import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://omaralvarezo.co',
  // Astro 5: output 'static' por default permite mezclar estático + endpoints
  // con `export const prerender = false` (corren serverless).
  // El modo 'hybrid' fue eliminado en Astro 5.
  output: 'static',
  // La analítica de tráfico vive en Cloudflare. El script de Vercel Analytics devolvía 404
  // detrás del dominio proxied y generaba ruido de consola sin aportar una segunda medición útil.
  adapter: vercel(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    server: {
      // Permitir túneles públicos (localhost.run, ngrok, trycloudflare) en dev
      allowedHosts: ['.lhr.life', '.localhost.run', '.ngrok-free.app', '.trycloudflare.com', '.serveousercontent.com', '.serveo.net'],
    },
  },
});
