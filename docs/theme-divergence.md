# Theme divergence — findings, 1 September 2026

Discovered while connecting Shopify CLI to the store. Read-only investigation;
nothing has been written to any theme.

## Themes on the store

| Theme | ID | Role |
|---|---|---|
| Luxe - Fashioncan | 173395738923 | **live** |
| Hartwik - Dev | 190886576427 | unpublished — our working theme |
| Updated copy of Luxe - Fashioncan | 190062493995 | unpublished |
| Updated copy of Luxe - Fashioncan | 190875861291 | unpublished |
| Luxe V.2 - Fashioncan | 190494114091 | unpublished |
| Dawn | 170976543019 | unpublished |
| Prestige | 170982015275 | unpublished |

## Finding 1 — the dev theme is not a copy of the live theme

`Hartwik - Dev` differs from `Updated copy of Luxe - Fashioncan` (#190062493995)
by **4 files only** — and those four are our own edits. It is a duplicate of that
theme, not of the live one.

Against the **live** theme it differs in roughly **250 files**: nearly every
section, snippet, stylesheet, locale and template.

Both report `Luxe 5.1.0`, but they are materially different builds.

**Present in the dev build, absent from live:**
`breadcrumb`, `cart-notification-*`, `cart-featured-collection`,
`component-age-verifier`, `section-image-comparison`, `section-feature-icons`,
`recently-viewed-products`, `related-articles`,
`section-main-product-description`, `swatch`, `product-share-button`,
`product-variant-media-gallery`, `cart-recommendations`, `scrolltrack`,
RTL support (`rtl.css`), `custom-styles.css`, media placeholder snippets.

**Present on live, absent from the dev build:**
`component-rte.css`, `facets.js`, `visual-display.liquid`, the
`icon-image-placeholder-*` and `icon-product-image-placeholder-*` snippets.

**Hartwick content is intact on both.** `templates/index.json` and
`templates/page.story.json` carry the same content in each.

### Why this matters

Publishing `Hartwik - Dev` on 10 September would ship a **full Luxe upgrade** to
the live storefront alongside the Hartwick work — cart, product page, header,
footer and every template would change at once. That is materially larger than
the scoped engagement and carries risk that has not been assessed or costed.

The audit in `audit-and-plan.md` was written against the local repo, which
tracks the **live** theme. Its load-bearing conflict — that `product_specifications`
splits `product.description` on the literal string `SPECIFICATIONS` and cannot read
metafields — was re-checked and **holds on both builds**, so the Material Record
still needs a custom section. Other specifics should be re-verified against
whichever base is chosen.

### Decision needed from Aloha

1. Is the newer Luxe build the intended base for launch? If yes, the Luxe upgrade
   must be scoped, QA'd and signed off as part of go-live — it is not free.
2. If not, the Hartwick work should be rebuilt on a theme duplicated from live.
   The work so far is four files and about 30 minutes to reapply.

Until this is settled, no further build work should go onto `Hartwik - Dev`.

## Finding 2 — 84 theme settings were stripped from the dev theme

**Cause: my instruction, not an error by Ivan.** Step 2c said to paste the local
`config/settings_schema.json` over the store's copy. The local file tracks the
*live* build; the dev theme is the *newer* build with a different schema. The
paste replaced 263 settings with 191.

**Lost from the schema (84):** carousel controls, card and swatch settings, cart
recommendations, badge sizing, filter styling, `rtl_enable`, and others.
`layout/theme.liquid` on the dev theme references `carousel_width`,
`carousel_arrow_visibility` and `rtl_enable`, which now resolve to nothing.

**Nothing configured was lost.** None of the 84 had stored values in
`settings_data.json` — they were resolving to schema defaults. Verified intact:

    color_body_text     = #0B0603
    color_body_bg       = #F2EFE9
    color_background_04 = #332820
    bar_bg_col          = #F2EFE9

The Hartwick palette settings carry no stored values either, which is correct —
they resolve to the schema defaults, and `ha-tokens.liquid` has `default:` guards.

### Repair, prepared and ready

Dev theme's original schema + the Hartwick — Material Archive panel:
**25 panels, 274 settings**, Hartwick panel inserted before Colors.
One file: `config/settings_schema.json`. No change needed to `settings_data.json`.

Not yet pushed — awaiting approval to write to the store.

## Process change

The local repo tracks the live theme while the work is happening on a theme built
from a different base. That mismatch is what caused Finding 2 and will cause more.
Once the base theme is settled, the repo should be re-baselined onto it so that
local and remote are the same codebase, and file transfer should be done with
`shopify theme pull` / `push` rather than copy-paste.
