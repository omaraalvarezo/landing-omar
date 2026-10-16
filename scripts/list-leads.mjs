#!/usr/bin/env node
// Lista los correos del PDF de prompts guardados en Upstash.
//   npm run lead:list
//
// No imprime enlaces de descarga.

import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || '';
const token = process.env.UPSTASH_REDIS_REST_TOKEN || '';
if (!url || !token) {
  console.error('Faltan UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN.');
  console.error('Sin esas variables el formulario del PDF no guarda correos.');
  process.exit(1);
}

const environment = process.env.WOMPI_ENVIRONMENT === 'production' ? 'production' : 'test';
const prefix = `oa:lead:${environment}`;
const redis = new Redis({ url, token });
const ids = await redis.lrange(`${prefix}:ids`, 0, 499);
const list = Array.isArray(ids) ? ids : [];

if (list.length === 0) {
  console.log(`No hay correos en ${prefix}:ids.`);
  process.exit(0);
}

for (const id of list) {
  const lead = await redis.get(`${prefix}:email:${id}`);
  if (!lead || typeof lead !== 'object') continue;
  console.log([lead.createdAt, lead.updatedAt, lead.email, lead.source].join(' | '));
}
