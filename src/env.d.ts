/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Inventario de variables del proyecto. Desde Astro 6, import.meta.env se congela en el
// build: las privadas se leen en runtime con getSecret() de 'astro:env/server'; solo las
// PUBLIC_* siguen usando import.meta.env.
interface ImportMetaEnv {
  readonly ADMIN_PASSWORD_HASH: string;
  readonly SESSION_SECRET: string;
  readonly UPSTASH_REDIS_REST_URL: string;
  readonly UPSTASH_REDIS_REST_TOKEN: string;
  readonly PUBLIC_SITE_URL: string;
  readonly CAL_CONSULTING_LINK: string;
  readonly WOMPI_ENVIRONMENT: 'test' | 'production';
  readonly WOMPI_PUBLIC_KEY: string;
  readonly WOMPI_INTEGRITY_SECRET: string;
  readonly WOMPI_RELAY_SECRET: string;
  readonly CONSULTING_ORDER_STORE_URL: string;
  readonly WOMPI_TEST_PUBLIC_KEY: string;
  readonly WOMPI_TEST_INTEGRITY_SECRET: string;
  readonly WOMPI_EVENTS_SECRET: string;
  readonly WOMPI_TEST_EVENTS_SECRET: string;
  readonly DIRECTORY_NOTIFY_EMAIL: string;
  readonly DIRECTORY_NOTIFY_FROM: string;
  readonly RESEND_API_KEY: string;
  readonly NEWSLETTER_PROVIDER: string;
  readonly NEWSLETTER_ACTION_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    adminUnlocked?: boolean;
  }
}
