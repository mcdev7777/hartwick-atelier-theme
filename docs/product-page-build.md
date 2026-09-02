# Product page build — record of what was made

Built 2 September 2026 against **Hartwik - Dev** (#190886576427), the same
unpublished theme as the homepage. Live theme untouched. Nothing published.

Sources: `Wireframe (03) PRODUCT PAGE` (desktop + mobile) and the mobile
developer brief `HA_ Wireframe 03_ Mobile Product Page.pdf` (12 sections,
8 pages), read in full. Terminology follows Framework v3 throughout.

## Sections, and what is native

| # | Wireframe section | Audit said | Built as | Why |
|---|---|---|---|---|
| 01 | Gallery + sticky buy column | native `main-product` | **native**, configured | Grid gallery, sticky info and sticky buttons, zoom — all Luxe settings. |
| 02 | Lot / Edition eyebrow, Style, Expression | native text block | **custom_liquid** → `ha-pdp-identity` | Luxe's `title` block prints `product.title` on one line. The wireframe needs three distinct things, two of which are metafields. |
| 03 | Size selector, Add to Bag | native `variant_picker` + `buy_buttons` | **native**, restyled | Untouched Shopify product form. Inventory, variants, analytics and checkout unchanged (brief §3). |
| 04 | Size & Fit / Delivery | native `popup` | **native** ×2 | Content held in the block, so no page needed. |
| 05 | Request Private Appointment | native `popup` | **custom_liquid** → `ha-appointment` | The route is undecided, so it resolves to whichever page exists and says so plainly when none does. See open questions. |
| 06 | The Garment | custom (small) | **custom** `ha-garment` | As planned. |
| 07 | **Material Record** | custom — shared | **reuses** `snippets/ha-material-record.liquid` via `ha-product-record` | The shared component, built for the homepage, now used in both places as intended. Runs in `full` mode: 13 rows against the homepage's 5. |
| 08 | The Origin | custom (small) | **custom** `ha-origin` | As planned. |
| 09 | Meet the Masters | custom — shared | **extends** `ha-masters-index` with `layout: feature` | One section, two compositions. Data path, placeholder path and touch states written once. |
| 10 | Fibre → Finished Garment | custom (small) | **custom** `ha-process` | Two rows of four on mobile, one row on desktop. No carousel (brief §8). |
| 11 | Care & Ageing / Delivery & Returns | native `collapsible-content` | **native**, configured + restyled | `column_layout: 2` plus `heading` group blocks. Native was the right call, but Luxe's 2-column mode flows rows *across* the columns; the wireframe's two grouped columns are a CSS correction on top. |
| 12 | From the Journal | native `featured-blog` | **reuses** `ha-journal` | Same reason as the homepage: the store's only blog is empty, so the native section falls back to Luxe demo cards. |
| 13 | You may also consider | native `related-products` | **native**, restyled | Shopify's own recommendation logic, analytics and inventory kept, exactly as brief §10 recommends. |
| 14 | The Register | native `newsletter` | **reuses** `ha-register` | Built for the homepage; unchanged. |

No native Luxe section or snippet was forked. Three of the fourteen sections
were already built for the homepage and were reused without modification to
their behaviour.

## Files added

    sections/ha-garment.liquid
    sections/ha-origin.liquid
    sections/ha-process.liquid
    sections/ha-product-record.liquid       wraps the shared record snippet
    snippets/ha-pdp-identity.liquid         Lot · Edition / Style / Expression
    snippets/ha-appointment.liquid          Request Private Appointment
    assets/ha-product.js                    gallery position counter
    templates/product.json                  rebuilt to the wireframe

Changed: `sections/ha-masters-index.liquid` (feature layout + product-scoped
Masters), `snippets/ha-material-record.liquid` (full-mode placeholders, and
flags to suppress the eyebrow/title/intro where the buy column already states
them), `assets/ha-sections.css` (+520 lines), `layout/theme.liquid` (one
conditional script tag), `docs/data-model.md` (two new metafields).

### The suffix templates

`templates/product.celestial / liminal / terrene / upaya .json` were **also**
rebuilt to the same layout. The Hartwick apparel products are assigned to these
Luxe suffix templates, not to `product.json` — so without this the garments the
wireframe was actually drawn for would have been the only products still showing
the old Luxe demo arrangement.

They are now four duplicates of one layout. The tidy end state is a single
product template with the suffixes cleared from the products, but that is a
product-data change and needs admin access. Left for Aloha's decision.

`product.no-pricing.json` is a genuinely different variant and was left alone.

## The one thing Luxe could not do

**The gallery image count (`01 · 06`, brief §2).** Luxe's mobile gallery
navigation offers bullets, a scroll track, thumbnails or nothing — there is no
numeric readout. Rather than fork `product-media-gallery.liquid` and lose the
theme's upgradeability, `assets/ha-product.js` attaches a counter from outside:
it reads the native gallery's DOM and writes one element into it. If the script
fails to load the gallery is untouched and still works.

Position is derived from geometry — which slide's centre is nearest the
scroller's centre — rather than from an IntersectionObserver, because observer
callbacks are tied to painting and go quiet on a backgrounded tab, which would
leave the readout stale. Verified at every scroll position and on thumbnail
click.

## Every field is data-driven

| Section | Reads | Falls back to |
|---|---|---|
| Identity | `hartwick.style` → `display_name`, `expression`, `lot` → `number_roman`, `edition_number` / `edition_size` | `product.title` for the heading; wireframe copy for the rest, marked |
| The Garment | `garment_heading`, `garment_intro`, `silhouette`, `fit`, `movement`, `garment_length`, `model_height`, `size_worn`, `construction_details` | section settings, marked |
| Material Record | all 13 `hartwick.*` record fields incl. `dye`, `place_of_weaving`, `place_of_dyeing` | per-row wireframe values, marked |
| The Origin | `origin` metaobject via `place_of_weaving` (then construction, then dyeing); `dye` metaobject image | section settings, marked |
| Meet the Masters | `hartwick.masters` → `master` metaobjects, with portrait + workshop image | 5 placeholder roles |
| Fibre → Garment | `hartwick.process_steps` → `process_step` metaobjects | 8 placeholder steps |
| Journal | blog articles | 3 placeholder cards |

Every row renders **only when present**. An empty field collapses with no
orphaned label and no gap (brief §5).

## Placeholders currently on the page

All marked on screen with "Placeholder content — wireframe copy, not approved
for publication", and every custom section has a checkbox to remove the notice.

- **All imagery** (risk R4). The gallery uses whatever media the product already
  has; every custom section's figures are labelled placeholder fields.
- **The Material Record's provenance** — khadi cotton, natural indigo, Rajasthan.
  Unverified (risk R7). Must not go live as fact.
- **Care, Delivery, Returns, Exchanges, Size & Fit** — all six accordions and
  both popups carry copy that says on its face it is pending approval. No care
  instruction, dispatch time, duty or return term has been invented.
- **Masters** — roles only. No artisan name is invented.
- **Identity** — Lot I · Edition 07 / 25 and "Handspun Khadi" are wireframe
  values; the heading falls back to the product's real title.

## Design-fidelity pass (2 September, second pass)

The first pass was validated by DOM measurement only — the preview pane was not
painting, so the page was never actually looked at. That was the wrong way to
check a layout, and the spacing showed it. This pass renders the page with
headless Chrome and measures both the render and the wireframe in pixels.

**Geometry read off the wireframe** (its canvas is 1501px = 2x a 1500px design):

| | Wireframe | Built (1440) | Target (1440) |
|---|---|---|---|
| page gutter | 67 | 64 | 64 |
| gallery / panel split | 61.1% / 38.9% | 60.5% / 39.5% | 61.1% |
| buy-column content | x 967 → 1385.5 | 919 → 1321 | 928 → 1329 |
| two-column split | 418 \| 99 \| 850 | 396 \| 95 \| 806 | 401 \| 95 \| 815 |
| Masters split | 363 \| 365 \| 529 | 343 \| 345 \| 500 | 348 \| 350 \| 507 |
| Style title | 54px | 54px | — |
| Expression | 29px | 28.8px | — |
| section heading | 40px / 120% | 40px | — |
| body | 16px / 140% | 16px | — |
| record voice | 12–13px | 12–13px | — |

Everything lands within about 9px of the wireframe.

**The homepage wireframe uses a 42px gutter; the product page uses 67px.** The
two pages genuinely differ, so `--ha-gutter` (40px) is untouched and the product
page carries its own `--ha-pdp-gutter`. The homepage is unchanged — verified.

**Type follows the homepage's system, not new numbers.** The eyebrow, body and
record sizes are the homepage's own; the only page-specific values are the ones
the wireframe sets differently — section headings at 40px against the homepage's
56px, and the Style title at 54px.

### What the pass actually fixed

1. **Gallery was one full-width image over a 2x2 grid**, not the wireframe's even
   two-column grid. `balance_grid: false`.
2. **Gallery/panel split was 66/34**, not 61/39. Luxe declares
   `.product-main-section-layout-extra-wide .product-main-media-section
   { width: 66% }` *after* `ha-sections.css` loads, so an equal-specificity
   override lost. Fixed with `body.` on the selector rather than `!important`.
3. **The buy column was 285px wide** and broke the product name mid-word
   ("HANDSP / UN"). Luxe's full-width margin rule pads the panel by
   `--page-margin-desktop` (100px) on *both* sides. Now 402px, per the wireframe.
4. **"SIZE" sat above the size boxes** instead of beside them. `legend` is
   rendered specially inside a `fieldset` and does not reliably become a flex
   item; it is now positioned instead.
5. **Vertical rhythm was ~11–26px where the wireframe runs 27–53px.**
   `blocks_vertical_spacing` 10 → 30, and `text_section_padding` 40 → 65 to put
   the eyebrow 67px below the header as drawn.
6. **Sections were 64px tall in padding where the wireframe runs 22–54.** Now 48.
7. **Care/Delivery and Related Products sat 36px inboard** of every Hartwick
   section, on Luxe's 100px page margin rather than the page's 64px gutter.
8. **The Care/Delivery accordions flowed across two columns** — "Care
   instructions | Ageing & patina" on one line — instead of forming two grouped
   columns. Now column-flow over a fixed row count, with the wireframe's
   vertical rule between them.
9. **Group headings rendered in the editorial serif.** The markup is
   `.accordion-group-heading h3`, not the `.collapsible-content` an earlier pass
   assumed. Same for related-product card titles: `.card-product-title-h3`.
10. **The process sequence generated 80 grid tracks** — `repeat(auto-fit,
    minmax(0, 1fr))` with a zero minimum. Now one column per step.
11. **The gallery counter used an IntersectionObserver**, which is tied to
    painting and goes quiet on a backgrounded tab. Rewritten to derive position
    from geometry, which is also why it is now testable.
12. **Placeholder notices in the buy column** dropped their box so they no longer
    out-weigh the product name.

## Third pass — client feedback, 2 September

Three faults reported after review, all reproduced and fixed.

**1. Images were cropped.** The gallery ran `object-fit: cover` inside a fixed
portrait frame, and every Hartwick figure reserved a designed aspect-ratio and
cropped the photograph into it. Now:

- the gallery frame is `portrait-4x6` (2:3) with `gallery_media_scale:
  scale-down`. The store's photographs are 1000x1500 — also 2:3 — so they now
  fill the frame exactly, with nothing cropped and nothing letterboxed. An
  odd-sized image is shown whole rather than cut.
- a Hartwick figure holding a real image drops its designed ratio and takes the
  image's own. The reserved ratio still applies to the placeholder field, so the
  page keeps its shape until Angela's assets land.
- a tall portrait is *scaled down* rather than cropped (`max-height: 64rem`,
  centred) so it cannot dwarf the record beside it.
- **layout stability is not traded away.** `image_tag` writes `width` and
  `height` attributes, so the browser reserves the image's own ratio before the
  file loads — verified while `img.complete` was still `false` (brief §12).

**2. Clicking an image did not obviously zoom.** It did work — Luxe's magnify
button already covers the whole image and `openModal()` fires — but nothing said
so: the cursor stayed `default`, and Luxe fades the magnify icon to `opacity: 0`
exactly when the visitor hovers. Both inverted: the pointer is now `zoom-in`, the
icon rests at 55% and comes to full on hover, and it takes a visible focus ring
for keyboard users. No JavaScript added — the native lightbox is unchanged.

**3. The two accordion columns moved as one.** Real bug, and mine. Luxe's
`column_layout: 2` builds a two-column *grid*, so Care and Delivery shared row
tracks: opening "Care instructions" resized the row and dragged "Delivery"
beside it. Replaced with CSS multi-column, which gives each column an
independent flow, plus a forced column break before the second group heading so
the split stays Care | Delivery.

Verified by forcing a panel open with transitions disabled (a transition cannot
advance in a pane that does not paint, which is what made this hard to see):
opening a Care accordion grows column 1 by 96px, moves the two items beneath it,
and leaves **every item in column 2 at exactly its original position and
height** — and the same in reverse. Luxe's accordion JS was never the problem;
it animates each panel independently already.

## Accessibility and QA done

Measured on the rendered page at 320, 390 and 1440.

- **No horizontal overflow** at any of the three widths (`scrollWidth` equals the
  viewport). Off-canvas drawers and the gallery's own scroller are excluded, as
  they are meant to sit outside the viewport.
- **Touch targets.** Every link, button, accordion title, size box, popup opener
  and submit in the Hartwick sections and the buy column measures ≥44px, or
  carries the invisible 44px hit area. Zero failures at any width (brief §2).
- **Contrast.** Every text/ground pair measured. Lowest is 5.17:1 (placeholder
  figure label), then 5.87:1 (quiet text, gallery count). All above AA. On the
  dark Masters field: 12.78:1.
- **Mobile composition, verified in the DOM:** the Material Record's cloth image
  renders before the record list (brief §5); the process sequence is 4 columns x
  2 rows with no horizontal scroll (brief §8); the Origin keeps its asymmetric
  composition; the Masters link falls after the images. All by CSS ordering — the
  DOM keeps the desktop reading order, so a screen reader still meets each
  heading before its own content.
- **Gallery counter** verified at every scroll position and on thumbnail click.
- **One `<h1>`** on the page (the Style name).
- **Accordions** are native `<details>` and Luxe's own — touch, keyboard and
  no-JavaScript all work.
- **No hover dependency.** `prefers-reduced-motion` honoured.
- **Homepage regression checked twice** — `ha-masters-index` and
  `ha-material-record` are shared, and the homepage still renders identically
  (index layout, 3 columns at 368/479/368, all 9 roles, 64px hero display,
  Featured Lot record intact).
- **Theme Check: 0 errors.** Two `OrphanedSnippet` warnings are false positives —
  Theme Check cannot see snippets rendered from a `custom_liquid` setting in a
  JSON template.

Related Products loads its cards through Luxe's own IntersectionObserver, which
cannot fire in a preview pane that does not paint. Driving the same fetch by hand
returns 6 cards that align correctly on the 64px gutter with the restyled
titles, so the section is wired correctly — but it is the one thing on the page
still worth a glance in a normal browser.

## Open questions for Aloha

1. **Request Private Appointment has no defined behaviour.** Neither the
   wireframe nor the brief says what it does. It currently links to a
   `private-appointment` or `contact` page if one exists, and marks itself a
   placeholder if not. Options: a modal enquiry form, a dedicated page, or an
   email route.
2. **Process steps: 7 or 8?** The desktop wireframe prints seven; the mobile
   brief §8 and `data-model.md` both list eight — the same sequence plus
   **Construction**. Built to eight. Deleting one block returns it to seven.
3. **Masters count: 5 or 3?** The wireframe lists five roles; brief §7 records
   that Angela wants three initially. Built with five and a limit setting.
4. **Product titles.** The wireframe prints **TIDE**, and the related row prints
   VALE / STONE / DRIFT. Those are legacy names, which CLAUDE.md makes internal
   SKU mapping only. Built so the heading is the Style display name and the line
   beneath is the Expression — `Skirt 001` / `Handspun Fresh Pink Cotton Khadi`.
   Same call as the homepage collection index; please confirm once for both.
5. **Suffix templates.** Should the apparel products be moved onto a single
   product template, so there is one page to maintain rather than five?
6. **Price.** The wireframe shows `€ —`. No prices are set and the store
   currency has not been confirmed.
7. **Sticky Add to Bag** — brief §3 was still awaiting an answer. It is native to
   Luxe and carries no custom testing burden, so it is on. Say if you want it off.
