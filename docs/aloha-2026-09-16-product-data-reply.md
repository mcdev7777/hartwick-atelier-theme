# Reply to Aloha — product pages from the sheet, and the data mapping (16 Sep 2026)

> Draft for Ivan to send. Hours line left for the log.

Hi Aloha,

Yes to all of it — the sheet as the team's working source, Shopify as the live
structured source, and your five tabs following the sections of the page is
exactly how the page is already built, so nothing is being rebuilt.

## SKIRT 001 — placement, today

The V2 layout is live on the development theme with every field from your
tabs given its slot. Until the sheet's text is written into Shopify it shows
the old site's content for the Tribeca Skirt, so you can check the
*placement* now and the *copy* the moment the fields are filled:

    https://www.hartwickatelier.com/products/tribeca-skirt-handwoven-matka-silk-emerald?preview_theme_id=190886576427

From tab 05, already in place: **COLLECT**, EXPECTED DISPATCH, "Select a
size" until a size is chosen (then the live stock state), REQUEST A PRIVATE
APPOINTMENT, "Scroll to explore", FIT & MEASUREMENTS, ASK ABOUT CARE, VIEW
DELIVERY INFORMATION / VIEW RETURNS POLICY (to the policies themselves), and
the Master module **hidden until a maker is verified** (it is switched on for
now so you can see the slot).

The SKIRT 001 PNG's care and returns wording is not used anywhere — Shipping
& Returns reads Settings › Policies (Christina's text, the same as checkout),
and Care & Repair reads the sheet's care field, which stays draft.

## The mapping you asked for

`docs/product-data-mapping.md` — every column of the five tabs → the Shopify
field or `hartwick.*` metafield → where it appears on the page → what it
feeds for search and AI. It is generated from the importer's own table, so
the document and the code cannot drift.

The short version:

| Tab | Goes to |
|---|---|
| 01 Product copy | Style record (name), `expression`, `colour_name`, `fibre`, `weave`, `fit`, `fit_measurements`, `hero_introduction`, `construction_details`; price / title / description are written **only at launch** |
| 02 Origin and maker | `yarn`, `weave`, `dye_process`, `construction_method`, `process_tags`, `fibre_ratio`; Master name / discipline / place / photo go on the **master record**, not the product |
| 03 Cloth and images | `cloth_heading`, `cloth_statement`, `cloth_explanation`, `fibre_ratio`, `material_record_ref`, `cloth_details` (images; the index label is the alt text) + `cloth_captions`, `look_closer` |
| 04 Production and care | variant SKU, `lot` record (number, quantity, dates), `care_instructions`, `related_products`; all notes → an internal field nobody sees |
| 05 Shared text | theme settings (one place) and Settings › Policies |

Thirteen new fields are needed for columns that had no home; the rest map
onto what exists. Nothing already built is touched.

## What we genuinely still need from Angela

Counted from the sheet, not asked afresh — the full table is in the mapping
document. Across the 78 expressions the open facts are: garment origin
("Made in", 56 rows), fibre origin and exact composition, the maker and place
for each stage (Masters are empty on every row), lot numbers, quantities and
production dates (all 78), the verified care source, the four cloth
photographs and hero image per product, and confirmation of the "Suggested"
related works. Everything else is drafted and only needs her review.

## Three decisions

1. **Price.** The sheet gives the EU RRP (€740). The store's base currency is
   USD and Markets converts live — should €740 be the EUR market price with
   USD derived, or the other way round? Christina's call; the importer does
   not touch price until it is settled.
2. **SKU per size.** The naming sheet gives one reference per Expression
   (AP-SKI-001-HWMS-EMG). Channel feeds expect a unique SKU per size, so the
   importer writes `-S / -M / -L` suffixes. Say if you want the bare reference.
3. **"Maker" or "Master".** The SKIRT 001 PNG writes "Maker / [confirm]"; the
   Framework says The Masters. Built as **Master**; one setting changes it.

## Next

Ivan grants the importer write access (one command, his login), runs SKIRT
001, you check the copy in place, then the same command runs the remaining
77 as Angela's reviews land — draft stays in the unpublished theme; nothing
reaches the live site until the launch step is run per product.

Images: whenever your renamed files are ready, they go into Shopify Files and
are linked from tab 03's filename cells; the legacy-name column already
matches the old filenames for the interim.

**Hours** — [Ivan: today's figure, running total and remainder from the log.]

Ivan
