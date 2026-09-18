# All Clothing — build note, 17 September 2026

Source: Aloha's **All Clothing & LOT — build brief for Ivan** (PDF), the
artboards *All Clothing - Desktop* (1440 × 7450), *Interaction and build
guide* and *The LOT / design & function*, and her message: fill the image
blocks for now, large uppercase titles in **#332820**, photographs black and
white at rest and colour on hover.

Preview (once a share link exists — see "Preview links" below):
`/collections/apparel` on Hartwik - Dev (#190886576427).

## What was built

| Brief | Built as |
|---|---|
| The page, at the established clothing URL | `templates/collection.clothing.json`, assigned to the **apparel** collection (`templateSuffix: clothing`, set by API). The live theme has no such template, so it falls back to its default there — nothing live changed. |
| Header, introduction, Back to the Collection Index | `sections/ha-clothing.liquid`, head |
| Five category links, sticky below the site header, anchor offsets | sticky nav; `scroll-margin-top` on each section |
| Made in Lots + How Lots work, inline, keyboard-operable, not hover | native `<details>` with the approved copy |
| One card per Style; photograph, Style, Expression, LOT, expression count, View piece; one link | products of the collection grouped by `hartwick.style`; hero = `style.hero_product` else the first product with a photograph; count = products sharing the Style; the whole card is one `<a>` to the hero product |
| Section rail + three columns; two on tablet; one on phone; rail releases at its section | CSS grid, sticky rail inside the section, static under 620px viewport height |
| Black and white → colour on hover / focus-within; reduced motion; touch = colour, one tap | `filter: grayscale(1)` on the colour originals; `:hover`, `:focus-visible`, `:focus-within`; `(hover: none)` colour by default, or the Index's scroll reveal by setting |
| Made by Masters feature between Skirts and Shirts | a `feature` block in the block order; copy from the artboard; image from Files (cotton khadi close-up) |
| Onward links, The Register | Fine Silk / Fine Jewellery / Yoga collections; `ha-register` |
| Numbers in Cutch Resin everywhere | `snippets/ha-style-name` — "Skirt <span class="ha-num">001</span>" — used on the cards, the product page h1, the Lot record and Related Works |
| Large uppercase titles #332820 | `--ha-ink-title: var(--ha-field-dark)`; applied to the Index title and tile labels, All Clothing h1/h2, the product Style h1 and the V2 section headings |
| One H1, real H2/H3, real links, alt text | yes |

Rendered on the CLI dev server: 25 cards — Skirts 3 · Shirts 10 · Trousers 5
· Dresses & Coats 2 · Loungewear 5 — sorted 001 → 010 within each section,
no Liquid errors, one link per card with a descriptive accessible name.
Phone: single column, wrapped links, no overflow.

## Data written to Shopify (invisible on the live theme)

- **`hartwick.style` on 52 clothing products** — every product in the apparel
  collection except the Corsica Coat (not in Aloha's range), matched by the
  legacy name in the product title against `style.legacy_name`. This is the
  binding the brief asks for ("stable catalogue IDs"); without it there are
  no cards.
- **Four style records corrected** to the sheet: Palma Skirt → **Skirt 002**
  (was a duplicate "Skirt 003"); Monaco Shirt → **Shirt 010** (was 011);
  Cedar Trousers → **Trouser 005** (was 007); Marrakesh Kaftan number/category
  were swapped. **Aloha to confirm** — the brief says revised display numbers
  need reconciling with the naming workbook.
- **`style.hero_product`** (product reference) added to the style definition —
  where Aloha's chosen featured image goes after Monday's meeting with Angela.
- `apparel` collection: `templateSuffix = clothing`.

## Not done, and why

- **Shorts 006** has no card: the Blossom Lounge Shorts product is a **draft**
  in Shopify, and drafts do not render. Activating it adds the card (26).
- **Made by Masters link is unbound** (the page says so). The approved textile
  story does not exist as a Shopify page yet; the old site's "Made by Masters"
  glossary is pulled to `docs/squarespace-export/made-by-masters-glossary.md`
  and is the obvious source for it. Creating a page needs the admin.
- **Yoga** onward link goes to the empty `yoga` collection, as the Index does;
  there is no yoga-mat product to link.
- **LOT [number]** on every card — no product carries a Lot yet.
- **Expressions** on the cards are the sheet's text only where a row has been
  written (SKIRT 001); the rest show the old title's descriptor until the
  rows are imported.
- Card order within a section is by Style number; the artboard's Loungewear
  order is hand-arranged. A manual order needs a sort field — not added.

## Preview links

From this afternoon, anonymous `?preview_theme_id=` links to **unpublished
themes are being routed through Shopify's `create_sharing` step** and loop
for anyone not logged into the admin (the old Luxe theme still previews
anonymously). Verification here ran through `shopify theme dev` instead.
For Aloha: generate a **Share preview** link in the admin (Online Store →
Themes → Hartwik - Dev → … → Preview → Share) and send that.

## Phone pass — 18 September

Ivan's feedback on a phone (and my own check at 375 / 768 in the browser pane):

- **Sticky category navigation** was three rows of display type covering the
  section heading, and sat 20px below the header (an inline style forced the
  desktop header height). Now one row of record-voice labels, 48px, scrolling
  sideways, flush under the mobile header; two wrapped rows on tablet.
- **Black and white on phones** — the brief said "colour on touch"; Ivan and
  Aloha both want the effect there too. All three pages now rest in black and
  white on touch screens and colour as each photograph scrolls into view
  (`assets/ha-collection-categories.js`: IntersectionObserver plus a geometry
  pass on scroll, since observer callbacks stop on a backgrounded tab).
- **Full-width text on phones** — the desktop measures (18–52ch) are removed
  under 750px on the product page, All Clothing and the Index.
- Product page: the Fit sentence is prose again (it inherited the record
  voice's capitals); Related Works' head stacks instead of squeezing.
- Collection Index: the photograph is a banner on phones with the title and
  directory on the page ground; a stray "50% 50%" (an `image_tag` argument
  slip) removed.
- No horizontal overflow on any of the three pages at 375 or 768.
- Both the CLI development theme and Hartwik - Dev carry every fix.
