# About page — build note

Built 15 September 2026 against **Hartwik - Dev** (#190886576427), unpublished.
Source: Aloha's `HA_ABOUT_PAGE_DESKTOP_EDITABLE.png` (15 Sep) and her covering
note: use the SansAtelier House symbol, remove the version that says "Atelier",
centre the main logo at the foot of the footer.

Preview: `https://9c8a52-dc.myshopify.com/pages/about-the-atelier?view=about&preview_theme_id=190886576427`
(password `angela`). The `?view=about` is only needed until the page's Theme
template is set to `about` in Admin (see Admin, below).

## What the wireframe became

| Wireframe band | Section | New? |
|---|---|---|
| Two photographs, title plate | `ha-about-hero` | new |
| THE HOUSE, centred opener | `ha-statement` (size: display) | new |
| FOUNDER · ANGELA HARTWICK, columns + portrait | `ha-founder` | new |
| THE PRINCIPLE, dark band | `ha-principle` | new |
| A JOURNEY INTO THE HOUSE, four columns | `ha-circle-columns` (layout: journey) | extended |
| "Craft does not need to be preserved…" | `ha-statement` (size: quote) | — |
| THE WORK AHEAD, photograph + pill button | `ha-feature` | new |
| THE REGISTER | `ha-register` (source: about_page) | extended |

Template: `templates/page.about.json`. Styles: the "ABOUT PAGE" block in
`assets/ha-sections.css`. One new colour token, `--ha-field-sand`, is the page
ground pulled 6% toward peat — the band the Journey sits on.

## Header and footer (site-wide)

- **Header** (`sections/header-group.json`): House symbol centred, navigation
  left, Bag right, as drawn. The symbol comes from a new header setting
  ("Header mark") that renders `assets/ha-house-symbol-black.png` — the
  SansAtelier artwork — instead of the Files logo, so nothing had to be
  uploaded to Admin > Files. Search and Account are switched off because the
  wireframe shows only Bag; both are one checkbox to restore.
- **Sizes** (Aloha's second note, same day: "not too big… clean", "footer
  fonts in Porter - Light", "the house symbol not large"): measured off her
  drawing at 1440 — symbol 47px in a 76px bar (set 50 / 80, the nearest steps
  Luxe allows), nav 11px, footer links 11px Porter Light tracked 0.18em,
  wordmark 195px (her 193px; the LOGO READ ME's 220px minimum is noted and
  overruled by the later instruction). The symbol is held square at the set
  size — Luxe's logo box would otherwise squash it.
- **Footer** (`sections/ha-footer.liquid`): three columns — site links and
  © left, the wordmark centred, contact / social / policies / cookie
  preferences right. Every link is a block with a Left/Right column setting;
  LinkedIn reads Theme settings > Social media, which is still empty.
- `assets/ha-house-symbol-black.png` is now the SansAtelier file; the old one
  (with ATELIER) is gone from the dev theme. The landing page section reads the
  same asset, so it is fixed there too — **on the dev theme only. The live
  landing theme (#191186141483) still carries the old symbol** and was not
  touched (CLAUDE.md: never push to the live theme).

## Provisional, and why

- **Photographs.** The three pictures are cut from the wireframe PNG
  (`assets/ha-about-*.jpg`, 2400px). The re-edited originals were not in the
  files that arrived. Picking an image in the theme editor replaces each
  stand-in; the "Provisional file" field can then be cleared.
- **Copy.** Transcribed from the wireframe, unapproved, placeholder notices on.
  Two sentences in the drawing are cut off and were NOT completed:
  - The House: "…setters and goldsmiths. The material" — stops.
  - Founder, right column: "…It is a working model for how a modern fashion
    house can value the source of" — stops.
  Three run-together words in the founder lead ("longstudy", "herearly",
  "simplysurface") were read as typesetting and spaced.
- **Links.** "Made by Masters" and "Meet the Masters" point at
  `/pages/the-makers` — the only Masters page that exists. Its title in Admin
  is still "The Makers", which is the wrong term.

## Policies (Aloha, 15 Sep, third note)

One POLICIES link in the footer → `templates/page.policies.json` →
`sections/ha-policies.liquid`, which renders every policy from Settings >
Policies in her order (Shipping, Returns & Refunds, Privacy, Terms, then the
rest) under its own anchor: `/pages/policies#shipping-policy`,
`#refund-policy`, `#privacy-policy`, `#terms-of-service`,
`#contact-information`. Index of anchors at the top. Search stays off in the
header at her request. Preview until the page exists:
`/pages/faq?view=policies&preview_theme_id=190886576427`.

## Admin (not theme code)

> **Done 18 September 2026, by API** (the CLI login now carries
> `write_content`): `about-the-atelier` → template `about`, `policies` →
> `policies`, `the-circle` → `the-circle`, and `the-makers` renamed to
> `the-masters` with its own template and a redirect. None of these pages
> needs `?view=` any more. Items 1, 1b and 3 below are therefore closed.


1. Page **About the Atelier** → Theme template → `about`. Until then the page
   needs `?view=about`.
1b. Create page **Policies** (handle `policies`) → Theme template →
   `policies`. The footer link already points at `/pages/policies`.
2. Theme settings > Social media > LinkedIn — empty; the footer link goes nowhere.
3. Consider renaming page `the-makers` → The Masters.

## Not done / needs the user

- Uploading files to Admin > Files through the CLI was blocked in this
  session, hence the theme-asset route for the symbol and the photographs.
- Aloha's 400+ re-edited images and the naming sheet (`Lily Cogs - Sheet1`)
  are for the product build; nothing from them is used here yet.
