import categoriesData from '../data/tool-categories.json';
import plansData from '../data/directory-plans.json';
import toolsData from '../data/tools.json';

export const DIRECTORY_REFERENCE_PREFIX = 'oa-directorio';

export const DIRECTORY_PRICE_BASIS = plansData.basis;

const RESERVED_SLUGS = new Set(['destacar', 'categoria', 'pedido', 'api']);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIRECTORY_REFERENCE =
  /^oa-directorio-(basico|destacado|patrocinio)-q(\d{7,12})-d(\d{8})-t(\d{13})-[a-f0-9]{8}$/;

export interface ToolCategory {
  slug: string;
  label: string;
}

export interface Tool {
  slug: string;
  nombre: string;
  url: string;
  categoria: string;
  desc: string;
  featured: boolean;
  featuredUntil: string | null;
  sponsor: boolean;
  sponsorUntil: string | null;
  added: string;
}

export interface DirectoryPlan {
  id: DirectoryPlanId;
  name: string;
  priceUsd: number;
  amountCop: number;
  periodDays: number;
  cadence: string;
  summary: string;
}

export type DirectoryPlanId = 'basico' | 'destacado' | 'patrocinio';

function assertCategory(value: unknown): ToolCategory {
  if (!value || typeof value !== 'object') throw new Error('DIRECTORY_CATEGORY_INVALID');
  const category = value as ToolCategory;
  if (!SLUG.test(category.slug) || typeof category.label !== 'string' || category.label.trim().length < 2) {
    throw new Error('DIRECTORY_CATEGORY_INVALID');
  }
  return { slug: category.slug, label: category.label.trim() };
}

function assertTool(value: unknown, categories: Set<string>, slugs: Set<string>): Tool {
  if (!value || typeof value !== 'object') throw new Error('DIRECTORY_TOOL_INVALID');
  const tool = value as Tool;
  if (!SLUG.test(String(tool.slug)) || tool.slug.length > 60 || RESERVED_SLUGS.has(tool.slug)) {
    throw new Error(`DIRECTORY_TOOL_SLUG_INVALID:${String(tool.slug)}`);
  }
  if (slugs.has(tool.slug)) throw new Error(`DIRECTORY_TOOL_SLUG_DUPLICATE:${tool.slug}`);
  slugs.add(tool.slug);

  let url: URL;
  try {
    url = new URL(tool.url);
  } catch {
    throw new Error(`DIRECTORY_TOOL_URL_INVALID:${tool.slug}`);
  }
  if (url.protocol !== 'https:' || !url.hostname.includes('.')) {
    throw new Error(`DIRECTORY_TOOL_URL_INVALID:${tool.slug}`);
  }
  if (!categories.has(tool.categoria)) throw new Error(`DIRECTORY_TOOL_CATEGORY_INVALID:${tool.slug}`);
  if (typeof tool.nombre !== 'string' || tool.nombre.trim().length < 2) {
    throw new Error(`DIRECTORY_TOOL_NAME_INVALID:${tool.slug}`);
  }
  if (typeof tool.desc !== 'string' || tool.desc.trim().length < 10) {
    throw new Error(`DIRECTORY_TOOL_DESC_INVALID:${tool.slug}`);
  }
  if (typeof tool.featured !== 'boolean' || typeof tool.sponsor !== 'boolean') {
    throw new Error(`DIRECTORY_TOOL_FLAG_INVALID:${tool.slug}`);
  }
  if (tool.featuredUntil !== null && (typeof tool.featuredUntil !== 'string' || !DATE.test(tool.featuredUntil))) {
    throw new Error(`DIRECTORY_TOOL_FEATURED_UNTIL_INVALID:${tool.slug}`);
  }
  if (tool.sponsorUntil !== null && (typeof tool.sponsorUntil !== 'string' || !DATE.test(tool.sponsorUntil))) {
    throw new Error(`DIRECTORY_TOOL_SPONSOR_UNTIL_INVALID:${tool.slug}`);
  }
  if (typeof tool.added !== 'string' || !DATE.test(tool.added)) {
    throw new Error(`DIRECTORY_TOOL_ADDED_INVALID:${tool.slug}`);
  }

  return {
    slug: tool.slug,
    nombre: tool.nombre.trim(),
    url: tool.url,
    categoria: tool.categoria,
    desc: tool.desc.trim(),
    featured: tool.featured,
    featuredUntil: tool.featuredUntil,
    sponsor: tool.sponsor,
    sponsorUntil: tool.sponsorUntil,
    added: tool.added,
  };
}

const categories = (categoriesData as unknown[]).map(assertCategory);
const categorySlugs = new Set(categories.map((category) => category.slug));
const seenSlugs = new Set<string>();
const tools = (toolsData as unknown[]).map((tool) => assertTool(tool, categorySlugs, seenSlugs));

const plans = plansData.plans.map((plan) => {
  if (plan.id !== 'basico' && plan.id !== 'destacado' && plan.id !== 'patrocinio') {
    throw new Error('DIRECTORY_PLAN_INVALID');
  }
  if (!Number.isSafeInteger(plan.amountCop) || plan.amountCop <= 0) throw new Error('DIRECTORY_PLAN_AMOUNT_INVALID');
  return plan as DirectoryPlan;
});

const planMap = Object.fromEntries(plans.map((plan) => [plan.id, plan])) as Record<DirectoryPlanId, DirectoryPlan>;

export function bogotaToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function isLiveFeatured(tool: Tool, today = bogotaToday()): boolean {
  if (!tool.featured) return false;
  if (!tool.featuredUntil) return true;
  return tool.featuredUntil >= today;
}

export function isLiveSponsor(tool: Tool, today = bogotaToday()): boolean {
  if (!tool.sponsor) return false;
  if (!tool.sponsorUntil) return true;
  return tool.sponsorUntil >= today;
}

function compareTools(left: Tool, right: Tool, today: string): number {
  const rank = (tool: Tool) => (isLiveSponsor(tool, today) ? 0 : isLiveFeatured(tool, today) ? 1 : 2);
  const difference = rank(left) - rank(right);
  if (difference !== 0) return difference;
  return left.nombre.localeCompare(right.nombre, 'es');
}

export function getCategories(): ToolCategory[] {
  return categories;
}

export function getCategory(slug: string): ToolCategory | undefined {
  return categories.find((category) => category.slug === slug);
}

export function categoryLabel(slug: string): string {
  return getCategory(slug)?.label || slug;
}

export function getTools(today = bogotaToday()): Tool[] {
  return [...tools].sort((left, right) => compareTools(left, right, today));
}

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(slug: string, today = bogotaToday()): Tool[] {
  return getTools(today).filter((tool) => tool.categoria === slug);
}

export function getDirectoryPlans(): DirectoryPlan[] {
  return plans;
}

export function getDirectoryPlan(id: DirectoryPlanId): DirectoryPlan {
  return planMap[id];
}

export function isDirectoryPlan(value: unknown): value is DirectoryPlanId {
  return value === 'basico' || value === 'destacado' || value === 'patrocinio';
}

export function planAmountInCents(plan: DirectoryPlanId): number {
  return planMap[plan].amountCop * 100;
}

export function createDirectoryReference(plan: DirectoryPlanId): string {
  const amountInCents = planAmountInCents(plan);
  const date = bogotaToday().replace(/-/g, '');
  const reference = `${DIRECTORY_REFERENCE_PREFIX}-${plan}-q${amountInCents}-d${date}-t${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  // El prefijo oa-directorio no puede colarse en el matcher de oa-consultoria-2h.
  if (reference.startsWith('oa-consultoria-2h') || !parseDirectoryReference(reference)) {
    throw new Error('DIRECTORY_REFERENCE_INVALID');
  }
  return reference;
}

export function parseDirectoryReference(
  reference: unknown,
): { plan: DirectoryPlanId; amountInCents: number } | null {
  if (typeof reference !== 'string' || reference.length > 140 || reference.startsWith('oa-consultoria-2h')) {
    return null;
  }
  const match = reference.match(DIRECTORY_REFERENCE);
  if (!match || !isDirectoryPlan(match[1])) return null;
  const amountInCents = Number(match[2]);
  if (!Number.isSafeInteger(amountInCents) || amountInCents !== planAmountInCents(match[1])) return null;
  return { plan: match[1], amountInCents };
}

export function addCalendarDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

export function formatDirectoryDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function directoryPath(slug = ''): string {
  return slug ? `/herramientas-ia/${slug}` : '/herramientas-ia';
}

export function categoryPath(slug: string): string {
  return `/herramientas-ia/categoria/${slug}`;
}
