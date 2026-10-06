# spacetoreno.com

A guide to **renovating a home in Singapore** (HDB flat, condo or landed), from the first plan to the end of the
works. It isn't a sales site. It's run by the OurKampung team, and no company is named (independence brief,
`../jtc-family/briefs/independence.md`, 6 Oct 2026). Junk to Clear is a separate renovation and disposal company we
refer jobs to (no referral fees); guides link to it only where that's the reader's next step, introduced as "a
renovation and disposal company we refer jobs to". Astro 7, static, GitHub Pages (deploys from `main`). The README has the commands, structure,
form and measurement details.

## The OurKampung family (read first)

The lanes between the sister sites, the linking rules, brand facts and the shared facts table live in one file for
the whole family. It wins over anything below:

@../jtc-family/PORTFOLIO.md

SpaceToReno's brief is `../jtc-family/briefs/spacetoreno.md`, and the family revamp is
`../jtc-family/briefs/family-revamp.md`.

SpaceToReno's lane: **renovation, from planning to the end of the works.** OurKampung keeps "BTO key collection to
move-in" and the "after-renovation checklist"; link its checklist, as a sister guide, for the move-in side.

## Content rules

- Every rule links to its official source (HDB, BCA, URA, NEA, EMA, PUB, SCDF, MOM, CASE, CCS, Singapore Statutes
  Online) and is listed in the guide's `sources`. If it can't be sourced, it doesn't go in.
- No invented prices, statistics, durations or testimonials. Talk about cost only with a cited source; otherwise
  explain what drives it. Illustrations follow the same rule.
- Condo by-laws and contracts aren't law: say so and tell readers to check their own.
- Family and partner links: at most two per guide, only at the step that needs the service, and disclosed in the
  sentence. Never "our", "sister" or "same team" for Junk to Clear, never rank or review our own sites or partners, no "best ID / contractor" lists, no `rel="noreferrer"`.
- Family footer: only "Part of OurKampung" (nofollow). No other sitewide links to family sites. No phone number,
  WhatsApp link or email address anywhere: contact is form-only.
- British spelling, plain English, answer first.

## Before pushing

- `npm run build && npm run audit` must pass.
- Don't push changes the user hasn't seen. After a push, tell the coordinator session.
- Live URLs are a one-way door: don't rename hubs or guide slugs once they're live.
