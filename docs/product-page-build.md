# Product page build — record of what was made

Built 2 September 2026 against **Hartwik - Dev** (#190886576427), the same
unpublished theme as the homepage. Live theme untouched. Nothing published.

Sources: `Wireframe (03) PRODUCT PAGE` (desktop + mobile) and the mobile
developer brief `HA_ Wireframe 03_ Mobile Product Page.pdf` (12 sections,
8 pages), read in full. Terminology follows Framework v3 throughout.

## Sections, and what is native

| # | Wireframe section | Audit said | Built as | Why |
|---|---|---|---|---|
| 01 | Gallery + sticky buy column | native `main-product` | **native**, configured | Grid gallery, sticky info and sticky buttons, zoom — all Luxe settings. |
| 02 | Lot / Edition eyebrow, Style, Expression | native text block | **custom_liquid** → `ha-pdp-identity` | Luxe's `title` block prints `product.title` on one line. The wireframe needs three distinct things, two of which are metafields. |
| 03 | Size selector, Add to Bag | native `variant_picker` + `buy_buttons` | **native**, restyled | Untouched Shopify product form. Inventory, variants, analytics and checkout unchanged (brief §3). |
| 04 | Size & Fit / Delivery | native `popup` | **native** ×2 | Content held in the block, so no page needed. |
| 05 | Request Private Appointment | native `popup` | **custom_liquid** → `ha-appointment` | The route is undecided, so it resolves to whichever page exists and says so plainly when none does. See open questions. |
| 06 | The Garment | custom (small) | **custom** `ha-garment` | As planned. |
| 07 | **Material Record** | custom — shared | **reuses** `snippets/ha-material-record.liquid` via `ha-product-record` | The shared component, built for the homepage, now used in both places as intended. Runs in `full` mode: 13 rows against the homepage's 5. |
| 08 | The Origin | custom (small) | **custom** `ha-origin` | As planned. |
| 09 | Meet the Masters | custom — shared | **extends** `ha-masters-index` with `layout: feature` | One section, two compositions. Data path, placeholder path and touch states written once. |
| 10 | Fibre → Finished Garment | custom (small) | **custom** `ha-process` | Two rows of four on mobile, one row on desktop. No carousel (brief §8). |
| 11 | Care & Ageing / Delivery & Returns | native `collapsible-content` | **native**, configured + restyled | `column_layout: 2` plus `heading` group blocks. Native was the right call, but Luxe's 2-column mode flows rows *across* the columns; the wireframe's two grouped columns are a CSS correction on top. |
| 12 | From the Journal | native `featured-blog` | **reuses** `ha-journal` | Same reason as the homepage: the store's only blog is empty, so the native section falls back to Luxe demo cards. |
| 13 | You may also consider | native `related-products` | **native**, restyled | Shopify's own recommendation logic, analytics and inventory kept, exactly as brief §10 recommends. |
| 14 | The Register | native `newsletter` | **reuses** `ha-register` | Built for the homepage; unchanged. |

No native Luxe section or snippet was forked. Three of the fourteen sections
were already built for the homepage and were reused without modification to
their behaviour.

## Files added

    sections/ha-garment.liquid
    sections/ha-origin.liquid
    sections/ha-process.liquid
    sections/ha-product-record.liquid       wraps the shared record snippet
    snippets/ha-pdp-identity.liquid         Lot · Edition / Style / Expression
    snippets/ha-appointment.liquid          Request Private Appointment
    assets/ha-product.js                    gallery position counter
    templates/product.json                  rebuilt to the wireframe

Changed: `sections/ha-masters-index.liquid` (feature layout + product-scoped
Masters), `snippets/ha-material-record.liquid` (full-mode placeholders, and
flags to suppress the eyebrow/title/intro where the buy column already states
them), `assets/ha-sections.css` (+520 lines), `layout/theme.liquid` (one
conditional script tag), `docs/data-model.md` (two new metafields).

### The suffix templates

`templates/product.celestial / liminal / terrene / upaya .json` were **also**
rebuilt to the same layout. The Hartwick apparel products are assigned to these
Luxe suffix templates, not to `product.json` — so without this the garments the
wireframe was actually drawn for would have been the only products still showing
the old Luxe demo arrangement.

They are now four duplicates of one layout. The tidy end state is a single
product template with the suffixes cleared from the products, but that is a
product-data change and needs admin access. Left for Aloha's decision.

`product.no-pricing.json` is a genuinely different variant and was left alone.

## The one thing Luxe could not do

**The gallery image count (`01 · 06`, brief §2).** Luxe's mobile gallery
navigation offers bullets, a scroll track, thumbnails or nothing — there is no
numeric readout. Rather than fork `product-media-gallery.liquid` and lose the
theme's upgradeability, `assets/ha-product.js` attaches a counter from outside:
it reads the native gallery's DOM and writes one element into it. If the script
fails to load the gallery is untouched and still works.

Position is derived from geometry — which slide's centre is nearest the
scroller's centre — rather than from an IntersectionObserver, because observer
callbacks are tied to painting and go quiet on a backgrounded tab, which would
leave the readout stale. Verified at every scroll position and on thumbnail
click.

## Every field is data-driven

| Section | Reads | Falls back to |
|---|---|---|
| Identity | `hartwick.style` → `display_name`, `expression`, `lot` → `number_roman`, `edition_number` / `edition_size` | `product.title` for the heading; wireframe copy for the rest, marked |
| The Garment | `garment_heading`, `garment_intro`, `silhouette`, `fit`, `movement`, `garment_length`, `model_height`, `size_worn`, `construction_details` | section settings, marked |
| Material Record | all 13 `hartwick.*` record fields incl. `dye`, `place_of_weaving`, `place_of_dyeing` | per-row wireframe values, marked |
| The Origin | `origin` metaobject via `place_of_weaving` (then construction, then dyeing); `dye` metaobject image | section settings, marked |
| Meet the Masters | `hartwick.masters` → `master` metaobjects, with portrait + workshop image | 5 placeholder roles |
| Fibre → Garment | `hartwick.process_steps` → `process_step` metaobjects | 8 placeholder steps |
| Journal | blog articles | 3 placeholder cards |

Every row renders **only when present**. An empty field collapses with no
orphaned label and no gap (brief §5).

## Placeholders currently on the page

All marked on screen with "Placeholder content — wireframe copy, not approved
for publication", and every custom section has a checkbox to remove the notice.

- **All imagery** (risk R4). The gallery uses whatever media the product already
  has; every custom section's figures are labelled placeholder fields.
- **The Material Record's provenance** — khadi cotton, natural indigo, Rajasthan.
  Unverified (risk R7). Must not go live as fact.
- **Care, Delivery, Returns, Exchanges, Size & Fit** — all six accordions and
  both popups carry copy that says on its face it is pending approval. No care
  instruction, dispatch time, duty or return term has been invented.
- **Masters** — roles only. No artisan name is invented.
- **Identity** — Lot I · Edition 07 / 25 and "Handspun Khadi" are wireframe
  values; the heading falls back to the product's real title.

## Design-fidelity pass (2 September, second pass)

The first pass was validated by DOM measurement only — the preview pane was not
painting, so the page was never actually looked at. That was the wrong way to
check a layout, and the spacing showed it. This pass renders the page with
headless Chrome and measures both the render and the wireframe in pixels.

**Geometry read off the wireframe** (its canvas is 1501px = 2x a 1500px design):

| | Wireframe | Built (1440) | Target (1440) |
|---|---|---|---|
| page gutter | 67 | 64 | 64 |
| gallery / panel split | 61.1% / 38.9% | 60.5% / 39.5% | 61.1% |
| buy-column content | x 967 → 1385.5 | 919 → 1321 | 928 → 1329 |
| two-column split | 418 \| 99 \| 850 | 396 \| 95 \| 806 | 401 \| 95 \| 815 |
| Masters split | 363 \| 365 \| 529 | 343 \| 345 \| 500 | 348 \| 350 \| 507 |
| Style title | 54px | 54px | — |
| Expression | 29px | 28.8px | — |
| section heading | 40px / 120% | 40px | — |
| body | 16px / 140% | 16px | — |
| record voice | 12–13px | 12–13px | — |

Everything lands within about 9px of the wireframe.

**The homepage wireframe uses a 42px gutter; the product page uses 67px.** The
two pages genuinely differ, so `--ha-gutter` (40px) is untouched and the product
page carries its own `--ha-pdp-gutter`. The homepage is unchanged — verified.

**Type follows the homepage's system, not new numbers.** The eyebrow, body and
record sizes are the homepage's own; the only page-specific values are the ones
the wireframe sets differently — section headings at 40px against the homepage's
56px, and the Style title at 54px.

### What the pass actually fixed

1. **Gallery was one full-width image over a 2x2 grid**, not the wireframe's even
   two-column grid. `balance_grid: false`.
2. **Gallery/panel split was 66/34**, not 61/39. Luxe declares
   `.product-main-section-layout-extra-wide .product-main-media-section
   { width: 66% }` *after* `ha-sections.css` loads, so an equal-specificity
   override lost. Fixed with `body.` on the selector rather than `!important`.
3. **The buy column was 285px wide** and broke the product name mid-word
   ("HANDSP / UN"). Luxe's full-width margin rule pads the panel by
   `--page-margin-desktop` (100px) on *both* sides. Now 402px, per the wireframe.
4. **"SIZE" sat above the size boxes** instead of beside them. `legend` is
   rendered specially inside a `fieldset` and does not reliably become a flex
   item; it is now positioned instead.
5. **Vertical rhythm was ~11–26px where the wireframe runs 27–53px.**
   `blocks_vertical_spacing` 10 → 30, and `text_section_padding` 40 → 65 to put
   the eyebrow 67px below the header as drawn.
6. **Sections were 64px tall in padding where the wireframe runs 22–54.** Now 48.
7. **Care/Delivery and Related Products sat 36px inboard** of every Hartwick
   section, on Luxe's 100px page margin rather than the page's 64px gutter.
8. **The Care/Delivery accordions flowed across two columns** — "Care
   instructions | Ageing & patina" on one line — instead of forming two grouped
   columns. Now column-flow over a fixed row count, with the wireframe's
   vertical rule between them.
9. **Group headings rendered in the editorial serif.** The markup is
   `.accordion-group-heading h3`, not the `.collapsible-content` an earlier pass
   assumed. Same for related-product card titles: `.card-product-title-h3`.
10. **The process sequence generated 80 grid tracks** — `repeat(auto-fit,
    minmax(0, 1fr))` with a zero minimum. Now one column per step.
11. **The gallery counter used an IntersectionObserver**, which is tied to
    painting and goes quiet on a backgrounded tab. Rewritten to derive position
    from geometry, which is also why it is now testable.
12. **Placeholder notices in the buy column** dropped their box so they no longer
    out-weigh the product name.

## Third pass — client feedback, 2 September

Three faults reported after review, all reproduced and fixed.

**1. Images were cropped.** The gallery ran `object-fit: cover` inside a fixed
portrait frame, and every Hartwick figure reserved a designed aspect-ratio and
cropped the photograph into it. Now:

- the gallery frame is `portrait-4x6` (2:3) with `gallery_media_scale:
  scale-down`. The store's photographs are 1000x1500 — also 2:3 — so they now
  fill the frame exactly, with nothing cropped and nothing letterboxed. An
  odd-sized image is shown whole rather than cut.
- a Hartwick figure holding a real image drops its designed ratio and takes the
  image's own. The reserved ratio still applies to the placeholder field, so the
  page keeps its shape until Angela's assets land.
- a tall portrait is *scaled down* rather than cropped (`max-height: 64rem`,
  centred) so it cannot dwarf the record beside it.
- **layout stability is not traded away.** `image_tag` writes `width` and
  `height` attributes, so the browser reserves the image's own ratio before the
  file loads — verified while `img.complete` was still `false` (brief §12).

**2. Clicking an image did not obviously zoom.** It did work — Luxe's magnify
button already covers the whole image and `openModal()` fires — but nothing said
so: the cursor stayed `default`, and Luxe fades the magnify icon to `opacity: 0`
exactly when the visitor hovers. Both inverted: the pointer is now `zoom-in`, the
icon rests at 55% and comes to full on hover, and it takes a visible focus ring
for keyboard users. No JavaScript added — the native lightbox is unchanged.

**3. The two accordion columns moved as one.** Real bug, and mine. Luxe's
`column_layout: 2` builds a two-column *grid*, so Care and Delivery shared row
tracks: opening "Care instructions" resized the row and dragged "Delivery"
beside it. Replaced with CSS multi-column, which gives each column an
independent flow, plus a forced column break before the second group heading so
the split stays Care | Delivery.

Verified by forcing a panel open with transitions disabled (a transition cannot
advance in a pane that does not paint, which is what made this hard to see):
opening a Care accordion grows column 1 by 96px, moves the two items beneath it,
and leaves **every item in column 2 at exactly its original position and
height** — and the same in reverse. Luxe's accordion JS was never the problem;
it animates each panel independently already.

## Accessibility and QA done

Measured on the rendered page at 320, 390 and 1440.

- **No horizontal overflow** at any of the three widths (`scrollWidth` equals the
  viewport). Off-canvas drawers and the gallery's own scroller are excluded, as
  they are meant to sit outside the viewport.
- **Touch targets.** Every link, button, accordion title, size box, popup opener
  and submit in the Hartwick sections and the buy column measures ≥44px, or
  carries the invisible 44px hit area. Zero failures at any width (brief §2).
- **Contrast.** Every text/ground pair measured. Lowest is 5.17:1 (placeholder
  figure label), then 5.87:1 (quiet text, gallery count). All above AA. On the
  dark Masters field: 12.78:1.
- **Mobile composition, verified in the DOM:** the Material Record's cloth image
  renders before the record list (brief §5); the process sequence is 4 columns x
  2 rows with no horizontal scroll (brief §8); the Origin keeps its asymmetric
  composition; the Masters link falls after the images. All by CSS ordering — the
  DOM keeps the desktop reading order, so a screen reader still meets each
  heading before its own content.
- **Gallery counter** verified at every scroll position and on thumbnail click.
- **One `<h1>`** on the page (the Style name).
- **Accordions** are native `<details>` and Luxe's own — touch, keyboard and
  no-JavaScript all work.
- **No hover dependency.** `prefers-reduced-motion` honoured.
- **Homepage regression checked twice** — `ha-masters-index` and
  `ha-material-record` are shared, and the homepage still renders identically
  (index layout, 3 columns at 368/479/368, all 9 roles, 64px hero display,
  Featured Lot record intact).
- **Theme Check: 0 errors.** Two `OrphanedSnippet` warnings are false positives —
  Theme Check cannot see snippets rendered from a `custom_liquid` setting in a
  JSON template.

Related Products loads its cards through Luxe's own IntersectionObserver, which
cannot fire in a preview pane that does not paint. Driving the same fetch by hand
returns 6 cards that align correctly on the 64px gutter with the restyled
titles, so the section is wired correctly — but it is the one thing on the page
still worth a glance in a normal browser.

## Open questions for Aloha

1. **Request Private Appointment has no defined behaviour.** Neither the
   wireframe nor the brief says what it does. It currently links to a
   `private-appointment` or `contact` page if one exists, and marks itself a
   placeholder if not. Options: a modal enquiry form, a dedicated page, or an
   email route.
2. **Process steps: 7 or 8?** The desktop wireframe prints seven; the mobile
   brief §8 and `data-model.md` both list eight — the same sequence plus
   **Construction**. Built to eight. Deleting one block returns it to seven.
3. **Masters count: 5 or 3?** The wireframe lists five roles; brief §7 records
   that Angela wants three initially. Built with five and a limit setting.
4. **Product titles.** The wireframe prints **TIDE**, and the related row prints
   VALE / STONE / DRIFT. Those are legacy names, which CLAUDE.md makes internal
   SKU mapping only. Built so the heading is the Style display name and the line
   beneath is the Expression — `Skirt 001` / `Handspun Fresh Pink Cotton Khadi`.
   Same call as the homepage collection index; please confirm once for both.
5. **Suffix templates.** Should the apparel products be moved onto a single
   product template, so there is one page to maintain rather than five?
6. **Price.** The wireframe shows `€ —`. No prices are set and the store
   currency has not been confirmed.
7. **Sticky Add to Bag** — brief §3 was still awaiting an answer. It is native to
   Luxe and carries no custom testing burden, so it is on. Say if you want it off.

---

# Revision — Aloha's feedback, 3 September 2026

Her letter is the source for everything below. Quotes are hers.

## 1. Gallery and information panel — the answer to her question

> "Could you confirm whether this structure is possible within Luxe without
> rebuilding the complete product template?"

**Yes, and it needs no custom development.** Both arrangements she describes are
existing Luxe settings on the section we are already using. The choice is one
field in the theme editor.

| | Her preference — vertical stack | Studio Standard — single image |
|---|---|---|
| Setting | `gallery_layout: "stack"` | `gallery_layout: "slider"` |
| Desktop | one image under another, full column width | one image, manual arrows |
| Mobile | horizontal swipe (native) | horizontal swipe (native) |
| Image counter | not shown — every image is already on screen | `01 · 06`, shown |
| Custom code | none | none |
| Extra hours | 0 | 0 |

The wireframe's two-up arrangement was `gallery_layout: "grid"`. So this is a
value change, not a rebuild — the same setting, three ways.

**Built to her preference: the vertical stack.** The other is one field away,
and both were tested.

**The image counter** is the one part Luxe has never had, and it already exists
here — `assets/ha-product.js`, written for the mobile brief. It now reports on
desktop too, but only in the single-image arrangement, where a position means
something.

**Automatic transitions: possible, but not recommended, and not built.** Luxe has
no autoplay for the product gallery, so it would be new code — roughly 2 hours
with a pause-on-hover, pause-on-focus, `prefers-reduced-motion` and pause-on-tab-hidden.
The cost is not the hours. A gallery that moves on its own takes the garment out
from under the visitor mid-look, is a documented WCAG 2.2.2 problem, and reads as
a shop window rather than an atelier. It is the one thing in the letter that
works against "a calmer frame". Say the word and it can be added.

**Which is cleaner and more efficient?** The vertical stack, on both counts.

- *Cleaner*: nothing moves, nothing to operate, no controls over the photograph.
  The visitor scrolls, which they were doing anyway. The single-image gallery
  asks them to click through six images to see the garment; the stack shows it.
- *More efficient*: identical. Both load the same images the same way. Neither
  adds a library.

The stack's one cost is page length — six images in a column is a long page. The
sticky panel is what pays for it: Add to Bag and the price stay on screen the
whole way down, which the single-image arrangement does not need but also does
not lose.

## 2. What changed on the page

| Aloha asked for | Built as |
|---|---|
| Vertical image stack, left | `gallery_layout: "stack"` — native |
| Narrower panel, right | 64 / 36 split; panel content 402px → **360px** |
| Panel stays sticky while scrolling | native `enable_sticky_info`, plus a height cap so a tall panel cannot put Add to Bag out of reach |
| Style, Expression, price, size, availability, delivery, Add to Bag, appointment link in the panel | all present, in that order. **Availability** is a new line (`snippets/ha-availability.liquid`) |
| Longer information in restrained accordion rows | four rows: Description, Size & Fit, Delivery & Returns, Care & Ageing |
| Less copy on the first screen | the description is an accordion now, not open prose |
| Lower sections not oversized | section padding 48 → 40px desktop (28 mobile), column gap capped at 72px, Origin panel 420 → 340px |

**One judgement call to flag.** Delivery, Returns, Care and Ageing were a
separate full-width section lower down the page. With the same content now in
the panel it would have appeared twice, so **that section is disabled, not
deleted** — one toggle in the theme editor brings it back if you would rather
have it in both places.

Size & Fit reads the garment's own `hartwick.*` fields
(`snippets/ha-fit.liquid`) rather than being typed prose, so it stays correct
per Expression.

## 3. Typography

Her scale is implemented exactly, and **as theme settings, not as CSS**, because
she asked for the numbers to be treated as starting points. Nine tokens in
`snippets/ha-tokens.liquid`, driven from **Theme settings → Hartwick — Material
Archive → Type scale**. No Hartwick stylesheet contains a font size any more.

| | Asked | Built (desktop) | Built (mobile) |
|---|---|---|---|
| Style name | 38–42 / 30–32 | **40** | **31** |
| Expression | 18–21 / 17–18 | **20** | **18** |
| Body | 16 / 24–26 · 15–16 / 22–24 | **16 / 25** | **16 / 23** |
| Price | 18–20 | **19** | 18 |
| Section + accordion labels | 13–14 | **13** | 13 |
| Lot + technical metadata | 11–12 / min 12 | **12** | **12** |
| Buttons + navigation | 13–14 | **13** | 13 |
| Editorial headings | 38–44 / 30–34 | **40** | **32** |

Verified by measuring the rendered page at 1440 and 375: every value above is
what the browser reports.

Three consequences worth naming, all in service of "clearer differences between
the product name, supporting information and body copy":

1. **The Expression is no longer uppercase.** Set in the editorial serif, sentence
   case, exactly as Aloha writes it — "Handspun Silk-Linen, Natural Pearl
   Shimmer". Uppercasing it gave a supporting line the same authority as the name.
2. **The size label moved above the size boxes.** Beside them it reserved 90px for
   one word, which in a 360px panel wrapped a fifth size onto its own row.
3. **Related-product titles came down from 22px to 16px.** They were competing
   with the Style name itself.

Navigation was 12px and buttons were 10px — both below her floor. Now 13px.

## 4. Limited Edition language — removed, and kept out

Badges are **product data**, not theme code: Luxe draws them from `Badge:` tags
and the `custom.badges` metafield. Deleting the markup would not remove the
words, and re-adding one tag in the admin would put them straight back.

So the theme now filters instead. Every place Luxe prints a badge — product
cards, recommendations, search results, the gallery, the product page — renders
through `snippets/ha-badges.liquid`, which drops any label matching the
suppression list in **Theme settings → Badges**. It ships with *limited edition,
limited run, exclusive, last chance, selling fast, almost gone, only a few left,
hurry, final pieces*. A stale tag left in the admin is now harmless.

**Still worth doing in the admin:** clear the underlying tags, so the words are
not in the product data at all. That needs admin access.

**Edition 07 / 25** is gone from the opening label and does not return unless a
garment is genuinely individually numbered — a new `hartwick.individually_numbered`
gate plus a real per-piece `edition_number`. Otherwise the label is the Lot alone.

**Production quantity** is now a factual Material Record row —
`Production quantity — 25 pieces` — gated on `hartwick.production_quantity_verified`.
An unverified number renders nothing at all: to a customer, an unchecked figure
reads exactly like a checked one.

**Two places still say "limited edition" and were left alone deliberately:**
`page.press-release` and `page.story` carry Hartwick's own October 2024 press
release and story copy, including "A New Era of Limited Edition Slow Fashion".
That is a dated published document and editorial prose, not a badge. Rewriting it
would misrepresent it. **Aloha's call** — say the word and it changes.

## 5. Announcement bar

Removed from `sections/header-group.json`. No banner, no countdown, anywhere.

## 6. Request Private Appointment

Now a modal enquiry form. The visitor never leaves the page.

Fields: Name, Email address, Telephone number, Preferred date or general
availability, Message — with the garment recorded automatically before the form
is even shown: Style, Expression, Lot, product title, product URL, and the size
actually selected at the moment it opens.

Built on Shopify's own `{% form 'contact' %}` — its spam protection, validation
and delivery, no app, no third-party endpoint — inside a native `<dialog>`, which
gives the focus trap, Escape and inert background from the browser rather than
from hand-written JavaScript.

**The one thing the theme cannot set is the destination.** Shopify sends every
contact-form submission to the store's sender address
(*Settings → Notifications*). That is an admin setting, not a theme value.
Meanwhile every submission is tagged `Enquiry type: Private appointment`, and
**Theme settings → Private appointment** adds a "Route to" line so a mail rule
can forward them. Give us the address and we will set it, or set it yourself in
Settings → Notifications.

## 7. Lot I on the homepage

The collection index has a new **"Lot I product list confirmed"** switch, off by
default. While it is off the section *ignores any bound collection entirely* —
so no product can reach the homepage by someone picking a collection and not
realising what the rows imply — renders unnamed rows, and says on its face that
the list is not confirmed. The legacy names (Tide, Mesa, Stone…) are gone.

Ticking the box when the approved list arrives restores normal behaviour.

## 8. Product naming — confirmed, nothing to change

Aloha confirmed the structure already built: permanent numbered Style as the
heading, Expression beneath. TIDE / VALE / STONE appear nowhere customer-facing.

## Hours

| | Hours |
|---|---|
| Gallery + sticky panel restructure | 2.0 |
| Typography — nine tokens, theme settings, applied site-wide | 3.0 |
| Limited Edition removal + the two verification gates | 1.5 |
| Appointment modal (markup, form, JavaScript, styling) | 2.5 |
| Announcement bar, Lot I gate, naming check | 1.0 |
| Verification — render, measure at 1440 / 375, fix | 1.5 |
| Documentation + this note | 0.5 |
| **This revision** | **12.0** |

No scope was added beyond the letter. **The running total against the 40-hour
ceiling has to come from the hours log** — this file records the cost of this
revision only, and `audit-and-plan.md` records 4 used at 1 September. Add this 12
to whatever the homepage and product builds logged before quoting Aloha a
remaining figure.

Automatic gallery transitions (~2 hrs) are **not** in the above and are not built.

## Verification

Rendered and measured, desktop 1440 and mobile 375.

- **Type**: every value in the table above measured on the rendered page.
- **No horizontal overflow** at either width.
- **Sticky panel**: pinned at 104px (header + 24px) after scrolling 3,500px, with
  Add to Bag still on screen.
- **Modal**: opens, focuses the first field, records the selected size
  (`Size: M` after choosing M), closes on backdrop click and Escape, does *not*
  close on a click inside the panel, and returns focus to the opener.
- **Accordions**: four rows, flush, opening to their full height. *Two real bugs
  were found and fixed here, both from the panel rows being a mix of native and
  Hartwick blocks:*
  1. Luxe measures `panel.scrollHeight` **before** it adds `.panel-open`, so the
     bottom padding I had put on `.panel-open` was never counted and clipped the
     last line — 150px against a 166px content height. The spacing is now a
     zero-content block inside the panel, which is part of the measurement.
  2. Luxe wraps every `custom_liquid` block in a `.product-custom-liquid-block`
     div, so the Size & Fit row sits one level deeper than the other three. That
     wrapper carries the section's 20px block spacing, which broke the run into
     separate boxes; and inside it the row is the only div, so it also matched
     Luxe's own `.accordion:last-of-type` closing rule and drew a second hairline
     against the next row's top border. Both corrected. Verified afterwards: row
     gaps 0px, borders 1px top on all four and 1px bottom on the last only, and
     the wrapped row opens with 16px of slack under its last line.
- **Theme Check: 0 errors.** Five `OrphanedSnippet` warnings are the known false
  positive — Theme Check cannot see snippets rendered from a `custom_liquid`
  setting in a JSON template.

**Not verified against the live store.** The Theme Access token in the
environment has expired (401 from the Admin API), so the page could not be
rendered with real products and real metafield values. Everything above was
measured on a harness reproducing the exact markup, class names and stylesheet.
The Liquid parses (Theme Check) and follows the same data patterns as the rest of
the build, but **a new token is needed before this goes in front of Aloha.**

## Files

Added: `snippets/ha-badges.liquid`, `snippets/ha-availability.liquid`,
`snippets/ha-panel-row.liquid`, `snippets/ha-fit.liquid`,
`assets/ha-appointment.js`.

Rewritten: `snippets/ha-appointment.liquid` (page link → modal),
`snippets/ha-pdp-identity.liquid` (Edition gate), `templates/product*.json` (×5).

Changed: `snippets/ha-material-record.liquid`, `assets/ha-sections.css`,
`assets/ha-product.js`, `sections/ha-collection-index.liquid`,
`sections/ha-featured-lot.liquid`, `sections/ha-product-record.liquid`,
`sections/header-group.json`, `config/settings_schema.json`,
`config/settings_data.json`, `layout/theme.liquid`, `templates/index.json`.

Luxe files touched — badge filtering only, one render call each:
`snippets/card-product.liquid`, `snippets/product-media-gallery.liquid`,
`sections/main-product.liquid`, `sections/predictive-search.liquid`,
`sections/featured-product.liquid`. No section or snippet was forked.

---

# Wireframe 04 (REVISED) — full desktop rebuild, 3 September 2026

Aloha supplied `04_HA_Product_Desktop_REVISED_EDITABLE.pdf` — a complete redesign
of the desktop product page on a 1440 × 6102 canvas. This is that design built.
Geometry below was read off the PDF at 1:1 (its canvas is CSS-pixel accurate),
not estimated: the file was rendered band-by-band and its filled shapes and text
runs measured.

## The headline change: a three-column hero

The opening section is no longer Luxe's two-column media/info split. The revised
design has **three** columns:

    left rail   58 → 380   (322)   sticky   — identity, cloth, facts, fit, rows
    media rail  422 → 1066 (644)   scrolls  — images stacked, position markers
    buy rail   1123 → 1390 (267)   sticky   — price, expression, size, availability, Add to Bag

Luxe's `main-product` renders its top section as a flex box with exactly two
children, and no CSS makes a flex item's children straddle a sibling. So the hero
is a **new custom section** — `sections/ha-product.liquid` — which is the case
CLAUDE.md reserves for custom work.

**What is still Shopify's own.** The money and inventory are not reimplemented.
The section calls Luxe's own `snippets/product-variant-picker.liquid` and
`snippets/buy-buttons.liquid` with the same arguments `main-product` uses, and
wraps them in the same `<product-info>` custom element, loading `product-info.js`,
`product-form.js` and the price/accordion CSS. Variants, availability, analytics
and checkout behave exactly as on the native template.

**Both side rails are sticky, the centre scrolls between them.** The sticky is on
the grid *item*, not an inner wrapper: a grid item is content-height under
`align-items: start`, so a sticky child has no room to travel — the item itself
sticks within the tall media row. Verified: after a 900px scroll both rails hold
at header + 32px and Add to Bag stays on screen.

**Position markers** (`assets/ha-product-rail.js`, a custom element) track the
frame nearest the viewport centre and jump to a frame on click — additive, so the
rail still scrolls and every image is reachable if the script never runs.

## The rest of the page: structure and order only, not the colours

The revised wireframe drew the page as full-bleed colour bands (pink, olive,
peat, clay). **Aloha's instruction was to follow only the structure and
positions of that file, not its colours** — those fills were placeholder. So the
page keeps the wireframe's ORDER and per-section composition but drops the
decorative bands: every section sits on the brand page ground, with the Masters
and Register on the established dark field, exactly as before.

The `field` setting and `.ha-section--field-*` classes were still built and are
kept as an available capability (a section can opt into a field from the theme
editor), but the product template sets every section to the page ground.

| Section | Field | Built as |
|---|---|---|
| The Piece | page ground | `ha-garment` |
| The Cloth / Material Record | page ground | `ha-product-record` |
| Made by Masters | peat (dark, established) | `ha-masters-index` (field now configurable; homepage unchanged) |
| The Origin | page ground | `ha-origin` |
| Process | page ground | `ha-process` |
| Living with the piece | page ground | native `collapsible-content` (re-enabled) |
| A Wearer's Note | page ground | **new** `ha-wearer-note` |
| Continue the record | page ground | `ha-journal` + `related-products` |
| The Register | peat (dark, established) | `ha-register` |

**A Wearer's Note is new.** One approved quotation on a clay field. Per CLAUDE.md
it carries the placeholder notice and reads "NAME / CONTEXT / PERMISSION
CONFIRMED" until Aloha supplies a real, permission-confirmed note — an unverified
quotation cannot render as verified.

## The page ground — unchanged

The wireframe drew a cooler #F8FBFF ground, but that is a colour, so the ground
stays the brand's established #F2EFE9 (still the placeholder pending Aloha's
confirmation). Luxe's own colour settings are unchanged.

## Type

Reads the same nine tokens as before, plus a new `--ha-t-statement` (32/22px) for
the two places the design sets one sentence as a statement — the process line and
the wearer's quotation. Measured on the rendered hero: Style name 40px (oldstyle
figures, so "001" sits below the cap line), cloth line 12px, price 19px,
everything within the scale.

## Files

Added: `sections/ha-product.liquid`, `sections/ha-wearer-note.liquid`,
`assets/ha-product-rail.js`.

Changed: `snippets/ha-tokens.liquid` (two rule weights, statement size; the
--ha-field-* tokens are defined but the page ground is unchanged at #F2EFE9),
`config/settings_schema.json` + `config/settings_data.json` (statement sliders;
page ground unchanged), `assets/ha-sections.css` (hero, field system, wearer's note),
`layout/theme.liquid` (rail script), `sections/ha-garment / ha-product-record /
ha-origin / ha-process / ha-journal / ha-masters-index .liquid` (field setting),
`templates/product*.json` (×5, rebuilt to the new order and fields).

## Verification

Rendered and measured on a harness reproducing the hero's exact markup, class
names and stylesheet, desktop 1440 and mobile 375:

- **Hero matches the design**: three columns at the measured widths, sticky rails
  hold, dots track the scrolling media, the size row fills its width with the
  selected size as a solid dark box, Add to Bag is the one solid mark.
- **Field system**: verified to work (dark fields flip the record/eyebrow to
  Chalk Blue), then set to the page ground everywhere per Aloha's instruction, so
  the product page shows no decorative bands — only Masters and Register stay dark.
- **Mobile**: single column, no horizontal overflow, order identity → buy → media.
- **Theme Check: 0 errors.** The OrphanedSnippet warnings on `ha-availability`
  and `ha-fit` are the known false positive (rendered from `custom_liquid`).
- **Homepage unaffected**: `ha-masters-index` defaults to the peat field, so the
  homepage's dark Masters band is unchanged.

**Not verified against the live store** — the Theme Access token is still expired
(401 from the Admin API), so the page could not be rendered with real products and
metafields. A new token is needed before this goes in front of Aloha.

**One honesty note on fidelity.** The hero is a pixel-measured rebuild. The lower
bands are built to the design's *fields, order and composition*, reusing the
existing sections; the finest details of the Masters and Origin arrangements
(exact full-bleed image placement) are close to, not pixel-identical with, the
drawing. Called out so the wireframe revision and the build can be reconciled.

---

# Wireframe 04 — full lower-page + footer rebuild, 3 September 2026

After previewing the pushed hero, the lower sections and footer still read as the
old build rather than the revised design. Aloha's direction: make the whole page
match the design's **structure, positions and text**, keeping only the theme's
colours. This rebuild does that section by section. (The homepage is unaffected —
it shares only `ha-masters-index`, `ha-journal`, `ha-register` and the footer;
the product-only sections were rebuilt freely, and Masters got a new product-only
section rather than a change to the shared one.)

| Design section | Built as | Structure |
|---|---|---|
| The Piece | `ha-garment` (spec table gated off) | eyebrow + heading + one paragraph, image right — editorial only; fit moved to the hero rail and Living |
| The Cloth / Material Record | `ha-product-record` (+ heading & intro) | heading + intro + record table left, image right |
| Made by Masters | **new** `ha-authorship` | two images left (full-bleed), labelled authorship record right (Master name / Workshop / Place / Technique) + Meet the Master + time |
| The Origin | `ha-origin` **rebuilt** | heading left, a connected 5-step route right (Fibre → Spinning → Weaving → Dyeing → Construction, circles joined by a hairline) |
| Process | `ha-process` **rebuilt** | eyebrow, a row of circled marks, heading set below |
| Living with the piece | **new** `ha-living` | heading left, four restrained accordion rows right (Fit & garment measurements open by default, Care & longevity, Delivery & returns, Edition / lot) |
| A Wearer's Note | `ha-wearer-note` | quote left, image right (built earlier) |
| Continue the record | **new** `ha-continue` | heading, then a story card left + two related-piece cards right |
| The Register | `ha-register` (design copy) | heading left, email form right (unchanged structure) |
| Footer | `ha-footer` **restructured** | nav + shop policies bottom-left, wordmark + copyright right |

**Colours are the theme's, not the design's.** Every section sits on the brand
page ground; only Masters/Register keep the established dark field via the
homepage's own settings (the product page's Authorship and Register are on the
brand grounds the sections already use). The wireframe's pink/olive/peat bands are
not reproduced.

**The connected route (Origin) and the circle marks (Process)** are new
components: numbered circles built from `--ha-border`, joined horizontally on
desktop and vertically on mobile, sizes from the `--ha-t-*` tokens.

**Continue the record is curated, not Shopify's async recommendations.** The
wireframe places specific pieces in specific positions, so the section takes a
chosen article and chosen products (blocks) that Aloha controls per garment —
stable layout, no second recommendation surface.

## Verification

Rendered on the dev theme (Hartwik – Dev) via `shopify theme dev`, measured on
the real AMMAN SHIRT product at 1440:

- All eleven sections render; **no Liquid errors**; **no horizontal overflow**.
- Grid structures measured and correct: The Piece 2-col, Authorship images-left/
  text-right (2-up media grid, 4 record rows), Origin 5 steps in one row, Process
  4 marks in a row, Living heading-left/4-rows-right, Continue story-left/2-pieces-
  right, Footer 2-col with 3 nav links.
- Placeholder figures show the peat-tint field (rgb 108,100,94) and reserve their
  ratio; the one real image is the hero's featured media.
- **Theme Check: 0 errors.** Two validator-only issues from the first push were
  fixed: an empty-string text default, and two Luxe header sizes that exceed the
  theme's own schema cap of 11 (clamped — Aloha's "no smaller than 12" cannot be
  met for those two specific Luxe controls).
- Pushed to **Hartwik – Dev #190886576427** (unpublished) only; live untouched.

Still **not committed to git** — local working copy only.

---

# Feedback pass 3 — Ivan, 3 September 2026

| Asked | Done |
|---|---|
| Wider section margins, at least 2× | Desktop gutter 40 → **88px** (104 above 1400). Tablet 32 → 48 |
| Material Record: subtitle unreadable on dark | `.ha-body` sets an explicit near-black `color`; on a dark field it now inherits. Fixed for **every** dark field at once, not per section |
| Material Record: columns equal height | Panel and image both 1232px — the image fills and crops here |
| Material Record + Masters: title/subtitle full width | All `max-width` caps removed |
| Remove lines between sections | `.ha-section` border-bottom → 0 |
| Placeholder notes need space | `margin: 24px 0 32px`, padding 12/16 |
| Typography still small and dense | Style 48, editorial 52, statement 38, body 17/28, price 22 (desktop). Mobile 34 / 36 / 16-25 |
| Register: line under Join button | Removed (`::after`/`::before` cleared, no border, no underline) |
| Register: body copy in the wrong column | Moved under the heading in the left column |
| Register: input not recognisable | Now a real bordered box with its own label and 16px gap to the button |
| Footer logo 1.5× | 96 → **144px** |
| Footer nav in Porter | Porter webfont added and enabled; nav uses the identify voice |

## Porter — served, with the licence still open

⚠️ **Risk R1 is not closed.** The supplied Porter files are **desktop `.otf` only**
and declare *"Envato – GraphicRiver, commercial license"* (designer Frank
Hemmekam). No webfont licence exists in the Brand Assets folder, and desktop
licences normally do not permit web embedding — a webfont is publicly
downloadable by design. It is served because Ivan instructed it after being told;
**the licence still needs resolving with the foundry before launch.** Turning
`ha_porter_licensed` off removes it in one click and the stack falls back to
Junicode with no other change.

The files are **subset to uppercase A–Z and space only**, which is the brand rule
(Typography READ ME: Porter carries no numbers, punctuation or symbols).
Subsetting enforces that mechanically — any other character has no glyph and
falls through to Junicode automatically, so the rule cannot be broken by an
author who has not read it. 22 KB of OTF becomes **1.7 KB of WOFF2** as a result.

## One bug found while fixing the record columns

`max-height: 64rem` from the "never crop, scale the image down" rule was still
capping the record photograph at 640px inside an 853px figure. Clearing it on the
**image** as well as the figure is what actually equalised the two columns —
the figure alone was not enough. Measured before (640 vs 853) and after
(1232 = 1232).

## Note on the type scale

The display levels now sit **above** Aloha's stated ranges (Style 48 against her
38–42, editorial 52 against her 38–44). She called those "starting points" and
asked for clearer separation between levels; Ivan asked twice for larger. Body,
labels and metadata remain inside her ranges. Worth confirming with her.
