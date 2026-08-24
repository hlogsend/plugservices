/* ===========================================================================
 * netlify/functions/submission-created.js
 * REBUILT 24 Aug 2026. The original source was lost; this is written against
 * BOTH ends of the contract, each read directly rather than assumed:
 *
 *   FORM  plugservices.ca/submit-event.html
 *         <form name="event-submission" enctype="multipart/form-data">
 *         27 fields, read live from the page.
 *
 *   WP    plugsvc_auto_publish_submission() in plugservices-rest-bridge.php
 *         POST /wp-json/plug/v1/submit-event
 *         permission_callback: current_user_can('edit_posts')
 *         reads exactly these params:
 *           title category date time end_date end_time city city_other
 *           venue address tiers description video_url organizer email
 *           poster_url   + gallery_urls (array)
 *
 * Auth: WordPress Application Password over HTTP Basic, from the site's
 * existing env vars WP_APP_USER / WP_APP_PASSWORD. Nothing else is needed.
 * ======================================================================== */

const WP_ENDPOINT =
  'https://tickets.plugservices.ca/wp-json/plug/v1/submit-event';

/* form field  ->  WP parameter.  Verified against the live form. */
const MAP = {
  'event-title':    'title',
  'category':       'category',
  'event-date':     'date',
  'start-time':     'time',
  'event-end-date': 'end_date',
  'end-time':       'end_time',
  'city':           'city',
  'city-other':     'city_other',
  'venue':          'venue',
  'address':        'address',
  'ticket-tiers':   'tiers',
  'description':    'description',
  'video-url':      'video_url',
  'organizer':      'organizer',
  'email':          'email',
  'poster':         'poster_url',
  /* The form marks time-zone REQUIRED but the current WP handler does not
   * read it, so submitted events inherit no mep_time_zone_display. Sent
   * anyway: WordPress ignores unknown params today, and the day the bridge
   * adds `time_zone` to its intake list this starts working with no redeploy
   * of this function. */
  'time-zone':      'time_zone'
};

const GALLERY = ['gallery-photo-1', 'gallery-photo-2', 'gallery-photo-3', 'gallery-photo-4'];

/* Netlify sends file uploads as a URL string, or sometimes as an object
 * carrying { url }. Accept both, reject anything that is not a URL. */
function asUrl(v) {
  if (!v) { return ''; }
  const s = typeof v === 'string' ? v.trim() : String((v && (v.url || v.href)) || '').trim();
  return /^https?:\/\//i.test(s) ? s : '';
}

function str(v) {
  if (v === null || v === undefined) { return ''; }
  return typeof v === 'string' ? v.trim() : String(v).trim();
}

exports.handler = async function (event) {
  let payload;
  try {
    const body = JSON.parse(event.body || '{}');
    payload = body.payload || body;
  } catch (e) {
    console.error('[submission-created] unparseable body:', e && e.message);
    return { statusCode: 200, body: 'ignored: bad json' };
  }

  const formName = payload.form_name || payload.formName || '';
  if (formName && formName !== 'event-submission') {
    console.log('[submission-created] ignoring form:', formName);
    return { statusCode: 200, body: 'ignored: other form' };
  }

  const data = payload.data || {};
  const out = {};
  for (const formKey of Object.keys(MAP)) {
    const wpKey = MAP[formKey];
    out[wpKey] = (formKey === 'poster') ? asUrl(data[formKey]) : str(data[formKey]);
  }
  out.gallery_urls = GALLERY.map(function (k) { return asUrl(data[k]); }).filter(Boolean);

  const user = process.env.WP_APP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  if (!user || !pass) {
    console.error('[submission-created] WP_APP_USER / WP_APP_PASSWORD missing — cannot post');
    return { statusCode: 200, body: 'env missing' };
  }
  const auth = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

  console.log('[submission-created] posting:', JSON.stringify({
    title: out.title, city: out.city, date: out.date,
    hasPoster: !!out.poster_url, gallery: out.gallery_urls.length,
    hasVideo: !!out.video_url
  }));

  try {
    const res = await fetch(WP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': auth
      },
      body: JSON.stringify(out)
    });
    const text = await res.text();
    if (!res.ok) {
      console.error('[submission-created] WP rejected', res.status, text.slice(0, 500));
    } else {
      console.log('[submission-created] WP ok', res.status, text.slice(0, 300));
    }
  } catch (e) {
    console.error('[submission-created] POST failed:', e && e.message);
  }

  /* Always 200. A non-2xx makes Netlify retry, which would double-publish
   * an event that actually succeeded. Failures are visible in the logs. */
  return { statusCode: 200, body: 'ok' };
};
