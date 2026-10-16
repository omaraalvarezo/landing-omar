#!/usr/bin/env node
// Lee las órdenes recientes del directorio en Upstash.
//   npm run tool:pending
//
// No publica nada. La activación sigue siendo editar src/data/tools.json.

import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || '';
const token = process.env.UPSTASH_REDIS_REST_TOKEN || '';
if (!url || !token) {
  console.error('Faltan UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN.');
  console.error('Sin esas variables el checkout del directorio no puede guardar la orden.');
  process.exit(1);
}

const environment = process.env.WOMPI_ENVIRONMENT === 'production' ? 'production' : 'test';
const prefix = `oa:dir:${environment}`;
const redis = new Redis({ url, token });
const ids = await redis.lrange(`${prefix}:ids`, 0, 199);
const list = Array.isArray(ids) ? ids : [];

if (list.length === 0) {
  console.log(`No hay órdenes en ${prefix}:ids.`);
  process.exit(0);
}

for (const id of list) {
  const order = await redis.get(`${prefix}:order:${id}`);
  if (!order || typeof order !== 'object') continue;
  const row = order;
  console.log(
    [
      row.status,
      row.notifyStatus || 'sin-aviso',
      row.plan,
      row.amountInCents,
      row.toolName,
      row.toolUrl,
      row.email,
      row.reference,
    ].join(' | '),
  );
}
