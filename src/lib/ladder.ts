// Escalera de ofertas del home: de lo gratis a lo que Omar vende, y al final la lista de espera.
// Precios, garantía, preventa y destinos de pago salen de `getProduct()`; aquí no se escribe
// ningún monto ni plazo a mano. Las páginas son estáticas: la escalera se arma al construir.
import { bogotaToday } from './directory';
import { getProduct, isProductOnSale, type Product } from './products';
import { hasGuarantee } from './sistema-copy';

export type RungId = 'pdf' | 'kit' | 'sistema-enzo' | 'lista';

export interface Rung {
  id: RungId;
  name: string;
  forWho: string;
  gets: string;
  priceCop: number | null;
  usdReference: number | null;
  action: 'correo' | 'compra' | 'preventa' | 'anotarse';
  href: string;
}

function requireProduct(id: 'talleres' | 'enzo-detailing') {
  const product = getProduct(id);
  if (!product) throw new Error(`LADDER_PRODUCT_MISSING:${id}`);
  return product;
}

/**
 * Qué recibe quien compra el sistema, con la garantía de `guaranteeDays` y el estado de la preventa.
 * Con la preventa cerrada (sin fecha o vencida) no dice "preventa": dice que todavía no cobro.
 */
export function sistemaRungGets(product: Product, onSale: boolean): string {
  const guarantee = hasGuarantee(product.guaranteeDays) ? ` y garantía de ${product.guaranteeDays} días` : '';
  const state = onSale
    ? 'Es preventa: los videos llegan después.'
    : 'Abre pronto: no cobro hasta fijar la fecha de los videos.';
  return `Las cuatro piezas del sistema de Enzo, con videos${guarantee}. ${state}`;
}

/** La escalera para una fecha de Bogotá (YYYY-MM-DD). */
export function buildLadder(today: string = bogotaToday()): readonly Rung[] {
  const kit = requireProduct('talleres');
  const sistema = requireProduct('enzo-detailing');
  return [
    {
      id: 'pdf',
      name: 'PDF de prompts',
      forWho: 'Para probar la IA en tu negocio sin gastar nada.',
      gets: 'Prompts que uso yo, listos para copiar. Dejas tu correo y lo descargas.',
      priceCop: null,
      usdReference: null,
      action: 'correo',
      href: '/herramientas-ia/prompts-gratis',
    },
    {
      id: 'kit',
      name: 'Kit para talleres',
      forWho: 'Para talleres y detailing que quieren dejar de improvisar con la IA.',
      gets: 'El paquete de prompts y guías para el taller, con descarga directa.',
      priceCop: kit.amountCop,
      usdReference: kit.usdReference,
      action: 'compra',
      href: kit.page,
    },
    {
      id: 'sistema-enzo',
      name: 'El sistema de Enzo · detailing',
      forWho: 'Para el dueño de un taller de detailing que quiere el sistema con el que yo opero.',
      gets: sistemaRungGets(sistema, isProductOnSale(sistema, today)),
      priceCop: sistema.amountCop,
      usdReference: sistema.usdReference,
      action: 'preventa',
      href: sistema.page,
    },
    {
      id: 'lista',
      name: 'Lista de espera',
      forWho: 'Para quien quiere que lo instale en su negocio o sesión conmigo.',
      gets: 'Hoy no tomo cupos. Te anotas y te escribo cuando abra uno.',
      priceCop: null,
      usdReference: null,
      action: 'anotarse',
      href: '/#contacto',
    },
  ];
}

export const LADDER: readonly Rung[] = buildLadder();

export const PRIMARY_RUNG: RungId = 'sistema-enzo';
