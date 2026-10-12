# CONTENT_TODO

All items below are **placeholder or unapproved content** that must be reviewed
and signed off before the site goes to production.

---

## Solutions (`src/config/solutions.ts`)

All 8 solutions have `approved: false`. Copy and images need client sign-off.

| Slug | Title | Issue |
|------|-------|-------|
| `ai` | AI | Copy unapproved; image placeholder |
| `hospitals` | Hospitals | Copy unapproved; image placeholder |
| `switching-from-windows-to-mac` | Switching from Windows to Mac | Copy unapproved; image placeholder |
| `device-deployment` | Device deployment | Copy unapproved; image placeholder |
| `video-streaming-solutions` | Video streaming solutions | Copy unapproved; image placeholder |
| `app-and-web-development` | App and web development | Copy unapproved; image placeholder |
| `trainings` | Trainings | Copy unapproved; image placeholder |
| `school-and-college-labs` | School and college labs | Copy unapproved; `hiddenInProd: true` — needs explicit unlock |

**Action:** Client to confirm copy and provide approved images before any solution
page goes live. Set `approved: true` per entry when sign-off received.

---

## Testimonials (`src/config/testimonials.ts`)

`TESTIMONIALS_LIVE = false` — section hidden in production until at least 3 approved
quotes exist.

**Action:** Collect real client testimonials with written consent (`consent: true`,
`approved: true`). Section auto-enables once 3 approved entries are present.

---

## Success Stories (`src/config/stories.ts`)

`STORIES_LIVE = false` — section hidden in production until confirmed stories exist.

**Action:** Populate `SUCCESS_STORIES` with real confirmed case studies
(`confirmed: true`). Set `STORIES_LIVE = true` when ready.

---

## Trusted-by logos (`src/config/site.ts` — `CLIENT_LOGOS`)

Some logos have `approved: false` or `permission: false` and are filtered out of
the Trusted-by strip.

**Action:** Obtain written permission before enabling any `permission: false` logo.
Update `approved: true` once confirmed.

---

## Shop (`PAGES_LIVE.shop = false`)

Shop section shows the teaser banner only. Full product listing is not live.

**Action:** Set `PAGES_LIVE.shop = true` in `src/config/pages.ts` when the shop
is ready, and verify all product images and descriptions are accurate.

---

## Services copy (`src/config/services.ts`)

Service copy (lines 1–2 per service) was drafted by Claude and has not been
reviewed by the client.

**Action:** Client to review and approve `line1` / `line2` for all 4 services.

---

## CTA copy

"Let's find the right technology for your organisation." and the sub-copy were
drafted as placeholder. Client to confirm or replace.

---

## Contact email (`SITE.contact.email`)

`email: ""` — empty in `src/config/site.ts`. The email CTA button is hidden when
the field is blank.

**Action:** Add the real enquiry email address.

---

## Stats — new entries (`src/config/stats.ts`)

Four stats added from the company profile; all `confirmed: true` pending client sign-off:

| id | Label | Current items |
|----|-------|---------------|
| `apple-lines` | Apple product lines | Mac, iPhone, iPad, Apple Watch, Accessories |
| `sales-channels` | Sales channels | Direct sales, Indirect channels, Systems integrators |
| `core-values` | Core values | Customer focus, Excellence, Openness, Ongoing support |
| `buying-options` | Buying options | Leasing and financing, Buyback on old devices, Promotional discounts, OEM cashback offers |

**Action:** Confirm with client. Update `items` arrays if the client provides different values; the stat count auto-updates from the list length.

---

## Stats — second batch (`src/config/stats.ts`)

Five more stats added; see notes per entry:

| id | Label | Current items / value | confirmed | Action |
|----|-------|-----------------------|-----------|--------|
| `extra-solutions` | Extra solutions | Mobile application development, Video streaming solutions, Surveillance and security solutions, AV solutions | `true` | Confirm with client |
| `contact-channels` | Ways to reach us | WhatsApp, Phone (auto-derived from `site.ts`; Email excluded while field is empty) | `true` | Confirm with client; add `SITE.contact.email` to unlock Email |
| `head-office` | Head office | Naraina, New Delhi | `true` | Confirm with client |
| `authorised-brands` | Authorised brands | Apple, Microsoft Surface, Canon, Samsung | `false` — draft only | Canon and Samsung must be confirmed before setting `confirmed: true` |
| `customers-served` | Customers served | _no value_ — stat is hidden until value supplied | `false` | Needs the real number from the client. Set `value: <number>` and `confirmed: true` in `stats.ts` |

---

*Last updated: 2026-10-12*
