# BACKUP STATUS - 2026-08-24 16:56

Production deploy : 6a8c121cdbcf0b3a6dba6287
Published at      : 2026-08-24T09:42:54.735Z
Manifest files    : 44
public/site.js    : 37f9c580e845b8ba42cdae1ab54c3244d92ef19f

## What this backup IS
public/ was downloaded from the live CDN and each file compared by SHA-1
against the Netlify deploy manifest.

  byte-exact          : 19
  differs from stored : 20
  not downloadable    : 5

## What this backup IS NOT
It is NOT a byte-exact copy of the deploy source, and it CANNOT be redeployed
blind. Two reasons, both measured, not assumed:

1. Netlify POST-PROCESSES HTML on delivery. Every .html served by the CDN
   differs from the file that was uploaded. It also STRIPS data-netlify
   attributes - so redeploying a CDN-downloaded HTML file would silently
   break the Netlify Forms wiring on that page.

2. These files are never served, so they cannot be recovered this way:
     /.netlify/internal/edge-functions/9b611d2a6d25336a1e2395e3411be4ee098d8a8b1f1be33d3ffa12f3617a7b2d.eszip
     /.netlify/internal/edge-functions/119dfa768408bf74972b3f218980553f3280acfeb99a9dc62ecdff6fa2884434.tar.gz
     /_redirects
     /netlify.toml
     /.netlify/internal/edge-functions/manifest.json

   /_redirects is the important one. It host-routes guest.plugservices.ca and
   organizer.plugservices.ca. _redirects.RECONSTRUCTED in this repo is a
   RECONSTRUCTION, not the original. Verify it by hand before ever relying on it.

## Before connecting this repo to Netlify
Do not. A build from this repo would redeploy post-processed HTML and the
reconstructed _redirects. Fix both first.
