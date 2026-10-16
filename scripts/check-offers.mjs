#!/usr/bin/env node
// Precio del kit, referencias y archivos generados. No toca Wompi.

import { readFileSync } from 'node:fs';
import { buildKitZip, buildPromptsPdf, promptCount } from '../src/lib/printable.ts';

const prompts = JSON.parse(readFileSync(new URL('../src/data/lead-prompts.json', import.meta.url), 'utf8'));
const kit = JSON.parse(readFileSync(new URL('../src/data/kit.json', import.meta.url), 'utf8'));
const pack = JSON.parse(readFileSync(new URL('../src/data/kit-pack.json', import.meta.url), 'utf8'));
const tools = JSON.parse(readFileSync(new URL('../src/data/tools.json', import.meta.url), 'utf8'));

if (promptCount(prompts) !== 40) throw new Error(`se esperaban 40 prompts, hay ${promptCount(prompts)}`);
const ids = new Set();
for (const area of prompts.areas) {
  if (ids.has(area.id)) throw new Error(`área repetida: ${area.id}`);
  ids.add(area.id);
  for (const prompt of area.prompts) {
    if (prompt.text.length < 80) throw new Error(`prompt corto: ${prompt.title}`);
  }
}
for (const required of ['agenda', 'taller-cotizacion', 'detailing', 'whatsapp', 'mantenimiento', 'resenas', 'redes', 'inventario', 'atencion', 'operacion']) {
  if (!ids.has(required)) throw new Error(`falta el área ${required}`);
}

const expected = Math.ceil((kit.priceUsd * kit.basis.operationalRateCop) / 1000) * 1000;
if (kit.amountCop !== expected) throw new Error(`kit ${kit.amountCop} no es el millar superior (${expected})`);
if (kit.amountCop !== 81000 || kit.priceUsd !== 25) throw new Error('el kit dejó de ser USD 25 → $81.000');

const cents = kit.amountCop * 100;
const reference = `oa-kit-talleres-q${cents}-d20261016-t1710000000000-abcdef12`;
const kitRef = /^oa-kit-talleres-q(\d{7,12})-d\d{8}-t\d{13}-[a-f0-9]{8}$/;
const directory = /^oa-directorio-(basico|destacado|patrocinio)-q\d{7,12}-d\d{8}-t\d{13}-[a-f0-9]{8}$/;
const consulting = /^oa-consultoria-2h/;
if (!kitRef.test(reference) || directory.test(reference) || consulting.test(reference)) {
  throw new Error(`referencia de kit inválida: ${reference}`);
}
if (Number(reference.match(kitRef)[1]) !== cents) throw new Error('la referencia no trae el monto del kit');

const toolSlugs = new Set(tools.map((tool) => tool.slug));
for (const flow of pack.flows) {
  if (!toolSlugs.has(flow.tool)) throw new Error(`flujo con herramienta ausente: ${flow.tool}`);
  if (flow.steps.length < 3) throw new Error(`flujo corto: ${flow.title}`);
}
const messageIds = pack.messages.map((message) => message.id).join(',');
if (messageIds !== 'cita,cotizacion,mantenimiento,resena,posventa') {
  throw new Error(`mensajes inesperados: ${messageIds}`);
}
if (!pack.csv.startsWith('fecha_contacto,nombre,telefono')) throw new Error('el CSV no trae el encabezado');

const pdf = buildPromptsPdf(prompts);
if (pdf[0] !== 0x25 || pdf[1] !== 0x50 || pdf[2] !== 0x44 || pdf[3] !== 0x46) throw new Error('el PDF no abre con %PDF');
const pdfText = Buffer.from(pdf).toString('latin1');
if (!pdfText.includes('detailing') || !pdfText.includes('WhatsApp')) throw new Error('el PDF no trae las secciones');

const zip = buildKitZip(prompts, pack);
const names = unzipNames(zip);
for (const name of ['leeme.txt', 'prompts-ia-talleres-detailing-pymes.pdf', 'mensajes-whatsapp.txt', 'flujos.txt', 'seguimiento-clientes.csv']) {
  if (!names.includes(name)) throw new Error(`falta ${name} en el zip`);
}

console.log(`ofertas ok · ${promptCount(prompts)} prompts · kit $${kit.amountCop} · zip ${names.length} archivos`);

function unzipNames(bytes) {
  const data = Buffer.from(bytes);
  const found = [];
  let offset = 0;
  while (offset + 4 <= data.length) {
    const signature = data.readUInt32LE(offset);
    if (signature !== 0x04034b50) break;
    const compressed = data.readUInt32LE(offset + 18);
    const nameLength = data.readUInt16LE(offset + 26);
    const extra = data.readUInt16LE(offset + 28);
    found.push(data.subarray(offset + 30, offset + 30 + nameLength).toString('utf8'));
    offset += 30 + nameLength + extra + compressed;
  }
  return found;
}
