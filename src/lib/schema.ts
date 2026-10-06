// JSON-LD. Every page emits one @graph: the Organization and WebSite nodes plus whatever the page adds.

import { SITE } from './site';

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

type Node = Record<string, unknown>;

export function baseGraph(): Node[] {
  return [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE.name,
      url: `${SITE.url}/`,
      description: SITE.description,
      areaServed: { '@type': 'Country', name: 'Singapore' },
      knowsLanguage: 'en-SG',
      parentOrganization: { '@type': 'Organization', name: 'OurKampung', url: 'https://ourkampung.com/' },
      knowsAbout: [
        'Home renovation in Singapore',
        'HDB renovation permits and rules',
        'Condominium renovation by-laws',
        'Hiring an interior designer or renovation contractor',
        'Renovation contracts and payment schedules',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: `${SITE.url}/`,
      name: SITE.name,
      inLanguage: 'en-SG',
      publisher: { '@id': ORG_ID },
    },
  ];
}

export function breadcrumbNode(items: { label: string; href?: string }[], pageUrl: string): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? new URL(item.href, SITE.url).href : pageUrl,
    })),
  };
}

export function articleNode(opts: {
  url: string;
  headline: string;
  description: string;
  dateModified: string;
  section: string;
  image?: string;
}): Node {
  return {
    '@type': 'Article',
    '@id': `${opts.url}#article`,
    mainEntityOfPage: opts.url,
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.dateModified,
    dateModified: opts.dateModified,
    articleSection: opts.section,
    inLanguage: 'en-SG',
    ...(opts.image ? { image: new URL(opts.image, SITE.url).href } : {}),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function faqNode(url: string, faqs: { q: string; a: string }[]): Node | null {
  if (faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
