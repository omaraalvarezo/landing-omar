import { Redis } from '@upstash/redis';

export type KitPaymentStatus = 'CREATED' | 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';

export interface KitOrder {
  version: 1;
  id: string;
  environment: 'test' | 'production';
  reference: string;
  product: 'talleres';
  amountInCents: number;
  currency: 'COP';
  buyerName: string;
  email: string;
  business: string;
  accessTokenHash: string;
  accessExpiresAt: string;
  status: KitPaymentStatus;
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
  downloadToken?: string;
  downloadExpiresAt?: string;
}

const ACCESS_TOKEN = /^[a-f0-9]{64}$/;
const ORDER_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;

const STORE_ENVIRONMENT: 'test' | 'production' =
  import.meta.env.WOMPI_ENVIRONMENT === 'production' ? 'production' : 'test';

function env(name: keyof ImportMetaEnv): string {
  return String(import.meta.env[name] || '').trim();
}

function storePrefix(): string {
  return `oa:kit:${STORE_ENVIRONMENT}`;
}

let client: Redis | null = null;

function redis(): Redis {
  if (client) return client;
  const url = env('UPSTASH_REDIS_REST_URL');
  const token = env('UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) throw new Error('KIT_STORE_NOT_CONFIGURED');
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

function asOrder(value: unknown): KitOrder | null {
  if (!value) return null;
  const parsed = typeof value === 'string' ? (JSON.parse(value) as unknown) : value;
  if (!parsed || typeof parsed !== 'object') return null;
  const order = parsed as KitOrder;
  if (order.version !== 1 || order.product !== 'talleres' || !isKitOrderId(order.id) || order.environment !== STORE_ENVIRONMENT) {
    return null;
  }
  return order;
}

export function createKitAccessToken(): string {
  return randomHex(32);
}

export function createKitDownloadToken(): string {
  return randomHex(32);
}

export function createKitOrderId(): string {
  return crypto.randomUUID();
}

export function kitAccessCookieName(orderId: string): string {
  return `__oa_kit_${orderId}`;
}

export function isKitAccessToken(value: unknown): value is string {
  return typeof value === 'string' && ACCESS_TOKEN.test(value);
}

export function isKitDownloadToken(value: unknown): value is string {
  return typeof value === 'string' && ACCESS_TOKEN.test(value);
}

export function isKitOrderId(value: unknown): value is string {
  return typeof value === 'string' && ORDER_ID.test(value);
}

export function kitTokensMatch(left: string, right: string): boolean {
  if (!isKitDownloadToken(left) || !isKitDownloadToken(right)) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return diff === 0;
}

export async function consumeKitRateLimit(ip: string): Promise<boolean> {
  const key = `${storePrefix()}:rl:${ip.slice(0, 80) || 'unknown'}`;
  const hits = await redis().incr(key);
  if (hits === 1) await redis().expire(key, 600);
  return hits <= 8;
}

export async function createKitOrder(args: {
  id: string;
  reference: string;
  amountInCents: number;
  buyerName: string;
  email: string;
  business: string;
  accessToken: string;
}): Promise<KitOrder> {
  if (!isKitOrderId(args.id)) throw new Error('KIT_ORDER_ID_INVALID');
  if (!isKitAccessToken(args.accessToken)) throw new Error('KIT_ACCESS_TOKEN_INVALID');
  if (!Number.isSafeInteger(args.amountInCents) || args.amountInCents <= 0) throw new Error('KIT_ORDER_AMOUNT_INVALID');

  const now = new Date().toISOString();
  const order: KitOrder = {
    version: 1,
    id: args.id,
    environment: STORE_ENVIRONMENT,
    reference: args.reference,
    product: 'talleres',
    amountInCents: args.amountInCents,
    currency: 'COP',
    buyerName: args.buyerName,
    email: args.email,
    business: args.business,
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

export async function getKitOrderById(id: string): Promise<KitOrder | null> {
  if (!isKitOrderId(id)) return null;
  return asOrder(await redis().get(`${storePrefix()}:order:${id}`));
}

export async function getKitOrderByReference(reference: string): Promise<KitOrder | null> {
  if (!reference || reference.length > 140) return null;
  const id = await redis().get<string>(`${storePrefix()}:ref:${reference}`);
  if (typeof id !== 'string') return null;
  return getKitOrderById(id);
}

export async function saveKitOrder(order: KitOrder): Promise<void> {
  if (!isKitOrderId(order.id) || order.environment !== STORE_ENVIRONMENT || order.product !== 'talleres') {
    throw new Error('KIT_ORDER_INVALID');
  }
  await redis().set(`${storePrefix()}:order:${order.id}`, order);
}

export async function hasKitOrderAccess(order: KitOrder, accessToken: string): Promise<boolean> {
  if (!isKitAccessToken(accessToken) || Date.parse(order.accessExpiresAt) <= Date.now()) return false;
  return order.accessTokenHash === (await sha256(accessToken));
}

export async function claimKitMailLock(key: string): Promise<boolean> {
  const result = await redis().set(`${storePrefix()}:mail:${key}`, '1', { nx: true, ex: 45 });
  return result === 'OK';
}

export async function releaseKitMailLock(key: string): Promise<void> {
  await redis().del(`${storePrefix()}:mail:${key}`);
}
