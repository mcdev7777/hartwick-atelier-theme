# Homepage build — record of what was made

Built 1 September 2026 against **Hartwik - Dev** (#190886576427), the base Aloha
confirmed. The repo was re-baselined onto that theme first (291 files), so local
and remote are now the same codebase — the mismatch behind `theme-divergence.md`
Finding 2 is closed.

Live theme untouched. Nothing published.

## Sections, and what is native

| # | Wireframe section | Audit said | Built as | Why |
|---|---|---|---|---|
| 01 | Hero | native `image-with-text` | **custom** `ha-hero` | Native has one text block type: it cannot carry the eyebrow, the record-voice line, the rule and the text link as distinct elements, and it cannot label a placeholder image. |
| 02 | The House | native `image-with-text` + collage | **custom** `ha-house` | Same reason. The lead-plus-two-tiles grid is trivial in CSS and the native collage cannot label placeholders. |
| 03 | Collection Index | custom (small) | **custom** `ha-collection-index` | As planned. |
| 04 | The Masters Index | custom (small) | **custom** `ha-masters-index` | As planned. |
| 05 | Featured Lot | custom, shared | **custom** `ha-featured-lot` + `snippets/ha-material-record.liquid` | As planned. The record snippet is the component the product page will render. |
| 06 | Journal / Dispatch | native `featured-blog` | **custom** `ha-journal` | The store's only blog (`news`) is empty, so the native section falls back to Luxe's own demo cards. The custom one shows the three Dispatch categories as labelled placeholders and switches to real articles the moment they exist. |
| 07 | The Register | native `newsletter` | **custom** `ha-register` | Native has no eyebrow and puts the invitation in the heading column. The form inside is still Shopify's own customer form, and the section accepts `@app` blocks so Klaviyo drops in without a rebuild. |
| 08 | Footer | native `footer` | **unchanged** | See open questions. |

No native Luxe section file was forked. Journal cards and the newsletter elsewhere
on the site are restyled from `assets/ha-sections.css`, which is loaded after
`base.css` in `layout/theme.liquid`.

## Files added

    assets/ha-sections.css            all homepage styles + native restyles
    assets/ha-collection-index.js     index ↔ image pairing (tablist)
    snippets/ha-figure.liquid         image or labelled placeholder
    snippets/ha-material-record.liquid  THE SHARED RECORD — product page reuses this
    snippets/ha-placeholder-note.liquid provisional-content marker
    sections/ha-hero.liquid
    sections/ha-house.liquid
    sections/ha-collection-index.liquid
    sections/ha-masters-index.liquid
    sections/ha-featured-lot.liquid
    sections/ha-journal.liquid
    sections/ha-register.liquid
    templates/index.json              rebuilt to the wireframe

Changed: `layout/theme.liquid` (one stylesheet line), `snippets/ha-tokens.liquid`
(placeholder field token), `locales/en.default.json` (Register wording),
`sections/header-group.json` (Lot terminology).

## Every field is data-driven

Nothing on this page is hard-coded editorial. Each section reads real data when it
exists and falls back to clearly labelled wireframe placeholders when it does not:

| Section | Reads | Falls back to |
|---|---|---|
| Collection Index | a collection's products, `hartwick.style` / `expression` / `lot` | 7 placeholder rows |
| Masters Index | `shop.metaobjects.master.values` — appears automatically once the definition exists | 9 placeholder roles |
| Featured Lot | a product's `hartwick.*` metafields | the wireframe's record |
| Journal | a blog's articles, `hartwick.category` / `standfirst` | 3 placeholder cards |

## Placeholders currently on the page

All are marked on screen with "Placeholder content — wireframe copy, not approved
for publication", and every section has a checkbox to remove that notice.

- All 13 images (risk R4 — no approved imagery yet).
- Collection Index rows: Tide, Mesa, Stone, Flint, Drift, Fell, Ember — **wireframe
  names, not the naming convention.** Real rows will read `Skirt 001 · Handspun
  Fresh Pink Cotton Khadi`.
- Masters: roles and one region. No artisan name is invented; names publish only
  when Aloha supplies them.
- Featured Lot record: Lot I · Edition 07 / 25, khadi cotton, natural indigo,
  Rajasthan. Provenance is unverified (risk R7) and must not go live as fact.
- "[14] pieces" on the Masters link — a wireframe number, replaced by a real count
  as soon as a collection is bound.

## Accessibility and QA done

- Collection Index is a tablist: click, tap, arrow keys, Home/End, roving tabindex.
  No hover dependency anywhere on the page.
- No horizontal overflow at 320 px. Checked 320, 390, 1440.
- Contrast measured on every text/ground pair: lowest is 5.17:1 (placeholder label),
  then 5.87:1 (quiet text). Both above AA. The placeholder field was darkened to a
  72% peat tint to achieve this.
- Accent colours are used as surfaces only, never as text.
- Type scale follows the typography READ ME: editorial copy at 16px ("digital body
  copy should normally begin at 16 px"), line height 145%, the record voice quieter
  at 12-13px beneath it. Luxe's rem base is 10px, so 1.6rem = 16px.
- Every tap target measures at least 44px (mobile brief §2), via invisible hit areas
  on the small text links rather than padding that would break the composition.
- `prefers-reduced-motion` honoured.
- Theme Check: 0 errors.

## Open questions for Aloha

1. **Footer.** The wireframe shows a single minimal bar (wordmark · Instagram ·
   Contact · The Register). The site's current footer carries real content and
   navigation — four feature columns, Company and Information link lists, a
   newsletter. Reducing it is a site-wide change and a content decision. Left as is
   pending her answer.
2. **Announcement bar** reads "Release September 15 2026" while launch is 10
   September. Terminology was corrected there ("Lot 001" → "Lot I"); the date is
   hers to confirm.
3. **Lot numbering.** The wireframe prints "LOT 001". Framework v3 makes the
   customer-facing form Roman — Lot I. Built to Framework v3.
4. **Journal on mobile.** Built stacked, per the recommendation. The mobile
   wireframe shows a three-across row; one setting switches it.
5. **Collection Index rows** need a collection to point at. Which collection is
   Lot I?
