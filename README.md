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
- No sitewide or footer links to family sites (they come in the revamp). No phone number, WhatsApp or email.
- British spelling, plain English, answer first.

## Enquiries

- `src/components/EnquiryForm.astro` posts to FormSubmit's AJAX endpoint from `PUBLIC_FORM_ENDPOINT` (a repo
  variable). Until it's set, it falls back to the family inbox's raw address in `src/lib/env.ts`; the family rule
  is to post to FormSubmit's alias, so set the variable to the alias.
- Fields: property type, timing, rooms or works, details, optional budget range, name, phone or WhatsApp. The
  subject carries "SpaceToReno", the page title and path. The PDPA notice says the details go to the team behind
  Junk to Clear. If the fields or recipient change, update the notice and `/about/#privacy` in the same commit.
- `generate_lead` fires once, only after FormSubmit returns `success`. On failure the form says so and keeps what
  the visitor typed. `MessageForm.astro` (corrections and privacy requests, on `/about/`) sends no GA4 event.

## Measurement

GA4 renders only when `PUBLIC_GA4_ID` is set at build time (a repo variable; the coordinator creates the property).
`generate_lead` is the only key event. Keep enhanced measurement on: outbound clicks count readers sent to the brands.

## Design

The "Paint chip" palette: plum `#3B2752` for trust and mint `#8FD3B6` for highlights. Every colour is a token on
`:root` in `src/styles/global.css`. Mint is only a fill behind dark text or a decorative bar, never text. Fonts
(Inter, Bricolage Grotesque) are self-hosted via Fontsource and the CSS is inlined, which keeps mobile Lighthouse
performance at 96–100.
