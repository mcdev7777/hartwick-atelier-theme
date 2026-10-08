# Product page v3 + final typography, 8 October 2026

Source: Aloha's message of 8 October 2026 (product page notes, typography confirmed
with Angela) and `Hartwick_Tribeca_Product_Updated.pdf`.

**Status:** committed to branch `claude/elegant-euler-oeff42` only. **Not pushed to any
Shopify theme** (not the dev theme, not live). Checked with Shopify Theme Check (no new
offences) and in Chromium against a static copy of the page at 1440 and 390, using the
real CSS, JS and theme settings. It has not yet been rendered with store data.

## The page flow

PRODUCT, PURCHASE, PROCESS, MATERIAL, MAKING / PROVENANCE, RELATED COLLECTION.

Template order (`product.json` and its four copies `celestial`, `liminal`, `terrene`,
`upaya`): opening, From Fibre to Garment, Material, A Record of the Making, Master
Technique, Related Collections. `ha_living` (Care & Repair / Shipping & Returns band)
is **off**. Its content now sits in the "+" items, so nothing is lost.

## What changed

| Aloha's note | Built as | Files |
|---|---|---|
| Top in 3 parts: left story + material, centre photos, right name + price + size + purchase | The name, material line and price moved to the buy rail. The left rail holds the story, the facts (Fibre / Weave / Colour / Made in), the "+" items, then View the Material Record and Request a Private Appointment. The breadcrumb is a full-width row on top. Phone order: path, photos, purchase, story. | `sections/ha-product.liquid`, `ha-sections.css` |
| TRIBECA EMERALD is the main title; SKIRTS > TRIBECA > TRIBECA EMERALD | The h1 reads **`hartwick.product_name`** (new product metafield, single line). Breadcrumb: … / SKIRTS / TRIBECA / TRIBECA EMERALD. The Style crumb is the Style name minus its garment word. The Lot left the breadcrumb (it is in the Record). | `ha-product.liquid` |
| "+" = overlay, never a longer page | New `snippets/ha-info-pop.liquid` + `assets/ha-info-pop.js`. **Desktop:** hover opens a small window beside the "+" and leaving closes it; a click pins it until ×, Escape or a click elsewhere. **Phone / touch:** tap opens a panel over the page from the foot, background **#F8F5ED** (theme setting *Information panels*); ×, Escape or a tap outside closes it, and the scroll position is kept. Used for Fit & Measurements, Description, Delivery & Returns, Care & Ageing, and About the technique (Fibre to Garment). | new files; `ha-provenance-note.liquid`, `ha-cloth.liquid` |
| Max 3 product images | The opening rail is capped at 3 in code (`at_most: 3`, setting range 1–3). Fewer are shown if the product has fewer. It never pads. | `ha-product.liquid` |
| From Fibre to Garment must accept film later | Film slot: product `hartwick.process_film` (video file), otherwise a section film (Shopify video or YouTube / Vimeo link). *Film only* (default once a film exists) shows the film with the five stages as one chapter line. *Film, then record* keeps the full five-stage record. No film = the record as before. | `ha-provenance.liquid` |
| Delete all arrow illustrations | Removed every `.ha-pdp__arrow` (pencil arrows on links) and the scroll-hint chevron from the product page sections and `ha-row-body`. A CSS guard hides any on the product template. | several |
| Material: max 3 images, Care & Ageing + | `ha-cloth` capped at 3 (the 4 Oct "all images" rule is retired). Care & Ageing + reads `care_instructions` / `ageing_patina` / `repairs`, with a labelled placeholder until those exist. | `ha-cloth.liquid` |
| A Record of the Making: factual record | Renamed from The Production Record. The Style / Expression row is combined as drawn. Masters, Origin, Technique and Cloth rows print **only when the fact exists**: no brackets, and a Master only from a record with a name. | `ha-lot-record.liquid` |
| Master Technique = flexible content area | Takes a film (`hartwick.technique_film` or a section film), a photo (Master / tool) and words (Master / tool, optional technique description, off by default). With nothing, it is hidden on a published theme, or shows INSERT MASTER TECHNIQUE on the dev theme when "Show the empty slot" is on. | `ha-master-feature.liquid` |
| Related: small and editorial | A narrow lead (RELATED COLLECTIONS / BACK TO THE COLLECTION INDEX → `/collections`) and at most 3 small cards (piece name + Expression line). No empty boxes. | `ha-related-works.liquid` |

## Typography (sitewide)

**PORTER = information / function. JUNICODE LIGHT = story / editorial.** This replaces
the 2 October system (Troja / Typewriter / Typewriter Bold / Junicode SemiBold Italic).

- `snippets/ha-fonts.liquid`: two voices. `HA Editorial` is Junicode **pinned to Light**:
  the variable font's weight is clamped to 300 whatever a rule asks for (checked in
  Chromium). The italic is Junicode Light Italic. Every older role (`title`, `text`,
  `narrate`, `note`) points at it, and `identify`, `record`, `mono` and `number` point at
  Porter. Troja and typrighter are no longer named by any face on the main site.
- Porter weights: Medium for nav, labels, buttons and links; **Light for record data**
  (facts, prices, sizes, references).
- **Figures in Porter lines come from Junicode** (`HA Porter Figures`, lining numerals,
  scaled to Porter's cap height). The Porter webfont has no digits or punctuation (brand
  rule), and the Typewriter that used to supply them is gone.
- **Porter files now map lowercase to their capitals**, so sentence-case text in a Porter
  role draws in Porter capitals instead of splitting into two faces.
- Headings (h1–h3, `__title`, `__heading`) are Junicode Light in capitals, as drawn.
  Paragraph opacity is back to full ink (the 82% was for the Typewriter).
- Expression lines (cards, product page, related) and the size label moved to Porter.
- Unchanged exceptions: the landing page (its own pinned faces), the Register
  envelope's drawn lettering, and the BAG in the menu bar.

## To check / open with Aloha

1. **`hartwick.product_name` must be set per product** (e.g. Tribeca → "Tribeca
   Emerald"). It is not in the product sheet yet. Until it is set, the Style name
   (Tribeca Skirt) shows, with a "Product name pending" notice on the unpublished theme.
   This also differs from the 21 Sep store-title rule ("Tribeca Skirt | …"), so it should
   be confirmed against Christina's Framework v3.
2. Porter has no digits, so prices and numbers in Porter lines use Junicode figures.
3. Junicode body copy uses old-style figures (1970, 14) by default; headings and Porter
   lines use lining figures.
4. Film fields to create when films exist: `hartwick.process_film`,
   `hartwick.technique_film` (file reference, video).
5. Licences: Porter (R1) unchanged.
