import { getSecret } from 'astro:env/server';
import { Redis } from '@upstash/redis';

const TOKEN = /^[a-f0-9]{64}$/;
const EMAIL_HASH = /^[a-f0-9]{64}$/;
const DOWNLOAD_TTL_SECONDS = 24 * 60 * 60;
const DOWNLOAD_USES = 5;

const STORE_ENVIRONMENT: 'test' | 'production' =
  getSecret('WOMPI_ENVIRONMENT') === 'production' ? 'production' : 'test';

export interface LeadRecord {
  version: 1;
  email: string;
  emailHash: string;
  source: 'prompts-gratis';
  createdAt: string;
  updatedAt: string;
}

interface DownloadGrant {
  emailHash: string;
  uses: number;
}

function env(name: keyof ImportMetaEnv): string {
  return String(getSecret(String(name)) || '').trim();
}

function storePrefix(): string {
  return `oa:lead:${STORE_ENVIRONMENT}`;
}

let client: Redis | null = null;

function redis(): Redis {
  if (client) return client;
  const url = env('UPSTASH_REDIS_REST_URL');
  const token = env('UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) throw new Error('LEAD_STORE_NOT_CONFIGURED');
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

function asLead(value: unknown): LeadRecord | null {
  if (!value || typeof value !== 'object') return null;
  const lead = value as LeadRecord;
  if (lead.version !== 1 || lead.source !== 'prompts-gratis' || !EMAIL_HASH.test(lead.emailHash)) return null;
  if (typeof lead.email !== 'string' || !lead.email.includes('@')) return null;
  return lead;
}

export async function consumeLeadRateLimit(ip: string): Promise<boolean> {
  const key = `${storePrefix()}:rl:${ip.slice(0, 80) || 'unknown'}`;
  const hits = await redis().incr(key);
  if (hits === 1) await redis().expire(key, 600);
  return hits <= 5;
}

export async function saveLeadAndGrant(email: string): Promise<string> {
  const emailHash = await sha256(email);
  const now = new Date().toISOString();
  const store = redis();
  const existing = asLead(await store.get(`${storePrefix()}:email:${emailHash}`));
  const record: LeadRecord = {
    version: 1,
    email,
    emailHash,
    source: 'prompts-gratis',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  await store.set(`${storePrefix()}:email:${emailHash}`, record);
  if (!existing) await store.lpush(`${storePrefix()}:ids`, emailHash);

  const token = randomHex(32);
  const grant: DownloadGrant = { emailHash, uses: 0 };
  await store.set(`${storePrefix()}:dl:${await sha256(token)}`, grant, { ex: DOWNLOAD_TTL_SECONDS });
  return token;
}

export async function consumeLeadDownload(token: string): Promise<boolean> {
  if (!TOKEN.test(token)) return false;
  const store = redis();
  const key = `${storePrefix()}:dl:${await sha256(token)}`;
  const grant = (await store.get<DownloadGrant>(key)) || null;
  if (!grant || typeof grant.uses !== 'number' || !EMAIL_HASH.test(grant.emailHash)) return false;
  if (grant.uses >= DOWNLOAD_USES) return false;
  const ttl = await store.ttl(key);
  grant.uses += 1;
  await store.set(key, grant, { ex: ttl > 30 ? ttl : 30 });
  return true;
}
