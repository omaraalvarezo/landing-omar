import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { getTool } from './lib/directory';

const isoDate = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date()]).transform((value) => {
  if (typeof value === 'string') return value;
  const month = String(value.getUTCMonth() + 1).padStart(2, '0');
  const day = String(value.getUTCDate()).padStart(2, '0');
  return `${value.getUTCFullYear()}-${month}-${day}`;
});

const toolSlug = z.string().refine((slug) => Boolean(getTool(slug)), { message: 'La herramienta no está en el directorio' });
const httpsUrl = z.string().url().refine((value) => value.startsWith('https://'), { message: 'La fuente tiene que ser https' });

const faq = z.object({
  q: z.string().min(12),
  a: z.string().min(40),
});

const base = {
  title: z.string().min(8).max(120),
  description: z.string().min(80).max(320),
  published: isoDate,
  updated: isoDate.optional(),
  draft: z.boolean().optional(),
};

const promptItem = z.object({
  title: z.string().min(4),
  text: z.string().min(40),
});

const toolGuide = z.object({
  tool: toolSlug,
  steps: z.array(z.string().min(20)).min(3).max(5),
});

const para = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/para' }),
  schema: z
    .object({
      ...base,
      priority: z.number().int().min(0).max(9).optional(),
      tools: z.array(toolSlug).min(3).max(6),
      steps: z.array(z.string().min(20)).min(3).max(6).optional(),
      guides: z.array(toolGuide).min(4).max(6).optional(),
      prompt: z.string().min(40).optional(),
      prompts: z.array(promptItem).min(3).max(5).optional(),
      faqs: z.array(faq).min(2).max(6),
      related: z.array(z.string()).default([]),
    })
    .superRefine((value, ctx) => {
      if (!value.steps?.length && !value.guides?.length) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hacen falta pasos o una guía por herramienta' });
      }
      if (!value.prompt && !value.prompts?.length) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hace falta al menos un prompt' });
      }
      if (value.guides) {
        const guideTools = value.guides.map((guide) => guide.tool);
        if (new Set(guideTools).size !== guideTools.length) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hay una herramienta repetida en las guías' });
        }
        if (guideTools.join() !== value.tools.join()) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'tools y guides tienen que ir en el mismo orden' });
        }
      }
    }),
});

const noticias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noticias' }),
  schema: z.object({
    ...base,
    edition: isoDate,
    sourceDate: isoDate,
    sourceName: z.string().min(2),
    sourceUrl: httpsUrl,
    meaning: z.string().min(40),
    tools: z.array(toolSlug).min(1).max(5),
    para: z.array(z.string()).default([]),
  }),
});

const prompts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/prompts' }),
  schema: z
    .object({
      ...base,
      roles: z.array(
        z.object({
          id: z.enum(['ventas', 'atencion', 'contenido', 'finanzas']),
          label: z.string().min(3),
          prompts: z.array(z.object({ title: z.string().min(4), text: z.string().min(40) })).min(1).max(8),
        }),
      ).length(4),
    })
    .superRefine((value, ctx) => {
      const ids = value.roles.map((role) => role.id);
      for (const id of ['ventas', 'atencion', 'contenido', 'finanzas']) {
        if (!ids.includes(id as 'ventas')) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Falta el rol ${id}` });
        }
      }
    }),
});

const semana = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/semana' }),
  schema: z
    .object({
      ...base,
      tool: toolSlug,
      steps: z.array(z.string().min(20)).length(5),
      verdict: z.string().min(40),
      alternatives: z.array(toolSlug).min(1).max(4),
      sponsorName: z.string().default(''),
      sponsorUrl: z.string().default(''),
      sponsorNote: z.string().default(''),
    })
    .superRefine((value, ctx) => {
      const filled = [value.sponsorName, value.sponsorUrl, value.sponsorNote].some((item) => item.trim());
      if (!filled) return;
      if (value.sponsorName.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El patrocinador necesita nombre', path: ['sponsorName'] });
      }
      if (!value.sponsorUrl.startsWith('https://')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El patrocinador necesita una URL https', path: ['sponsorUrl'] });
      }
    }),
});

const row = z.object({
  label: z.string().min(2),
  left: z.string().min(8),
  right: z.string().min(8),
});

const comparar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comparar' }),
  schema: z.object({
    ...base,
    checked: isoDate,
    left: toolSlug,
    right: toolSlug,
    rows: z.array(row).min(3).max(8),
    recommendation: z.string().min(40),
  }),
});

const alternativas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/alternativas' }),
  schema: z.object({
    ...base,
    checked: isoDate,
    insteadOf: toolSlug,
    alternatives: z.array(toolSlug).min(2).max(6),
  }),
});

const casos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/casos' }),
  schema: z.object({
    ...base,
    sourceDate: isoDate,
    sourceName: z.string().min(2),
    sourceUrl: httpsUrl,
    tools: z.array(toolSlug).min(1).max(5),
    para: z.array(z.string()).default([]),
    resultNote: z.string().min(40),
  }),
});

const tendencias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tendencias' }),
  schema: z.object({
    ...base,
    month: z.string().regex(/^\d{4}-\d{2}$/),
    tools: z.array(toolSlug).min(1).max(8),
    para: z.array(z.string()).default([]),
    themes: z
      .array(
        z.object({
          title: z.string().min(8),
          detail: z.string().min(40),
          sourceName: z.string().min(2),
          sourceUrl: httpsUrl,
        }),
      )
      .min(3)
      .max(8),
  }),
});

export const collections = {
  para,
  noticias,
  prompts,
  semana,
  comparar,
  alternativas,
  casos,
  tendencias,
};
