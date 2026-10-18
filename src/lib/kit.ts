import kitData from '../data/kit.json';
import {
  PRODUCT_REFERENCE_PREFIX,
  createProductReference,
  parseProductReference,
  productAmountInCents,
  type ProductId,
} from './products';

export const KIT_REFERENCE_PREFIX = PRODUCT_REFERENCE_PREFIX;

export const KIT = {
  id: 'talleres' as const,
  name: kitData.name,
  priceUsd: kitData.priceUsd,
  amountCop: kitData.amountCop,
  downloadDays: kitData.downloadDays,
  basis: kitData.basis,
};

export function kitAmountInCents(): number {
  return productAmountInCents('talleres');
}

export function createKitReference(): string {
  return createProductReference('talleres');
}

// Solo referencias del kit: las del sistema de Enzo las lee parseProductReference.
export function parseKitReference(reference: unknown): { product: ProductId; amountInCents: number } | null {
  const parsed = parseProductReference(reference);
  return parsed && parsed.product === 'talleres' ? parsed : null;
}

export function kitDownloadPath(orderId: string, token: string): string {
  return `/api/herramientas/kit-archivo?pedido=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`;
}

export const KIT_BUSINESSES = ['taller', 'detailing', 'ambos', 'otra'] as const;
export type KitBusiness = (typeof KIT_BUSINESSES)[number];

export function isKitBusiness(value: string): value is KitBusiness {
  return (KIT_BUSINESSES as readonly string[]).includes(value);
}
