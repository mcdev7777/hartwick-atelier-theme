# Collection page — build note

Built 15 September 2026 against **Hartwik - Dev** (#190886576427), unpublished.
Source: Aloha's `HA_COLLECTION_CATEGORY_DESKTOP_EDITABLE.png` (15 Sep) and her
covering note: "I'd like the imagery to appear black and white by default, then
transition to colour on hover. All of the images you'll need are already in
the Drive I shared with you."

Preview: `https://9c8a52-dc.myshopify.com/collections?preview_theme_id=190886576427`
(password `angela`). This is the page the header's COLLECTION link opens; the
footer's Collection link now goes there too (it went to `/collections/all`).
Also 16 Sep, site-wide: the footer wordmark is centred on a phone (it sat
left when the three columns stacked).

## What the wireframe became

| Wireframe band | Section | New? |
|---|---|---|
| THE COLLECTION INDEX, the category line | `ha-collection-categories` (its head) | new |
| Four photographs two by two, names at the foot | `ha-collection-categories` (its tiles) | new |
| THE REGISTER | `ha-register` (source: collection_page) | extended |

Template: `templates/list-collections.json` — Luxe's `main-list-collections`
is kept, disabled, so the native grid is one switch away. Styles: the
"THE COLLECTION INDEX" block in `assets/ha-sections.css`. The editor name is
**HA — Category tiles** (the homepage's numbered index already owns
"Collection Index" in the section list, and Shopify caps names at 25 chars).

Geometry measured off the drawing at 1440: title band 206px (built: 213
without the notice), tiles 720 × 858 (21:25; built 713 × 848 beside the
scrollbar), Junicode capitals with a 28px cap height (built: 1.35× editorial
= 43px), the name in Porter capitals 42px above the tile's foot (built: 42).
Below 750px the tiles stack one to a column at 4:5.

## Black and white → colour

The photographs are the **colour originals**; `filter: grayscale(1)` takes
the colour away and hover or keyboard focus bring it back over 700ms (no
transition under `prefers-reduced-motion`). A phone has no hover, so there
the colour arrives as each tile scrolls into view and leaves as it scrolls
out (`assets/ha-collection-categories.js`, an IntersectionObserver at 55%
visibility, active only where `(hover: none)`); a tap does it too. The
section's "On touch screens, colour arrives" select can restrict it to touch
only. First cut (15 Sep) had phones in colour by default — Ivan, 16 Sep:
"the black and white transition effect is destroyed" — so a phone now starts
black and white exactly like the desktop. Aloha has not sent a mobile drawing.

## Data model

Each tile is a block bound to a **collection**: the tile links to it, and its
featured image and title are used unless the block's Photograph / Name
override them. A fifth category is a fifth block. Crop position per tile
(horizontal / vertical %) because the files are 2:3 and the tile is 21:25.

| Tile | Collection | Store title |
|---|---|---|
| Clothing | `apparel` | APPAREL |
| Fine Silks | `fine-silk` | FINE SILK SCARVES |
| Yoga | `yoga` | YOGA — **0 products**, the tile opens an empty collection |
| Fine Jewellery | `fine-jewellery` | FINE JEWELLERY |

## Photographs — provisional, and why

Her Drive was not to hand (the local materials folder holds only the
homepage and product wireframes). Every image on the store was scanned by eye
against the drawing (1,316 files in Admin > Files):

- **Fine Silks** — `088_HARTWICK_FINESILK_PETITSQUARE01_SCARF_NATURALDYE_BLOCKPRINT.jpg`
  is the frame in her drawing (corner turned, ladder and its shadow).
- **Fine Jewellery** — `001_HARTWICK_LIMINAL_ALEXANDRIA_PENDANT_22K_GOLD_EMERALD.jpg`
  is the same photograph; the store's copy is cropped tighter than hers (no
  hat brim at the top).
- **Clothing** — `001_HARTWICK_HANDWOVEN_TRIBECA_SKIRT_KHADI_TOKYO_SHIRT_IKAT.jpg`
  is the same shoot, room and outfit but not her frame (hers has the framed
  photograph on the dresser bottom-left and her to the right; that frame is
  not on the store). Nearest of the three cabin frames.
- **Yoga** — the rolled mat on stone is **nowhere on the store** (there are no
  yoga products yet). The tile carries the Yoga collection's own header image
  (`HartwickAtelier-CollectionHeader-Yoga.jpg`, the yellow mat by the sea) as
  a stand-in.

Picking an image on a block replaces its picture at once; the section's
placeholder notice is on until then.

## Admin (not theme code)

Nothing required — `/collections` exists on every store. If Aloha wants the
Yoga tile hidden until the yoga products exist, remove that block in the
editor (the grid becomes three tiles; the last one sits alone on the left).

## Not done / needs the user

- The wireframe originals from Aloha's Drive — three tiles are close or
  exact from the store's files, one is a stand-in (Yoga).
- Aloha's other points in the same note — About only in the footer with its
  content surfaced on the Homepage / Circle / Register; the Clothing Index
  page still to come; The Masters page; a call at 11:30 tomorrow on the
  Product page and Homepage; Angela to set up Google Analytics — are noted,
  not built.
