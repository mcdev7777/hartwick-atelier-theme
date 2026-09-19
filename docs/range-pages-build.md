# Range pages — Apparel, Fine Silk, Fine Jewellery, Yoga — 18 September 2026

Aloha, 18 September: "please proceed to create the remaining pages for
Fine Silk, Yoga, and Fine Jewellery. These should follow the same structure
as the Apparel page … we will no longer use the term 'Clothing' … refer to
it as 'Apparel' … include a header image similar to the one on the Apparel
page … ensure that the text size remains smaller."

## What was built

- **One section for every range.** `sections/ha-clothing.liquid` (the All
  Clothing build, 17 Sept) now serves all four: a Category block may name a
  **collection** instead of Style categories, and then lists that
  collection's products, one card per product, in the collection's order.
  Everything else — head, sticky category navigation, Made in Lots, rails,
  the black-and-white → colour cards, the Made by Masters feature slot,
  onward links, the Register — is the same page. The card name is the
  product title up to its " | " (the Expression after it is read by
  `ha-product-fact` and printed once). When Style records exist for these
  ranges the blocks switch back without touching the layout.
- **Templates and assignments** (by API, `collectionUpdate.templateSuffix`):

  | Range | Template | Category blocks (sub-collections) |
  |---|---|---|
  | Apparel `/collections/apparel` | `collection.clothing.json` (kept; internal name) | Style categories as before |
  | Fine Silk `/collections/fine-silk` | `collection.fine-silk.json` | Oversized Dupattas · Classic Stoles · Large Squares · Medium Squares · Petit Squares; Made by Masters feature after Stoles |
  | Fine Jewellery `/collections/fine-jewellery` | `collection.fine-jewellery.json` | Earrings · Rings · Bangles & Bracelets · Necklaces & Pendants |
  | Yoga `/collections/yoga` | `collection.yoga.json` | Yoga Mats (empty until a product exists — the page says so) |

- **"Clothing" → "Apparel"** in every visible place: the Apparel page's
  title (All Apparel), breadcrumb, introduction, navigation label and Lots
  copy; the Collection Index's tile, directory heading, group heading,
  "View all apparel", subline and introduction; the section defaults.
  File names, CSS classes and the `clothing` template suffix stay — they are
  internal, like legacy SKU names, and renaming them would leave stale
  copies on the remote themes.
- **Smaller text.** Range titles come down from 2.4× to 1.7× of the
  editorial token (77 → 54px at 1440, the Index title's size; 1.4× on a
  phone). Sticky category links from 1.05× to 0.9× of the statement token.
  The Fine Silk navigation runs to two lines at 1440; the navigation's
  measured height now feeds the anchor offsets and the rail's resting point
  so nothing hides beneath it.

## Copy — provisional, for Aloha

Introductions, category lines and Lots copy for the three new ranges are
placeholders in the house voice, written to be replaced by her range
briefs ("I will send at some point the important info … as they all have
different masters knowledge"). The Fine Silk feature carries the Masters
glossary's block-printing copy and links to `/pages/the-masters#block-printed-by-hand`;
Fine Jewellery and Yoga have no feature until she supplies theirs. The
placeholder notice is on.

## Data notes

- Fine Silk shows 14 cards, not 21: Rich Ribbon 01–03 and Shayla 01–04 in
  Classic Stoles are **draft** products and do not render. Activating them
  adds the cards (the Index's missing "Rich Ribbon / Shayla" formats).
- Fine Jewellery shows 18 of 19: one product in the collection is in none
  of the four sub-collections.
- No product carries a Lot yet; "Lot [number]" prints as designed.

## Not done — needs the reference

Aloha's "header image similar to the one on the Apparel page … attached a
reference for placement" did not reach this session (the Apparel page has
no header image; the Index does). Waiting on the attachment before placing
anything.
