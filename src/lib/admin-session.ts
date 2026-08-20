// HMAC-signed session tokens para el admin panel.
// Formato del token: base64url(payload) "." base64url(hmac-sha256(payload, secret))
// Payload mínimo: { sub: 'admin', exp: <epoch ms> }
//
// Usa Web Crypto para funcionar igual en Node/Vercel y en runtimes Edge.

export interface SessionPayload {
  sub: string;
  exp: number;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmac(body: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)));
}

function equal(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

export async function sign(payload: SessionPayload, secret: string): Promise<string> {
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = toBase64Url(await hmac(body, secret));
  return `${body}.${sig}`;
}

export async function verify(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;

    const expectedSig = await hmac(body, secret);
    if (!equal(fromBase64Url(sig), expectedSig)) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (!payload || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    if (payload.sub !== 'admin') return null;

    return payload;
  } catch {
    return null;
  }
}
