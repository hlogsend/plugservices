# BACKUP STATUS - generated 2026-08-24 02:24

Production deploy: 6a8966a1f44a15cd569ca00b
Manifest: 44 files

## source/   (byte-exact from the Netlify API)
Byte-exact files: 0 of 44
Failed: 44

## public/   (downloaded from the live CDN)
DO NOT TREAT public/ AS SOURCE. Netlify post-processes HTML on delivery, so
every .html served by the CDN differs from the stored file. In the first pass
17 of 44 matched, 22 HTML files differed for that reason, and 5 could not be
downloaded at all because Netlify never serves them:
  /_redirects            <-- host-routes the organizer and guest portals
  /netlify.toml
  /.netlify/internal/edge-functions/*  (3 build artifacts)

If source/ is complete, use source/. Otherwise this backup is PARTIAL.
