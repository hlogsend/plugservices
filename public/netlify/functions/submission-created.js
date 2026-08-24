/**
 * PlugServices Phase-3 pipeline (v2 — full automation).
 * Fires on every Netlify form submission. For "event-submission", calls the
 * PlugServices REST Bridge /plug/v1/submit-event which INSTANTLY publishes
 * the event (safety-screened), creates the WooCommerce product, sideloads
 * the poster (or uses the branded placeholder), creates the organizer
 * account, and sends welcome + "your event is LIVE" emails.
 * Requires env vars WP_APP_USER and WP_APP_PASSWORD.
 */
exports.handler = async (event) => {
  try {
    const user = process.env.WP_APP_USER;
    const pass = process.env.WP_APP_PASSWORD;
    if (!user || !pass) {
      return { statusCode: 200, body: "WP credentials not configured; skipped." };
    }
    const payload = (JSON.parse(event.body || "{}") || {}).payload || {};
    if ((payload.form_name || "") !== "event-submission") {
      return { statusCode: 200, body: "Not the event form; ignored." };
    }
    const d = payload.data || {};
    const poster =
      (d.poster && typeof d.poster === "object" && (d.poster.url || d.poster.href)) ||
      (typeof d.poster === "string" && /^https?:/.test(d.poster) ? d.poster : "");
    const fileUrl = (v) =>
      (v && typeof v === "object" && (v.url || v.href)) ||
      (typeof v === "string" && /^https?:/.test(v) ? v : "");
    const gallery = ["gallery-photo-1","gallery-photo-2","gallery-photo-3","gallery-photo-4"]
      .map((k) => fileUrl(d[k])).filter(Boolean);
    const body = {
      title: d["event-title"] || "",
      category: d["category"] || "",
      date: d["event-date"] || "",
      time: d["start-time"] || "",
      end_date: d["event-end-date"] || "",
      end_time: d["end-time"] || "",
      city: d["city"] || "",
      city_other: d["city-other"] || "",
      venue: d["venue"] || "",
      address: d["address"] || "",
      tiers: d["ticket-tiers"] || "",
      description: d["description"] || "",
      video_url: d["video-url"] || "",
      organizer: d["organizer"] || "",
      email: d["email"] || "",
      poster_url: poster || "",
      gallery_urls: gallery,
    };
    const res = await fetch("https://tickets.plugservices.ca/wp-json/plug/v1/submit-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(user + ":" + pass).toString("base64"),
      },
      body: JSON.stringify(body),
    });
    const out = await res.text();
    return { statusCode: 200, body: "WP " + res.status + ": " + out.slice(0, 300) };
  } catch (e) {
    return { statusCode: 200, body: "Pipeline error (form still saved): " + e.message };
  }
};
