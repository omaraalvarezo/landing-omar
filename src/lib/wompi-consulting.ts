import { CONSULTING, expectedAmountForConsultingReference } from './consulting';

type WompiEnvironment = 'production' | 'test';

interface WompiConfig {
  environment: WompiEnvironment;
  publicKey: string;
  integritySecret: string;
  apiBaseUrl: string;
}

export interface WompiTransaction {
  id: string;
  status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';
  status_message?: string | null;
  reference: string;
  amount_in_cents: number;
  currency: string;
  payment_method_type?: string;
  customer_email?: string;
  customer_data?: {
    full_name?: string;
    phone_number?: string;
  };
}

function env(name: keyof ImportMetaEnv): string {
  return String(import.meta.env[name] || '').trim();
}

export function getWompiConfig(): WompiConfig | null {
  const environment = env('WOMPI_ENVIRONMENT');
  if (environment !== 'production' && environment !== 'test') return null;

  const production = environment === 'production';
  const publicKey = production ? env('WOMPI_PUBLIC_KEY') : env('WOMPI_TEST_PUBLIC_KEY');
  const integritySecret = production
    ? env('WOMPI_INTEGRITY_SECRET')
    : env('WOMPI_TEST_INTEGRITY_SECRET');

  if (!publicKey || !integritySecret) return null;
  const expectedPublicPrefix = production ? 'pub_prod_' : 'pub_test_';
  const expectedIntegrityPrefix = production ? 'prod_integrity_' : 'test_integrity_';
  if (!publicKey.startsWith(expectedPublicPrefix) || !integritySecret.startsWith(expectedIntegrityPrefix)) {
    throw new Error('WOMPI_ENVIRONMENT_MISMATCH');
  }

  return {
    environment: production ? 'production' : 'test',
    publicKey,
    integritySecret,
    apiBaseUrl: production
      ? 'https://production.wompi.co/v1'
      : 'https://sandbox.wompi.co/v1',
  };
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createCheckoutUrl(args: {
  reference: string;
  amountInCents: number;
  redirectUrl: string;
  customerName: string;
  customerEmail: string;
}): Promise<string> {
  const config = getWompiConfig();
  if (!config) throw new Error('WOMPI_NOT_CONFIGURED');

  const signature = await sha256(
    `${args.reference}${args.amountInCents}${CONSULTING.chargeCurrency}${config.integritySecret}`,
  );

  const params = new URLSearchParams({
    'public-key': config.publicKey,
    currency: CONSULTING.chargeCurrency,
    'amount-in-cents': String(args.amountInCents),
    reference: args.reference,
    'signature:integrity': signature,
    'redirect-url': args.redirectUrl,
    'customer-data:email': args.customerEmail,
    'customer-data:full-name': args.customerName,
  });

  return `https://checkout.wompi.co/p/?${params.toString()}`;
}

export async function fetchTransaction(id: string): Promise<WompiTransaction | null> {
  const config = getWompiConfig();
  if (!config) throw new Error('WOMPI_NOT_CONFIGURED');

  const response = await fetch(`${config.apiBaseUrl}/transactions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${config.publicKey}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(7_000),
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`WOMPI_STATUS_${response.status}`);

  const payload = (await response.json()) as { data?: WompiTransaction };
  return payload.data || null;
}

export function isApprovedConsultingPayment(transaction: WompiTransaction | null): boolean {
  const expectedAmount = expectedAmountForConsultingReference(transaction?.reference);
  return Boolean(
    transaction &&
      transaction.status === 'APPROVED' &&
      expectedAmount !== null &&
      transaction.amount_in_cents === expectedAmount &&
      transaction.currency === CONSULTING.chargeCurrency,
  );
}
