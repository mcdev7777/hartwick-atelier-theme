# Product page V2 — build record, 16 September 2026

Built to Aloha's **Product page design and discovery brief** (9 pages) and
**Hartwick_Product_Desktop_V2.png** (6000 × 18875), received 16 September, and
her follow-up message the same morning: populate the new layout with the old
website's text and product information, take imagery from the product
records, leave a placeholder wherever the old site has no fact — Masters,
provenance, Lot — and flag it.

Verified on the CLI development theme (#190959223083) at 1440 and 390, then
pushed to **Hartwik - Dev** (#190886576427). Live theme untouched. Nothing
published. No mobile artboard and no AI/SVG files were in the zip; the mobile
behaviour follows the brief's text.

Preview (old-site content, new layout — three images, three related pieces):

    https://www.hartwickatelier.com/products/tokyo-blouse-handwoven-ikat-in-mesa-white?preview_theme_id=190886576427

## What the page is now

| V2 section | Built as | Reads |
|---|---|---|
| Opening — information \| photographs \| purchase | `ha-product` (3 Sept), extended | see "Opening" below |
| Origin + Process — *From Fibre to Garment* | **new** `ha-provenance` — replaces `ha-origin` + `ha-process` | fibre, yarn, weave, technique, dye, colour, finishing, places, Masters by stage, the old site's process notes |
| The Cloth / Material Record | **new** `ha-cloth` — replaces `ha-product-record` | fibre, yarn + weave, `cloth_details` or the product's own images, `fibre_ratio`, SKU |
| The Master | **new** `ha-master-feature` — replaces `ha-authorship` | the first `master` in `hartwick.masters` (then the Lot's): photograph, name, discipline, place, record link |
| Lot Record — *The Production Record* | **new** `ha-lot-record` | Style, Expression, SKU, `lot` number + quantity + dates |
| Care & Repair / Shipping & Returns | `ha-living`, bare layout, 2 rows | care fields; **Settings › Policies** |
| Related Works | **new** `ha-related-works` — replaces `ha-continue` | `related_products`, then the old site's `featured_product_1/2`, then same-collection pieces sharing the fibre or Style |
| The Register | unchanged | — |

The seven replaced compositions are **disabled in the template, not
deleted** — their settings and chosen images are intact, one toggle each.
`ha-garment` and `ha-wearer-note` are off because V2 has no equivalent (fit
lives in the left rail; no wearer's note is drawn).

### One set of facts

`snippets/ha-product-fact.liquid` is the single place a product fact is
resolved — Style, Expression, material, fibre, yarn, weave, technique, dye,
colour, made-in, finishing, reference. Every section on the page asks it, so
the Style in the opening, in the Production Record and on a Related Works
card cannot differ. Order: `hartwick.*` → the old site's `custom.*` /
`shopify.*` → the title. Nothing is typed into a section.

### Opening — what changed

- The material as a serif line under the Style (V2), with the record label
  beneath only when it adds a fact the serif line lacks.
- **Product JSON-LD restored.** Luxe emits it from `main-product.liquid`,
  which `ha-product` replaced on 3 September — the garment pages had no
  Product record until today. Now one record (Shopify's `ProductGroup` with
  the variants as offers), from theme code only.
- Image count `01 / 03` and a "Scroll" hint at the foot of the frame, sticky
  to the viewport while the photographs are taller than the screen; the hint
  retires on the first scroll. Markers now **stay in view** (sticky) and are
  named "Show image 2 of 3". A polite live region announces the position.
- **The size must be chosen** — "Before selection, the button asks for a
  size." A multi-size garment opens with no size ticked and the button reading
  *Select a size*; the first choice hands over to Luxe's own `product-info.js`,
  which fetches the variant and re-enables the button. Verified: no size →
  M → *Add to bag*, hidden variant id and URL updated. Setting
  **Ask for a size before Add to Bag**, on; off restores Shopify's default.
- The old site's DETAILS list joins the Description row. Its "Limited Edition
  /25 Lot No. 0624" bullet is filtered out (scarcity language removed 3 Sept;
  the run size is an unverified figure).
- **Delivery & Returns reads Settings › Policies** — the same text as the
  Shipping & Returns row below and as checkout. One source.
- "View the Material Record" lands with the heading 32px below the sticky
  header (`scroll-margin`).
- Sticky rails release on viewports under 620px tall.
- **Mobile:** the photographs are one swipeable row with the count beneath,
  **first**, then the information rail, then the purchase rail — the brief's
  reading order. Luxe's sticky Add to Bag bar keeps purchase in reach from the
  first scroll. (Until today the identity and buy rail came first; that is one
  `order` change if the mobile artboard draws it that way.)

## What comes from the old site, per product

| On the page | Source | Example (Tokyo Blouse, ikat) |
|---|---|---|
| Style name | title before ` \| ` | TOKYO BLOUSE |
| Material line + Expression | title after ` \| `; `custom.subtitle` | Handwoven Ikat in Mesa White |
| Intro + Description | `product.description` | "The evolution of the sari blouse…" |
| Details list | `custom.description` | Mandarin collar, hidden hooks, … |
| Fibre / Colour | `shopify.fabric`, `shopify.color-pattern` | Cotton / White |
| Yarn, weave, technique, dye | `custom.process_1…4` | Handspun / Handwoven / Khadi / Natural dye |
| Process notes ("About handspun") | the `process` metaobjects' paragraphs | closed disclosures under the stage |
| Photographs | product media; `custom.featured_photo` | gallery, Cloth details |
| Related Works | `custom.featured_product_1/2` | the old site's pairs, then derived |
| Shipping & Returns | Settings › Policies | the free-shipping table, the exchange terms |
| Size guide | `/pages/size-guide` (link) | S / M / L table |

## Flags for Aloha — placeholders on the page

Each is marked on screen and publishes from the field named.

1. **Style names are the legacy names** (TOKYO BLOUSE, AMMAN SHIRT, BOMBAY
   TROUSERS…) until `hartwick.style` is linked — interim, per her note that
   the naming is being re-edited. The 54 `style` records exist; none is linked.
2. **Provenance:** Origin, Ratio, Master and Place read `[Confirm]` on every
   stage, and every classification carries "/ Unverified" until
   `provenance_verified_on` is set. Construction has no source at all.
3. **The Master** is the labelled slot on every product — no Master is linked
   (`hartwick.masters` empty; the five records are roles without names).
4. **Lot Record:** reference, Lot / quantity and dates are all bracketed. No
   product carries a SKU. The old descriptions say "Lot No. 0624" and "/25" —
   is that the Lot and run size to verify?
5. **The Cloth's photographs** are the product's own gallery images with the
   caption "Detail" — no old image carries alt text. Dedicated weave / button /
   collar / seam photographs go in `cloth_details` with the caption as alt.
6. **Care & Repair** has no source on the old site — placeholder.
7. **Made in India** on every product is the section's stand-in, not a record.
8. **Related Works** falls back to the old site's pairs (a pendant beside a
   blouse, in places) and to shared-fibre pieces; the derived rows say so.
9. **The refund policy** says "Limited Edition textiles" — legal text in
   Settings › Policies, left as is; Christina's to change.
10. **"Mesa White", "Celeste"** and similar are the old colourway names inside
    the titles — they will go with the renaming.
11. The **assets Drive** was not reachable from here; imagery is the products'
    own. Master / workshop photographs are image pickers on the section and
    need no code.

Questions from the 16 September estimate still open: the button label
(**Collect** on the artboard, Add to Bag in the brief — built as Add to Bag),
whether a stage should show "Unverified" or be hidden, one Lot per Expression,
and the Master page destination (built to link to the record's own page when
metaobject storefront pages are on, else the Masters page chosen in the
section).

## Data model

Twelve fields added — `docs/data-model.md` and `docs/metafield-build-sheet.md`
**Stage 5**. Nothing breaks without them; they turn `[Confirm]` into facts.
Definitions are created in the admin by hand, as before.

## Verification

- Theme Check: **0 errors** (one pre-existing `\'` in `ha-authorship` fixed).
- 1440: three columns, both rails sticky, markers sticky and tracking (2 of 3
  current after one scroll), count `02 / 03`, hint retired, anchor 32px under
  the header, Cloth index → photograph (current, scrolled, focused), size flow.
- 390: no horizontal overflow (`scrollWidth` = 390), gallery first as a snap
  row with the count, provenance as a vertical record, Cloth stacked in order,
  Master slot intact, Shipping & Returns opening to the policy table. One
  `<h1>`. Every control ≥44px except three inline text links (breadcrumb and
  the policy's email addresses), which are exempt as inline text.
- JSON-LD: two records — Organization (header) and ProductGroup (product).

## Hours — this revision

| | Hrs |
|---|---|
| Brief and artboard read, theme audit, estimate and questions | 1.5 |
| Shared fact snippet + old-site fallbacks | 1.5 |
| From Fibre to Garment | 2.0 |
| The Cloth (composition, index script) | 2.5 |
| The Master, Lot Record, Related Works | 2.5 |
| Opening: material line, count/hint, sticky markers, size gate, JSON-LD, policies source, mobile row | 2.5 |
| Templates, CSS, verification at 1440 / 390, fixes | 2.0 |
| Data model, build sheet, this record | 1.0 |
| **Total** | **15.5** |

Running total against the 40-hour ceiling: **from the hours log** — not
recorded here.
