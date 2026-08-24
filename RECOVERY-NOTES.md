# What is and is not in this backup

Generated 2026-08-24 after three passes against the live Netlify deploy
`6a8966a1f44a15cd569ca00b`.

## Recovered and trustworthy
- `public/` - 39 of 44 files pulled from the live CDN.
  **17 are byte-identical** to Netlify's stored copy (sha1-verified).
- `_redirects` - **reconstructed from behaviour**, see the header of that file.
  Routing faithful; original syntax unknowable.

## Recovered but NOT byte-identical (22 files, all HTML)
Netlify post-processes HTML as it serves it, so the delivered bytes never match
the stored bytes. The CONTENT is right; the file is not the original source.
Affected: about, checkout, city-*(7), confidentiality, contact, events, faq,
gallery, index, organizer-register, partners, portal-guest, portal-organizer,
privacy, submit-event, submit-thanks.

## Not recovered at all
| File | Why |
|---|---|
| `netlify.toml` | never served publicly; API exposes metadata only |
| `.netlify/internal/edge-functions/*` (3) | build artifacts, not source |
| `netlify/functions/submission-created.js` | **source lost** - see below |

## The function - the one real gap
`submission-created`, nodejs22.x, 278,730 bytes, created 17 Aug 2026.
It is the Netlify Forms handler that posts organizer event submissions into
the WordPress bridge - the "video passthrough" carrying `video_url`.
Site env vars are exactly `WP_APP_USER` and `WP_APP_PASSWORD`, so it
authenticates with a WordPress Application Password over HTTP Basic.
Those env vars remain on the site, so a rewrite would still authenticate.

**Consequence:** this repo is NOT yet safe to connect to Netlify as a build
source. A build from it would produce a site with no function and silently
break event submissions.

## Your actual rollback today
Netlify keeps every past deploy. Netlify app -> plugservices -> Deploys ->
pick `6a8966a1f44a15cd569ca00b` -> "Publish deploy". Instant, and it restores
the function too. **That, not this zip, is your disaster recovery right now.**
This zip is insurance against losing the Netlify account itself.
