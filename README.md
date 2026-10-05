# spacetoreno.com

A guide to **renovating a home in Singapore** (HDB flat, condo or landed), from the first plan to the end of the
works. It's a guide, not a sales site: Junk to Clear sells renovation, and guides link to it only at the step where
the reader wants quotes. Part of the JTC family; the family's rules are in `../jtc-family/PORTFOLIO.md` and the
site's brief in `../jtc-family/briefs/spacetoreno.md`.

Astro 7, static, GitHub Pages (deploys from `main` via `.github/workflows/deploy.yml`). The structure copies
Relocado's: hubs, guides, and an enquiry form.

## Commands

| | |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Build to `dist/`. Fails on a title over 60 characters, a description outside 70–160, or a guide without sources |
| `npm run audit` | Post-build checks: internal links, canonicals, alt text, the GA4 tag (when `PUBLIC_GA4_ID` is set), brand-link limit, no contact details, `.nojekyll` and `CNAME` |
| `npm run illo` | Regenerate the SVG illustrations in `public/illo/` and `public/favicon.svg` |

## Structure

- Hubs are defined in `src/lib/site.ts` (`HUBS`). URLs are `/{hub path}/` and `/{hub path}/{guide}/`. **Live URLs
  are a one-way door.**
- Guides: `src/content/guides/<slug>.md`, schema in `src/content.config.ts`. Every guide needs `sources`.
- Illustrations: `scripts/illustrations.mjs`, in the family style (PestToClear's script, after OurKampung) with
  SpaceToReno's palette. Diagrams show no durations, percentages or prices unless a guide cites them. The approval
  chart (`approval-matrix.svg`) mirrors the table in `what-needs-approval.md`: change the guide first, then the chart.

## Content rules

- Every rule links to its official source (HDB, BCA, URA, NEA, EMA, PUB, SCDF, MOM, CASE, CCS, SSO) and is listed
  in the guide's `sources`. No invented prices, statistics, durations or testimonials. Talk about cost only with a
  cited source; otherwise explain what drives it.
- Lane: renovation, from planning to the end of the works. OurKampung keeps "BTO key collection to move-in" and the
  "after-renovation checklist"; link its checklist for the move-in side, as a sister guide.
- Brand links: at most two per guide, only at the step that needs the service, and disclosed in the sentence. Never
  "our crew", never rank or review our own brands, no "best ID / contractor" lists, no `rel="noreferrer"`.
- Family revamp (5 Oct 2026, `../jtc-family/briefs/family-revamp.md`): the only footer link is "Part of OurKampung"
  to `https://ourkampung.com/` with `rel="nofollow"`, and `/about/` has one sentence linking
  `https://ourkampung.com/our-sites/`. No other sitewide links to family sites, and none between sister sites.
  No phone number, WhatsApp or email.
- British spelling, plain English, answer first.

## Enquiries

- `src/components/EnquiryForm.astro` posts to FormSubmit's AJAX endpoint from `PUBLIC_FORM_ENDPOINT` (a repo
  variable), set on 5 Oct 2026 to FormSubmit's alias for the family inbox. `src/lib/env.ts` falls back to the same
  alias, so no email address appears in the code or the pages.
- Fields: property type, timing, rooms or works, details, optional budget range, name, phone or WhatsApp. The
  subject carries "SpaceToReno", the page title and path. The PDPA notice says the details go to the team behind
  Junk to Clear. If the fields or recipient change, update the notice and `/about/#privacy` in the same commit.
- `generate_lead` fires once, only after FormSubmit returns `success`. On failure the form says so and keeps what
  the visitor typed. `MessageForm.astro` (corrections and privacy requests, on `/about/`) sends no GA4 event.

## Measurement

GA4 property "SpaceToReno" (557318329), stream 16043330293, measurement ID `G-JVTF9S8TBR`, set as the repo
variable `PUBLIC_GA4_ID` (5 Oct 2026). The tag renders only when that variable is set at build time, and the audit
then fails any page without it. Search Console: `sc-domain:spacetoreno.com`.
`generate_lead` is the only key event. Keep enhanced measurement on: outbound clicks count readers sent to the brands.

## Design

The "Paint chip" palette: plum `#3B2752` for trust and mint `#8FD3B6` for highlights. Every colour is a token on
`:root` in `src/styles/global.css`. Mint is only a fill behind dark text or a decorative bar, never text. Fonts
(Inter, Bricolage Grotesque) are self-hosted via Fontsource and the CSS is inlined, which keeps mobile Lighthouse
performance at 96–100.
