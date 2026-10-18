// JSON-LD compartido. El grafo completo de Persona/WebSite vive solo en el home; las demás
// páginas apuntan a la persona por su @id con `personRef()`. El producto se describe completo en
// su página de venta; el home solo lo referencia por @id.

import { SOCIALS } from './contact';

export const SITE = 'https://omaralvarezo.co';
export const PERSON_ID = `${SITE}/#persona`;
export const WEBSITE_ID = `${SITE}/#website`;
export const SISTEMA_ENZO_PRODUCT_ID = `${SITE}/sistemas/detailing#product`;
export const SITE_NAME = 'Omar Álvarez';
export const DEFAULT_OG_IMAGE = '/og-image.png';

/** Referencia mínima a la persona del home, para author/publisher/mainEntity. */
export function personRef() {
  return { '@type': 'Person', '@id': PERSON_ID, name: SITE_NAME, url: `${SITE}/` };
}

export function homeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        url: `${SITE}/`,
        inLanguage: 'es',
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: SITE_NAME,
        jobTitle: 'Operador de Enzo Motorsport y Arkhē',
        description:
          'Opera Enzo Motorsport y Arkhē con sistemas que construyó, y vende El sistema de Enzo para que un detailing entregue sin olvidos.',
        url: `${SITE}/`,
        image: `${SITE}${DEFAULT_OG_IMAGE}`,
        sameAs: [SOCIALS.tiktok, SOCIALS.instagram, SOCIALS.linkedin],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cúcuta',
          addressRegion: 'Norte de Santander',
          addressCountry: 'CO',
        },
        alumniOf: [
          { '@type': 'EducationalOrganization', name: 'Universidad EAFIT' },
          { '@type': 'EducationalOrganization', name: 'Universidad Pontificia Bolivariana' },
          { '@type': 'EducationalOrganization', name: 'La Salle Barcelona' },
        ],
        makesOffer: { '@type': 'Offer', itemOffered: { '@id': SISTEMA_ENZO_PRODUCT_ID } },
      },
    ],
  };
}

export function breadcrumbList(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
