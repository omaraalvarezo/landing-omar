// Medición del embudo (Vercel Web Analytics, mismo origen: `/_vercel/insights`, sin tocar la CSP).
//
// Los eventos personalizados (`track`) se envían siempre. Si el plan del proyecto en Vercel no los
// recoge, el envío es inofensivo: no rompe nada y las visitas siguen contando. En ese caso las ventas
// se cuentan con `npm run kit:pending`. (El MCP de Vercel no expone el plan del equipo, por eso no se
// pudo verificar antes de implementar.)
//
// Reglas: las props son SOLO strings cortos (ids de escalón, placement, slug del link corto). Nunca
// correos, nombres ni texto libre. `trackEvent` nunca lanza: medir no puede romper una página.
import { track } from '@vercel/analytics';
import { SHORT_LINKS } from './short-links';

export type TrackName =
  | 'escalon_click'
  | 'sistema_checkout_iniciado'
  | 'sistema_comprado'
  | 'lista_espera_enviada'
  | 'boletin_suscrito'
  | 'kit_checkout_iniciado'
  | 'link_corto';

/** Eventos que se disparan al hacer clic en un elemento marcado con `data-track`. */
const CLICK_EVENTS: ReadonlySet<string> = new Set<TrackName>(['escalon_click']);

/** ¿Este valor de `data-track` lo mide el oyente de clics? Todo `data-track` del sitio debe serlo. */
export function isClickEvent(name: string): boolean {
  return CLICK_EVENTS.has(name);
}

const PROP_MAX_LENGTH = 60;

function cleanProps(props: Record<string, string> | undefined): Record<string, string> | undefined {
  if (!props) return undefined;
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string' && value !== '') clean[key] = value.slice(0, PROP_MAX_LENGTH);
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
}

/** Envía un evento. Nunca lanza, ni si el SDK falla o no está disponible. */
export function trackEvent(name: TrackName, props?: Record<string, string>): void {
  try {
    if (typeof window === 'undefined') return;
    track(name, cleanProps(props));
  } catch {
    // Medir nunca puede romper la página.
  }
}

/** `data-track-id` -> `id`, `data-track-placement` -> `placement`. */
function propsFromDataset(dataset: Record<string, string | undefined>): Record<string, string> {
  const props: Record<string, string> = {};
  for (const [key, value] of Object.entries(dataset)) {
    if (!key.startsWith('track') || key === 'track' || typeof value !== 'string') continue;
    const prop = key.slice('track'.length);
    props[prop.charAt(0).toLowerCase() + prop.slice(1)] = value;
  }
  return props;
}

const bound = new WeakSet<object>();

/**
 * Un solo oyente de clic en la raíz: cualquier `[data-track]` cuyo valor sea un evento de clic
 * (`escalon_click`) dispara el evento con sus `data-track-*` como props. Los eventos de envío
 * (checkout, lista de espera) los dispara cada formulario cuando el servidor responde bien.
 */
export function bindTrackedLinks(root: ParentNode = document): void {
  if (bound.has(root)) return;
  bound.add(root);
  root.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    const marked = target?.closest?.('[data-track]') as HTMLElement | null;
    const name = marked?.dataset.track;
    if (!marked || !name || !isClickEvent(name)) return;
    trackEvent(name as TrackName, propsFromDataset(marked.dataset));
  });
}

/** El `ref` válido de la URL (uno de los slugs de `short-links.json`), o null. */
export function refFromSearch(search: string): string | null {
  const ref = new URLSearchParams(search).get('ref');
  return ref !== null && SHORT_LINKS.some((link) => link.slug === ref) ? ref : null;
}

/** Una vez por carga: si llegas por un link corto (`?ref=entregas`), cuenta la visita por video. */
export function trackShortLinkVisit(search: string = window.location.search): void {
  const ref = refFromSearch(search);
  if (ref) trackEvent('link_corto', { ref });
}
