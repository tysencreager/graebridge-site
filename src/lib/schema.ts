// JSON-LD built from the templates in /schema with placeholders filled from site.config.ts.
import localBusinessRaw from '../../schema/localbusiness.jsonld?raw';
import faqRaw from '../../schema/faq.jsonld?raw';
import pageTemplatesRaw from '../../schema/hidden-page-templates.jsonld?raw';
import { site, isSet, canonical } from './site';
import { faqs } from './content';

export function localBusiness() {
  const data = JSON.parse(localBusinessRaw);
  data.telephone = site.phoneE164;
  data.email = site.email;
  data.geo.latitude = site.geo.lat;
  data.geo.longitude = site.geo.lng;
  data.sameAs = [site.social.facebook, site.social.instagram, site.social.yelp, site.gbpMapsUrl].filter(isSet);
  return data;
}

export function faqPage() {
  const data = JSON.parse(faqRaw);
  // The schema file and the visible accordion must say the same thing.
  const inSchema = data.mainEntity.map((q: any) => q.name).join('|');
  const onPage = faqs.map((f) => f.q).join('|');
  if (inSchema !== onPage) throw new Error('schema/faq.jsonld and src/content/faq.md have drifted apart: the questions no longer match.');
  data.mainEntity.forEach((q: any, i: number) => (q.acceptedAnswer.text = faqs[i].a));
  return data;
}

const AREAS: Record<string, object[]> = {
  'countertops-utah-county': [{ '@type': 'AdministrativeArea', name: 'Utah County, UT' }],
  'countertops-salt-lake-city': [
    { '@type': 'City', name: 'Salt Lake City, UT' },
    { '@type': 'AdministrativeArea', name: 'Salt Lake County, UT' },
  ],
  'countertops-park-city-heber': [
    { '@type': 'City', name: 'Park City, UT' },
    { '@type': 'City', name: 'Heber City, UT' },
  ],
};

export function hiddenPage(id: string, name: string, description: string) {
  const fillIn = (value: unknown): unknown => {
    if (typeof value === 'string') {
      return value
        .replace(/PAGE_TITLE_SHORT.*$/, name)
        .replace('PAGE_SLUG', id)
        .replace('PAGE_META_DESCRIPTION', description);
    }
    if (Array.isArray(value)) return value.map(fillIn);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillIn(v)]));
    return value;
  };
  const { service, breadcrumb } = fillIn(JSON.parse(pageTemplatesRaw)) as { service: any; breadcrumb: any };
  if (AREAS[id]) service.areaServed = AREAS[id];
  return [service, breadcrumb];
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: canonical(t.path) })),
  };
}
