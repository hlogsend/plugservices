# La Nuit du Continent: event listing sheet (tickets.plugservices.ca)

Enter this in wp-admin → Events → Add New (MagePeople), or clone template **3455** via `/clone-event`.
Once it's published, plugservices.ca lists it automatically through the `mep_events` feed, so no Netlify deploy is needed.

## Core fields
| Field | Value |
|---|---|
| Title | La Nuit du Continent |
| Slug | `la-nuit-du-continent` |
| Organizer (`mep_org`) | Cathy La Tigresse |
| Category / tag | Gala (secondary: Party) |
| Start | 2026-12-26 19:00 (Saturday) |
| End | **TBC**: not stated on the flyer (assume 2026-12-27 02:00 until Cathy confirms) |
| Time zone (`mep_time_zone_display`) | America/Edmonton |
| Venue (`mep_location_venue`) | Paradise Banquet Hall |
| Street / City / State / Country | 3760 104 Ave NE / Calgary / AB / Canada |
| Thumbnail / poster | `flyer-main-table-packages.jpg` (check that `mep_list_thumbnail` is NOT 3468) |
| Gallery (`mep_gallery_images`) | 6 images, in this order: `photo-main-event-vertical.jpg`, `photo-square-duo.jpg`, `photo-banner-duo.jpg`, `flyer-vertical-banner.jpg`, `flyer-title.jpg`, `flyer-countdown.jpg`. Save as an **array of ID strings** (a CSV string crashes the page) |
| Social stories (fixed) | `story-teaser.jpg` (duplicate "Most" removed) · `story-cta.jpg` ("VIDEO STILL 6 OF 6 CTA FINAL" label removed). For Instagram/WhatsApp stories. Optional in the gallery |

## Ticket tiers (`mep_event_ticket_type`: one assoc row per tier)
| Tier | Price (CAD) | Includes | Qty |
|---|---|---|---|
| Single | 70 | Admission + dinner | 999 (default) |
| Couple | 135 | 2 admissions + dinner | 999 (default) |
| Bronze Table (seats 8) | 500 | 8 tickets + dinner · reserved table · 1 wine · water & soft drinks | **5** |
| Silver Table (seats 8) | 750 | 8 tickets + dinner · reserved table · 1 spirit · 1 wine · water & soft drinks | **5** |
| Gold Table (seats 8) | 1,000 | 8 tickets + dinner · 1 sparkling wine · 1 spirit · 2 wines · water & soft drinks | **5** |
| Platinum Table (seats 8) | 1,500 | 8 tickets + dinner · 2 premium sparkling wines · 1 premium spirit · 2 wines · water & soft drinks | **5** |

`mep_event_ticket_type`: one assoc row per tier, e.g.
`{"option_name_t":"Platinum Table (seats 8)","option_price_t":"1500","option_qty_t":"5","option_details_t":"8 tickets + dinner · 2 premium sparkling wines · 1 premium spirit · 2 wines · water & soft drinks"}`

Each table is ONE ticket that seats 8. **5 per tier (20 tables, 160 seats) is my placeholder, not Cathy's number.** Replace it once she confirms the floor plan. Starting low is deliberate: raising stock later is easy, but refunding a table you oversold is not. Every table booked by phone must be deducted here on the same day.

**Full table sell-out = $18,750** (5 × $500 + 5 × $750 + 5 × $1,000 + 5 × $1,500), before singles and couples.

## Description (EN / FR)
**La Nuit du Continent: celebrating Calgary's African communities.**
Join Cathy La Tigresse for an elegant evening of culture, music, fine dining and community at Paradise Banquet Hall. Dinner is included with every ticket. Reserve a table for your group of 8 and celebrate in style.
*One Continent. One Community.*

**La Nuit du Continent : célébrons les communautés africaines de Calgary.**
Cathy La Tigresse vous invite à une soirée élégante de culture, de musique, de gastronomie et de partage au Paradise Banquet Hall. Le souper est inclus avec chaque billet. Réservez une table pour votre groupe de 8 et célébrez avec style.

**Partners:** PlugServices.ca (official partner) · NexTrade · Vane 2 Luxe · Rosy
**Reservations by phone:** PlugServices 587-973-6496 · Cathy la Tigresse 368-399-4628 · Vane 2 Luxe 825-733-3782 · NexTrade 368-399-4287

## Confirm with Cathy before publishing
1. **End time** and **dress code** (neither is on any flyer).
2. **Real table count per tier** (placeholder is 5 each), and who deducts phone bookings from online stock.
3. **Liquor licence.** Drinks are bundled into the ticket price at a public, ticketed event. Confirm that Paradise Banquet Hall's licence (or an AGLC special-event licence) covers this. I have not verified the Alberta rule. A bad answer here can shut the event down on the night.
4. **Phone numbers.** Cathy's (368-399-**4628**) and NexTrade's (368-399-**4287**) are near-identical. Check that this isn't a typo on the flyer.
