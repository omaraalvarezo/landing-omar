import { CONSULTING } from './consulting';

const TRM_ENDPOINT = 'https://www.datos.gov.co/resource/32sa-8pi3.json';
const CACHE_MS = 15 * 60 * 1_000;

interface TrmRow {
  valor?: string;
  vigenciadesde?: string;
  vigenciahasta?: string;
}

export interface ConsultingQuote {
  priceUsd: number;
  trmCop: number;
  operationalRateCop: number;
  spreadBps: number;
  spreadPercent: number;
  amountCop: number;
  amountInCents: number;
  effectiveDate: string;
  quotedAt: string;
  source: 'sfc';
}

let cache: { quote: ConsultingQuote; forDate: string; expiresAt: number } | null = null;

function bogotaDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function validTrm(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 2_000 && parsed <= 7_000 ? parsed : null;
}

function toQuote(trmCop: number, effectiveDate: string): ConsultingQuote {
  const spreadFactor = 1 + CONSULTING.fxSpreadBps / 10_000;
  const operationalRateCop = Math.ceil(
    (trmCop * spreadFactor) / CONSULTING.fxRateRoundingCop,
  ) * CONSULTING.fxRateRoundingCop;
  // Wompi solo admite COP. La tasa aplicada y el total exacto se muestran antes de pagar.
  const amountCop = Math.round(CONSULTING.priceUsd * operationalRateCop);
  return {
    priceUsd: CONSULTING.priceUsd,
    trmCop,
    operationalRateCop,
    spreadBps: CONSULTING.fxSpreadBps,
    spreadPercent: CONSULTING.fxSpreadBps / 100,
    amountCop,
    amountInCents: amountCop * 100,
    effectiveDate,
    quotedAt: new Date().toISOString(),
    source: 'sfc',
  };
}

async function fetchOfficialTrm(today: string): Promise<ConsultingQuote | null> {
  const url = new URL(TRM_ENDPOINT);
  url.searchParams.set('$select', 'valor,vigenciadesde,vigenciahasta');
  url.searchParams.set('$order', 'vigenciadesde DESC');
  url.searchParams.set('$limit', '10');

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(4_000),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`TRM_STATUS_${response.status}`);

  const rows = (await response.json()) as TrmRow[];
  const applicable = rows.find((row) => {
    const from = String(row.vigenciadesde || '').slice(0, 10);
    const to = String(row.vigenciahasta || '').slice(0, 10);
    return from && to && from <= today && to >= today;
  });

  const trm = validTrm(applicable?.valor);
  const effectiveDate = String(applicable?.vigenciadesde || '').slice(0, 10);
  return trm && effectiveDate ? toQuote(trm, effectiveDate) : null;
}

export async function getConsultingQuote(): Promise<ConsultingQuote> {
  const now = Date.now();
  const today = bogotaDate();
  if (cache && cache.forDate === today && cache.expiresAt > now) return cache.quote;

  let quote: ConsultingQuote | null = null;
  try {
    quote = await fetchOfficialTrm(today);
  } catch (error) {
    console.warn('[consultoria] no se pudo consultar la TRM oficial', error);
  }

  if (!quote) {
    // La TRM es fija durante su vigencia. Una cotización ya verificada hoy es un
    // respaldo seguro; un número configurado manualmente no lo es al cambiar el día.
    if (cache?.forDate === today) return cache.quote;
    throw new Error('OFFICIAL_TRM_UNAVAILABLE');
  }

  cache = { quote, forDate: today, expiresAt: now + CACHE_MS };
  return quote;
}
