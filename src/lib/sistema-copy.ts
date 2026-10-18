// Textos y cálculos que comparten el home y /sistemas/detailing. Una sola fuente: si la garantía,
// la preventa o el costo de las herramientas cambian de redacción, cambian en las dos páginas.
// Funciones puras: nada de Astro ni de fechas implícitas.
import { getTool } from './directory';
import { formatCop, formatUsd } from './money';
import type { SistemaPiece, SistemaTool } from './sistema';

/** Cada pieza es un estado del trabajo y conserva su color en todo el sitio. */
export const PIECE_STATE: Record<SistemaPiece['id'], { color: string; ink: string; failure: string; fix: string }> = {
  recepcion: { color: '#ff6b45', ink: '#131118', failure: 'El rayón ya estaba. Nadie lo fotografió.', fix: 'Constancia de cómo llegó el carro.' },
  checklist: { color: '#c79aff', ink: '#131118', failure: 'Se olvidó un paso.', fix: 'Pasos que el equipo marca para que nada se olvide.' },
  entrega: { color: '#4b5fe3', ink: '#fff8ea', failure: 'El carro salió sin firma.', fix: 'Acta que el cliente acepta y firma.' },
  seguimiento: { color: '#c8ff3d', ink: '#131118', failure: 'Nadie le volvió a escribir.', fix: '“Ya está listo”, garantía, posventa y pedido de reseña.' },
};

/** Fecha ISO (YYYY-MM-DD) en formato largo de Colombia, al mediodía de Bogotá. */
export function longDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'America/Bogota' }).format(new Date(`${iso}T12:00:00-05:00`));
}

export function toolName(slug: string): string {
  const tool = getTool(slug);
  if (!tool) throw new Error(`Herramienta ausente del directorio: ${slug}`);
  return tool.nombre;
}

export function costLabel(tool: Pick<SistemaTool, 'monthlyCostUsd' | 'monthlyCostCop'>): string {
  const parts: string[] = [];
  if (tool.monthlyCostUsd) parts.push(formatUsd(tool.monthlyCostUsd));
  if (tool.monthlyCostCop) parts.push(formatCop(tool.monthlyCostCop));
  if (parts.length) return `${parts.join(' · ')} al mes`;
  if (tool.monthlyCostUsd === 0 || tool.monthlyCostCop === 0) return 'Gratis';
  return 'Sin precio publicado';
}

/** Total mensual: dólares de las que cobran en dólares, más pesos de las que solo publican pesos. */
export function toolsTotalLabel(tools: Pick<SistemaTool, 'monthlyCostUsd' | 'monthlyCostCop'>[]): string {
  const totalUsd = tools.reduce((sum, tool) => sum + (tool.monthlyCostUsd ?? 0), 0);
  const totalCop = tools.reduce((sum, tool) => sum + (tool.monthlyCostUsd === null ? tool.monthlyCostCop ?? 0 : 0), 0);
  return [totalUsd ? formatUsd(totalUsd) : '', totalCop ? formatCop(totalCop) : ''].filter(Boolean).join(' + ') || 'Gratis';
}

/** Respuesta "¿Cuánto cuestan las herramientas al mes?". */
export function toolsAnswer(tools: SistemaTool[]): string {
  const total = toolsTotalLabel(tools);
  const checkedDates = [...new Set(tools.map((tool) => longDate(tool.checkedOn)))];
  return (
    tools
      .map((tool) => {
        const cost = costLabel(tool);
        return `${toolName(tool.slug)}: ${cost === 'Gratis' ? 'gratis' : cost}.`;
      })
      .join(' ') +
    (checkedDates.length === 1 ? ` Precios consultados el ${checkedDates[0]} en la página de cada una.` : '') +
    ` En total, ${total.toLowerCase() === 'gratis' ? 'nada' : `${total} al mes`}, y eso se lo pagas a cada herramienta, no a mí.`
  );
}

/** Si hay garantía: un número de días mayor que cero. */
export function hasGuarantee(days: number | null | undefined): days is number {
  return days != null && days > 0;
}

/** Condición de la garantía, tal cual en la página de venta, el home y el talón. */
export function guaranteeTerms(days: number): string {
  return `Si no te sirve, escríbeme en los ${days} días siguientes a la compra y dime qué no te sirvió. Te devuelvo la plata; la devolución la hago yo a mano.`;
}

/** Respuesta "¿Cómo funciona la garantía?". */
export function guaranteeAnswer(days: number): string {
  const terms = guaranteeTerms(days);
  return `Tienes ${days} días: ${terms.charAt(0).toLowerCase()}${terms.slice(1)}`;
}

/**
 * Dónde se lee el texto: en la página del producto ("aquí", "esta página") o fuera de ella,
 * donde hay que nombrar la página del sistema.
 */
export type CopyPlace = 'producto' | 'fuera';

const here = (place: CopyPlace) => (place === 'producto' ? 'aquí' : 'en la página del sistema');

export interface PresaleState {
  /** Fecha de los videos ya en formato largo, o vacío si no hay fecha. */
  dueDate: string;
  onSale: boolean;
  place: CopyPlace;
}

/**
 * `offers.availability` del JSON-LD: con preventa abierta, PreOrder; cerrada (sin fecha o vencida),
 * OutOfStock, porque hoy no se puede comprar; sin preventa y a la venta, InStock.
 */
export function offerAvailability({ presale, onSale }: { presale: boolean; onSale: boolean }): string {
  if (!onSale) return 'https://schema.org/OutOfStock';
  return presale ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock';
}

/** Respuesta "¿Cuándo llegan los videos?". */
export function videosAnswer({ dueDate, onSale, place }: PresaleState): string {
  if (!dueDate) {
    return `Todavía no hay fecha. Sin fecha no cobro: la compra abre cuando fije el día en que entrego los videos, y esa fecha queda escrita en ${place === 'producto' ? 'esta página' : 'la página del sistema'}.`;
  }
  return onSale
    ? `Los videos llegan antes del ${dueDate}. Al pagar recibes la guía y las plantillas, y te aviso por correo cuando estén los videos. Si no llegan para esa fecha, te devuelvo la plata.`
    : `La fecha de esta preventa (${dueDate}) ya pasó. No estoy cobrando hasta fijar una nueva y escribirla ${here(place)}.`;
}

/** Línea corta de la preventa (el bloque de precio y el talón del home). */
export function presaleTerms({ dueDate, onSale, place }: PresaleState): string {
  if (!dueDate) {
    return `Todavía no fijé la fecha de los videos. Sin fecha no cobro: la compra abre cuando la fecha quede escrita ${here(place)}.`;
  }
  return onSale
    ? `Los videos llegan antes del ${dueDate}. Al pagar recibes la guía y las plantillas; los videos después. Si no llegan para esa fecha, te devuelvo la plata.`
    : `La fecha de esta preventa (${dueDate}) ya pasó. No cobro hasta fijar una nueva.`;
}

export const FOREIGN_QUESTION = '¿Puedo pagar desde fuera de Colombia?';

/**
 * Respuesta de pago desde fuera según lo confirmado con Wompi. `linkLabel` dice qué enlace va a la
 * lista de espera (null: no hace falta enlace).
 */
export function foreignAnswer(acceptsForeignCards: boolean | null): { q: string; a: string; linkLabel: string | null } {
  if (acceptsForeignCards === true) {
    return { q: FOREIGN_QUESTION, a: 'Sí. El cobro sale en pesos colombianos y tu banco lo convierte a tu moneda.', linkLabel: null };
  }
  if (acceptsForeignCards === false) {
    return {
      q: FOREIGN_QUESTION,
      a: 'Por ahora no; anótate con tu país. Así sé cuánta gente de fuera lo quiere y si vale la pena abrir otro medio de pago.',
      linkLabel: 'Anotarme con mi país',
    };
  }
  return {
    q: FOREIGN_QUESTION,
    a: 'Lo estoy confirmando con Wompi; escríbeme antes de pagar. Si tu tarjeta es de otro país, mándame la pregunta y te digo si pasa.',
    linkLabel: 'Pregúntame aquí',
  };
}

/** Enlace para preguntar o anotarse desde las FAQ: abre la lista con la opción preseleccionada. */
export const QUESTION_HREF = '/?quiero=pregunta-sistema#contacto';
