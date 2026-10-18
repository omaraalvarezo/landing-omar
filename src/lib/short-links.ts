// Direcciones cortas para decir en voz alta en los videos (omaralvarezo.co/entregas).
// Cada una redirige con `?ref=` para medir las visitas por video. La lista vive en
// `src/data/short-links.json`; `astro.config.mjs` arma los redirects con el mismo núcleo.
import links from '../data/short-links.json';
import {
  shortLinkDestination as destination,
  shortLinkRedirects as redirects,
} from './short-links-core.mjs';

export interface ShortLink {
  slug: string;
  to: string;
  label: string;
}

export interface ShortLinkRedirect {
  status: 302;
  destination: string;
}

export const SHORT_LINKS: readonly ShortLink[] = links;

export function shortLinkDestination(link: Pick<ShortLink, 'slug' | 'to'>): string {
  return destination(link);
}

export function shortLinkRedirects(list: readonly ShortLink[] = SHORT_LINKS): Record<string, ShortLinkRedirect> {
  return redirects(list);
}
