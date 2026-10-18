// Escalera de ofertas del home: de lo gratis a lo que Omar vende, y al final la lista de espera.
// Precios y destinos de pago salen de `getProduct()`; aquí no se escribe ningún monto a mano.
import { getProduct } from './products';

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

const kit = requireProduct('talleres');
const sistema = requireProduct('enzo-detailing');

export const LADDER: readonly Rung[] = [
  {
    id: 'pdf',
    name: 'PDF de prompts',
    forWho: 'Para probar la IA en tu negocio sin gastar nada.',
    gets: 'Prompts que uso yo, listos para copiar. Te lo mando al correo.',
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
    gets: 'Las cuatro piezas del sistema de Enzo, con videos y garantía de 7 días. Es preventa.',
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

export const PRIMARY_RUNG: RungId = 'sistema-enzo';
