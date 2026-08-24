# plugservices.ca â€” static site

Reconstructed from Netlify production deploy on 2026-08-24.
Every file in `public/` was downloaded from the live CDN and its SHA-1
verified byte-for-byte against the Netlify deploy file manifest.

/ public          exactly what production serves today
/ netlify/functions   see MISSING-submission-created.md â€” READ IT FIRST

## Before connecting this to Netlify
The `submission-created` function source was lost. Building from this repo
as-is would drop it and break event submissions. See the note in
netlify/functions/.

## Deploy method in use until then
File-digest deploy against api.netlify.com with a personal access token.
See the project docs: plugservices-deploy-transport-truth-2026-08-24.md
