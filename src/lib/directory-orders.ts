import { getSecret } from 'astro:env/server';
import type { DirectoryPlanId } from './directory';
import { Redis } from '@upstash/redis';

export type DirectoryPaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'VOIDED'
  | 'ERROR';

export interface DirectoryOrder {
  version: 1;
  id: string;
  environment: 'test' | 'production';
  reference: string;
  plan: DirectoryPlanId;
  amountInCents: number;
  currency: 'COP';
  toolName: string;
  toolUrl: string;
  email: string;
  description: string;
  category: string;
  accessTokenHash: string;
  accessExpiresAt: string;
  status: DirectoryPaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
  statusMessage?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  notifiedAt?: string;
  notifyStatus?: 'sent' | 'unconfigured' | 'failed';
  approvedTransactionIds?: string[];
  voidedTransactionIds?: string[];
  alertedTransactionIds?: string[];
}

const ACCESS_TOKEN = /^[a-f0-9]{64}$/;
const ORDER_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;

const STORE_ENVIRONMENT: 'test' | 'production' =
  getSecret('WOMPI_ENVIRONMENT') === 'production' ? 'production' : 'test';

function env(name: keyof ImportMetaEnv): string {
  return String(getSecret(String(name)) || '').trim();
}

function storePrefix(): string {
  return `oa:dir:${STORE_ENVIRONMENT}`;
}

let client: Redis | null | undefined;

function redis(): Redis {
  if (client) return client;
  const url = env('UPSTASH_REDIS_REST_URL');
  const token = env('UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) throw new Error('DIRECTORY_STORE_NOT_CONFIGURED');
  client = new Redis({ url, token });
  return client;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function randomHex(bytesLength: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(bytesLength));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function asOrder(value: unknown): DirectoryOrder | null {
  if (!value) return null;
  const parsed = typeof value === 'string' ? (JSON.parse(value) as unknown) : value;
  if (!parsed || typeof parsed !== 'object') return null;
  const order = parsed as DirectoryOrder;
  if (order.version !== 1 || !isDirectoryOrderId(order.id) || order.environment !== STORE_ENVIRONMENT) {
    return null;
  }
  return order;
}

export function createDirectoryAccessToken(): string {
  return randomHex(32);
}

export function createDirectoryOrderId(): string {
  return crypto.randomUUID();
}

export function directoryAccessCookieName(orderId: string): string {
  return `__oa_directorio_${orderId}`;
}

export function isDirectoryAccessToken(value: unknown): value is string {
  return typeof value === 'string' && ACCESS_TOKEN.test(value);
}

export function isDirectoryOrderId(value: unknown): value is string {
  return typeof value === 'string' && ORDER_ID.test(value);
}

export async function consumeDirectoryRateLimit(ip: string): Promise<boolean> {
  const key = `${storePrefix()}:rl:${ip.slice(0, 80) || 'unknown'}`;
  const hits = await redis().incr(key);
  if (hits === 1) await redis().expire(key, 600);
  return hits <= 8;
}

export async function createDirectoryOrder(args: {
  id: string;
  reference: string;
  plan: DirectoryPlanId;
  amountInCents: number;
  toolName: string;
  toolUrl: string;
  email: string;
  description: string;
  category: string;
  accessToken: string;
}): Promise<DirectoryOrder> {
  if (!isDirectoryOrderId(args.id)) throw new Error('DIRECTORY_ORDER_ID_INVALID');
  if (!isDirectoryAccessToken(args.accessToken)) throw new Error('DIRECTORY_ACCESS_TOKEN_INVALID');
  if (!Number.isSafeInteger(args.amountInCents) || args.amountInCents <= 0) {
    throw new Error('DIRECTORY_ORDER_AMOUNT_INVALID');
  }

  const now = new Date().toISOString();
  const order: DirectoryOrder = {
    version: 1,
    id: args.id,
    environment: STORE_ENVIRONMENT,
    reference: args.reference,
    plan: args.plan,
    amountInCents: args.amountInCents,
    currency: 'COP',
    toolName: args.toolName,
    toolUrl: args.toolUrl,
    email: args.email,
    description: args.description,
    category: args.category,
    accessTokenHash: await sha256(args.accessToken),
    accessExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1_000).toISOString(),
    status: 'CREATED',
    createdAt: now,
    updatedAt: now,
  };

  const store = redis();
  await store.set(`${storePrefix()}:order:${order.id}`, order);
  await store.set(`${storePrefix()}:ref:${order.reference}`, order.id);
  await store.lpush(`${storePrefix()}:ids`, order.id);
  return order;
}

export async function getDirectoryOrderById(id: string): Promise<DirectoryOrder | null> {
  if (!isDirectoryOrderId(id)) return null;
  return asOrder(await redis().get(`${storePrefix()}:order:${id}`));
}

export async function getDirectoryOrderByReference(reference: string): Promise<DirectoryOrder | null> {
  if (!reference || reference.length > 140) return null;
  const id = await redis().get<string>(`${storePrefix()}:ref:${reference}`);
  if (typeof id !== 'string') return null;
  return getDirectoryOrderById(id);
}

export async function saveDirectoryOrder(order: DirectoryOrder): Promise<void> {
  if (!isDirectoryOrderId(order.id) || order.environment !== STORE_ENVIRONMENT) {
    throw new Error('DIRECTORY_ORDER_INVALID');
  }
  await redis().set(`${storePrefix()}:order:${order.id}`, order);
}

export async function hasDirectoryOrderAccess(order: DirectoryOrder, accessToken: string): Promise<boolean> {
  if (!isDirectoryAccessToken(accessToken) || Date.parse(order.accessExpiresAt) <= Date.now()) return false;
  return order.accessTokenHash === (await sha256(accessToken));
}

export async function claimDirectoryMailLock(key: string): Promise<boolean> {
  const result = await redis().set(`${storePrefix()}:mail:${key}`, '1', { nx: true, ex: 45 });
  return result === 'OK';
}

export async function releaseDirectoryMailLock(key: string): Promise<void> {
  await redis().del(`${storePrefix()}:mail:${key}`);
}
