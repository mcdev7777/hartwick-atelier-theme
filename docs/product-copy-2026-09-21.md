# Product copy from the 21 September sheet — names, bullets, the draft gate

> Build note and a reply for Ivan to send Aloha. Hours line left for the log.

Aloha, 21 September 2026, with `Hartwick Atelier _ Product Data text (2).xlsx`:

> We've returned to the original names, such as Tribeca Skirt and Amman Shirt.
> Please use these as the customer facing product titles, with the Expression
> underneath to distinguish the fabric, weave, colour or treatment. Style codes
> and product IDs stay internal. Column O in "01 Product copy" is now in short
> bullet points, ready for the product page description accordion. You can use
> the updated sheet to build out the website product pages, keeping anything
> marked draft or awaiting confirmation unpublished.

## What changed in the sheet (against the 16 September export)

| Where | Change |
|---|---|
| 01 · Product name | `SKIRT 001` → **`Tribeca Skirt`** on all 78 rows. The fine-silk rows keep their codes (`DUPATTA 01`, `SHAYLA 03`): tab 05, "Do not invent location names where none is recorded." |
| 01 · column E | Header still reads **"Legacy name - internal only"** but the cells now hold the old *Short hero subtitle* (`Handspun Matka Silk`); that column's header was dropped and its data kept under the stale one. Read as the subtitle. |
| 01 · column O | "Description accordion" is now **bullet points** (`•`), 78 rows, 306 bullets. |
| 01 · Fit & measurements body | Reworded on P001 and one other row. |
| 04 · Related works | Suggestions renamed to the location names ("Suggested: Amman Shirt - …"). |
| 05 · guide | Product identity and Tone rows rewritten for the location names; "Publish the approved existing location name and its expression. Keep worksheet IDs, style codes and SKUs in internal fields." |
| Approval | **P001 only**: "Hero introduction and description approved in conversation; remaining fields need review." Every other row: "DRAFT \| Angela to review …". |

## What was done

**Store (through `scripts/sheet-to-shopify.py`, CLI auth now has write scopes):**

- `--styles`: on the `style` metaobject, `display_name` ← the location name
  (30 apparel and accessory records), the old numbered name → a new
  **`code`** field, internal; the 22 fine-silk records keep their code as
  the name; the definition's display-name key is `display_name`, so the
  admin lists read *Tribeca Skirt* rather than *001*. Idempotent.
- `--definitions`: two new product metafields, `hartwick.subtitle` (column E)
  and `hartwick.copy_status` (the gate).
- `--write-all`: the sheet's `hartwick.*` fields on **76 of 78 rows** —
  identity, hero introduction, facts, fit, the bullet description as a
  rich-text list, tab 02 provenance fragments (facts kept, "to confirm"
  dropped), tab 03 cloth copy and captions, tab 04 care, internal notes.
  No title, description, price or SKU was touched: those are live-visible
  and `--launch` writes them only per product, only for an *approved* row.
  Unmatched: **P027** Monaco Shirt, block printed (the store has one Monaco
  product and P026 is it) and **P077** Rich Ribbon 04 (no product; motif
  pending).

**Theme (CLI dev theme #190959223083, then Hartwik - Dev #190886576427):**

- The heading, the Lot record's STYLE row, the Apparel / Fine Silk cards,
  the Index and Related Works all read `style.display_name`, so they now say
  *Tribeca Skirt*; no per-section change. `ha-style-name` still sets a
  trailing number in Cutch Resin, which now reaches only the fine silk.
- Description row: `hartwick.construction_details` renders as `<ul>`, with
  the same quiet marker as the old DETAILS list (`ha-sections.css`).
- Serif line under the name reads `hartwick.subtitle` first (column E:
  "Handspun Linen" where the Expression says "Handspun/Handwoven Linen"),
  then the Expression before its comma.
- **Draft marker:** a page whose `copy_status` is `draft` shows *"Draft copy
  — awaiting Angela's review"* beside the placeholder notices — on the
  unpublished theme only, and only while the global notices switch is on
  (it is off since 20 Sep; one click brings every review marker back).
- `ha-clothing` include/exclude accepts a Style's name **or** code;
  `collection.clothing.json` now says *Jasmine Dress* where it said
  *Dress 002*. Placeholder names in the product templates and
  `ha-continue` follow.
- `CLAUDE.md`, `docs/data-model.md`, `docs/product-page-v2-build.md`,
  `docs/product-data-mapping.md` (regenerated; the `.docx` / `.pdf` beside
  it are the 17 Sep version) updated.

**Checked:** the live theme (*Hartwick - Landing*) renders Luxe's native
product section and none of the `hartwick.*` fields — the Tribeca page on
hartwickatelier.com still shows the old copy, so nothing drafted is public.

## Reply to Aloha

Hi Aloha,

Done — the sheet is in.

**Names.** Tribeca Skirt, Amman Shirt and the rest are the product names
across the development theme: the product page heading with the Expression
beneath it, the Apparel and Fine Silk pages, the Collection Index, the Lot
record and the Related Works cards. The style codes (Skirt 001) and the
P-numbers are held internally and appear nowhere a visitor reads. The fine
silk keeps its codes as names (Dupatta 01, Shayla 03), as tab 05 says not to
invent a location name where none is recorded — tell me if you would rather
these read differently.

**Column O.** The bullets are the Description row on every page, as a list.

**Draft stays unpublished.** Every row's copy sits in the product's Hartwick
fields, which only the development theme reads — the live site is unchanged.
A row marked DRAFT is marked *Draft copy — awaiting Angela's review* on the
development theme when the review notices are switched on, and the importer
will not write a draft row's title, description or price to the live product.
Today that means only Tribeca Skirt (emerald) is releasable, and only its
introduction and description; everything else waits for Angela's tick in the
Approval notes column.

Preview (log in to the admin first, then open):
`https://www.hartwickatelier.com/products/amman-shirt-handwoven-natural-checkerboard?preview_theme_id=190886576427`
`https://www.hartwickatelier.com/collections/apparel?preview_theme_id=190886576427`

Five things to settle, none blocking:

1. **Column E's header** still says "Legacy name - internal only" but the
   cells are the short subtitle ("Handspun Matka Silk"). I have read it as
   the subtitle. Could you rename the header so the sheet says what it holds?
2. **Christina's Framework v3** still defines the Style by its number
   (`Skirt 001`). Since the Framework is the terminology authority, it would
   be good to have the line updated so the two documents agree.
3. **Product title in Shopify** (cart, checkout, order emails, Google) will
   be `Tribeca Skirt | Handspun Matka Silk, Emerald Changeant` — the name,
   then the Expression, as the old site did — so two Tribeca Skirts in a bag
   can be told apart. Say if you want another separator.
4. **Spellings:** the sheet says *Samarkant Dress*, the store *Samarkand*;
   *Cyprus Pyjama Set* / the store's *Cyprus Lounge Set*; *Cedar Trousers* /
   *Cedar Pants*; *Sitges Tote* / *Stiges*. The sheet wins when a product is
   released; confirm those are intended.
5. **Two rows have no product yet** — Monaco Shirt, hand block printed
   (P027) and Rich Ribbon 04 (P077) — and two products have no row: the
   Prague Shirt in the Cottonfields print and the Corsica Coat (draft).
   Should the missing products be created, and the extra two retired?

SKUs from tab 04 are ready but not written until the size-suffix question
(REF-S / REF-M / REF-L or one reference per product) is answered.

Hours: —

## For the log

- Importer flags added: `--write-all`, `--styles`, `--refresh`, `--skus`
  (SKUs are now opt-in), `--launch` refuses `copy_status = draft`.
- Matching is by the linked Style record first, then title words; the
  Expression's words decide within a Style, weighted title › subtitle ›
  handle; old print names in the Approval notes ("changed from Victorian
  Rouge … to Vine Red") count. 76 ok / 0 check / 2 none.
- `store-snapshot/products.json` and `metaobjects.json` are refreshed by
  `--refresh` (the 5 Sep snapshot was stale); the rest of the snapshot is
  still `scripts/store-audit.sh`.
