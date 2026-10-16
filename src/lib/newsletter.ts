export type NewsletterSlot =
  | { ready: false }
  | { ready: true; provider: 'beehiiv' | 'buttondown'; action: string };

function hostOk(provider: string, hostname: string): provider is 'beehiiv' | 'buttondown' {
  const host = hostname.toLowerCase();
  if (provider === 'beehiiv') return host === 'beehiiv.com' || host.endsWith('.beehiiv.com');
  if (provider === 'buttondown') {
    return host === 'buttondown.com' || host.endsWith('.buttondown.com') || host === 'buttondown.email' || host.endsWith('.buttondown.email');
  }
  return false;
}

export function resolveNewsletter(env: { provider?: string; action?: string }): NewsletterSlot {
  const provider = (env.provider || '').trim().toLowerCase();
  const action = (env.action || '').trim();
  let url: URL;
  try {
    url = new URL(action);
  } catch {
    return { ready: false };
  }
  if (url.protocol !== 'https:' || !hostOk(provider, url.hostname)) return { ready: false };
  return { ready: true, provider, action: url.toString() };
}
