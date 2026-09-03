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
displayed) · `opened_on` · `masters` (list of ref) · `story` (rich text) · `image`

### `release`
`title` · `lot` (ref) · `ship_date` · `opens_at` / `closes_at` · `dispatch_article` (ref
to blog article) · `status` (Announced / Reserve / Public / Sold Out / Archived)
> Reserve window fields are **defined now, unused in Phase 1** — so Reserve drops in later
> without a data migration.

### `style` — permanent silhouette identity
`number` (`001`) · `category` (Skirt/Shirt/Trouser/Coat/Dress/Scarf/Robe/Kaftan/Tote/
Pouch/Belt/Shorts/PJ/Fine Silk/Yoga Mat) · `display_name` (`Skirt 001`) ·
`silhouette_description` · `fit_notes` · `is_core` (boolean → drives pre-order
availability) · `legacy_name` (**internal only, never rendered**)

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
| `availability_note` | single line | "THROUGH THE REGISTER" |
| **The Garment** | | |
| `garment_heading` | single line | Section headline, e.g. "A study in proportion and ease." Added during the product-page build so no editorial line is hard-coded in the section. |
| `garment_intro` | rich text | The paragraph beneath it. Same reason. |
| `silhouette` / `fit` / `movement` | single line | STRAIGHT, RELAXED · EASE THROUGH BODY AND SLEEVE |
| `garment_length` | single line | |
| `model_height` / `size_worn` | single line | |
| `construction_details` | rich text | |
| **Relationships** | | |
| `masters` | list of ref → `master` | Meet the Masters block |
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
