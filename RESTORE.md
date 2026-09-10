# RESTORE PROCEDURE - READ BEFORE REDEPLOYING ANYTHING FROM THIS REPO
Generated 2026-08-24 18:02

## THE DECISION (taken 24 Aug 2026)
public/ is a CDN capture, not deploy source. Netlify post-processes HTML on
delivery and strips `data-netlify` from every form. Rather than leave that as
a landmine, the attribute has been RE-AUTHORED into every form that still
carries a `name=` attribute, because Netlify keys a form on its name and the
name survives delivery.

  files patched this run : 11
  already correct        : 0

## WHAT IS STILL NOT GUARANTEED
1. `netlify-honeypot` and any custom form attributes were also stripped and
   are NOT recoverable from the delivered HTML. If a form used a honeypot, it
   must be re-added by hand.
2. Other post-processing (minification, asset inlining, injected snippets) is
   baked into these files. Redeploying them re-processes already-processed
   output. It works, but it is not lossless.
3. /_redirects is UNRECOVERED. RECONCILED 2026-09-10: _redirects.OBSERVED and
   _redirects.RECONSTRUCTED have been merged into _redirects.RECONCILED, which
   supersedes both. It also fixes a dead loop found during that reconciliation
   (/organizer-register was swallowed by the organizer.* catch-all and returned
   the sign-in page). It sits at repo root, NOT in public/, so it cannot go
   live until this repo is deploy-safe. See AUDIT-2026-09-10.md sections 4 & 8.
4. netlify.toml.RECONSTRUCTED is derived from the API, not the original file.

## RESTORE ORDER
1. DONE 2026-09-10 - use _redirects.RECONCILED. It host-routes guest. and
   organizer.; the catch-all does swallow every asset path on those subdomains,
   which is why both portals load site.js by ABSOLUTE URL (verified). Copy it to
   public/_redirects only as part of a deploy that has cleared steps 2-4.
2. Confirm netlify.toml.RECONSTRUCTED against the Netlify UI build settings.
3. Deploy netlify/functions/submission-created.js WITH the site. Without it,
   organizer event submissions silently stop.
4. After deploying, submit a REAL test event and confirm the alert email
   arrives. That is the only proof the form wiring survived.

## DO NOT
Do not connect this repo to Netlify as a build source until steps 1-3 are done
and step 4 has passed once.
