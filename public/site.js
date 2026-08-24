/* PlugServices — shared engine: header/footer, events data, cart, mobile menu, FR translate */
const LOGO = "https://tickets.plugservices.ca/wp-content/uploads/2024/04/cropped-PHOTO-2024-04-03-10-37-57_1-270x270.jpg";

/* Real event flyers hosted on plugservices.ca */
const F = {
  ottawa:  "https://tickets.plugservices.ca/wp-content/uploads/2026/08/Photo_1.png",
  brunch:  "https://tickets.plugservices.ca/wp-content/uploads/2026/06/Summer-4.jpg",
  edmonton:"https://tickets.plugservices.ca/wp-content/uploads/2026/06/Edmonton.jpg",
  calgary: "https://tickets.plugservices.ca/wp-content/uploads/2026/06/Calgary.jpg",
  g1:"https://tickets.plugservices.ca/wp-content/uploads/2025/06/PHOTO-2025-08-22-00-39-42_1.jpg",
  g2:"https://tickets.plugservices.ca/wp-content/uploads/2025/06/PHOTO-2025-08-22-00-39-38_1.jpg",
  g3:"https://tickets.plugservices.ca/wp-content/uploads/2025/06/PHOTO-2025-08-22-00-39-39_1.jpg",
  g4:"https://tickets.plugservices.ca/wp-content/uploads/2025/06/PHOTO-2025-08-22-00-39-43_1.jpg",
  white:"https://tickets.plugservices.ca/wp-content/uploads/2024/04/All-White-Party-2-1024x1024.jpg",
  crowd:"https://tickets.plugservices.ca/wp-content/uploads/2024/04/pexels-photo-1209843.jpeg",
  stage:"https://tickets.plugservices.ca/wp-content/uploads/2024/04/Transformative-1-1024x718.jpg",
  food:"https://tickets.plugservices.ca/wp-content/uploads/2024/04/pexels-photo-4557831.jpeg"
};

/* Blue "SAMPLE EVENT" placeholder flyer for sample listings */
const SAMPLE_SVG = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'><rect width='800' height='800' fill='#1e73ff'/><text x='400' y='400' font-family='Arial,Helvetica,sans-serif' font-size='78' font-weight='bold' fill='#ffffff' text-anchor='middle'>SAMPLE EVENT</text><text x='400' y='505' font-family='Arial,Helvetica,sans-serif' font-size='46' font-weight='bold' fill='#dbe8ff' text-anchor='middle'>LIST YOUR EVENT</text><text x='400' y='565' font-family='Arial,Helvetica,sans-serif' font-size='46' font-weight='bold' fill='#dbe8ff' text-anchor='middle'>HERE NOW</text></svg>";
const SAMPLE_FLYER = "data:image/svg+xml," + encodeURIComponent(SAMPLE_SVG);
function getLikes(){ try{ return JSON.parse(localStorage.getItem('pe_likes')||'[]'); }catch(e){ return []; } }
function isLiked(slug){ return getLikes().indexOf(slug) > -1; }
function toggleLike(ev, slug){
  ev.preventDefault(); ev.stopPropagation();
  var likes=getLikes(); var i=likes.indexOf(slug);
  if(i>-1){ likes.splice(i,1); } else { likes.push(slug); }
  try{ localStorage.setItem('pe_likes', JSON.stringify(likes)); }catch(e){}
  document.querySelectorAll('.fav[data-slug="'+slug+'"]').forEach(function(el){ el.textContent = i>-1 ? '\ud83e\udd0d' : '\u2764\ufe0f'; el.classList.toggle('on', i===-1); });
  var chip=document.getElementById('likedChip'); if(chip){ chip.textContent='\u2764\ufe0f Liked ('+getLikes().length+')'; }
  if(window.__likedOnly) applyFilters();
}
function toggleLikedFilter(btn){
  window.__likedOnly = !window.__likedOnly;
  btn.classList.toggle('active', window.__likedOnly);
  applyFilters();
}
/* Organizers you have personally vetted — shown with a ✔ tick. Add slugs here. */
var VERIFIED_ORGS = ["plugservices","plug-trading-services","pont-cultural-bridge","cathy-la-tigresse",
  "kilimandjaro-productions","cican","golden-era-records-nexoria-events"];
function flyerFor(e){ return e.sample ? SAMPLE_FLYER : e.flyer; }
function peCur(){ try{ return localStorage.getItem('pe_cur')||'CAD'; }catch(e){ return 'CAD'; } }
function peSetCur(c){ try{ localStorage.setItem('pe_cur', c); }catch(e){}
  document.querySelectorAll('#curCAD,#curUSD').forEach(a=>a.classList.toggle('on', a.textContent.trim()===(c==='USD'?'USD':'CAD')));
  }
function peCurUrl(u){ if(!u) return u; try{ const url=new URL(u); if(peCur()==='USD'){ url.searchParams.set('currency','USD'); } else { url.searchParams.delete('currency'); } return url.toString(); }catch(e){ return u; } }
function peApplyCur(){ document.querySelectorAll('a[href*="tickets.plugservices.ca"]').forEach(a=>{ if(/\/eve\/|\/checkout/.test(a.href)) a.href=peCurUrl(a.href); }); }

/* ---------- GEO + CATEGORY NORMALIZATION (v20) ---------- */
/* Metro rollups: suburb -> the metro chip shown on the site. */
var GTA_CITIES = ["toronto","north york","scarborough","etobicoke","east york","york","downsview",
  "mississauga","brampton","markham","vaughan","richmond hill","pickering","ajax","whitby","oshawa",
  "oakville","burlington","milton","newmarket","aurora","thornhill","concord","woodbridge","maple",
  "king city","stouffville","whitchurch-stouffville","caledon","georgetown","halton hills","uxbridge",
  "bolton","kleinburg","nobleton","gormley","gta","greater toronto area"];
/* Metro Vancouver (incl. Surrey, Fraser Valley commuter belt). */
var METRO_VAN = ["vancouver","surrey","burnaby","richmond","coquitlam","port coquitlam","port moody",
  "new westminster","new west","delta","north delta","tsawwassen","ladner","langley","township of langley",
  "walnut grove","cloverdale","white rock","north vancouver","west vancouver","maple ridge","pitt meadows",
  "abbotsford","mission","chilliwack","squamish","bowen island","anmore","belcarra","lions bay",
  "metro vancouver","greater vancouver","lower mainland","fraser valley","yvr","bc lower mainland"];
var CA_PROV = ["ab","alberta","bc","british columbia","on","ontario","qc","quebec","québec","mb","manitoba",
  "sk","saskatchewan","ns","nova scotia","nb","new brunswick","nl","newfoundland","pe","pei",
  "prince edward island","yt","yukon","nt","northwest territories","nu","nunavut"];
var US_STATES = ["ny","new york","ga","georgia","tx","texas","co","colorado","nv","nevada","ca","california",
  "md","maryland","dc","washington","mn","minnesota","oh","ohio","il","illinois","ma","massachusetts",
  "nj","new jersey","pa","pennsylvania","fl","florida","wa","north carolina","nc","virginia","va"];
function _k(v){ return String(v==null?"":v).trim().toLowerCase(); }
/* Overseas detection (rule: any city NOT in Canada/USA always rolls into International). */
var INTL_COUNTRIES = ["cameroon","cameroun","nigeria","ghana","senegal","sénégal","senegal","ivory coast",
  "côte d'ivoire","cote d'ivoire","burundi","rwanda","kenya","ethiopia","congo","dr congo","drc","rdc",
  "congo-brazzaville","gabon","benin","bénin","togo","mali","guinea","guinée","equatorial guinea",
  "burkina faso","niger","chad","tchad","south africa","morocco","maroc","algeria","algérie","tunisia",
  "tunisie","egypt","tanzania","uganda","zambia","zimbabwe","angola","mozambique","madagascar","comoros",
  "djibouti","eritrea","somalia","sudan","south sudan","liberia","sierra leone","gambia","cape verde",
  "cap-vert","mauritania","mauritius","seychelles","france","belgium","belgique","united kingdom","uk",
  "england","germany","allemagne","netherlands","italy","spain","portugal","switzerland","suisse",
  "haiti","haïti","jamaica","trinidad","trinidad and tobago","guadeloupe","martinique","brazil","mexico"];
var INTL_CITIES = ["douala","yaounde","yaoundé","kribi","bafoussam","buea","lagos","abuja","ibadan","accra",
  "kumasi","dakar","abidjan","yamoussoukro","bujumbura","gitega","kigali","nairobi","mombasa","addis ababa",
  "kinshasa","lubumbashi","goma","brazzaville","pointe-noire","libreville","cotonou","porto-novo","lome",
  "lomé","bamako","conakry","ouagadougou","niamey","ndjamena","n'djamena","johannesburg","cape town",
  "durban","pretoria","casablanca","rabat","marrakech","algiers","alger","tunis","cairo","dar es salaam",
  "kampala","lusaka","harare","luanda","maputo","banjul","freetown","monrovia","nouakchott","paris",
  "london","londres","brussels","bruxelles","amsterdam","berlin","madrid","lisbon","rome","geneva",
  "genève","port-au-prince","kingston","fort-de-france","pointe-à-pitre"];
/* Canonical city for filtering/display. Rolls suburbs into their metro and sends
   anything outside Canada/USA to the "International" bucket (never an orphan).
   "Other" and "Online" are merged into a single "Online" bucket. */
function normalizeCity(city, state, country){
  var c = _k(city), st = _k(state), co = _k(country);
  /* Virtual events first — never international, never "Other". */
  if (c === "online" || c === "virtual" || c === "en ligne" || c === "webinar" || c === "other") return "Online";
  var isIntl = false;
  if (co && ["canada","ca","usa","us","united states","united states of america"].indexOf(co) < 0) isIntl = true;
  if (!isIntl && (INTL_COUNTRIES.indexOf(st) > -1 || INTL_COUNTRIES.indexOf(c) > -1)) isIntl = true;
  if (!isIntl && !co && INTL_CITIES.indexOf(c) > -1) isIntl = true;
  /* Compound entries like "Yaoundé/Cameroon" (even with a wrong country selected):
     check every token of the city/state strings against the overseas lists. */
  if (!isIntl && (c.indexOf("/") > -1 || c.indexOf(",") > -1 || st.indexOf("/") > -1)) {
    var toks = (c + "/" + st).split(/[\/,;]+/);
    for (var ti = 0; ti < toks.length; ti++) {
      var tk = toks[ti].trim();
      if (tk && (INTL_COUNTRIES.indexOf(tk) > -1 || INTL_CITIES.indexOf(tk) > -1)) { isIntl = true; break; }
    }
  }
  if (!isIntl && st && CA_PROV.indexOf(st) < 0 && US_STATES.indexOf(st) < 0 && co === "") {
    /* no country given and the "province" isn't a CA/US one -> treat as overseas */
    if (st.length > 1 && !c) isIntl = true;
  }
  if (isIntl) return "International";
  if (GTA_CITIES.indexOf(c) > -1) return "Toronto";
  if (METRO_VAN.indexOf(c) > -1) return "Vancouver";
  if (!c) {
    /* No city supplied: fall back to something meaningful rather than "Canada". */
    if (GTA_CITIES.indexOf(st) > -1) return "Toronto";
    if (METRO_VAN.indexOf(st) > -1) return "Vancouver";
    return "Online";
  }
  return String(city).trim();
}
/* Filler categories that describe nothing — never used as the primary label. */
var CAT_FILLER = ["live event","community event","event","events","other","general","uncategorized","uncategorised"];
function normalizeCat(name){
  if(!name) return "";
  var k=_k(name);
  var map={ "concert":"Concert","concerts":"Concert","afrobeats":"Concert","music":"Concert","live music":"Concert","show":"Concert",
    "party":"Party","parties":"Party","white party":"Party","nightlife":"Party","club":"Party","nye":"Party",
    "comedy":"Comedy","humour":"Comedy","humor":"Comedy","stand-up":"Comedy","one man show":"Comedy",
    "festival":"Festival","festivals":"Festival","carnival":"Festival","mas":"Festival","masquerade":"Festival",
    "conference":"Conference","conference event":"Conference","summit":"Conference","business":"Conference","expo":"Conference","networking":"Conference",
    "national day":"National Day","independence":"National Day","fete d'independance":"National Day",
    "gala":"Gala","gala night":"Gala","awards":"Gala","award":"Gala",
    "brunch":"Brunch","family":"Family","gospel":"Gospel","food":"Food & Business","food & business":"Food & Business" };
  if(map[k]) return map[k];
  return String(name).trim().charAt(0).toUpperCase()+String(name).trim().slice(1);
}
/* ONE primary category for the card label: most specific real category wins. */
var CAT_RANK = ["Festival","Concert","Comedy","National Day","Gala","Conference","Party","Brunch","Gospel","Food & Business","Family"];
function primaryCat(cats){
  if(!cats || !cats.length) return "Event";
  var real = cats.filter(function(c){ return CAT_FILLER.indexOf(_k(c)) < 0; });
  if(!real.length) return "Event";
  for(var i=0;i<CAT_RANK.length;i++){ if(real.indexOf(CAT_RANK[i]) > -1) return CAT_RANK[i]; }
  return real[0];
}

/* EVENTS — real listings first (with live data), then expansion samples. dkey = YYYYMMDD sort key. */
let EVENTS = [
  { slug:"ottawa", dkey:20260904, wp:"https://tickets.plugservices.ca/eve/ottawa-white/", title:"Ottawa White Party 2026", cat:["Party"], catLabel:"Party",
    city:"Ottawa", region:"ON", m:"Sep", d:"04", date:"Friday, September 4, 2026", time:"6:00 PM – 3:00 AM",
    venue:"Cello Events", address:"2465 St Laurent Blvd, Ottawa, ON K1G 6C3",
    org:"PlugServices", extra:"🎶 MC Couzo · DJ Rikta · 👗 Dress code: White only", flyer:F.ottawa, real:true,
    tiers:[{n:"Single",p:40,note:"35 remaining"},{n:"Couple",p:70,note:"10 remaining"},{n:"Door (Single)",p:50,note:"15 remaining"},{n:"Door (Couple)",p:100,note:"15 remaining"}],
    desc:["✨ OTTAWA WHITE PARTY 2026 — A Night to Remember ✨","Dress in white. Celebrate in style. Create memories that last forever. 🤍 Join PlugServices for an unforgettable evening of elegance, music, connection, and amazing vibes.","🌟 Beautiful people. Great energy. One unforgettable night."],
    gallery:[F.ottawa,F.white,F.crowd,F.stage] },

  { slug:"brunch", dkey:20260830, wp:"https://tickets.plugservices.ca/eve/summer-brunch-in-calgary/", title:"Summer Brunch in Calgary", cat:["Brunch","Family"], catLabel:"Brunch · Family",
    city:"Calgary", region:"AB", m:"Aug", d:"30", date:"Sunday, August 30, 2026", time:"2:00 PM – 9:00 PM",
    venue:"Prairie Winds Park", address:"223 Castleridge Blvd NE, Calgary, AB T3J 3J8",
    org:"Cathy La Tigresse", extra:"👗 Dress code: White · 🍽️ Masso Food Catering", flyer:F.brunch, real:true,
    tiers:[{n:"Adults",p:30,note:"25 remaining"},{n:"Kids (5–15)",p:20,note:"10 remaining"}],
    desc:["Join us for a beautiful afternoon of food, music, laughter, and community at Summer Brunch 2026! 🌿✨","Bring your family and friends for a memorable summer gathering — great vibes, delicious brunch, and unforgettable moments.","👗 Come dressed in white and celebrate summer with us! ☀️🤍"],
    gallery:[F.brunch,'https://images.unsplash.com/photo-1561049527-9743861dce35?auto=format&fit=crop&w=900&q=70','https://images.unsplash.com/photo-1755003842792-9d2b7ad08862?auto=format&fit=crop&w=900&q=70','https://images.unsplash.com/photo-1658227412301-75d89b92aae0?auto=format&fit=crop&w=900&q=70'] },

  { slug:"edmonton", dkey:20261010, wp:"https://tickets.plugservices.ca/eve/festival-rire-dafrique-2026-edmonton/", title:"Festival Rire d'Afrique — Edmonton", cat:["Comedy","Festival"], catLabel:"Comedy Festival",
    city:"Edmonton", region:"AB", m:"Oct", d:"10", date:"Samedi 10 octobre 2026", time:"6:00 PM – 10:00 PM",
    venue:"Venue announced soon", address:"Edmonton, Alberta",
    org:"Pont Cultural Bridge", extra:"🎤 One Man Show · humoriste international · 🍛 Food & Business", flyer:F.edmonton, real:true,
    tiers:[{n:"Standard",p:50,note:"35 remaining"},{n:"VIP",p:70,note:"10 remaining"}],
    desc:["EDMONTON – FESTIVAL RIRE D'AFRIQUE EN ALBERTA 2026","Une soirée exceptionnelle de rires, de culture et de partage réunissant humour, musique, poésie et slam pour célébrer la richesse culturelle africaine en Alberta. 🌍","🎶 Une soirée remplie d'énergie, de rencontres et de moments inoubliables!"],
    gallery:[F.edmonton,'https://images.unsplash.com/photo-1611956425642-d5a8169abd63?auto=format&fit=crop&w=900&q=70','https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=900&q=70','https://images.unsplash.com/photo-1647589047037-ba94e650388f?auto=format&fit=crop&w=900&q=70'] },

  { slug:"calgary", dkey:20261011, wp:"https://tickets.plugservices.ca/eve/festival-rire-dafrique-2026-calgary/", title:"Festival Rire d'Afrique — Calgary", cat:["Comedy","Festival"], catLabel:"Comedy Festival",
    city:"Calgary", region:"AB", m:"Oct", d:"11", date:"Dimanche 11 octobre 2026", time:"7:00 PM – 11:00 PM",
    venue:"Venue announced soon", address:"Calgary, Alberta",
    org:"Pont Cultural Bridge", extra:"🎤 One Man Show – l'humoriste ivoirien Boukary", flyer:F.calgary, real:true,
    tiers:[{n:"Standard",p:50,note:"35 remaining"},{n:"VIP (cocktail + photo)",p:70,note:"15 remaining"}],
    desc:["Calgary, préparez-vous pour la grande célébration de l'humour africain en Alberta! 🌍✨","Une soirée mémorable avec l'humoriste ivoirien Boukary — rires, émotions et bonne humeur. 😂","🍛 Cuisine africaine, boissons variées et stands culturels · 🤝 une rencontre entre cultures, entrepreneurs et passionnés."],
    gallery:[F.calgary,'https://images.unsplash.com/photo-1647589047037-ba94e650388f?auto=format&fit=crop&w=900&q=70','https://images.unsplash.com/photo-1611956425642-d5a8169abd63?auto=format&fit=crop&w=900&q=70','https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=900&q=70'] },

  /* ---- Expansion sample listings (new cities & categories) ---- */
  { slug:"afro-mtl", dkey:20261107, title:"Afrobeats Live — Montréal", cat:["Concert"], catLabel:"Concert", sample:true,
    city:"Montréal", region:"QC", m:"Nov", d:"07", date:"Saturday, November 7, 2026", time:"9:00 PM",
    venue:"To be announced", address:"Montréal, QC", org:"PlugServices", extra:"🎶 Live Afrobeats & Amapiano", flyer:F.g4,
    tiers:[{n:"Early Bird",p:30,note:""},{n:"General",p:45,note:""}], desc:["Sample listing — an Afrobeats night to show how PlugServices expands into Montréal."], gallery:[F.g4,F.g1,F.white] },

  { slug:"conf-tor", dkey:20261114, title:"Africa Business Summit — Toronto", cat:["Conference"], catLabel:"Conference", sample:true,
    city:"Toronto", region:"ON", m:"Nov", d:"14", date:"Saturday, November 14, 2026", time:"9:00 AM – 5:00 PM",
    venue:"To be announced", address:"Toronto, ON", org:"Africa Development Network", extra:"🎤 Keynotes · panels · networking", flyer:F.stage,
    tiers:[{n:"Delegate",p:75,note:""},{n:"VIP / Exhibitor",p:250,note:""}], desc:["Sample listing — a diaspora business conference showing PlugServices beyond nightlife: conferences, summits, and networking."], gallery:[F.stage,F.crowd,F.g2] },

  { slug:"natl-hou", dkey:20261121, title:"Cameroon National Day Gala — Houston", cat:["National Day","Gala"], catLabel:"National Day", sample:true,
    city:"Houston", region:"TX", m:"Nov", d:"21", date:"Saturday, November 21, 2026", time:"6:00 PM", country:"USA",
    venue:"To be announced", address:"Houston, TX", org:"PlugServices", extra:"🎉 Culture · cuisine · live band", flyer:F.crowd,
    tiers:[{n:"General",p:55,note:""},{n:"VIP Table",p:500,note:"seats 8"}], desc:["Sample listing — a national-day celebration showing PlugServices in USA and community/cultural galas."], gallery:[F.crowd,F.white,F.g3] },

  { slug:"gala-atl", dkey:20261205, title:"Diaspora Awards Gala — Atlanta", cat:["Gala","National Day"], catLabel:"Awards Gala", sample:true,
    city:"Atlanta", region:"GA", m:"Dec", d:"05", date:"Saturday, December 5, 2026", time:"7:00 PM", country:"USA",
    venue:"To be announced", address:"Atlanta, GA", org:"PlugServices", extra:"🏆 Black-tie awards evening", flyer:F.g3,
    tiers:[{n:"Seat",p:80,note:""},{n:"VIP Table",p:650,note:"seats 8"}], desc:["Sample listing — a formal awards gala showing the platform's range beyond parties."], gallery:[F.g3,F.white,F.stage] },

  { slug:"afro-nyc", dkey:20261212, title:"Afrobeats Night — New York City", cat:["Concert"], catLabel:"Concert", sample:true,
    city:"New York City", region:"NY", m:"Dec", d:"12", date:"Saturday, December 12, 2026", time:"10:00 PM", country:"USA",
    venue:"To be announced", address:"New York City, NY", org:"PlugServices", extra:"🎶 NYC diaspora party", flyer:F.g1,
    tiers:[{n:"Advance",p:40,note:""},{n:"VIP",p:90,note:""}], desc:["Sample listing — a New York City Afrobeats night."], gallery:[F.g1,F.white,F.g2] },

  { slug:"vegas", dkey:20261231, title:"Diaspora NYE — Las Vegas", cat:["Party"], catLabel:"NYE Party", sample:true,
    city:"Las Vegas", region:"NV", m:"Dec", d:"31", date:"Thursday, December 31, 2026", time:"9:00 PM", country:"USA",
    venue:"To be announced", address:"Las Vegas, NV", org:"PlugServices", extra:"🥂 New Year's Eve gala", flyer:F.white,
    tiers:[{n:"General",p:90,note:""},{n:"VIP Table",p:800,note:"seats 8"}], desc:["Sample listing — a New Year's Eve gala in Las Vegas."], gallery:[F.white,F.g1,F.g4] },

  { slug:"food-den", dkey:20270220, title:"Taste of Africa Expo — Denver", cat:["Conference"], catLabel:"Expo & Business", sample:true,
    city:"Denver", region:"CO", m:"Feb", d:"20", date:"Saturday, February 20, 2027", time:"12:00 PM", country:"USA",
    venue:"To be announced", address:"Denver, CO", org:"PlugServices", extra:"🍛 Food · vendors · culture", flyer:F.food,
    tiers:[{n:"Entry",p:15,note:""},{n:"Vendor booth",p:150,note:""}], desc:["Sample listing — a food & business expo in Denver."], gallery:[F.food,F.stage,F.crowd] }
];
EVENTS.sort((a,b)=>a.dkey-b.dkey); /* default: filtered by date (earliest first) */
const ALL_EVENTS = EVENTS.slice();
function todayKey(){ const n=new Date(); return n.getFullYear()*10000+(n.getMonth()+1)*100+n.getDate(); }
const PAST_EVENTS = EVENTS.filter(e=>e.dkey < todayKey());
EVENTS = EVENTS.filter(e=>e.dkey >= todayKey()); /* expired events auto-drop from all listings */
function realEvents(){ return EVENTS.filter(function(e){ return !e.sample; }); }
function featuredEvents(n){
  var list=realEvents().slice();
  /* v57: Top Picks shows real events only - never padded with samples. */
  return list.slice(0, n);
}
function orgSlug(name){ return String(name||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
/* Search across everything a human might type. */
function haystack(e){
  return [e.title,e.city,e.region,e.venue,e.address,e.org,e.catLabel,(e.cat||[]).join(" "),e.extra]
    .filter(Boolean).join(" ").toLowerCase();
}
/* "Just added" = published in the last 10 days (WP post date). */
function isNew(e){
  if(!e.published) return false;
  var d=new Date(e.published); if(isNaN(d)) return false;
  return (Date.now()-d.getTime())/86400000 <= 10;
}
/* Honest scarcity from real seat counts / tier notes — never invented. */
function scarcity(e){
  var left = null;
  if(typeof e.seatsAvailable === "number" && e.seatsAvailable >= 0) left = e.seatsAvailable;
  else if(e.tiers && e.tiers.length){
    var n=0, found=false;
    e.tiers.forEach(function(t){ var m=/(\d+)\s*(remaining|left)/i.exec(t.note||""); if(m){ n+=parseInt(m[1],10); found=true; } });
    if(found) left=n;
  }
  if(left===null) return null;
  if(left<=0) return {t:"Sold out",cls:"b-out"};
  if(left<=10) return {t:"Only "+left+" left",cls:"b-hot"};
  if(left<=30) return {t:"Selling fast",cls:"b-warm"};
  return null;
}
/* Days until the event, for the "Sales end soon" nudge. */
function daysUntil(e){
  var y=Math.floor(e.dkey/10000), m=Math.floor(e.dkey/100)%100, d=e.dkey%100;
  return Math.ceil((new Date(y,m-1,d) - new Date())/86400000);
}
function getEvent(slug){ return ALL_EVENTS.find(e=>e.slug===slug); }
function priceFrom(e){ return Math.min.apply(null, e.tiers.map(t=>t.p)); }

/* ---------- CART ---------- */
function cartGet(){ try{ return JSON.parse(localStorage.getItem("pe_cart")||"[]"); }catch(e){ return []; } }
function cartSave(c){ try{ localStorage.setItem("pe_cart", JSON.stringify(c)); }catch(e){} updateCartCount(); }
function cartCount(){ return cartGet().reduce((n,i)=>n+i.qty,0); }
function cartTotal(){ return cartGet().reduce((n,i)=>n+i.qty*i.price,0); }
function cartAdd(item){ const c=cartGet(); const ex=c.find(i=>i.event===item.event&&i.tier===item.tier); if(ex) ex.qty+=item.qty; else c.push(item); cartSave(c); toast(item.qty+" × "+item.tier+" added to cart"); }
function cartClear(){ cartSave([]); }
function updateCartCount(){ const el=document.querySelector(".cartbtn .count"); if(el) el.textContent=cartCount(); }

/* ---------- LANGUAGE (Google auto-translate EN/FR) ---------- */
window.googleTranslateElementInit=function(){
  try{ new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'en,fr',autoDisplay:false},'google_translate_element'); }catch(e){}
};
function loadGoogleTranslate(){
  if(document.getElementById('gt-script')) return;
  var s=document.createElement('script'); s.id='gt-script';
  s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.body.appendChild(s);
}
function peLang(l){
  var v='/en/'+l;
  document.cookie='googtrans='+v+';path=/';
  try{ var h=location.hostname; document.cookie='googtrans='+v+';path=/;domain='+h; document.cookie='googtrans='+v+';path=/;domain=.'+h; }catch(e){}
  location.reload();
}
function currentLang(){ var m=document.cookie.match(/googtrans=\/en\/(\w+)/); return m?m[1]:'en'; }

/* ---------- MOBILE MENU ---------- */
function toggleMenu(){ var n=document.getElementById('navLinks'); if(n) n.classList.toggle('open'); }

/* ---------- HEADER / FOOTER ---------- */
function renderChrome(){
  const active=document.body.getAttribute("data-active")||"";
  const lang=currentLang();
  const link=(href,label,key)=>`<a href="${href}" class="${active===key?'active':''}" onclick="var n=document.getElementById('navLinks');if(n)n.classList.remove('open')">${label}</a>`;
  const header=document.getElementById("site-header");
  if(header) header.innerHTML=`<header class="nav"><div class="wrap nav-in">
      <a class="logo" href="index.html"><img src="${LOGO}" alt="PlugServices logo"><span class="wordmark notranslate" translate="no">Plug<b>Services</b></span></a>
      <nav class="nav-links" id="navLinks">
        ${link("events.html","Find Events","events")}
        ${link("index.html#cats","Categories","cats")}
        ${link("partners.html","Partners","partners")}
        ${link("submit-event.html","Sell Tickets","submit")}
        ${link("faq.html","FAQ","faq")}
        ${link("about.html","About","about")}
      </nav>
      <div class="nav-right">
        <span class="lang" translate="no"><a href="#" id="langEN" class="${lang==='en'?'on':''}" onclick="peLang('en');return false">EN</a> / <a href="#" id="langFR" class="${lang==='fr'?'on':''}" onclick="peLang('fr');return false">FR</a></span>
        <a href="submit-event.html" class="btn btn-flame btn-sm listbtn"><span class="ll-full">List your event</span><span class="ll-short">+ List</span></a>
        <a href="https://tickets.plugservices.ca/checkout/" class="cartbtn2" id="hdrCart" aria-label="Cart" translate="no">🛒<span class="count" id="hdrCartCount" style="display:none">0</span></a>
        <button class="hamb" aria-label="Menu" onclick="toggleMenu()">☰</button>
      </div>
      <div id="google_translate_element" translate="no"></div>
    </div>
    <div class="loginbar"><div class="wrap loginbar-in">
      <a class="lbtn lbtn-org" href="/organizer-login" rel="noopener">🔑 Organizer Login</a>
      <a class="lbtn lbtn-guest" href="/guest-login" rel="noopener">🎟️ Guest Login</a>
    </div></div></header>`;
  const footer=document.getElementById("site-footer");
  if(footer) footer.innerHTML=`<footer class="site"><div class="wrap">
      <div class="fgrid">
        <div class="fbrand">
          <a class="logo" href="index.html" style="color:#fff"><img src="${LOGO}" alt=""><span class="wordmark notranslate" translate="no">Plug<b style="color:var(--amber)">Services</b></span></a>
          <p>African events, live across Canada &amp; USA — parties, comedy, festivals, conferences &amp; national-day galas. La culture, célébrée.</p>
          <a href="https://whatsapp.com/channel/0029VbDlqhl9Gv7QmtEp7i3f" rel="noopener" target="_blank" style="display:inline-block;margin-top:14px;text-decoration:none;text-align:center">
            <img src="assets/whatsapp-qr.png" alt="PlugServices WhatsApp Channel QR code" width="128" loading="lazy" style="width:128px;border-radius:12px;display:block;margin:0 auto 7px">
            <span style="color:#3ddc71;font-weight:800;font-size:12.5px">💬 Follow the PlugServices (Event Platform)<br>channel on WhatsApp</span>
          </a>
          <div class="fsoc-h">Follow us</div>
          <div class="fsocial">
            <a class="fb" href="https://www.facebook.com/profile.php?id=61577020693349" target="_blank" rel="noopener" aria-label="PlugServices on Facebook"><span class="ficon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg></span>Facebook</a>
            <a class="ig" href="https://instagram.com/plugevents_canada" target="_blank" rel="noopener" aria-label="PlugServices on Instagram"><span class="ficon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0z"/><path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4z"/><circle cx="18.41" cy="5.59" r="1.44"/></svg></span>Instagram</a>
            <a class="wa" href="https://whatsapp.com/channel/0029VbDlqhl9Gv7QmtEp7i3f" target="_blank" rel="noopener" aria-label="PlugServices WhatsApp Channel"><span class="ficon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.13c-1.5 0-2.98-.4-4.27-1.17l-.31-.18-3.17.83.85-3.09-.2-.32a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 5.83 2.41 8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.7 8.32-8.12 8.32z"/></svg></span>WhatsApp</a>
          </div>
        </div>
        <div><h5>Discover</h5>
          <a href="events.html">All events</a><a href="events.html?cat=Concert">Concerts</a><a href="events.html?cat=Party">Parties</a>
          <a href="events.html?cat=Comedy">Comedy</a><a href="events.html?cat=Conference">Conferences</a><a href="events.html?cat=National%20Day">National Day</a><a href="gallery.html">Gallery</a></div>
        <div><h5>Guests</h5>
          <a href="/guest-login" rel="noopener">🎟️ My tickets (Guest login)</a>
          <a href="events.html">Find an event</a>
          <a href="privacy.html#refund">Refunds &amp; cancellations</a>
          <a href="faq.html">Guest FAQ</a>
          <a href="contact.html">Contact us</a></div>
        <div><h5>Organizers</h5>
          <a href="submit-event.html">Create an event &amp; sell tickets</a>
          <a href="partners.html">Partners</a><a href="faq.html#org">Organizer FAQ</a>
          <a href="/organizer-login" rel="noopener">🔑 Organizer login</a></div>
        <div><h5>Company</h5>
          <a href="about.html">About</a><a href="contact.html">Contact</a><a href="faq.html">FAQ</a><a href="privacy.html">Privacy</a><a href="confidentiality.html">Confidentiality</a><a href="privacy.html#terms">Terms</a><a href="privacy.html#refund">Refunds &amp; cancellations</a><a href="privacy.html#payouts">Organizer payouts</a></div>
      </div>
      <div class="fbot">
        <span><span translate="no">PlugServices</span> is an event promotion platform managed by <b translate="no" style="color:#cfc4ea">Plug Trading Services Inc.</b> © 2026. All rights reserved.</span>
        
      </div></div></footer>`;
  updateCartCount();
}


/* ---------- v56: TIME ZONE LABELS — every event time is stamped with its zone ---------- */
var TZ_BY_CITY = {
  /* Mountain */ "calgary":"MT","edmonton":"MT","red deer":"MT","lethbridge":"MT","fort mcmurray":"MT",
  "grande prairie":"MT","banff":"MT","airdrie":"MT","rocky view county":"MT","denver":"MT","phoenix":"MST",
  /* Pacific */ "vancouver":"PT","surrey":"PT","burnaby":"PT","richmond":"PT","victoria":"PT",
  "seattle":"PT","los angeles":"PT","san francisco":"PT","oakland":"PT","las vegas":"PT","san diego":"PT",
  /* Central */ "winnipeg":"CT","saskatoon":"CT","regina":"CST","houston":"CT","dallas":"CT","chicago":"CT",
  "austin":"CT","minneapolis":"CT","new orleans":"CT",
  /* Eastern */ "ottawa":"ET","toronto":"ET","north york":"ET","scarborough":"ET","mississauga":"ET",
  "brampton":"ET","markham":"ET","hamilton":"ET","london":"ET","kitchener":"ET","windsor":"ET","oshawa":"ET",
  "montréal":"ET","montreal":"ET","québec city":"ET","quebec city":"ET","gatineau":"ET","laval":"ET","longueuil":"ET",
  "new york city":"ET","new york":"ET","atlanta":"ET","boston":"ET","miami":"ET","philadelphia":"ET",
  "washington":"ET","charlotte":"ET","orlando":"ET","detroit":"ET",
  /* Atlantic */ "halifax":"AT","moncton":"AT","fredericton":"AT","charlottetown":"AT","saint john":"AT",
  "st. john's":"NT","st johns":"NT"
};
/* Returns the short zone label for a city, or "" when we can't be certain. */
function tzForCity(city){
  if(!city) return "";
  var c = String(city).toLowerCase().trim();
  if(c==="online"||c==="virtual") return "";
  if(TZ_BY_CITY[c]) return TZ_BY_CITY[c];
  var k = Object.keys(TZ_BY_CITY);
  for(var i=0;i<k.length;i++){ if(c.indexOf(k[i])>-1) return TZ_BY_CITY[k[i]]; }
  return "";
}
/* Appends the zone to a time string: "7:00 PM" -> "7:00 PM MT" */
function withTZ(timeStr, city){
  if(!timeStr) return timeStr||"";
  var z = tzForCity(city);
  if(!z) return timeStr;
  if(String(timeStr).toUpperCase().indexOf(" "+z)>-1) return timeStr;
  return timeStr + " " + z;
}

/* ---------- CARD RENDERING ---------- */
function cardHTML(e){
  const href = e.wp ? e.wp : `event.html?e=${e.slug}`;
  const sc = scarcity(e);
  const dn = daysUntil(e);
  const badges = [];
  if(sc) badges.push(`<span class="ebadge ${sc.cls}">${sc.t}</span>`);
  else if(dn>=0 && dn<=7) badges.push(`<span class="ebadge b-warm">${dn<=1?'Happening now':'In '+dn+' days'}</span>`);
  if(isNew(e)) badges.push(`<span class="ebadge b-new">Just added</span>`);
  return `<a class="card" href="${href}" data-city="${e.city}" data-cat="${e.cat.join(',')}">
    <div class="thumb"><div class="datebadge"><div class="m">${e.m}</div><div class="d">${e.d}</div></div>
      ${e.sample?'<div class="sampletag">Sample</div>':''}<div class="fav${isLiked(e.slug)?' on':''}" data-slug="${e.slug}" onclick="toggleLike(event,'${e.slug}')">${isLiked(e.slug)?'❤️':'🤍'}</div>
      ${badges.length?`<div class="badgerow">${badges.join('')}</div>`:''}
      <img src="${flyerFor(e)}" alt="${e.title}"></div>
    <div class="body"><div class="catlab">${primaryCat(e.cat)} · ${e.city}</div><h3>${e.title}</h3>
      <div class="meta"><span>📍 ${e.venue}, ${e.city}</span><span>🗓️ ${e.m} ${e.d}${e.time?` · ${withTZ(e.time.split('–')[0].trim(), e.city)}`:''}</span></div>
      ${e.org?`<div class="orgline">${VERIFIED_ORGS.indexOf(orgSlug(e.org))>-1?'<span class="vtick" title="Verified organizer">✔</span> ':''}${e.org}</div>`:''}
      <div class="foot"><span class="price">${e.tiers&&e.tiers.length?(priceFrom(e)>0?`$${priceFrom(e)} <small>+</small>`:`Free`):`<small>On sale now</small>`}</span><span class="btn btn-flame btn-sm">${e.sample?"List Your Event":"Get Tickets"}</span></div></div></a>`;
}
function renderCards(containerId, list){ const el=document.getElementById(containerId); if(el) el.innerHTML=list.map(cardHTML).join(""); }

/* ---------- FILTERS + DISCOVERY (events page, v20) ---------- */
let filterState={city:"all",cat:"all",when:"all",sort:"soon",q:"",exactDay:null};

/* Approx city centres for "Near me". */
var CITY_GEO = {
  "Calgary":[51.05,-114.07], "Edmonton":[53.55,-113.49], "Ottawa":[45.42,-75.70],
  "Toronto":[43.65,-79.38], "Vancouver":[49.25,-123.11], "Montréal":[45.50,-73.57],
  "New York City":[40.71,-74.01], "Atlanta":[33.75,-84.39], "Houston":[29.76,-95.37],
  "Denver":[39.74,-104.99], "Las Vegas":[36.17,-115.14]
};
function haversine(a,b,c,d){
  var R=6371,p=Math.PI/180,dLat=(c-a)*p,dLon=(d-b)*p;
  var x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a*p)*Math.cos(c*p)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return 2*R*Math.asin(Math.sqrt(x));
}
/* Preselect the nearest city that actually has events. */
function useMyLocation(btn){
  if(!navigator.geolocation){ toast("Location isn't available in this browser"); return; }
  if(btn){ btn.classList.add("busy"); btn.textContent="📍 Locating…"; }
  navigator.geolocation.getCurrentPosition(function(pos){
    var la=pos.coords.latitude, lo=pos.coords.longitude, best=null, bestD=1e9;
    var live={}; EVENTS.forEach(function(e){ if(!e.sample) live[e.city]=1; });
    Object.keys(CITY_GEO).forEach(function(c){
      if(!live[c]) return;
      var d=haversine(la,lo,CITY_GEO[c][0],CITY_GEO[c][1]);
      if(d<bestD){ bestD=d; best=c; }
    });
    if(btn){ btn.classList.remove("busy"); btn.textContent="📍 Near me"; }
    if(!best){ toast("No events near you yet — showing everything"); return; }
    filterState.city=best;
    document.querySelectorAll('[data-chipgroup="city"] .chip').forEach(function(c){
      c.classList.toggle("active",(c.getAttribute("data-val")||"all")===best);
    });
    applyFilters();
    toast("Closest city with events: "+best+" ("+Math.round(bestD)+" km)");
  }, function(){
    if(btn){ btn.classList.remove("busy"); btn.textContent="📍 Near me"; }
    toast("Location permission denied — pick a city instead");
  }, {timeout:8000, maximumAge:600000});
}
/* Hero search bar (homepage): filter in place instead of navigating away.
   Falls back to a normal GET to events.html if the grid isn't on this page. */
function heroSearch(form){
  if(!document.getElementById("allEvents")) return true; /* let the form submit normally */
  var q  = (document.getElementById("heroQ")||{}).value || "";
  var c  = (document.getElementById("heroCity")||{}).value || "";
  var k  = (document.getElementById("heroCat")||{}).value || "";
  var d  = (document.getElementById("heroDate")||{}).value || "";
  filterState.q = String(q).trim().toLowerCase();
  /* The hero only carries a search box now; city/type/date live with the results,
     so only override them when those (optional) hero controls actually exist. */
  if(document.getElementById("heroCity")) filterState.city = c || "all";
  if(document.getElementById("heroCat"))  filterState.cat  = k || "all";
  var si=document.getElementById("evSearch"); if(si) si.value=q;
  /* a specific date -> show everything and let the search text narrow it */
  if(d){
    var dk = parseInt(String(d).replace(/-/g,""),10);
    filterState.when = "all";
    filterState.exactDay = dk;
  } else { filterState.exactDay = null; }
  /* reflect the picks in the chip rows */
  document.querySelectorAll('[data-chipgroup="city"] .chip').forEach(function(x){
    x.classList.toggle("active",(x.getAttribute("data-val")||"all")===filterState.city);
  });
  document.querySelectorAll('[data-chipgroup="cat"] .chip').forEach(function(x){
    x.classList.toggle("active",(x.getAttribute("data-val")||"all")===filterState.cat);
  });
  syncFilterChips();
  applyFilters();
  var sec=document.getElementById("events");
  if(sec) sec.scrollIntoView({behavior:"smooth",block:"start"});
  return false; /* never reload */
}
function setSearch(v){ filterState.q=String(v||"").trim().toLowerCase(); applyFilters(); }
function setWhen(sel){ filterState.when=sel.value; applyFilters(); }
function setSort(sel){ filterState.sort=sel.value; applyFilters(); }
function clearAllFilters(){
  filterState={city:"all",cat:"all",when:"all",sort:"soon",q:"",exactDay:null};
  window.__likedOnly=false;
  var hq=document.getElementById("heroQ"); if(hq) hq.value="";
  var si=document.getElementById("evSearch"); if(si) si.value="";
  var w=document.getElementById("evWhen"); if(w) w.value="all";
  var so=document.getElementById("evSort"); if(so) so.value="soon";
  var lc=document.getElementById("likedChip"); if(lc) lc.classList.remove("active");
  document.querySelectorAll("[data-chipgroup]").forEach(function(g){
    g.querySelectorAll(".chip").forEach(function(c){ c.classList.toggle("active",(c.getAttribute("data-val")||"all")==="all"); });
  });
  applyFilters();
}
function inWindow(e){
  if(filterState.exactDay && e.dkey !== filterState.exactDay) return false;
  if(filterState.when==="all") return true;
  var d=daysUntil(e);
  if(filterState.when==="weekend"){
    var y=Math.floor(e.dkey/10000),m=Math.floor(e.dkey/100)%100,dd=e.dkey%100;
    var dow=new Date(y,m-1,dd).getDay();
    return d>=0 && d<=7 && (dow===5||dow===6||dow===0);
  }
  if(filterState.when==="week") return d>=0 && d<=7;
  if(filterState.when==="month") return d>=0 && d<=31;
  return true;
}
function matchFilter(e){
  return (filterState.city==="all"||e.city===filterState.city) &&
         (filterState.cat==="all"||e.cat.includes(filterState.cat)) &&
         inWindow(e) &&
         (!filterState.q || haystack(e).indexOf(filterState.q) > -1);
}
function sortList(list){
  var l=list.slice();
  if(filterState.sort==="new") l.sort(function(a,b){ return (new Date(b.published||0))-(new Date(a.published||0)) || a.dkey-b.dkey; });
  else if(filterState.sort==="price") l.sort(function(a,b){
    var pa=(a.tiers&&a.tiers.length)?priceFrom(a):1e9, pb=(b.tiers&&b.tiers.length)?priceFrom(b):1e9;
    return pa-pb || a.dkey-b.dkey; });
  else l.sort(function(a,b){ return a.dkey-b.dkey; });
  return l;
}

/* ---------- v57: HONEST EMPTY STATE (no fake listings, ever) ---------- */
function plugNotifyCity(){
  var c = (filterState && filterState.city && filterState.city!=="all") ? filterState.city : "";
  var k = (filterState && filterState.cat  && filterState.cat!=="all")  ? filterState.cat  : "";
  return (c||k) ? [c,k].filter(Boolean).join(" · ") : "";
}
function renderEmptyState(shownCount, totalLive){
  var host = document.getElementById("noResults");
  if(!host) return;
  if(shownCount){ host.style.display="none"; host.innerHTML=""; return; }
  var what = plugNotifyCity();
  var line = what
    ? ("No live events match <b>"+what+"</b> yet.")
    : "No live events match this filter yet.";
  var elsewhere = totalLive>0
    ? ('<p style="margin:8px 0 0">We have <b>'+totalLive+'</b> live event'+(totalLive===1?'':'s')+' on PlugServices right now &mdash; <a href="events.html" style="color:var(--flame);font-weight:800">see all of them &rarr;</a></p>')
    : '';
  host.style.display="block";
  host.innerHTML =
    '<div class="emptystate">'
    + '<div class="es-ico" aria-hidden="true">\uD83D\uDD0E</div>'
    + '<h3>'+line+'</h3>'
    + elsewhere
    + '<form class="es-notify" onsubmit="return plugNotifySubmit(this)">'
    +   '<label for="esEmail">Get an email the moment one is listed'+(what?(" in <b>"+what+"</b>"):"")+'</label>'
    +   '<div class="es-row">'
    +     '<input id="esEmail" type="email" name="email" required placeholder="you@example.com" autocomplete="email">'
    +     '<button class="btn btn-flame" type="submit">Notify me</button>'
    +   '</div>'
    +   '<p class="es-msg" id="esMsg" role="status"></p>'
    + '</form>'
    + '<p class="es-org">Organizing something? <a href="submit-event.html">List your event &rarr;</a></p>'
    + '</div>';
}
function plugNotifySubmit(form){
  var email=(form.email.value||"").trim();
  var msg=document.getElementById("esMsg");
  if(!email){ return false; }
  if(msg){ msg.textContent="Adding you\u2026"; msg.className="es-msg"; }
  var city=(filterState&&filterState.city&&filterState.city!=="all")?filterState.city:"";
  fetch("https://tickets.plugservices.ca/wp-json/plug/v1/subscribe",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({email:email, city:city, source:"empty-state-notify"})
  }).then(function(r){ return r.json().catch(function(){return {};}); })
    .then(function(){ if(msg){ msg.textContent="\u2713 Done \u2014 we\u2019ll email you as soon as an event is listed."; msg.className="es-msg ok"; } form.reset(); var inp=form.querySelector("input"); if(inp) inp.style.display="none"; var btn=form.querySelector("button"); if(btn){ btn.disabled=true; btn.textContent="\uD83C\uDF89 You\u2019re on the list!"; } })
    .catch(function(){ if(msg){ msg.textContent="Couldn\u2019t save that \u2014 email hello@plugservices.ca and we\u2019ll add you."; msg.className="es-msg err"; } });
  return false;
}

function applyFilters(){
  /* Only real (published) events. Samples surface only when a filter has no real match. */
  let real=EVENTS.filter(e=>!e.sample && matchFilter(e));
  if(window.__likedOnly) real=real.filter(e=>isLiked(e.slug));
  let list=sortList(real), showingSample=false;
  /* v57: never render a sample/demo card. An empty filter gets an honest empty state. */
  /* Optional cap (homepage uses data-max="12"): show the first N, link to the rest. */
  const host=document.getElementById("allEvents");
  const max=host?parseInt(host.getAttribute("data-max")||"0",10):0;
  const shown=(max>0)?list.slice(0,max):list;
  renderCards("allEvents", shown);
  const more=document.getElementById("moreLink");
  if(more) more.style.display=(max>0 && list.length>max)?"block":"none";
  const pastHost=document.getElementById("pastEvents");
  if(pastHost && PAST_EVENTS.length){
    document.getElementById("pastWrap").style.display="";
    renderCards("pastEvents", PAST_EVENTS.slice().reverse());
  }
  const sn=document.getElementById("sampleNote"); if(sn) sn.style.display="none";
  const totalLive = realEvents().length;
  renderEmptyState(list.length, totalLive);
  const cnt=document.getElementById("resultCount");
  if(cnt) cnt.textContent = (max>0 && real.length>max)
      ? ("Showing "+max+" of "+real.length+" events")
      : (real.length===1 ? "1 event found" : real.length+" events found");
}
/* Self-healing filters: if the WP feed brings a city (or category) we have no chip
   for, add the chip automatically so a live event can never become unreachable. */
function syncFilterChips(){
  var grp=document.querySelector('[data-chipgroup="city"]');
  if(grp){
    var have={}; grp.querySelectorAll(".chip").forEach(function(c){ have[c.getAttribute("data-val")||"all"]=1; });
    var want=[...new Set(realEvents().map(function(e){ return e.city; }))].filter(function(c){ return c && !have[c]; });
    want.sort().forEach(function(city){
      var el=document.createElement("span");
      el.className="chip"; el.setAttribute("data-val",city); el.textContent=city;
      el.addEventListener("click",function(){
        grp.querySelectorAll(".chip").forEach(function(x){ x.classList.remove("active"); });
        el.classList.add("active"); filterState.city=city; applyFilters();
      });
      grp.appendChild(el);
    });
  }
  var cg=document.querySelector('[data-chipgroup="cat"]');
  if(cg){
    var haveC={}; cg.querySelectorAll(".chip").forEach(function(c){ haveC[c.getAttribute("data-val")||"all"]=1; });
    var wantC=[...new Set(realEvents().map(function(e){ return primaryCat(e.cat); }))]
      .filter(function(c){ return c && c!=="Event" && !haveC[c]; });
    wantC.sort().forEach(function(cat){
      var el=document.createElement("span");
      el.className="chip"; el.setAttribute("data-val",cat); el.textContent=cat;
      el.addEventListener("click",function(){
        cg.querySelectorAll(".chip").forEach(function(x){ x.classList.remove("active"); });
        el.classList.add("active"); filterState.cat=cat; applyFilters();
      });
      cg.appendChild(el);
    });
  }
}

/* ---------- v57: per-city SEO landing pages (/events/<city>) ---------- */
function initCityLanding(){
  var C = window.__CITY_LANDING; if(!C) return;
  filterState.city = C.name;
  var head = document.querySelector(".phead .wrap");
  if(head){
    var h1 = head.querySelector("h1"); if(h1) h1.textContent = "African events in " + C.name;
    var p  = head.querySelector("p");
    if(p) p.innerHTML = "Concerts, parties, comedy nights, festivals, conferences and national-day galas happening in <b>"+C.name+"</b>, "+C.prov+
      ". Tickets are delivered as a QR code the moment you pay. <i>Les meilleurs \u00e9v\u00e9nements africains \u00e0 "+C.name+".</i>";
    var cr = head.querySelector(".crumb");
    if(cr) cr.innerHTML = '<a href="/index.html">Home</a> / <a href="/events.html">Events</a> / '+C.name;
  }
  /* reflect the preselected city in the chip row */
  var grp=document.querySelector('[data-chipgroup="city"]');
  if(grp){
    var found=false;
    grp.querySelectorAll(".chip").forEach(function(c){
      var on = (c.getAttribute("data-val")===C.name);
      c.classList.toggle("active", on); if(on) found=true;
    });
    if(!found){
      var el=document.createElement("span");
      el.className="chip active"; el.setAttribute("data-val",C.name); el.textContent=C.name;
      grp.insertBefore(el, grp.firstChild);
    }
  }
}

function initChips(){
  document.querySelectorAll("[data-chipgroup]").forEach(group=>{
    group.querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>{
      group.querySelectorAll(".chip").forEach(x=>x.classList.remove("active")); c.classList.add("active");
      filterState[group.getAttribute("data-chipgroup")]=c.getAttribute("data-val")||"all"; applyFilters();
    }));
  });
}

/* ---------- EVENT DETAIL PAGE ---------- */
function renderEvent(){
  const host=document.getElementById("eventDetail"); if(!host) return;
  const slug=new URLSearchParams(location.search).get("e")||"ottawa";
  const e=getEvent(slug); if(!e){ host.innerHTML='<div class="wrap"><p style="padding:40px 0">Event not found. <a href="events.html" style="color:var(--flame)">Browse all events →</a></p></div>'; return; }
  if(e.wp){ location.replace(e.wp); return; } /* real events live on the ticket engine — no intermediary page */
  document.title=e.title+" — Tickets | PlugServices";
  const ended = e.dkey < todayKey();
  const tiers=e.tiers.map(t=>`<div class="tier" data-tier="${t.n}" data-price="${t.p}">
      <div><div class="n">${t.n}</div><div class="p">$${t.p.toFixed(2)}${t.note?' · '+t.note:''}</div></div>
      <div class="qty"><button class="minus" type="button">–</button><span class="qval">0</span><button class="plus" type="button">+</button></div></div>`).join("");
  const gal=e.gallery.map(g=>`<img src="${g}" alt="${e.title}">`).join("");
  const desc=e.desc.map(p=>`<p>${p}</p>`).join("");
  host.innerHTML=`
    <div class="wrap">
      <div class="crumb" style="color:var(--muted);margin-top:16px"><a href="index.html">Home</a> / <a href="events.html">Events</a> / ${e.title}</div>
      ${e.sample?'<div class="note" style="margin-top:12px">📌 Sample expansion listing — illustrates a new city/category. <a href="submit-event.html" style="color:var(--flame);font-weight:800">List your event here now →</a></div>':''}
      <div class="evhero">
        <div class="evmain">
          <img class="cover" src="${flyerFor(e)}" alt="${e.title}">
          <span class="pill" style="background:#f3eefc;color:var(--grape);margin-top:16px">${e.catLabel} · ${e.city}</span>
          <h1 style="font-size:32px;letter-spacing:-1px;margin:10px 0 6px">${e.title}</h1>
          <div style="color:var(--muted);font-weight:600;display:flex;flex-direction:column;gap:4px">
            <span>🗓️ ${e.date} · ${withTZ(e.time, e.city)}</span>
            <span>📍 ${e.venue} — ${e.address}</span>
            <span>👤 Organized by <a href="organizer.html?o=${orgSlug(e.org)}" style="color:var(--grape);font-weight:800">${VERIFIED_ORGS.indexOf(orgSlug(e.org))>-1?'✔ ':''}${e.org}</a>${e.extra?' · '+e.extra:''}</span>
          </div>
        </div>
        <div class="ticketbox">
          <div style="font-weight:900;font-size:18px;margin-bottom:12px">Get tickets</div>
          ${(function(){var sc=scarcity(e),dn=daysUntil(e);
            if(sc) return `<div class="ebadge ${sc.cls}" style="margin-bottom:10px;display:inline-block">${sc.t}</div>`;
            if(dn>=0&&dn<=7) return `<div class="ebadge b-warm" style="margin-bottom:10px;display:inline-block">${dn<=1?'Happening now':'Sales end soon — in '+dn+' days'}</div>`;
            return '';})()}
          ${(ended ? "" : e.tiers.map(t=>`<div class="tier"><div><div class="n">${t.n}</div><div class="p">${t.p>0?'$'+t.p.toFixed(2):'Free'}${t.note?' · '+t.note:''}</div></div></div>`).join(""))}
          ${ended ? `<div class="note" style="text-align:center">📅 This event has ended. <a href="gallery.html" style="color:var(--flame);font-weight:800">See photos in our gallery →</a></div>`
            : e.wp ? `<a class="btn btn-flame btn-lg" style="width:100%;text-align:center;display:block" href="${e.wp}">Get Tickets — Secure Checkout</a>`
            : (!e.sample ? `<a class="btn btn-flame btn-lg" style="width:100%;text-align:center;display:block" href="contact.html">Request Tickets — Contact Us</a><p class="hint center" style="margin-top:8px">Online ticket sales for this event are opening soon.</p>`
            : `<a class="btn btn-flame btn-lg" style="width:100%;text-align:center;display:block" href="submit-event.html">List Your Event</a><p class="hint center" style="margin-top:8px">This is a sample listing — your event could be here.</p>`)}
          <div class="trustbar"><span>🔒 Secure checkout</span><span>0% platform fee</span><span>📱 QR ticket by email</span><span>↩︎ Organizer refund policy</span></div>
          <p class="hint center" style="margin-top:8px">Bank processing fees may apply.</p>
        </div>
      </div>
      <div class="cols" style="margin-top:36px">
        <div class="prose">
          <h2>About this event</h2>${desc}
          <h2 id="gallery" style="margin-top:26px">Photo gallery</h2>
          <div class="gallery">${gal}</div>${e.gcredit?`<p style="font-size:11.5px;color:var(--muted);margin-top:6px" translate="no">${e.gcredit}</p>`:``}
          <p class="hint" style="margin-top:8px">Click any photo to enlarge.</p>
        </div>
        <div>
          <div class="card-flat" style="margin-bottom:18px">
            <h3 style="margin-bottom:8px">📍 Location</h3>
            <p style="color:var(--muted);font-size:14px">${e.venue}<br>${e.address}</p>
            ${e.sample ? `<div style="height:150px;border-radius:12px;margin-top:12px;background:linear-gradient(135deg,#e9e1ff,#f7f0ff);display:grid;place-items:center;color:var(--grape);font-weight:700">🗺️ Sample listing</div>` : `<iframe title="Map of ${e.venue}" src="https://maps.google.com/maps?q=${encodeURIComponent((e.venue&&e.venue!=='TBA'?e.venue+', ':'')+e.address+', '+e.city)}&z=14&output=embed" style="width:100%;height:220px;border:0;border-radius:12px;margin-top:12px" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
          </div>
          <div class="card-flat">
            <h3 style="margin-bottom:8px">👤 Organizer</h3>
            <p style="font-weight:800">${VERIFIED_ORGS.indexOf(orgSlug(e.org))>-1?'<span class="vtick" title="Verified organizer">✔</span> ':''}${e.org}</p>
            <p style="color:var(--muted);font-size:14px;margin:4px 0 12px">Presenting African diaspora events with PlugServices.</p>
            <a class="btn btn-outline btn-sm" href="organizer.html?o=${orgSlug(e.org)}">See all their events</a>
            <a class="btn btn-outline btn-sm" href="contact.html" style="margin-top:8px">Contact organizer</a>
          </div>
        </div>
      </div>
      <div style="margin:40px 0 10px"><div class="sec-head"><h2>More events</h2><a href="events.html">All events →</a></div>
        <div class="grid" id="moreEvents"></div></div>
    </div>
    <div class="lightbox" id="lightbox"><span class="x">&times;</span><img src="" alt="Enlarged"></div>`;
  renderCards("moreEvents", EVENTS.filter(x=>x.slug!==e.slug).slice(0,4));
  initTiers(e.title); initGallery();
}

/* ---------- ORGANIZER PROFILE PAGE (v20) ---------- */
function renderOrganizer(){
  var host=document.getElementById("orgDetail"); if(!host) return;
  var want=new URLSearchParams(location.search).get("o")||"";
  function build(){
    var mine=ALL_EVENTS.filter(function(e){ return !e.sample && orgSlug(e.org)===want; });
    var name = mine.length ? mine[0].org : want.replace(/-/g," ").replace(/\b\w/g,function(m){return m.toUpperCase();});
    var verified = VERIFIED_ORGS.indexOf(want) > -1;
    var upcoming = mine.filter(function(e){ return e.dkey >= todayKey(); }).sort(function(a,b){ return a.dkey-b.dkey; });
    var past = mine.filter(function(e){ return e.dkey < todayKey(); }).sort(function(a,b){ return b.dkey-a.dkey; });
    var cities=[...new Set(mine.map(function(e){return e.city;}))];
    var cats=[...new Set(mine.map(function(e){return primaryCat(e.cat);}))];
    document.title = name + " — Events & Tickets | PlugServices";
    var initials = name.split(/\s+/).map(function(w){return w[0];}).join("").slice(0,2).toUpperCase();
    var logo = mine.length && mine[0].flyer ? mine[0].flyer : "";
    host.innerHTML = `
      <div class="orghero"><div class="wrap">
        <div class="crumb" style="color:#d9ceff"><a href="index.html" style="color:#fff">Home</a> / <a href="events.html" style="color:#fff">Events</a> / ${name}</div>
        <div class="orgtop">
          <div class="orgavatar">${logo?`<img src="${logo}" alt="${name}">`:`<span>${initials}</span>`}</div>
          <div>
            <h1>${verified?'<span class="vtick big" title="Verified organizer">✔</span> ':''}${name}</h1>
            <p>${cats.length?cats.join(' · '):'Event organizer'}${cities.length?' &nbsp;·&nbsp; 📍 '+cities.join(', '):''}</p>
            <div class="orgstats">
              <div><b>${upcoming.length}</b><span>Upcoming</span></div>
              <div><b>${mine.length}</b><span>Total events</span></div>
              <div><b>${cities.length}</b><span>${cities.length===1?'City':'Cities'}</span></div>
              ${verified?'<div><b>✔</b><span>Verified</span></div>':''}
            </div>
          </div>
        </div>
      </div></div>
      <section style="padding-top:28px"><div class="wrap">
        ${upcoming.length?`<div class="sec-head"><h2>Upcoming events</h2><a href="events.html">All events →</a></div>
          <div class="grid g3" id="orgUpcoming"></div>`
        :`<div class="note">No upcoming events listed right now. <a href="events.html" style="color:var(--flame);font-weight:800">Browse all events →</a></div>`}
        ${past.length?`<div class="sec-head" style="margin-top:40px"><h2>Past events</h2><a href="gallery.html">Photo gallery →</a></div>
          <div class="grid g3" id="orgPast"></div>`:``}
        <div class="band" style="margin-top:44px;text-align:center">
          <h2 style="margin:0 auto">Are you an organizer?</h2>
          <p style="margin:10px auto 0">List your event free — 0% platform fee (bank processing fees may apply) — and get your own page like this one.</p>
          <div style="margin-top:20px;position:relative"><a class="btn btn-flame" href="submit-event.html">List your event</a></div>
        </div>
      </div></section>`;
    if(upcoming.length) renderCards("orgUpcoming", upcoming);
    if(past.length) renderCards("orgPast", past);
  }
  build();
  window.__rebuildOrganizer = build; /* re-run once the WP feed lands */
}

/* ---------- QTY + add to cart ---------- */
function initTiers(eventName){
  document.querySelectorAll("[data-tier]").forEach(row=>{
    const span=row.querySelector(".qval");
    row.querySelector(".minus").addEventListener("click",()=>{ let v=+span.textContent; if(v>0){span.textContent=v-1; recalc();} });
    row.querySelector(".plus").addEventListener("click",()=>{ span.textContent=(+span.textContent)+1; recalc(); });
  });
  function recalc(){ let t=0; document.querySelectorAll("[data-tier]").forEach(r=>{ t+=(+r.querySelector(".qval").textContent)*parseFloat(r.getAttribute("data-price")); }); const el=document.getElementById("ticketTotal"); if(el) el.textContent="$"+t.toFixed(2); }
  const btn=document.getElementById("addCart");
  if(btn) btn.addEventListener("click",()=>{
    let added=0;
    document.querySelectorAll("[data-tier]").forEach(row=>{ const q=+row.querySelector(".qval").textContent; if(q>0){ cartAdd({event:eventName,tier:row.getAttribute("data-tier"),price:parseFloat(row.getAttribute("data-price")),qty:q}); added+=q; } });
    if(!added) toast("Select at least one ticket");
    else setTimeout(()=>{ if(confirm("Tickets added. Go to checkout now?")) location.href="checkout.html"; },300);
  });
}

/* ---------- GALLERY ---------- */
function initGallery(){
  const lb=document.getElementById("lightbox"); if(!lb) return; const img=lb.querySelector("img");
  document.querySelectorAll(".gallery img").forEach(g=>g.addEventListener("click",()=>{ img.src=g.src; lb.classList.add("open"); }));
  lb.addEventListener("click",()=>lb.classList.remove("open"));
}

/* ---------- CHECKOUT (0% fee) ---------- */
function initCheckout(){
  const list=document.getElementById("coItems"); if(!list) return;
  const cart=cartGet();
  if(!cart.length){ list.innerHTML='<p style="color:var(--muted)">Your cart is empty. <a href="events.html" style="color:var(--flame);font-weight:700">Browse events →</a></p>';
    ["coSub","coFee","coTotal"].forEach(id=>{const el=document.getElementById(id); if(el) el.textContent="$0.00";}); return; }
  list.innerHTML=cart.map(i=>`<div class="li"><span>${i.qty} × ${i.tier} <em style="color:var(--muted)">— ${i.event}</em></span><b>$${(i.qty*i.price).toFixed(2)}</b></div>`).join("");
  const sub=cartTotal(); const fee=0; const tot=sub+fee;
  const set=(id,v)=>{const el=document.getElementById(id); if(el) el.textContent="$"+v.toFixed(2);};
  set("coSub",sub); set("coFee",fee); set("coTotal",tot);
  const form=document.getElementById("coForm");
  if(form) form.addEventListener("submit",e=>{ e.preventDefault(); const ok=document.getElementById("coDone"); if(ok){ ok.classList.add("show"); ok.scrollIntoView({behavior:"smooth"}); } cartClear(); list.innerHTML='<p style="color:var(--green);font-weight:700">✓ Order confirmed (demo). A real deployment emails QR tickets here.</p>'; });
}

/* ---------- demo forms ---------- */
function initDemoForms(){
  document.querySelectorAll("form[data-demo]").forEach(f=>f.addEventListener("submit",e=>{ e.preventDefault(); const ok=f.querySelector(".ok"); if(ok){ ok.classList.add("show"); ok.scrollIntoView({behavior:"smooth",block:"center"}); } f.querySelectorAll("input,textarea,select").forEach(i=>{ if(i.type!=="submit"&&i.type!=="checkbox") i.value=""; }); }));
}

/* ---------- FAQ accordion ---------- */
function initFaq(){ document.querySelectorAll(".faq-q").forEach(q=>q.addEventListener("click",()=>q.parentElement.classList.toggle("open"))); }

/* ---------- toast ---------- */
let toastT;
function toast(msg){ let t=document.querySelector(".toast"); if(!t){ t=document.createElement("div"); t.className="toast"; document.body.appendChild(t); } t.textContent=msg; requestAnimationFrame(()=>t.classList.add("show")); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("show"),2600); }

document.addEventListener("DOMContentLoaded",()=>{
  renderChrome(); renderEvent(); renderOrganizer(); initCheckout(); initDemoForms(); initFaq(); initGallery(); loadGoogleTranslate();
  if(document.getElementById("homeEvents")) renderCards("homeEvents", featuredEvents(8));
  if(document.getElementById("allEvents")){
    const p=new URLSearchParams(location.search);
    if(p.get("city")) filterState.city=p.get("city");
    if(p.get("cat")) filterState.cat=p.get("cat");
    if(p.get("q")){ filterState.q=p.get("q").toLowerCase(); var si=document.getElementById("evSearch"); if(si) si.value=p.get("q"); }
    if(p.get("when")){ filterState.when=p.get("when"); var w=document.getElementById("evWhen"); if(w) w.value=p.get("when"); }
    document.querySelectorAll("[data-chipgroup]").forEach(g=>{ const type=g.getAttribute("data-chipgroup"); g.querySelectorAll(".chip").forEach(c=>{ c.classList.toggle("active",(c.getAttribute("data-val")||"all")===filterState[type]); }); });
    initChips(); initCityLanding(); syncFilterChips(); applyFilters();
  }
});

/* ---------- v8: auto-list newly published WP events (Phase-2 pipeline) ---------- */
(function(){
  var API = "https://tickets.plugservices.ca/wp-json/wp/v2/mep_events?per_page=100&_fields=id,slug,title,date,plug_event";
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function decodeEnt(s){ var t=document.createElement("textarea"); t.innerHTML=s; return t.value; }
  var known = {};
  ALL_EVENTS.forEach(function(e){ if(e.wp){ var m=e.wp.match(/\/eve\/([^\/]+)/); if(m) known[m[1]]=1; } });
  fetch(API).then(function(r){ return r.ok ? r.json() : Promise.reject(new Error("bad status")); }).then(function(list){
    if(!Array.isArray(list)) return;
    var added = false;
    list.forEach(function(ev){
      if(known[ev.slug]) return;
      var p = ev.plug_event || {};
      var ds = String(p.event_start_date || p.event_start_datetime || "").slice(0,10);
      if(!/^\d{4}-\d{2}-\d{2}$/.test(ds)) return;
      var dkey = parseInt(ds.replace(/-/g,""),10);
      /* v44: an event stays listed until its END date passes (ongoing series were vanishing on day 2). */
      var de = String(p.event_end_date || "").slice(0,10);
      var ekey = /^\d{4}-\d{2}-\d{2}$/.test(de) ? parseInt(de.replace(/-/g,""),10) : dkey;
      if(Math.max(dkey, ekey) < todayKey()) return;
      if(dkey < todayKey()) dkey = todayKey(); /* ongoing: sort with today so it is visible up top, badge shows original month/day below */
      var dt = new Date(ds + "T12:00:00");
      var rawCats = [];
      if (Array.isArray(p.mep_tag)) rawCats = p.mep_tag;
      else if (typeof p.mep_tag === "string" && p.mep_tag) rawCats = p.mep_tag.split(",");
      if (!rawCats.length) {
        if (Array.isArray(p.mep_cat)) rawCats = p.mep_cat;
        else if (typeof p.mep_cat === "string" && p.mep_cat) rawCats = p.mep_cat.split(",");
      }
      var cats = [];
      rawCats.forEach(function(c){ var n = normalizeCat(c); if (n && cats.indexOf(n) < 0) cats.push(n); });
      if (!cats.length) cats = ["Event"];
      var cityDisplay = normalizeCity(p.mep_city, p.mep_state, p.mep_country);
      var orgName = (Array.isArray(p.mep_org) && p.mep_org.length) ? p.mep_org[0] : "";
      var eObj = {
        slug: "wp-" + ev.slug, external: true, dkey: dkey,
        wp: p.link || ("https://tickets.plugservices.ca/eve/" + ev.slug + "/"),
        title: decodeEnt((ev.title && ev.title.rendered) || ev.slug),
        cat: cats, catLabel: primaryCat(cats),
        city: cityDisplay, region: p.mep_state || "",
        m: MONTHS[dt.getMonth()], d: ("0" + dt.getDate()).slice(-2),
        date: dt.toDateString(), time: p.event_start_time || "",
        venue: p.mep_location_venue || "See event page",
        address: [p.mep_street, p.mep_city, p.mep_state, p.mep_country].filter(Boolean).join(", "),
        org: orgName || "PlugServices", flyer: p.thumb || SAMPLE_FLYER, real: true,
        published: ev.date || "",
        seatsAvailable: (typeof p.available_seats !== "undefined") ? parseInt(p.available_seats,10) : undefined,
        totalSeats: (typeof p.total_seats !== "undefined") ? parseInt(p.total_seats,10) : undefined,
        /* Real ticket tiers straight from MagePeople (v1.8.1 feed): name, price, remaining. */
        tiers: (Array.isArray(p.tiers) ? p.tiers : []).map(function(t){
          return { n: t.name,
                   p: (t.price === null || typeof t.price === "undefined") ? 0 : parseFloat(t.price),
                   note: (typeof t.remaining === "number") ? (t.remaining + " remaining") : "" };
        }),
        desc: [], gallery: []
      };
      EVENTS.push(eObj); ALL_EVENTS.push(eObj); added = true;
    });
    if(added){
      EVENTS.sort(function(a,b){ return a.dkey - b.dkey; });
      if(document.getElementById("allEvents")){ syncFilterChips(); applyFilters(); }
      if(document.getElementById("homeEvents")) renderCards("homeEvents", featuredEvents(8));
      if(window.__rebuildOrganizer) window.__rebuildOrganizer();
      var tc=document.getElementById("liveEventCount"); if(tc) tc.textContent=realEvents().length;
    }
  }).catch(function(){ /* WP unreachable — static list stands */ });
})();

/* ---------- v9: live cart count ---------- */
(function(){
  try {
    fetch("https://tickets.plugservices.ca/wp-json/wc/store/v1/cart", { credentials: "include" })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(c){
        if(!c || typeof c.items_count !== "number" || c.items_count < 1) return;
        var n = document.getElementById("hdrCartCount");
        if(n){ n.textContent = c.items_count; n.style.display = ""; }
      }).catch(function(){});
  } catch(e){}
})();
