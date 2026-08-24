// Per-event Open Graph tags for event.html?e=<slug> — WhatsApp/Facebook previews
const EVENTS = {
  ottawa: {
    title: "Ottawa White Party 2026 — Tickets | PlugServices",
    desc: "Fri Sep 4, 2026 · Mosaic Convention Centre, Ottawa. Dress code: all white. MC Couzo & DJ Rikta. Singles $40 · Couples $70. Secure tickets on PlugServices.",
    img: "https://tickets.plugservices.ca/wp-content/uploads/2026/06/ChatGPT-Image-Jun-19-2026-09_44_21-PM.png"
  },
  brunch: {
    title: "Summer Brunch in Calgary — Tickets | PlugServices",
    desc: "Sun Aug 30, 2026 · Prairie Winds Park, Calgary. Family-friendly African summer brunch by Cathy La Tigresse. Adults $30 · Kids $20.",
    img: "https://tickets.plugservices.ca/wp-content/uploads/2026/06/Summer-4.jpg"
  },
  edmonton: {
    title: "Festival Rire d'Afrique 2026 — Edmonton — Tickets | PlugServices",
    desc: "Sat Oct 10, 2026 · Edmonton. L'humoriste ivoirien Boukary en One Man Show — rires, culture et partage. Standard $50 · VIP $70.",
    img: "https://tickets.plugservices.ca/wp-content/uploads/2026/06/Edmonton.jpg"
  },
  calgary: {
    title: "Festival Rire d'Afrique 2026 — Calgary — Tickets | PlugServices",
    desc: "Sun Oct 11, 2026 · Calgary. Boukary en One Man Show — la grande célébration de l'humour africain en Alberta. Standard $50 · VIP $70.",
    img: "https://tickets.plugservices.ca/wp-content/uploads/2026/06/Calgary.jpg"
  }
};

const esc = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export default async (request, context) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("e");
  const response = await context.next();
  const ev = slug && EVENTS[slug];
  if (!ev) return response;
  let html = await response.text();
  html = html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(ev.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(ev.desc)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(ev.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(ev.desc)}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${ev.img}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1https://plugservices.ca/event.html?e=${slug}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(ev.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(ev.desc)}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${ev.img}$2`)
    .replace(/<meta name="twitter:card" content="summary"/, '<meta name="twitter:card" content="summary_large_image"');
  return new Response(html, { headers: response.headers });
};

export const config = { path: "/event.html" };
