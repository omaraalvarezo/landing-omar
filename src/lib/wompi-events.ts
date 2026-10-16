import { getSecret } from 'astro:env/server';
import { getWompiConfig } from './wompi';

function env(name: keyof ImportMetaEnv): string {
  return String(getSecret(String(name)) || '').trim();
}

export function getWompiEventsSecret(): string {
  const config = getWompiConfig();
  if (!config) throw new Error('WOMPI_NOT_CONFIGURED');
  const secret =
    config.environment === 'production' ? env('WOMPI_EVENTS_SECRET') : env('WOMPI_TEST_EVENTS_SECRET');
  if (secret.length < 16) throw new Error('WOMPI_EVENTS_SECRET_MISSING');
  return secret;
}

export interface VerifiedWompiEvent {
  transactionId: string;
}

function readPath(data: unknown, path: string): string | null {
  let current: unknown = data;
  for (const part of path.split('.')) {
    if (!part || !current || typeof current !== 'object' || !(part in current)) return null;
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === 'string') return current;
  if (typeof current === 'number' && Number.isFinite(current)) return String(current);
  if (typeof current === 'boolean') return current ? 'true' : 'false';
  return null;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function safeEqual(leftValue: string, rightValue: string): boolean {
  const left = new TextEncoder().encode(leftValue);
  const right = new TextEncoder().encode(rightValue);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index]! ^ right[index]!;
  return difference === 0;
}

/**
 * Checksum de Wompi: SHA-256 de los valores de `signature.properties`
 * (rutas dentro de `data`), en orden, más `timestamp` y el secreto de eventos.
 */
export async function verifyWompiEvent(payload: unknown): Promise<VerifiedWompiEvent | null> {
  if (!payload || typeof payload !== 'object') return null;
  const event = payload as {
    data?: unknown;
    environment?: unknown;
    timestamp?: unknown;
    signature?: { properties?: unknown; checksum?: unknown };
  };
  const properties = event.signature?.properties;
  const checksum = event.signature?.checksum;
  if (!Array.isArray(properties) || properties.length === 0 || properties.length > 12) return null;
  if (typeof checksum !== 'string' || !/^[a-f0-9]{64}$/i.test(checksum)) return null;

  const timestamp =
    typeof event.timestamp === 'number' && Number.isSafeInteger(event.timestamp)
      ? String(event.timestamp)
      : typeof event.timestamp === 'string' && /^\d{10,13}$/.test(event.timestamp)
        ? event.timestamp
        : null;
  if (!timestamp) return null;

  let chain = '';
  for (const property of properties) {
    if (typeof property !== 'string' || !/^[A-Za-z0-9_.]+$/.test(property)) return null;
    const value = readPath(event.data, property);
    if (value === null) return null;
    chain += value;
  }

  const expected = await sha256(`${chain}${timestamp}${getWompiEventsSecret()}`);
  if (!safeEqual(expected, checksum.toLowerCase())) return null;

  const config = getWompiConfig();
  const expectedEnvironment = config?.environment === 'production' ? 'prod' : 'test';
  if (typeof event.environment === 'string' && event.environment !== expectedEnvironment) return null;

  const transactionId = readPath(event.data, 'transaction.id');
  if (!transactionId || !/^[A-Za-z0-9-]{4,80}$/.test(transactionId)) return null;
  return { transactionId };
}
