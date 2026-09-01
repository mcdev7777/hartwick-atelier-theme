# Hartwick Atelier — Shopify Audit, Native/Custom Split & Plan to 10 September

Prepared: 1 September 2026 · Ivan · Phase 1 · 40 hrs max (4 used, **36 remaining**)

---

## A. Corrections to the brief — please confirm

### A1. Terminology conflict — the mobile homepage brief is out of date
`Hartwick_Atelier_Mobile_Homepage_Developer_Brief.docx` instructs:

> "Use **'Join the Circle'** as the visible registration invitation."
> "**The Register** — if retained, use as an internal Klaviyo list… avoid presenting it
> beside Circle and Dispatch as a third public sign-up proposition."
> Menu order: "New, Apparel, Jewellery, **The Makers**, Journal, About…"

All three contradict Christina's Framework v3, which you have confirmed as final:
The Register is the public free-to-join community; The Circle is invitation-only with
**no public form**; the artisans are **The Masters**.

**I am building to Framework v3** — "Join The Register", "The Masters", and no public
Circle route anywhere. The wireframes agree with this (their nav reads COLLECTION /
THE MASTERS / JOURNAL / THE REGISTER). Please confirm the .docx is superseded on
terminology only — its technical requirements (Klaviyo, performance, accessibility,
CMS-editability) I am treating as still binding.

### A2. Both briefs are addressed to "Leigh"
The two mobile briefs are written to a previous developer and reference decisions she
made ("Leigh has indicated that the image fade-in appears feasible"). Two questions are
left open in them and are still open for me: **sticky Add to Bag** (mobile product brief
§3), and the **Journal cards row vs stack** on mobile. My recommendation on both below.

### A3. The theme is **Luxe 5.1.0 by Winter Studio**, not Eluxi
Just so the records match. Not a problem — Luxe is a strong base for this.

---

## B. What already exists

| Area | State |
|---|---|
| Theme | Luxe 5.1.0, largely stock. 67 sections, 29 templates. |
| Homepage | **Built out** with stock Luxe sections — 16 sections, mostly `image-banner`, `rich-text`, `video-with-text`, `section-media-collage`. Real Hartwick copy is in place. This is a *Luxe demo arrangement with Hartwick content*, not the wireframe. |
| Custom page templates | `page.story`, `page.heritage-craft`, `page.slow-fashion`, `page.press`, `page.press-release`, `page.events`, `page.media-library`, `page.contact` — all already populated with Hartwick content. |
| Custom product templates | `product.celestial`, `product.liminal`, `product.terrene`, `product.upaya` — bespoke variants already exist. |
| Metafields in use | `custom.cross_links`, `custom.color` (metaobject + swatch), `custom.excerpt`, `custom.breadcrumb`, `custom.pre_order`, `custom.inquire_to_order`. |
| Brand styling | **Not applied.** Fonts are still Swiss 721; colours are Luxe defaults (`#ffffff` / `#f3f3f3` / generic greys). None of the eight-colour Material Archive palette is in the theme. |
| Klaviyo | Not present in the theme. No account yet (you create Thursday). |

### Retain
- The whole Luxe foundation — product form, variant logic, cart drawer, predictive search,
  responsive image handling, accordion component, `main-product` gallery. All solid.
- `custom.cross_links` + `custom.color`. This is a product↔product relationship with
  colour swatches already wired into the buy column — it maps **exactly** onto
  Style → Expressions. Significant saving; we extend rather than rebuild.
- `custom.pre_order` / `custom.inquire_to_order` — reuse for Core-Style pre-order and
  "Request Private Appointment" instead of inventing parallel flags.
- The existing editorial page templates as the base for About / Masters / Journal.

### Rebuild
- **Homepage.** The current arrangement doesn't match the wireframe. Rebuilt from the
  section set below.
- **Product page.** Needs the Material Record, Origin, Masters, and process sequence,
  none of which exist.
- **Global tokens.** Colour + type applied centrally as theme settings and CSS variables,
  so the final Brand Book can be dropped in without touching sections.

### Conflicts found
1. **`product_specifications` cannot do the Material Record.** Luxe's native block splits
   `product.description` on the literal string `SPECIFICATIONS`
   (`sections/main-product.liquid:395`) — it does not read metafields at all. A structured,
   metafield-driven spec table is a custom section. Not negotiable if you want the record
   to be real data rather than typed prose.
2. **The brand fonts are not available to Shopify.** Luxe uses `font_picker`, which only
   offers Shopify's library. Porter, Junicode and Noto Sans Mono Condensed are all absent
   from it, so all three need custom `@font-face` from theme assets. See risk R1.

---

## C. Native vs custom — the wireframe, section by section

### Homepage
| # | Wireframe section | Verdict | Notes |
|---|---|---|---|
| 01 | Hero — split image / headline | **Native** `image-banner` or `image-with-text` | Configuration only. Mobile crop + focal point. |
| 02 | The House — "A slower way of making" | **Native** `image-with-text` + `section-media-collage` | 1 lead + 2 secondary tiles is what the collage does. |
| 03 | Collection Index — numbered list ↔ image grid | **Custom (small)** | `section-featured-style-gallery` is close — it already pairs a thumbnail index with a preview and supports price/link. Likely a **restyle + extend**, not a new build. Must work on touch (no hover dependency). |
| 04 | The Masters Index — dark field | **Custom (small)** | Metaobject-driven list. `multicolumn` can't express the layout. |
| 05 | Featured Lot record — image / spec table | **Custom — shared** | *Same component as the product Material Record.* Build once, use in both places. |
| 06 | Journal / Dispatch — 3 cards | **Native** `featured-blog` | Configuration + restyle. |
| 07 | The Register — dark signup | **Native** `newsletter` + Klaviyo | Has `heading`/`paragraph`/`email_form`/`@app` blocks. |
| 08 | Footer | **Native** `footer` | Configuration. |

### Product page
| # | Wireframe section | Verdict | Notes |
|---|---|---|---|
| 01 | Gallery + sticky buy column | **Native** `main-product` | Already supports `enable_sticky_info`, `enable_sticky_buttons`, mobile swipe nav, image count, zoom. Configuration only. |
| 02 | Lot / Edition eyebrow | **Native** `text` or `custom_liquid` block | Metafield output. |
| 03 | Size selector, Add to Bag | **Native** `variant_picker` + `buy_buttons` | Untouched Shopify product form — inventory, analytics and checkout stay intact. |
| 04 | Size & Fit / Delivery toggles | **Native** `popup` / `collapsible_tab` blocks | Configuration. |
| 05 | Request Private Appointment | **Native** `popup` block + `custom.inquire_to_order` | |
| 06 | The Garment | **Custom (small)** | Text + spec rows + image. Metafield-driven. |
| 07 | **Material Record** | **Custom — shared** | See C.05. The core new component. |
| 08 | The Origin | **Custom (small)** | Text + asymmetric 3-image grid, metaobject-driven. |
| 09 | Meet the Masters | **Custom** | Shared with homepage §04. |
| 10 | Fibre → Finished Garment | **Custom (small)** | 8-step index. Two rows on mobile, per your preference — no carousel. |
| 11 | Care & Ageing / Delivery & Returns | **Native** `collapsible-content` | Configuration. Keyboard + touch already handled. |
| 12 | From the Journal | **Native** `featured-blog` | |
| 13 | You may also consider | **Native** `related-products` | Restyle only — keeps Shopify's recommendation logic, analytics and inventory, as you asked. |
| 14 | The Register | **Native** `newsletter` | |

**Net: 6 custom sections**, two of which (Material Record, Meet the Masters) are shared
across both pages. Everything else is Luxe configuration or restyling. That is a good
outcome — it keeps us inside the hours and keeps the theme upgradeable.

### Requires an app or paid feature
- **Klaviyo** — free tier covers launch volume. Needs the account (Thursday) and Shopify
  connection before I can wire forms, consent, source properties or flows.
- **Nothing else.** No app needed for anything in the wireframes.

---

## D. Answers to your open questions

**Sticky Add to Bag (mobile):** recommended, and it's **native** to Luxe
(`enable_sticky_buttons`). No custom testing burden. It appears after the buy panel
scrolls out, which is the behaviour you described. Keep it in Phase 1.

**Journal cards on mobile:** **stack vertically.** A swipe row adds a carousel we don't
need, and stacking is faster and more accessible. Matches your own reasoning on the
process sequence.

**Product population method:** **Shopify CSV import**, then a metafield pass by script.
The naming spreadsheet already has clean Title / Description / SKU columns, so the base
import is a scripted transform rather than manual entry. Full reasoning and the field map
are in `docs/data-model.md`.

**Volume:** the spreadsheet holds **85 Expressions** — 56 Apparel (30 Styles), 22 Fine
Silks, 7 Yoga Mats.

**Population time:** 2 representative products for your sign-off ≈ **2 hrs**. The
remaining 83 via CSV + script ≈ **4–6 hrs**, *excluding imagery*. Image placement,
cropping, ordering and focal points is a further **6–10 hrs** and cannot begin until
Angela's asset folder arrives. **This does not fit inside the remaining 36 hrs alongside
the build.** See R2.

---

## E. Day-by-day plan to 10 September

36 hrs across 7 working days. Assumes ~5 hrs/day.

| Day | Focus | Hrs |
|---|---|---|
| **Tue 1 Sep** | This audit. Dev theme created from live. Global foundations: colour tokens from the Material Archive palette, type scale, spacing, header/nav, footer. | 5 |
| **Wed 2 Sep** | Metafield + metaobject definitions created in Shopify. Two representative products built end-to-end for your approval. | 5 |
| **Thu 3 Sep** | Product page: Material Record + The Garment + The Origin custom sections. **Klaviyo account connected** (your Thursday action). | 5 |
| **Fri 4 Sep** | Product page: Meet the Masters, Fibre→Finished Garment, Care/Delivery accordions, related products restyle. Product page complete. | 5 |
| **Mon 7 Sep** | Homepage: hero, The House, Collection Index, Masters Index, Featured Lot, Journal, The Register. | 6 |
| **Tue 8 Sep** | Klaviyo forms, consent, source properties, form states. Analytics + event map. Collection page. | 5 |
| **Wed 9 Sep** | Product population from CSV. Cross-browser, 320–430 px, keyboard, reduced-motion, contrast QA. Cart → checkout journey testing. | 5 |
| **Thu 10 Sep** | Final fixes, performance pass, launch. | — |

Review points: **end of Wed 2 Sep** (product data structure — needs your sign-off before
I populate anything), **end of Fri 4 Sep** (product page), **end of Mon 7 Sep** (homepage).

---

## F. Risks to the 10 September date

**R1 — Porter is a licensed commercial font (HIGH).** The Brand Assets folder supplies
Porter as desktop `.otf` files. Desktop licences almost never permit web embedding, and
`@font-face` exposes the file publicly. **We need a webfont licence from Displaay before
Porter can go on the site.** Junicode and Noto are open-licensed and fine. Please check
what licence Angela holds. If it isn't resolved, I will ship with Junicode carrying the
Porter roles and swap it centrally later — one settings change, not a rebuild.

**R2 — Product population does not fit in the remaining hours (HIGH).** Build + population
+ imagery for 85 products exceeds 36 hrs. My recommendation: **launch with the two
approved representative products plus whatever subset Lot I actually requires**, and move
bulk population to a costed Phase 2 block. Please tell me how many products must be live
on 10 September — this is the single biggest variable in the plan.

**R3 — The remaining page designs have not arrived (HIGH).** Collection, The Masters,
Journal/The Dispatch, The Register, The Circle and About are all still in design. The plan
above covers homepage + product only. **Each additional page is roughly 3–5 hrs.** Six
pages is 18–30 hrs, which does not exist in the budget. As soon as the designs land I will
tell you which are essential for launch and which must move to Phase 2 — but on today's
arithmetic, most will.

**R4 — Imagery (MEDIUM).** No approved images yet. I'll build with clearly labelled
placeholders in the unpublished theme and reserve correct aspect ratios so nothing shifts
when real assets land. Please confirm the Angela asset-folder access.

**R5 — Klaviyo starts Thursday (MEDIUM).** Account creation on 3 Sep leaves five days for
integration, flows, consent and testing. Workable, but it is the critical path for the
tracking requirements. Any slip here pushes analytics acceptance past launch.

**R6 — Payment/shipping owner actions (MEDIUM, unassessed).** I can't audit the payment
and shipping configuration until collaborator access is granted. Some fixes are
account-owner-only and only Angela can complete them. Please prioritise the collaborator
request — this is currently blocking.

**R7 — `[pending Chanchal verification]` (LOW/MEDIUM).** Most rows in the naming
spreadsheet have unverified fabric/technique origin. I will not publish those as fact.
They ship as placeholders until verified.

---

## G. What I need from you

1. Confirm **A1** — Framework v3 terminology overrides the mobile .docx.
2. **Collaborator access** (see §H) — currently blocking the payment/shipping audit.
3. **Porter webfont licence status** (R1).
4. **How many products must be live on 10 September** (R2).
5. Remaining page designs, or a decision to defer them (R3).
6. Angela's asset folder access (R4).
7. Klaviyo account on Thursday as planned (R5).

---

## H. Access requested

Shopify **collaborator** access, minimum permissions:
- Themes (edit code, create/preview unpublished themes)
- Products, Collections, Inventory
- Content / Blog posts, Files, Metaobjects & metafield definitions
- Online Store settings, Navigation
- **Read-only:** Settings → Payments, Shipping & delivery, Markets, Taxes
  *(read-only is enough to audit and report; I won't need to change them, and account-owner
  actions will come back to Angela regardless)*
- Analytics
- **Not requested:** Customers (PII), Orders, Finances, Apps billing, Staff.

Note: I have **not** used the storefront preview password. I'll work from collaborator
access instead.

---

## Reporting
Daily written update to Aloha: work completed · current work · hours used and remaining ·
next priority · questions or decisions required · anything affecting scope or 10 September.
