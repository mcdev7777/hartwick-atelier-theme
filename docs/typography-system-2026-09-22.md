# One typography system — Aloha, 22 September 2026

Source: Aloha's "web text sizes" note and the PDF table attached to it.

> "We need to heavily decrease the sizes of our texts, links etc. […] quite a lot
> of the text feels oversized so we're losing some of the editorial hierarchy.
> Can we establish a consistent typography system across the theme rather than
> adjusting sections individually? […] I'd also like us to set these globally
> wherever possible rather than manually resizing each block. Then individual
> pages can deviate only when there's an intentional editorial reason. The
> overall aim is smaller and calmer. Photography, spacing and information
> structure should create the hierarchy rather than oversized typography."

## What was wrong

Sizes were held as nine tokens plus **thirty different multipliers** off them —
`calc(var(--ha-t-editorial) * 1.7)`, `* 2.9`, `* 0.94`, and so on. Each one was a
reasonable local decision when it was written, and together they were not a
system: the same kind of heading was six different sizes across six pages, and
the largest text on the site had reached **93px** (The Masters page title).

Meanwhile Luxe's own header, footer, cart, product cards, facets and account
pages ran on a *second*, untouched typography driven from its own theme
settings. Two typographies is the thing Aloha's sentence rules out.

## What it is now

One row per line of her table, one token per row, nothing computed from anything
else. Declared in `snippets/ha-tokens.liquid`, adjustable at
**Theme settings → Hartwick — Material Archive → Type scale**.

| Row | Desktop | Mobile | Line height | Voice | Token |
|---|---|---|---|---|---|
| Hero / large editorial heading | 32 | 28 | 1.08 | Porter | `--ha-t-hero` |
| Page title (H1) | 26 | 23 | 1.1 | Porter | `--ha-t-h1` |
| Section title (H2) | 20 | 18 | 1.15 | Porter / Junicode | `--ha-t-h2` |
| Editorial subheading (H3) | 16 | 15 | 1.25 | Junicode | `--ha-t-h3` |
| Product name (Style) | 16 | 15 | 1.2 | Porter | `--ha-t-style` |
| Editorial intro | 15 | 14 | 1.5 | Junicode | `--ha-t-intro` |
| Body copy | 13 | 13 | 1.6 | Noto Mono Cond. | `--ha-t-body` |
| Product Expression | 13 | 12 | 1.35 | Junicode | `--ha-t-expression` |
| Product details / bullets | 12 | 12 | 1.5 | Noto Mono Cond. | `--ha-t-detail` |
| Price | 12 | 12 | 1.3 | Noto Mono Cond. | `--ha-t-price` |
| Navigation, links, CTAs, buttons | 11 | 11 | 1.3 / 1.2 / 1 | Noto Mono Cond. | `--ha-t-ui` (+ `-nav`, `-button`, `-accordion`, `-footer`) |
| Small labels | 10 | 10 | 1.2 | Noto Mono Cond. | `--ha-t-label` |
| Captions, records, metadata | 10 | 10 | 1.4 | Noto Mono Cond. | `--ha-t-meta` (+ `-caption`, `-footer-heading`) |
| Copyright / legal | 9 | 9 | 1.4 | Noto Mono Cond. | `--ha-t-legal` |

Her hero row is a range (30–34 desktop, 26–30 mobile); 32 / 28 is its centre.
Her body line height is a range (1.55–1.65) and stays a slider at 160%.

### Three mechanisms make "globally" true

1. **One table of sizes.** `snippets/ha-tokens.liquid`, one token per row above.
2. **The Luxe bridge.** The same file re-declares Luxe's own `--font-*`
   variables out of those tokens, so the header, footer, cart, product cards,
   facets and account pages read Aloha's table rather than Luxe's settings. No
   vendor stylesheet is edited, so a theme update cannot undo it.
3. **The type-system block** at the foot of `assets/ha-sections.css`: the line
   heights, the voice each row is set in, and the short list of Luxe surfaces
   that hard-code a pixel value and so cannot be reached through a variable
   (the filter panel, the account and order pages, the rich-text size classes,
   the cart drawer heading).

Luxe's own pixel sliders under **Theme settings → Typography** no longer do
anything; a note now says so in that group, in the theme editor.

### Verified

Measured in the browser at 1440 and at 375, page by page. On **every page that
renders** — home, collection index, a range page, two collection grids, three
product templates, The Masters, The Register, The Circle, Policies, About the
Atelier, Story, Slow Fashion, Heritage Craft, Press, FAQ, the Journal index,
search, cart (with an item in it), 404 and the mobile menu drawer — every
rendered size is one of the rows above, and nothing exceeds the hero row.

Then a second sweep, from the other direction: every `font-size` written in
pixels or rems in **all 40 shipped stylesheets** was listed and classified by
hand — 78 declarations. (A script was written to do it and produced both false
positives and false negatives on ancestor-scoped and attribute selectors, so its
output was only used to build the list, not to sign it off. That is how
`.form__message` at 14px was nearly missed: it renders only when a form field
fails validation, so no resting page showed it.) Everything not governed by the
type system is now one of:

- a **glyph, not text** — the gallery arrows, the quantity +/− marks, the
  comparison drag handle, the market-selector bullet, the account avatar
  initial. Sizing those from a text row would be a category error.
- **already on one of her rows by number** — the feature-icon placeholder and
  `.fp-tag` at 10px, the drawer feature badge at 11–12px, the product-form error
  at 12–13px, the swatch label at 13px.
- **dead code** — `.banner-background-text` at 180px is defined in
  `section-image-banner.css` but no section emits the class; `snippets/css.liquid`
  (which carried an 11px table rule and a 12px `.product .accordion-title`) is an
  orphaned snippet that nothing renders, confirmed by Theme Check; and
  `.account-home-avatar` at 18px sits on the classic customer templates, which
  this store no longer uses.
- a **custom property that only looks like a size** — `--font-size: 1.5` on
  `.rating-star`, which feeds the star-mask calculation, not any text.

The landing page (the live theme) is untouched: it sets its own sizes and voices
by design, and was compared before and after with the change stashed, to confirm
it renders identically.

### What could not be rendered, and how it was handled

Four surfaces could not be opened in the preview, so they were brought into the
system by reading the vendor stylesheet rather than by measuring:

| Surface | Why | Risk |
|---|---|---|
| Gift card page | needs a real issued gift-card code | low — nine sizes, all mapped |
| Password page | the dev session already holds the storefront password cookie | low — its only sizes are the two 16px inputs, which are correct as the iOS-zoom floor |
| Blog article | the Journal has no published articles | low — the article link and comment avatar are mapped |
| Customer account and order pages | **the store is on new customer accounts** — `/account/login` 302s to the Shopify-hosted portal, so `templates/customers/*` and `customer.css` never render on this storefront | none — the overrides written for them are insurance if the store ever moves back to classic accounts |

Worth knowing for its own sake: the classic customer templates in this theme are
dead. Any future work aimed at the account pages has to happen in the Shopify
customer-accounts editor, not here.

## Three judgement calls, for Aloha

**1. Body copy moves from Junicode to Noto Sans Mono Condensed.** Her hierarchy
says "Noto Sans Mono Condensed = body copy", and the table's font column repeats
it on the "Main paragraph / body" row. That reverses the brand book, where
Junicode is the NARRATE voice that carries editorial copy. It is the single most
visible change on the site, so it is a **switch**, not a rewrite: *Theme settings
→ Hartwick — Material Archive → Typography voices → Body copy*. One click puts
the whole site back to Junicode if she meant something narrower by "body copy"
(for example, only the short editorial paragraphs). Junicode still carries every
editorial heading, Expression, number and intro, as she specified.

**2. Navigation and the footer move from Porter Light to Noto.** Her table's
Navigation and Footer rows both name Noto Sans Mono Condensed. That reverses her
own 15 September note ("footer fonts in Porter - Light"). Same treatment — one
switch, *Typography voices → Navigation and footer*, defaulting to the
22 September table.

**3. Product card titles are on the Expression row (13 / 12), not the product
name row (16 / 15).** On the product page, Collection Index and Related Works the
NAME is printed on its own with the Expression beneath it, and those take 16px
Porter as her table says. Luxe's card prints the whole store title instead —
"TOKYO BLOUSE | Rare Muga Silk Brocade" — so most of that string is an
Expression, and setting it at the product-name size would enlarge the Expression
too, across a grid of twenty. It is written as one explicit rule, so it is one
line to change if she wants the grids at 16 after all.

Also superseded: the 3 September floor "labels and technical information never
below 12px on mobile". Her new table sets labels, captions and metadata at 10px
on both breakpoints and legal text at 9px, so that guard has been removed.

## Files

- `snippets/ha-tokens.liquid` — the type scale rewritten as one row per table
  line, plus the Luxe bridge.
- `snippets/ha-fonts.liquid` — the two voice switches; body weight follows the
  body voice; navigation reads the chrome voice and the nav row.
- `assets/ha-sections.css` — 116 derived sizes resolved onto role tokens, every
  multiplier removed, the ten `calc(--ha-t-body-lh / --ha-t-body)` line heights
  collapsed onto the ratio token, and the type-system block appended.
- `config/settings_schema.json` — the Type scale group rebuilt to one slider per
  row, the two Typography voices settings, and the notice on Luxe's own
  typography group.
- `sections/header-group.json` — the header's own nav size settings brought to
  11px (10px for the dropdown category heading and the bag count).

The type-system block also closes, by name, the Luxe surfaces that hard-code a
size and that a visitor can reach: the filter panel, the disclosure menus, the
cart drawer heading, the rich-text size classes and blockquote, the search
fields, the gift-card page, the tertiary button, the large form message, the
quantity stepper and the shop-name fallback. The quantity input and the search
fields keep a 16px floor on phones for the same iOS reason as the other forms —
verified at 375, where the stepper reads 16px, and at 1440, where it reads 12px.

`config/settings_data.json` is deliberately unchanged: the bridge makes Luxe's
stored sizes inert, and leaving the file alone avoids overwriting anything set
in the store's theme editor since 15 September.

## Hours

Typography system pass, including the full-theme sweep and page-by-page
verification: 4.5 hrs.
