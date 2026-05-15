// HMAC-signed session tokens para el admin panel.
// Formato del token: base64url(payload) "." base64url(hmac-sha256(payload, secret))
// Payload mínimo: { sub: 'admin', exp: <epoch ms> }
//
// El uso de timingSafeEqual evita ataques de timing en la verificación del HMAC.

import { createHmac, timingSafeEqual } from 'node:crypto';

const ALG = 'sha256';

export interface SessionPayload {
  sub: string;
  exp: number;
}

export function sign(payload: SessionPayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac(ALG, secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verify(token: string, secret: string): SessionPayload | null {
  try {
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;

    const expectedSig = createHmac(ALG, secret).update(body).digest('base64url');
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload;
    if (!payload || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    if (payload.sub !== 'admin') return null;

    return payload;
  } catch {
    return null;
  }
}
