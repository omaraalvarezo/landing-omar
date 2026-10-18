import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sdk = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('@vercel/analytics', () => ({ track: sdk.track }));

import { SHORT_LINKS } from '../src/lib/short-links';
import { bindTrackedLinks, isClickEvent, refFromSearch, trackEvent, trackShortLinkVisit } from '../src/lib/track';

// Todo el código de src que puede marcar un enlace con data-track.
const sources = import.meta.glob(['../src/**/*.astro', '../src/**/*.ts', '../src/**/*.tsx', '../src/**/*.mjs'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

beforeEach(() => {
  sdk.track.mockReset();
  vi.stubGlobal('window', {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('trackEvent', () => {
  it('envía el nombre y las props al SDK', () => {
    trackEvent('escalon_click', { id: 'sistema-enzo', placement: 'hero' });
    expect(sdk.track).toHaveBeenCalledWith('escalon_click', { id: 'sistema-enzo', placement: 'hero' });
  });

  it('sin props, no manda objeto vacío', () => {
    trackEvent('lista_espera_enviada');
    expect(sdk.track).toHaveBeenCalledWith('lista_espera_enviada', undefined);
    trackEvent('lista_espera_enviada', {});
    expect(sdk.track).toHaveBeenLastCalledWith('lista_espera_enviada', undefined);
  });

  it('descarta props vacías o que no son string y recorta las largas', () => {
    trackEvent('escalon_click', {
      id: 'kit',
      placement: '',
      email: 42 as unknown as string,
      largo: 'x'.repeat(200),
    });
    const [, props] = sdk.track.mock.calls[0] as [string, Record<string, string>];
    expect(Object.keys(props).sort()).toEqual(['id', 'largo']);
    expect(props.largo).toHaveLength(60);
  });

  it('nunca lanza si el SDK lanza', () => {
    sdk.track.mockImplementation(() => {
      throw new Error('boom');
    });
    expect(() => trackEvent('link_corto', { ref: 'kit' })).not.toThrow();
    expect(sdk.track).toHaveBeenCalledTimes(1);
  });

  it('nunca lanza si el SDK no está disponible (TypeError al llamarlo)', () => {
    sdk.track.mockImplementation(() => {
      throw new TypeError('track is not a function');
    });
    expect(() => trackEvent('boletin_suscrito')).not.toThrow();
  });

  it('en el servidor (sin window) no llama al SDK ni lanza', () => {
    vi.unstubAllGlobals();
    expect(() => trackEvent('escalon_click', { id: 'kit' })).not.toThrow();
    expect(sdk.track).not.toHaveBeenCalled();
  });
});

type Listener = (event: { target: unknown }) => void;

function fakeRoot() {
  const listeners: Listener[] = [];
  const root = {
    addEventListener: vi.fn((type: string, listener: Listener) => {
      if (type === 'click') listeners.push(listener);
    }),
  };
  return { root, click: (target: unknown) => listeners.forEach((listener) => listener({ target })) };
}

function fakeLink(dataset: Record<string, string>) {
  const el = { dataset, closest: (selector: string) => (selector === '[data-track]' ? el : null) };
  return el;
}

describe('bindTrackedLinks', () => {
  it('mapea data-track-id y data-track-placement a props de escalon_click', () => {
    const { root, click } = fakeRoot();
    bindTrackedLinks(root as unknown as ParentNode);
    click(fakeLink({ track: 'escalon_click', trackId: 'sistema-enzo', trackPlacement: 'hero' }));
    expect(sdk.track).toHaveBeenCalledWith('escalon_click', { id: 'sistema-enzo', placement: 'hero' });
  });

  it('sin placement, solo manda el id', () => {
    const { root, click } = fakeRoot();
    bindTrackedLinks(root as unknown as ParentNode);
    click(fakeLink({ track: 'escalon_click', trackId: 'lista' }));
    expect(sdk.track).toHaveBeenCalledWith('escalon_click', { id: 'lista' });
  });

  it('un clic dentro de un elemento marcado sube hasta el [data-track]', () => {
    const { root, click } = fakeRoot();
    bindTrackedLinks(root as unknown as ParentNode);
    const link = fakeLink({ track: 'escalon_click', trackId: 'kit' });
    click({ closest: (selector: string) => (selector === '[data-track]' ? link : null) });
    expect(sdk.track).toHaveBeenCalledWith('escalon_click', { id: 'kit' });
  });

  it('ignora clics fuera de elementos marcados', () => {
    const { root, click } = fakeRoot();
    bindTrackedLinks(root as unknown as ParentNode);
    click({ closest: () => null });
    click(null);
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it('los eventos de envío no se disparan por clic: los manda cada formulario al responder el servidor', () => {
    const { root, click } = fakeRoot();
    bindTrackedLinks(root as unknown as ParentNode);
    click(fakeLink({ track: 'sistema_checkout_iniciado' }));
    click(fakeLink({ track: 'lista_espera_enviada' }));
    click(fakeLink({ track: 'kit_checkout_iniciado' }));
    click(fakeLink({ track: 'sistema_abierto', trackId: 'detailing' }));
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it('enlazar dos veces la misma raíz no duplica el evento', () => {
    const { root, click } = fakeRoot();
    bindTrackedLinks(root as unknown as ParentNode);
    bindTrackedLinks(root as unknown as ParentNode);
    expect(root.addEventListener).toHaveBeenCalledTimes(1);
    click(fakeLink({ track: 'escalon_click', trackId: 'kit' }));
    expect(sdk.track).toHaveBeenCalledTimes(1);
  });

  it('un fallo del SDK en el clic no rompe el clic', () => {
    sdk.track.mockImplementation(() => {
      throw new Error('boom');
    });
    const { root, click } = fakeRoot();
    bindTrackedLinks(root as unknown as ParentNode);
    expect(() => click(fakeLink({ track: 'escalon_click', trackId: 'kit' }))).not.toThrow();
  });
});

describe('?ref= (link corto)', () => {
  it('dispara link_corto con el slug cuando es de la lista', () => {
    for (const { slug } of SHORT_LINKS) {
      sdk.track.mockClear();
      trackShortLinkVisit(`?ref=${slug}`);
      expect(sdk.track).toHaveBeenCalledWith('link_corto', { ref: slug });
    }
  });

  it('ignora refs desconocidos, vacíos o con texto libre', () => {
    for (const search of ['?ref=otra-cosa', '?ref=', '?ref=ENTREGAS', '?ref=entregas%20x', '?otro=entregas', '', '?ref=a@b.co']) {
      trackShortLinkVisit(search);
    }
    expect(sdk.track).not.toHaveBeenCalled();
  });

  it('refFromSearch devuelve solo slugs conocidos', () => {
    expect(refFromSearch('?utm=1&ref=entregas')).toBe('entregas');
    expect(refFromSearch('?ref=desconocido')).toBeNull();
    expect(refFromSearch('')).toBeNull();
  });
});

describe('data-track en src', () => {
  it('todo data-track literal y todo track: de enlace es un evento de clic que se mide', () => {
    const found: string[] = [];
    for (const [file, code] of Object.entries(sources)) {
      if (file.endsWith('/lib/track.ts')) continue;
      for (const match of code.matchAll(/data-track="([^"]+)"/g)) found.push(`${file}:${match[1]}`);
      for (const match of code.matchAll(/\btrack: '([^']+)'/g)) found.push(`${file}:${match[1]}`);
    }
    expect(found.length).toBeGreaterThan(5);
    const unhandled = found.filter((entry) => !isClickEvent(entry.slice(entry.lastIndexOf(':') + 1)));
    expect(unhandled).toEqual([]);
  });

  it('los data-track dinámicos ({...}) solo están donde el tipo los ata a un evento de clic', () => {
    const dynamic: string[] = [];
    for (const [file, code] of Object.entries(sources)) {
      for (const match of code.matchAll(/data-track=\{([^}]+)\}/g)) dynamic.push(`${file.replace('../src/', '')}:${match[1]}`);
    }
    expect(dynamic.sort()).toEqual([
      'components/sistemas/SistemaShell.astro:cta.track',
      'pages/sistemas/[slug].astro:faq.link.track',
    ]);
  });
});
