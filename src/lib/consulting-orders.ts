import { CONSULTING, expectedAmountForConsultingReference } from './consulting';
import type { ConsultingQuote } from './trm';
import type { WompiTransaction } from './wompi-consulting';

export type ConsultingEnvironment = 'test' | 'production';
export type ConsultingPaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'VOIDED'
  | 'ERROR';

export interface ConsultingIntake {
  name: string;
  email: string;
  phone: string;
  business: string;
  frameworkStage: string;
  problem: string;
}

export interface ConsultingOrder {
  version: 1;
  id: string;
  environment: ConsultingEnvironment;
  reference: string;
  amountInCents: number;
  currency: typeof CONSULTING.chargeCurrency;
  quote: ConsultingQuote;
  intake: ConsultingIntake;
  accessTokenHash: string;
  accessExpiresAt: string;
  status: ConsultingPaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
  statusMessage?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedTransactionIds?: string[];
  voidedTransactionIds?: string[];
}

const ACCESS_TOKEN = /^[a-f0-9]{64}$/;
const ORDER_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const STORE_ENVIRONMENT: ConsultingEnvironment =
  import.meta.env.WOMPI_ENVIRONMENT === 'production' ? 'production' : 'test';

function env(name: keyof ImportMetaEnv): string {
  return String(import.meta.env[name] || '').trim();
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function randomHex(bytesLength: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(bytesLength));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function callStore<T>(payload: Record<string, unknown>): Promise<T> {
  const url = env('CONSULTING_ORDER_STORE_URL') || 'https://adjudika.co/api/internal/consulting-orders';
  const secret = env('WOMPI_RELAY_SECRET');
  if (!secret || secret.length < 32) throw new Error('CONSULTING_ORDER_STORE_NOT_CONFIGURED');

  const body = JSON.stringify({ ...payload, environment: STORE_ENVIRONMENT });
  const timestamp = String(Date.now());
  const signature = await hmacSha256(secret, `${timestamp}.${body}`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-OA-Relay-Timestamp': timestamp,
      'X-OA-Relay-Signature': signature,
      'User-Agent': 'Omar-Consulting-Store/1.0',
    },
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });

  const result = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(result.error || `CONSULTING_ORDER_STORE_${response.status}`);
  return result;
}

export function createConsultingAccessToken(): string {
  return randomHex(32);
}

export function createConsultingOrderId(): string {
  return crypto.randomUUID();
}

export function consultingAccessCookieName(orderId: string): string {
  return `__oa_consulting_${orderId}`;
}

export function isConsultingAccessToken(value: unknown): value is string {
  return typeof value === 'string' && ACCESS_TOKEN.test(value);
}

export function isConsultingOrderId(value: unknown): value is string {
  return typeof value === 'string' && ORDER_ID.test(value);
}

export async function createConsultingOrder(args: {
  id: string;
  reference: string;
  quote: ConsultingQuote;
  intake: ConsultingIntake;
  accessToken: string;
}): Promise<ConsultingOrder> {
  if (!isConsultingOrderId(args.id)) throw new Error('CONSULTING_ORDER_ID_INVALID');
  if (!isConsultingAccessToken(args.accessToken)) throw new Error('CONSULTING_ACCESS_TOKEN_INVALID');

  const expectedAmount = expectedAmountForConsultingReference(args.reference);
  if (
    expectedAmount === null ||
    expectedAmount !== args.quote.amountInCents ||
    args.quote.amountInCents <= 0
  ) {
    throw new Error('CONSULTING_ORDER_AMOUNT_INVALID');
  }

  const now = new Date().toISOString();
  const retentionDays = STORE_ENVIRONMENT === 'production' ? 180 : 1;
  const order: ConsultingOrder = {
    version: 1,
    id: args.id,
    environment: STORE_ENVIRONMENT,
    reference: args.reference,
    amountInCents: args.quote.amountInCents,
    currency: CONSULTING.chargeCurrency,
    quote: args.quote,
    intake: args.intake,
    accessTokenHash: await sha256(args.accessToken),
    accessExpiresAt: new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1_000).toISOString(),
    status: 'CREATED',
    createdAt: now,
    updatedAt: now,
  };

  const result = await callStore<{ order: ConsultingOrder }>({ operation: 'create', order });
  return result.order;
}

export async function getConsultingOrder(reference: string): Promise<ConsultingOrder | null> {
  const result = await callStore<{ order: ConsultingOrder | null }>({
    operation: 'getByReference',
    reference,
  });
  return result.order;
}

export async function getConsultingOrderById(id: string): Promise<ConsultingOrder | null> {
  if (!isConsultingOrderId(id)) return null;
  const result = await callStore<{ order: ConsultingOrder | null }>({ operation: 'getById', id });
  return result.order;
}

export async function hasConsultingOrderAccess(
  order: ConsultingOrder,
  accessToken: string,
): Promise<boolean> {
  if (!isConsultingAccessToken(accessToken) || Date.parse(order.accessExpiresAt) <= Date.now()) {
    return false;
  }
  return order.accessTokenHash === (await sha256(accessToken));
}

type RecordedConsultingTransaction = {
  order: ConsultingOrder;
  newlyApproved: boolean;
  doubleApproval: boolean;
};

async function recordConsultingTransactionWithOperation(
  transaction: WompiTransaction,
  operation: 'record' | 'recordAndClaim',
): Promise<RecordedConsultingTransaction | null> {
  const expectedAmount = expectedAmountForConsultingReference(transaction.reference);
  if (expectedAmount === null) return null;
  if (
    transaction.amount_in_cents !== expectedAmount ||
    transaction.currency !== CONSULTING.chargeCurrency
  ) {
    throw new Error('WOMPI_TRANSACTION_MISMATCH');
  }

  const result = await callStore<{
    recorded: RecordedConsultingTransaction | null;
  }>({
    operation,
    reference: transaction.reference,
    transaction: {
      transactionId: transaction.id,
      status: transaction.status,
      amountInCents: transaction.amount_in_cents,
      currency: transaction.currency,
      paymentMethod: String(transaction.payment_method_type || '').slice(0, 60),
      statusMessage: String(transaction.status_message || '').slice(0, 240),
      receivedAt: new Date().toISOString(),
    },
  });
  return result.recorded;
}

export async function recordConsultingTransaction(
  transaction: WompiTransaction,
): Promise<RecordedConsultingTransaction | null> {
  return recordConsultingTransactionWithOperation(transaction, 'record');
}

export async function recordConsultingTransactionAndClaim(
  transaction: WompiTransaction,
): Promise<RecordedConsultingTransaction | null> {
  return recordConsultingTransactionWithOperation(transaction, 'recordAndClaim');
}
