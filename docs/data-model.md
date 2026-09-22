# Hartwick Atelier — Shopify Content Architecture

Approved approach: reusable sections driven by **metaobjects** (shared, reusable records)
and **metafields** (per-product references). No hard-coded product or editorial pages.

Namespace convention: `hartwick.*` for everything we create, so it never collides with
Luxe's existing `custom.*` fields.

---

## 1. What Luxe already gives us — reuse, don't rebuild

| Existing | What it does | Our use |
|---|---|---|
| `custom.cross_links` (product list) | Renders sibling products as thumbnails or colour swatches in the buy column | **Expressions of the same Style.** Exactly the relationship we need — reuse as-is. |
| `custom.color` (metaobject list, has `swatch`) | Drives the swatch dots on cross-links | Expression colour swatch. Extend its entries; don't replace. |
| `custom.excerpt`, `custom.breadcrumb` | Card excerpt / breadcrumb label | Keep. |
| `custom.pre_order`, `custom.inquire_to_order` | Boolean purchase-mode flags | **Reuse for Core-Style pre-order and Request Private Appointment** rather than inventing new flags. |
| Native metaobject + `swatch` support in `main-product.liquid` | | Confirms the theme already renders metaobjects — the pattern is proven in this codebase. |

> ⚠️ Luxe's native **`product_specifications`** block does **not** read metafields. It
> splits `product.description` on the literal keyword `SPECIFICATIONS`
> (`sections/main-product.liquid:395`). That is incompatible with a structured Material
> Record. The spec table must be a **custom metafield-driven section**.

---

## 2. Metaobjects (shared records)

### `master` — The Masters
| Field | Type | Notes |
|---|---|---|
| `name` | single line | ⚠️ Real names only, supplied by Aloha. Never invented. |
| `role` | single line | Master Weaver, Khadi Spinner, Natural Indigo Master, Pattern Cutter, Hand Finisher |
| `stage` | single line (fibre / spinning / weaving / dyeing / construction) | Which provenance stage the Master's line sits on (16 Sept). Role keyword is the fallback. |
| `region` | ref → `origin` | |
| `techniques` | list of ref → `technique` | |
| `portrait` / `workshop_images` | file / file list | |
| `stories` | rich text | Editorial field report — the Masters page grows into a living archive. Single rich-text field despite the plural name; rich text has no list type. |
| `handle` | — | Drives `/pages/the-masters` index + individual routes |

### `technique` — craft techniques
`name` (Khadi, Ajrakh, Ikat, Jamdani, Gota Patti, Mashru, Banaras Brocade, Gota) ·
`description` (rich text) · `origin` (ref) · `image` · `unesco_listed` (boolean, Jamdani)

### `origin` — place records
`place` · `region` · `country` · `landscape_image` · `why_here` (rich text) ·
`local_practice` (rich text)

### `dye` — natural / ayurvedic dyes
`name` (Natural Indigo, Turmeric, Marigold, Madder Root, Cutch, Iron/Mineral Black) ·
`source_plant` · `swatch` (colour) · `properties` (rich text — ⚠️ health claims need
Angela's written approval before publishing) · `image`

### `lot` — production batch
`number_roman` (**Lot I / Lot II** — customer-facing form) · `number_internal` (never
displayed) · `opened_on` · `completed_on` (16 Sept) · `quantity` (16 Sept — the run
size for the Production Record) · `masters` (list of ref) · `story` (rich text) · `image`

### `release`
`title` · `lot` (ref) · `ship_date` · `opens_at` / `closes_at` · `dispatch_article` (ref
to blog article) · `status` (Announced / Reserve / Public / Sold Out / Archived)
> Reserve window fields are **defined now, unused in Phase 1** — so Reserve drops in later
> without a data migration.

### `style` — permanent silhouette identity
`number` (`001`) · `category` (Skirt/Shirt/Trouser/Coat/Dress/Scarf/Robe/Kaftan/Tote/
Pouch/Belt/Shorts/PJ/Fine Silk/Yoga Mat) · `display_name` (**the customer-facing
name: `Tribeca Skirt`** — since 21 Sep 2026; `Shayla 03` where no location name is
recorded) · `code` (`Skirt 001`, **internal**, added 21 Sep) · `silhouette_description`
· `fit_notes` · `is_core` (boolean → drives pre-order availability) · `legacy_name`
(the same location name; kept as the sheet-to-store key) · `hero_product`
> 21 Sep 2026, Aloha: "We've returned to the original names … Style codes and product
> IDs stay internal." `--styles` in `scripts/sheet-to-shopify.py` did the swap.

### `process_step` — Fibre → Finished Garment
`order` · `label` (Fibre, Spinning, Weaving, Dyeing, Cutting, Construction, Finishing,
Wear) · `description` · `image`

---

## 3. Product metafields (`hartwick.*`)

One Shopify **product = one Expression**. Sizes are **variants**.

| Metafield | Type | Wireframe use |
|---|---|---|
| `style` | ref → `style` | Groups Expressions; drives "Style 001" display |
| `expression` | single line | "Handspun Fresh Pink Cotton Khadi" |
| `lot` | ref → `lot` | `LOT 001 · EDITION 07 / 25` eyebrow |
| `edition_size` | integer | The `25` |
| `edition_number` | integer | The `07` — per-piece where stock is 1 |
| `individually_numbered` | boolean | **Gate.** `Edition 07 / 25` appears only where this is true AND `edition_number` is set. Aloha, 3 Sep 2026: "remove Edition 07 / 25 unless this refers to an actual individually numbered garment". |
| `production_quantity` | integer | The run size as a count of pieces |
| `production_quantity_verified` | boolean | **Gate.** The Material Record prints `Production quantity — 25 pieces` only when this is true. An unchecked number does not render. |
| `release` | ref → `release` | Availability logic |
| **Material Record** | | |
| `fibre` | single line | HANDSPUN KHADI COTTON |
| `yarn` | single line | |
| `weave` | single line | HANDLOOM |
| `weight_gsm` | integer | |
| `colour_name` | single line | NATURAL INDIGO |
| `dye` | ref → `dye` | |
| `place_of_weaving` / `place_of_dyeing` / `place_of_construction` | ref → `origin` | RAJASTHAN, INDIA |
| `finishing` | single line | |
| `availability_note` | single line | "THROUGH THE REGISTER" — also the product panel's Availability line |
| **The Garment** | | |
| `garment_heading` | single line | Section headline, e.g. "A study in proportion and ease." Added during the product-page build so no editorial line is hard-coded in the section. |
| `garment_intro` | rich text | The paragraph beneath it. Same reason. |
| `silhouette` / `fit` / `movement` | single line | STRAIGHT, RELAXED · EASE THROUGH BODY AND SLEEVE |
| `garment_length` | single line | |
| `model_height` / `size_worn` | single line | |
| `construction_details` | rich text | |
| **Provenance — From Fibre to Garment (16 Sept)** | | |
| `place_of_fibre` / `place_of_spinning` | ref → `origin` | Stages 01 and 02. The garment's made-in country is not the origin of every fibre or process (brief). |
| `fibre_ratio` | single line | "60% silk / 40% linen" — stage 01 and The Cloth's Composition |
| `construction_method` | single line | Stage 05, e.g. "Full placket" |
| `provenance_verified_by` / `provenance_verified_on` | single line / date | "Record who approved provenance and when it was checked." Unset → every classification carries "/ Unverified". |
| **The Cloth (16 Sept)** | | |
| `cloth_statement` | single line | The two-line statement; derived from yarn + weave when empty |
| `cloth_details` | list of files | Numbered detail photographs; each image's alt text is its caption |
| **Relationships** | | |
| `masters` | list of ref → `master` | The Master feature (first entry) and each provenance stage (by `stage`) |
| `related_products` | list of ref → product | Related Works — deliberate picks (16 Sept) |
| `techniques` | list of ref → `technique` | |
| `process_steps` | list of ref → `process_step` | Fibre → Finished Garment |
| `journal_articles` | list of ref → article | From the Journal |
| **Care** | | |
| `care_instructions` / `ageing_patina` / `repairs` | rich text | Care & Ageing accordions |
| **Phase 2, defined now** | | |
| `reserve_eligible` | boolean | Unused at launch |
| `deposit_percent` | integer | Unused at launch |

Every field renders **only when present** — empty fields collapse with no orphaned label
or gap (explicit requirement, mobile brief §5).

---

## 4. Article metafields (The Dispatch / Journal)
`category` (The Loom / The Colour / The Wearer) · `standfirst` · `dispatch_number`
(integer — "Dispatch No. 001") · `is_dispatch` (boolean) · `related_products` (product
list) · `related_masters` (list of ref)

## 5. Collection metafields
`lot` (ref) · `release` (ref) · `index_intro` (rich text)

---

## 6. Product population — recommended method

**85 Expressions** total, from `Hartwick_Style_Naming_Conventions (2).xlsx`:

| Sheet | Expressions | Distinct Styles |
|---|---|---|
| Apparel | 56 | 30 |
| Fine Silks | 22 | 22 |
| Yoga Mats | 7 | 2 |

**Recommendation: Shopify CSV import for the base records, then a metafield pass.**

1. **CSV import** — Handle, Title (`Skirt 002 · Handspun Fresh Pink Cotton Khadi`), Body,
   Type, Tags, Variants (size), SKU (New SKU column), Price, Inventory. The spreadsheet
   already carries clean Title/Description/SKU columns, so this is a scripted transform,
   not manual entry.
2. **Metafield pass** — CSV import cannot create metaobject *references*. Populate
   `hartwick.*` via a Matrixify-style app or a small Admin API script. A script is
   cheaper here and reusable for later Lots.
3. **Images** — cannot be bulk-attached until Angela's asset folder is available. This is
   the single largest unknown in the population estimate.

**Estimate:** 2 approved representative products (structure sign-off) ≈ 2 hrs. Remaining
83 via CSV + script ≈ 4–6 hrs *excluding* imagery. Image sourcing, cropping, ordering and
focal points is a separate **6–10 hrs** and cannot start until assets land.
