#!/usr/bin/env node
// Comprueba datos del directorio y que sus referencias no choquen con la consultoría.

import { readFileSync } from 'node:fs';
import { loadCategories, loadTools, validateTools } from './lib/tools-io.mjs';

const plans = JSON.parse(readFileSync(new URL('../src/data/directory-plans.json', import.meta.url), 'utf8'));
const rate = plans.basis.operationalRateCop;

function rounded(usd) {
  return Math.ceil((usd * rate) / 1000) * 1000;
}

const tools = validateTools(loadTools(), loadCategories());
if (tools.length < 32) {
  throw new Error(`el directorio semilla tiene 32 herramientas; ahora hay ${tools.length}`);
}

for (const plan of plans.plans) {
  const expected = rounded(plan.priceUsd);
  if (plan.amountCop !== expected) {
    throw new Error(`${plan.id}: ${plan.amountCop} no es el millar superior de ${plan.priceUsd} × ${rate} (${expected})`);
  }
}

const consulting = /^oa-consultoria-2h(?:-q\d{8,12}-d\d{8}-t\d{13}-[a-f0-9]{8}|-\d{13}-[a-f0-9]{8})$/;
const directory = /^oa-directorio-(basico|destacado|patrocinio)-q(\d{7,12})-d\d{8}-t\d{13}-[a-f0-9]{8}$/;
for (const plan of plans.plans) {
  const reference = `oa-directorio-${plan.id}-q${plan.amountCop * 100}-d20261016-t1710000000000-abcdef12`;
  if (!directory.test(reference) || consulting.test(reference)) {
    throw new Error(`referencia inválida para ${plan.id}: ${reference}`);
  }
}

const sampleConsulting = 'oa-consultoria-2h-q247867000-d20260820-t1710000000000-abcdef12';
if (!consulting.test(sampleConsulting) || directory.test(sampleConsulting)) {
  throw new Error('la referencia de consultoría cambió de forma');
}

console.log(`directorio ok · ${tools.length} herramientas · ${plans.plans.length} planes`);
