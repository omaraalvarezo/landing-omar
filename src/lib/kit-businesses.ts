// Tipos de negocio del formulario del kit. Módulo sin dependencias: lo importan `products.ts` y
// `kit.ts` sin crear un ciclo entre los dos.
export const KIT_BUSINESSES = ['taller', 'detailing', 'ambos', 'otra'] as const;
export type KitBusiness = (typeof KIT_BUSINESSES)[number];

export function isKitBusiness(value: string): value is KitBusiness {
  return (KIT_BUSINESSES as readonly string[]).includes(value);
}
