// Recursos descargables expuestos en /recursos.
// Data declarativa en JSON (editable a mano o vía scripts CLI: npm run resource:add, resource:toggle, area:toggle).
// Los archivos físicos viven en /public/resources/{fileName}.

import areasData from '../data/areas.json';
import resourcesData from '../data/resources.json';

export type AreaSlug =
  | 'direccion'
  | 'marketing'
  | 'ventas'
  | 'operaciones'
  | 'finanzas'
  | 'producto-tech'
  | 'rrhh'
  | 'skills-claude';

export type ResourceTipo = 'prompt' | 'plantilla' | 'framework' | 'checklist' | 'skill' | 'sop';

export interface Area {
  slug: AreaSlug;
  label: string;
  description: string;
  intro: string;
  order: number;
  icon: string;
  hidden: boolean;
}

export interface Resource {
  slug: string;
  title: string;
  description: string;
  // Copy editorial extendido para la página de detalle (todo en primera persona).
  // longDescription: 1-2 párrafos. Separar párrafos con "\n\n".
  longDescription?: string;
  // Bullets concretos: para qué te sirve este recurso.
  usefulFor?: string[];
  // Bullets descriptivos: qué contiene el archivo.
  includes?: string[];
  // Bullets concretos: cómo adaptar el recurso a tu negocio.
  // Cuando existe, la card de la grilla muestra un badge "ADAPTABLE" y
  // ResourceDetail renderiza un cuarto bloque editorial.
  howToAdapt?: string[];
  area: AreaSlug;
  tipo: ResourceTipo;
  fileName: string;
  sizeBytes: number;
  updatedAt: string;
  featured?: boolean;
  hidden: boolean;
  skillName?: string;
  skillTrigger?: string;
}

export interface AreaWithCount extends Area {
  count: number;
}

const AREAS_ALL: Area[] = (areasData as Area[]).slice().sort((a, b) => a.order - b.order);
const RESOURCES_ALL: Resource[] = resourcesData as Resource[];

export const AREAS: Area[] = AREAS_ALL;
export const RESOURCES: Resource[] = RESOURCES_ALL;

// Helpers — todos filtran `hidden` por defecto

export function getVisibleAreas(): Area[] {
  return AREAS_ALL.filter((a) => !a.hidden);
}

export function getVisibleResources(): Resource[] {
  return RESOURCES_ALL.filter((r) => !r.hidden);
}

export function getResourcesByArea(slug: AreaSlug): Resource[] {
  return getVisibleResources()
    .filter((r) => r.area === slug)
    .sort((a, b) => {
      // Featured primero, luego por fecha desc
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

export function getAreasWithCounts(): AreaWithCount[] {
  return getVisibleAreas().map((a) => ({
    ...a,
    count: getResourcesByArea(a.slug).length,
  }));
}

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS_ALL.find((a) => a.slug === slug);
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return getVisibleResources().find((r) => r.slug === slug);
}

// Devuelve el recurso visible junto con su área (útil para páginas de detalle
// que necesitan ambos: breadcrumb del área + datos del recurso).
export function getResourceWithArea(
  slug: string
): { resource: Resource; area: Area } | undefined {
  const resource = getResourceBySlug(slug);
  if (!resource) return undefined;
  const area = getAreaBySlug(resource.area);
  if (!area || area.hidden) return undefined;
  return { resource, area };
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getTotalVisibleResources(): number {
  return getVisibleResources().length;
}
