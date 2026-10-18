#!/usr/bin/env node
// Lee las órdenes del kit y del sistema en Upstash. Primera columna: producto.
//   npm run kit:pending
//   npm run kit:pending -- --link
//
// --link imprime el enlace de descarga. No lo pegues en un canal público.

import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || '';
const token = process.env.UPSTASH_REDIS_REST_TOKEN || '';
if (!url || !token) {
  console.error('Faltan UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN.');
  console.error('Sin esas variables el checkout del kit queda cerrado.');
  process.exit(1);
}

const withLink = process.argv.includes('--link');
const environment = process.env.WOMPI_ENVIRONMENT === 'production' ? 'production' : 'test';
const prefix = `oa:kit:${environment}`;
const site = (process.env.PUBLIC_SITE_URL || 'https://omaralvarezo.co').replace(/\/$/, '');
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
  // Las órdenes anteriores a los productos múltiples no traen `product`: eran del kit.
  const columns = [
    order.product || 'talleres',
    order.status,
    order.notifyStatus || 'sin-aviso',
    order.amountInCents,
    order.buyerName,
    order.email,
    order.business,
    order.reference,
    order.downloadExpiresAt || 'sin-enlace',
    order.country || '-',
  ];
  if (withLink && order.status === 'APPROVED' && order.downloadToken) {
    columns.push(`${site}/api/herramientas/kit-archivo?pedido=${order.id}&t=${order.downloadToken}`);
  }
  console.log(columns.join(' | '));
}
