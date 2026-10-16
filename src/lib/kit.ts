import kitData from '../data/kit.json';
import { bogotaToday } from './directory';

export const KIT_REFERENCE_PREFIX = 'oa-kit';

const KIT_REFERENCE = /^oa-kit-talleres-q(\d{7,12})-d(\d{8})-t(\d{13})-[a-f0-9]{8}$/;

export const KIT = {
  id: 'talleres' as const,
  name: kitData.name,
  priceUsd: kitData.priceUsd,
  amountCop: kitData.amountCop,
  downloadDays: kitData.downloadDays,
  basis: kitData.basis,
};

if (!Number.isSafeInteger(KIT.amountCop) || KIT.amountCop !== Math.ceil((KIT.priceUsd * KIT.basis.operationalRateCop) / 1000) * 1000) {
  throw new Error('KIT_PRICE_INVALID');
}

export function kitAmountInCents(): number {
  return KIT.amountCop * 100;
}

export function createKitReference(): string {
  const date = bogotaToday().replace(/-/g, '');
  const reference = `${KIT_REFERENCE_PREFIX}-talleres-q${kitAmountInCents()}-d${date}-t${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  if (
    reference.startsWith('oa-consultoria-2h') ||
    reference.startsWith('oa-directorio-') ||
    !parseKitReference(reference)
  ) {
    throw new Error('KIT_REFERENCE_INVALID');
  }
  return reference;
}

export function parseKitReference(reference: unknown): { amountInCents: number } | null {
  if (typeof reference !== 'string' || reference.length > 140) return null;
  if (reference.startsWith('oa-consultoria-2h') || reference.startsWith('oa-directorio-')) return null;
  const match = reference.match(KIT_REFERENCE);
  if (!match) return null;
  const amountInCents = Number(match[1]);
  if (!Number.isSafeInteger(amountInCents) || amountInCents !== kitAmountInCents()) return null;
  return { amountInCents };
}

export function kitDownloadPath(orderId: string, token: string): string {
  return `/api/herramientas/kit-archivo?pedido=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`;
}

export const KIT_BUSINESSES = ['taller', 'detailing', 'ambos', 'otra'] as const;
export type KitBusiness = (typeof KIT_BUSINESSES)[number];

export function isKitBusiness(value: string): value is KitBusiness {
  return (KIT_BUSINESSES as readonly string[]).includes(value);
}
