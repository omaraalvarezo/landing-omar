/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

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
  readonly WOMPI_TEST_PUBLIC_KEY: string;
  readonly WOMPI_TEST_INTEGRITY_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    adminUnlocked?: boolean;
  }
}
