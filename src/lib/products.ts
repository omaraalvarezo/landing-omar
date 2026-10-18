import kitData from '../data/kit.json';
import enzoData from '../data/sistema-enzo-detailing.json';
import paises from '../data/paises.json';
import { bogotaToday } from './directory';
import { isKitBusiness } from './kit';

export type ProductId = 'talleres' | 'enzo-detailing';

export interface ProductVideo {
  title: string;
  url: string;
}

export interface Product {
  id: ProductId;
  name: string;
  amountCop: number;
  usdReference: number;
  downloadDays: number;
  buyerEmail: boolean;
  page: string;
  orderPath: string;
  archiveName: string;
  guaranteeDays: number | null;
  acceptsForeignCards: boolean | null;
  presale: { videosDueDate: string | null; videos: ProductVideo[] } | null;
}

export const PRODUCT_IDS: readonly ProductId[] = ['talleres', 'enzo-detailing'];

export const PRODUCT_REFERENCE_PREFIX = 'oa-kit';

const PRODUCTS: Record<ProductId, Product> = {
  talleres: {
    id: 'talleres',
    name: kitData.name,
    amountCop: kitData.amountCop,
    usdReference: kitData.priceUsd,
    downloadDays: kitData.downloadDays,
    buyerEmail: false,
    page: '/herramientas-ia/kit',
    orderPath: '/herramientas-ia/kit/pedido',
    archiveName: 'kit-ia-talleres-detailing.zip',
    guaranteeDays: null,
    acceptsForeignCards: null,
    presale: null,
  },
  'enzo-detailing': {
    id: 'enzo-detailing',
    name: enzoData.name,
    amountCop: enzoData.amountCop,
    usdReference: enzoData.usdReference,
    downloadDays: enzoData.downloadDays,
    buyerEmail: enzoData.buyerEmail,
    page: enzoData.page,
    orderPath: enzoData.orderPath,
    archiveName: enzoData.archiveName,
    guaranteeDays: enzoData.guaranteeDays,
    acceptsForeignCards: enzoData.acceptsForeignCards,
    presale: {
      videosDueDate: enzoData.presale.videosDueDate,
      videos: enzoData.presale.videos as ProductVideo[],
    },
  },
};

// El kit sigue la regla USD × tasa operativa (millar superior); el sistema es fijo en pesos.
if (
  !Number.isSafeInteger(PRODUCTS.talleres.amountCop) ||
  PRODUCTS.talleres.amountCop !==
    Math.ceil((PRODUCTS.talleres.usdReference * kitData.basis.operationalRateCop) / 1000) * 1000
) {
  throw new Error('KIT_PRICE_INVALID');
}
if (!Number.isSafeInteger(PRODUCTS['enzo-detailing'].amountCop) || PRODUCTS['enzo-detailing'].amountCop <= 0) {
  throw new Error('PRODUCT_PRICE_INVALID');
}

const PRODUCT_REFERENCE = new RegExp(
  `^${PRODUCT_REFERENCE_PREFIX}-(${PRODUCT_IDS.join('|')})-q(\\d{7,12})-d(\\d{8})-t(\\d{13})-[a-f0-9]{8}$`,
);

export function getProduct(id: unknown): Product | null {
  if (typeof id !== 'string' || !(PRODUCT_IDS as readonly string[]).includes(id)) return null;
  return PRODUCTS[id as ProductId];
}

export function productAmountInCents(id: ProductId): number {
  return PRODUCTS[id].amountCop * 100;
}

export function createProductReference(id: ProductId, now: Date = new Date()): string {
  const date = bogotaToday(now).replace(/-/g, '');
  const reference = `${PRODUCT_REFERENCE_PREFIX}-${id}-q${productAmountInCents(id)}-d${date}-t${now.getTime()}-${crypto.randomUUID().slice(0, 8)}`;
  if (
    reference.startsWith('oa-consultoria-2h') ||
    reference.startsWith('oa-directorio-') ||
    parseProductReference(reference)?.product !== id
  ) {
    throw new Error('PRODUCT_REFERENCE_INVALID');
  }
  return reference;
}

export function parseProductReference(
  reference: unknown,
): { product: ProductId; amountInCents: number } | null {
  if (typeof reference !== 'string' || reference.length > 140) return null;
  if (reference.startsWith('oa-consultoria-2h') || reference.startsWith('oa-directorio-')) return null;
  const match = reference.match(PRODUCT_REFERENCE);
  if (!match) return null;
  const product = match[1] as ProductId;
  const amountInCents = Number(match[2]);
  if (!Number.isSafeInteger(amountInCents) || amountInCents !== productAmountInCents(product)) return null;
  return { product, amountInCents };
}

/** Sin preventa: siempre a la venta. Con preventa: solo con fecha de videos vigente (hoy cuenta). */
export function isProductOnSale(product: Product, today: string = bogotaToday()): boolean {
  if (!product.presale) return true;
  const due = product.presale.videosDueDate;
  if (!due) return false;
  return due >= today;
}

const CHECKOUT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mismo saneado que usaba el endpoint del kit: sin <>, espacios colapsados, recortado.
function cleanField(value: unknown, max: number): string {
  return typeof value === 'string' ? value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

export type CheckoutInput =
  | { ok: true; product: ProductId; buyerName: string; email: string; business: string; country: string }
  | { ok: false; error: string };

/** Valida y sanea el cuerpo del checkout. Sin `product` es el kit, así su formulario no cambia. */
export function validateCheckoutInput(input: Record<string, unknown>): CheckoutInput {
  const product = input.product === undefined ? getProduct('talleres') : getProduct(input.product);
  if (!product) return { ok: false, error: 'Ese producto no existe.' };

  const buyerName = cleanField(input.buyerName, 80);
  const email = cleanField(input.email, 254).toLowerCase();

  if (product.id === 'talleres') {
    const business = cleanField(input.business, 20);
    if (buyerName.length < 2 || !CHECKOUT_EMAIL.test(email) || !isKitBusiness(business)) {
      return { ok: false, error: 'Revisa nombre, correo y tipo de negocio.' };
    }
    return { ok: true, product: product.id, buyerName, email, business, country: '' };
  }

  const business = cleanField(input.business, 200);
  const country = cleanField(input.country, 2).toUpperCase();
  const countryOk = paises.some((pais) => pais.id === country);
  if (
    buyerName.length < 2 ||
    !CHECKOUT_EMAIL.test(email) ||
    business.length < 2 ||
    business.length > 80 ||
    !countryOk
  ) {
    return { ok: false, error: 'Revisa nombre, correo, nombre del negocio y país.' };
  }
  return { ok: true, product: product.id, buyerName, email, business, country };
}
