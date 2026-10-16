// JSON-LD compartido. El grafo completo de Persona/Servicio/WebSite vive solo en el home;
// las demás páginas apuntan a la persona por su @id con `personRef()`.

import { SOCIALS } from './contact';

export const SITE = 'https://omaralvarezo.co';
export const PERSON_ID = `${SITE}/#persona`;
export const SERVICE_ID = `${SITE}/#servicio`;
export const WEBSITE_ID = `${SITE}/#website`;
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
        jobTitle: 'Operador y consultor de sistemas para empresas de servicios',
        description:
          'Sesiones privadas de 120 minutos para dueños y socios que quieren mejorar captación, CRM, operación o postventa con sistemas e inteligencia artificial.',
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
      },
      {
        '@type': 'ProfessionalService',
        '@id': SERVICE_ID,
        name: 'Omar Álvarez · Sistemas e IA para empresas de servicios',
        url: `${SITE}/`,
        image: `${SITE}${DEFAULT_OG_IMAGE}`,
        founder: { '@id': PERSON_ID },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cúcuta',
          addressRegion: 'Norte de Santander',
          addressCountry: 'CO',
        },
        areaServed: ['CO', 'MX', 'PE', 'CL', 'ES'],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'consultoría',
          url: `${SITE}/#contacto`,
          availableLanguage: ['es'],
        },
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
