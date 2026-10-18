import data from '../data/recibos.json';

export type Negocio = 'enzo' | 'arkhe' | 'grupo';

/**
 * Cifra operativa con respaldo en un archivo de los repos del grupo.
 * `source` y `method` son internos: nunca se imprimen en el sitio.
 * `kind: 'exacto'` marca una regla de diseño exacta, que no lleva "aprox.".
 */
export type Recibo = {
  id: string;
  value: string;
  label: string;
  origin: string;
  negocio: Negocio;
  source: string;
  method: string;
  date: string;
  kind?: 'exacto';
};

/** Lo único de un recibo que puede llegar a una página. */
export type PublicRecibo = Pick<Recibo, 'value' | 'label' | 'origin'>;

export const recibos = data as Recibo[];

export function publicRecibo(id: string): PublicRecibo {
  const recibo = recibos.find((item) => item.id === id);
  if (!recibo) throw new Error(`Recibo desconocido: ${id}`);
  return { value: recibo.value, label: recibo.label, origin: recibo.origin };
}
