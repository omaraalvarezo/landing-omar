import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { readFileSync } from 'node:fs';
import { shortLinkRedirects } from './src/lib/short-links-core.mjs';

// Direcciones cortas de los videos (/entregas, /prompts, /kit, /lista): una sola fuente de verdad.
const shortLinks = JSON.parse(readFileSync(new URL('./src/data/short-links.json', import.meta.url), 'utf8'));

// https://astro.build/config
export default defineConfig({
  site: 'https://omaralvarezo.co',
  // output 'static' por default permite mezclar estático + endpoints
  // con `export const prerender = false` (corren serverless).
  output: 'static',
  // La analítica de tráfico vive en Cloudflare. El script de Vercel Analytics devolvía 404
  // detrás del dominio proxied y generaba ruido de consola sin aportar una segunda medición útil.
  // El regreso de pago consulta Wompi y el almacén durable de Adjudika. El
  // límite explícito evita cortar una verificación válida a mitad.
  adapter: vercel({ maxDuration: 30 }),
  // 302 (no permanente): el destino de cada video puede cambiar. Llevan ?ref= para medir visitas.
  redirects: shortLinkRedirects(shortLinks),
  build: {
    inlineStylesheets: 'auto',
  },
  // Astro 7 cambió el default a 'jsx', que quita el espacio entre elementos en línea.
  // Se conserva la compresión estilo HTML de Astro 5 para no pegar palabras en el copy.
  compressHTML: true,
  vite: {
    // Tailwind 4 se integra como plugin de Vite; @astrojs/tailwind quedó obsoleto.
    plugins: [tailwindcss()],
    server: {
      // Permitir túneles públicos (localhost.run, ngrok, trycloudflare) en dev
      allowedHosts: ['.lhr.life', '.localhost.run', '.ngrok-free.app', '.trycloudflare.com', '.serveousercontent.com', '.serveo.net'],
    },
  },
});
