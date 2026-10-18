#!/usr/bin/env node
// Avisa a los compradores de "El sistema de Enzo" que los videos ya están publicados.
//   npm run sistema:avisar-videos            -> simulacro: solo lista a quién le escribiría
//   npm run sistema:avisar-videos -- --send  -> envía por Resend y marca `videosNotifiedAt`
//
// Corre después de llenar `presale.videos` en src/data/sistema-enzo-detailing.json y de desplegar.
// Solo toca órdenes APPROVED de `enzo-detailing` sin `videosNotifiedAt`, así que se puede repetir.
// Para --send hacen falta RESEND_API_KEY y DIRECTORY_NOTIFY_FROM además de las variables de Upstash.

import { readFile } from 'node:fs/promises';
import { Redis } from '@upstash/redis';

const PRODUCT_ID = 'enzo-detailing';
const send = process.argv.includes('--send');

const data = JSON.parse(
  await readFile(new URL('../src/data/sistema-enzo-detailing.json', import.meta.url), 'utf8'),
);
const videos = Array.isArray(data.presale?.videos) ? data.presale.videos : [];
if (videos.length === 0) {
  console.log('presale.videos está vacío en src/data/sistema-enzo-detailing.json: no hay nada que avisar.');
  process.exit(0);
}

const url = process.env.UPSTASH_REDIS_REST_URL || '';
const token = process.env.UPSTASH_REDIS_REST_TOKEN || '';
if (!url || !token) {
  console.error('Faltan UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN.');
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY || '';
const from = process.env.DIRECTORY_NOTIFY_FROM || '';
const replyTo = process.env.DIRECTORY_NOTIFY_EMAIL || 'omaraalvarezo@gmail.com';
if (send && (!apiKey || !from)) {
  console.error('Para --send faltan RESEND_API_KEY y DIRECTORY_NOTIFY_FROM.');
  process.exit(1);
}

const environment = process.env.WOMPI_ENVIRONMENT === 'production' ? 'production' : 'test';
const prefix = `oa:kit:${environment}`;
const site = (process.env.PUBLIC_SITE_URL || 'https://omaralvarezo.co').replace(/\/$/, '');
const redis = new Redis({ url, token });

const ids = await redis.lrange(`${prefix}:ids`, 0, -1);
const list = Array.isArray(ids) ? ids : [];

// Mismo enlace que `buyerOrderLink` en src/lib/kit-mail.ts.
function orderLink(order) {
  return `${site}${data.orderPath}/${order.id}?t=${order.downloadToken}`;
}

function message(order) {
  const name = String(order.buyerName || '').trim().split(/\s+/)[0] || 'hola';
  return [
    `Hola ${name},`,
    '',
    'Ya están tus videos de El sistema de Enzo · detailing.',
    '',
    'Ábrelos desde el mismo enlace de tu compra, en cualquier dispositivo:',
    orderLink(order),
    '',
    'Si algo no te carga o no te queda claro, respóndeme a este correo y lo vemos.',
    '',
    'Omar',
  ].join('\n');
}

async function sendEmail(order) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `videos-ready-${order.id}`,
    },
    body: JSON.stringify({
      from,
      to: [order.email],
      reply_to: replyTo,
      subject: 'Ya están tus videos',
      text: message(order),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  return response.ok ? null : `Resend respondió ${response.status}`;
}

const pending = [];
for (const id of list) {
  const order = await redis.get(`${prefix}:order:${id}`);
  if (!order || typeof order !== 'object') continue;
  if (order.product !== PRODUCT_ID || order.status !== 'APPROVED') continue;
  if (order.videosNotifiedAt || !order.downloadToken || !order.email) continue;
  pending.push(order);
}

if (pending.length === 0) {
  console.log(`No hay compradores por avisar en ${prefix}.`);
  process.exit(0);
}

console.log(`${send ? 'Enviando a' : 'Simulacro: se le escribiría a'} ${pending.length} comprador(es) en ${prefix}.`);

let failed = 0;
for (const order of pending) {
  if (!send) {
    console.log(`  ${order.email} | ${order.buyerName} | orden ${order.id}`);
    continue;
  }
  try {
    const problem = await sendEmail(order);
    if (problem) throw new Error(problem);
    // Se relee la orden para no pisar cambios que haya hecho el webhook entre tanto.
    const key = `${prefix}:order:${order.id}`;
    const fresh = (await redis.get(key)) || order;
    await redis.set(key, { ...fresh, videosNotifiedAt: new Date().toISOString() });
    console.log(`  enviado | ${order.email} | orden ${order.id}`);
  } catch (error) {
    failed += 1;
    console.error(`  FALLÓ   | ${order.email} | orden ${order.id} | ${error instanceof Error ? error.message : error}`);
  }
}

if (!send) console.log('\nSolo era un simulacro. Para enviar: npm run sistema:avisar-videos -- --send');
if (failed > 0) {
  console.error(`\n${failed} envío(s) fallaron; vuelve a correr el script, solo repite los pendientes.`);
  process.exit(1);
}
