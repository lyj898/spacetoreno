// Post-build audit of dist/. Fails on anything that would ship broken or break the family's rules.
//   npm run audit        (after npm run build)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const SITE = 'https://spacetoreno.com';
// Family service sites and partners. A guide links to them at most twice (PORTFOLIO.md). Sister guides
// (OurKampung and the rest) don't count.
const BRAND_HOSTS = [
  'junktoclear.com.sg',
  'hometomoved.com',
  'hometoclean.com',
  'pesttoclear.com',
  'aircontocool.com',
  'brokentofixed.com',
  'skillstofix.com',
];
// When the build had a GA4 ID, every page must carry the tag, the 404 page included.
const GA4_ID = (process.env.PUBLIC_GA4_ID ?? '').trim();
const errors = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
  });
}

const pages = htmlFiles(DIST).map((file) => {
  const rel = relative(DIST, file).split(sep).join('/');
  const url = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
  return { file, url, html: readFileSync(file, 'utf8') };
});

const titles = new Map();
const descriptions = new Map();

for (const p of pages) {
  const title = p.html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = p.html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const noindex = /<meta name="robots" content="noindex"/.test(p.html);
  if (!title) fail(p.url, 'missing <title>');
  if (!desc) fail(p.url, 'missing meta description');
  if (GA4_ID && !p.html.includes(`googletagmanager.com/gtag/js?id=${GA4_ID}`)) fail(p.url, `missing the GA4 tag (${GA4_ID})`);
  if (!noindex) {
    const canon = [...p.html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
    if (canon.length !== 1) fail(p.url, `expected 1 canonical, found ${canon.length}`);
    else if (canon[0] !== SITE + p.url) fail(p.url, `canonical ${canon[0]} is not self-referencing`);
    if (titles.has(title)) fail(p.url, `duplicate title with ${titles.get(title)}`);
    if (descriptions.has(desc)) fail(p.url, `duplicate description with ${descriptions.get(desc)}`);
    titles.set(title, p.url);
    descriptions.set(desc, p.url);
  }

  for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(p.url, 'JSON-LD does not parse'); }
  }

  // Every internal link and image must resolve to a built page or a public file.
  for (const m of p.html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    const href = m[1];
    if (href.startsWith('//')) continue;
    const target = href.endsWith('/') ? join(DIST, href, 'index.html') : join(DIST, href);
    if (!existsSync(target)) fail(p.url, `broken internal link ${href}`);
  }

  // Every image has an alt attribute (empty only for decorative images beside a text label).
  for (const m of p.html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(m[0])) fail(p.url, `image without alt: ${m[0].slice(0, 80)}`);
  }

  // No contact details anywhere: contact is form-only (family rule).
  if (/href="(?:mailto|tel):/i.test(p.html) || /wa\.me\//i.test(p.html)) fail(p.url, 'shows a mailto, tel or WhatsApp link');

  // Brand rules, in the guide body before the disclosure note.
  const body = p.html.match(/<article class="prose[^"]*">([\s\S]*?)<\/article>/)?.[1] ?? '';
  if (body) {
    const beforeDisclosure = body.split('class="disclosure-note"')[0].split('data-enquiry>')[0];
    if (/\bour (movers|cleaners|trucks|crews?|technicians|handymen|contractors|workers)\b/i.test(beforeDisclosure)) {
      fail(p.url, 'says "our movers/cleaners/crew/…": the brands are matching services or use partner crews');
    }
    const brandLinks = [...beforeDisclosure.matchAll(/href="https?:\/\/(?:www\.)?([^/"]+)/g)].filter((mm) => BRAND_HOSTS.includes(mm[1]));
    if (p.url !== '/about/' && brandLinks.length > 2) fail(p.url, `${brandLinks.length} links to our own brands in the guide body (max 2)`);
    if (/rel="[^"]*noreferrer/.test(beforeDisclosure)) fail(p.url, 'rel="noreferrer" hides the visit source from the brands');
    if (/(?<![A-Za-z])\$\d/.test(beforeDisclosure.replace(/S\$\d/g, ''))) fail(p.url, 'amount written with a bare "$" (use S$)');
    // /about/ quotes the phrase to say we don't publish such lists.
    if (p.url !== '/about/' && /\bbest (interior designers?|contractors?|renovation)/i.test(beforeDisclosure)) {
      fail(p.url, 'reads like a "best of" list');
    }
  }
}

// Sitemap: every entry must exist and must not be a noindex page.
const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const path = m[1].replace(SITE, '');
  const page = pages.find((p) => p.url === path);
  if (!page) fail('sitemap', `lists ${path}, which was not built`);
  else if (/<meta name="robots" content="noindex"/.test(page.html)) fail('sitemap', `lists noindex page ${path}`);
}

// Deploy furniture that GitHub Pages needs in the published output.
if (!existsSync(join(DIST, '.nojekyll'))) fail('dist', 'missing .nojekyll (Jekyll would strip _astro/)');
if (readFileSync(join(DIST, 'CNAME'), 'utf8').trim() !== 'spacetoreno.com') fail('dist', 'CNAME is not spacetoreno.com');

if (errors.length) {
  console.error(`Audit failed with ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`Audit passed: ${pages.length} pages, sitemap clean${GA4_ID ? `, GA4 ${GA4_ID} on every page` : ' (no GA4 ID set)'}.`);
