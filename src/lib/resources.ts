// Recursos descargables expuestos en /recursos.
// Los archivos físicos viven en /public/resources/{fileName}.

export type ResourceCategory = 'prompt' | 'plantilla' | 'framework' | 'checklist';
export type FileType = 'md' | 'pdf' | 'json' | 'txt' | 'csv' | 'xlsx' | 'docx';

export interface Resource {
  slug: string;
  title: string;
  description: string;
  category: ResourceCategory;
  fileType: FileType;
  fileName: string;
  sizeBytes: number;
  date: string;
}

export const CATEGORIES: { value: ResourceCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'todos' },
  { value: 'prompt', label: 'prompts' },
  { value: 'plantilla', label: 'plantillas' },
  { value: 'framework', label: 'frameworks' },
  { value: 'checklist', label: 'checklists' },
];

export const RESOURCES: Resource[] = [
  {
    slug: 'prompt-bot-whatsapp-reportes',
    title: 'Prompt — bot de WhatsApp para reportes diarios',
    description:
      'El prompt completo que opera el bot de Enzo Motorsport. Llega un reporte cada 8pm con ventas, ratio insumos, márgenes y alertas operativas. Adaptable a cualquier pyme con POS.',
    category: 'prompt',
    fileType: 'md',
    fileName: 'prompt-bot-whatsapp-reportes.md',
    sizeBytes: 1419,
    date: '2026-04-27',
  },
  {
    slug: 'plantilla-pulse-financiero',
    title: 'Plantilla — Pulse financiero mensual',
    description:
      'Formato semáforo (🔴🟡🔵🟢) que uso cada mes en Enzo y Arkhē. Estructura para detectar desviaciones, justificarlas y planear el siguiente mes en 30 minutos.',
    category: 'plantilla',
    fileType: 'md',
    fileName: 'plantilla-pulse-financiero.md',
    sizeBytes: 1103,
    date: '2026-04-27',
  },
  {
    slug: 'framework-decision-log',
    title: 'Framework — Decision log para founders',
    description:
      'Cómo registrar decisiones importantes (precio, contrataciones, inversiones) sin convertirte en un esclavo de la documentación. 7 campos, 5 minutos por decisión.',
    category: 'framework',
    fileType: 'md',
    fileName: 'framework-decision-log.md',
    sizeBytes: 1848,
    date: '2026-04-27',
  },
];

export function formatSize(bytes: number): string {
  if (bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function countByCategory(): Record<ResourceCategory | 'all', number> {
  const counts: Record<string, number> = { all: RESOURCES.length };
  RESOURCES.forEach((r) => {
    counts[r.category] = (counts[r.category] ?? 0) + 1;
  });
  return counts as Record<ResourceCategory | 'all', number>;
}
