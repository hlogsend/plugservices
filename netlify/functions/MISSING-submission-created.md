MISSING SOURCE â€” submission-created

The live site runs a Netlify function named `submission-created`
(aws_lambda, nodejs22.x, 278,730 bytes, created 2026-08-17).
Its SOURCE IS NOT RECOVERABLE:

  - not on this machine (no netlify/functions folder anywhere)
  - Netlify reports has_source_zip = true but exposes no endpoint to
    download it (all five candidate endpoints return 404)
  - the zip that built it lived in a cloud sandbox that no longer exists

WHAT IT DOES (inferred from the site's environment variables):
  env vars on this site are exactly:  WP_APP_USER, WP_APP_PASSWORD
  It is the Netlify Forms `submission-created` event handler. It takes a
  form submission and posts it into the WordPress bridge, authenticating
  with a WP Application Password (HTTP Basic). The 17 Aug session record
  calls it "the video passthrough" â€” it carries `video_url` through to
  the event, which plugin v1.20.0 added to the bridge intake list.

WHY THIS REPO IS NOT YET DEPLOYABLE:
  A Netlify build from this repo would produce a site with NO function,
  which silently breaks organizer event submissions. The function must be
  rewritten and end-to-end tested BEFORE this repo is connected to Netlify
  as the build source.

DO NOT connect this repo to Netlify until that is done.
