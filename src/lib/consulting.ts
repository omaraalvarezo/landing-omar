export const CONSULTING = {
  name: 'Sesión de arquitectura operativa con IA',
  shortName: 'Consultoría 2H',
  durationMinutes: 120,
  priceUsd: 797,
  fxSpreadBps: 165,
  fxRateRoundingCop: 10,
  displayCurrency: 'USD',
  chargeCurrency: 'COP',
  referencePrefix: 'oa-consultoria-2h',
} as const;

// Mantiene válidos los redirects emitidos antes del cambio a precio base en USD.
export const LEGACY_CONSULTING_AMOUNT_IN_CENTS = 240_000_000;

const MIN_TRM_COP = 2_000;
const MAX_TRM_COP = 7_000;
const QUOTED_REFERENCE = new RegExp(
  `^${CONSULTING.referencePrefix}-q(\\d{8,12})-d(\\d{8})-t(\\d{13})-[a-f0-9]{8}$`,
);
const LEGACY_REFERENCE = new RegExp(
  `^${CONSULTING.referencePrefix}-(\\d{13})-[a-f0-9]{8}$`,
);

export function formatCop(value: number): string {
  return `$${new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatUsd(value: number): string {
  return `USD ${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function createConsultingReference(amountInCents: number, effectiveDate: string): string {
  const min = CONSULTING.priceUsd * MIN_TRM_COP * 100;
  const max = CONSULTING.priceUsd * MAX_TRM_COP * 100;
  if (!Number.isSafeInteger(amountInCents) || amountInCents < min || amountInCents > max) {
    throw new Error('CONSULTING_AMOUNT_OUT_OF_RANGE');
  }

  const date = effectiveDate.replace(/\D/g, '').slice(0, 8);
  if (date.length !== 8) throw new Error('CONSULTING_QUOTE_DATE_INVALID');

  return `${CONSULTING.referencePrefix}-q${amountInCents}-d${date}-t${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

export function expectedAmountForConsultingReference(reference: unknown): number | null {
  if (typeof reference !== 'string' || reference.length > 120) return null;

  const quoted = reference.match(QUOTED_REFERENCE);
  if (quoted) {
    const amount = Number(quoted[1]);
    const min = CONSULTING.priceUsd * MIN_TRM_COP * 100;
    const max = CONSULTING.priceUsd * MAX_TRM_COP * 100;
    return Number.isSafeInteger(amount) && amount >= min && amount <= max ? amount : null;
  }

  return LEGACY_REFERENCE.test(reference) ? LEGACY_CONSULTING_AMOUNT_IN_CENTS : null;
}

export function isConsultingReference(reference: unknown): reference is string {
  return expectedAmountForConsultingReference(reference) !== null;
}
