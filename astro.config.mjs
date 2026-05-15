import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://omaralvarezo.co',
  // Hybrid: páginas estáticas por default (prerender automático),
  // solo endpoints con `export const prerender = false` corren serverless.
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: { enabled: true },
    // No edge functions por ahora — admin-auth corre como Node serverless con bcryptjs.
  }),
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
