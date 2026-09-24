# The Register page — Aloha's artboard, 21 September 2026

Built 21 September 2026 from `Hartwick_The_Register.png` (6000 × 14542; the
1440 grid at 4.167×). Ivan: "ignore the odd header and footer. just implement
the else parts" — the site's own header and footer carry on. Verified on the
CLI development theme (#190959223083) at 1440, 800 and 375. Live theme
untouched.

Preview: `https://www.hartwickatelier.com/pages/the-register?preview_theme_id=190959223083`

## What was built

| Artboard | Section | Notes |
|---|---|---|
| Wine band, envelope, THE REGISTER. | `ha-register-hero` | Eyebrow, the envelope drawn in CSS (live text on the flaps and the card, the House symbol from `assets/ha-house-symbol-white.png`), the h1 in capitals. Flaps and the card's label are optional links; the template points them down the page. |
| Join the correspondence | `ha-register-join` | Two columns: eyebrow / heading / lead / the Register card (picker) left; eyebrow / "Join The Register." / paragraph / form right. The form is The Register's — Shopify customer form posted to Klaviyo by `ha-klaviyo-form.js`, Register list, `register_source: register_page`, first name optional, consent required and never pre-ticked, privacy note, wine button. |
| The Circle / By invitation | `ha-register-circle` | Two columns: the words left; "Respond to the Atelier." and a reply form right — full name, the invitation's email, a note, "Your reply goes to the Atelier team for confirmation.", outlined button. Posts to the Circle list with its own tag `Circle: Invitation reply` and `register_source: register_page_invitation_reply`. Behind `show_form` (see below). |
| Your correspondence | `ha-register-correspondence` | Eyebrow left, statement right; the photograph within the gutters at its own proportion; three ruled columns (blocks) over its foot on desktop, beneath it on phones. Shade under the columns is a setting (55%). |

`templates/page.the-register.json` carries the copy. Page record created by
API: **The Register**, handle `the-register`, template `the-register`,
published (#177851433259). The "Hartwick Main" menu's THE REGISTER item now
points at it (it pointed at `/`); the live landing theme renders no menu, so
this shows only on the development themes.

Shared page styles are one block at the end of `assets/ha-sections.css`
("THE REGISTER PAGE"), on the homepage's editorial idiom (`.ha-home` shared
classes). Two theme settings added under Hartwick — Material Archive >
Correspondence — The Register page: **Correspondence band** (#512F38) and
**Envelope paper** (#EEE8D4); neither is one of the eight archive colours.
Tokens `--ha-field-correspondence`, `--ha-paper`, `--ha-peat-rgb` in
`snippets/ha-tokens.liquid`. The card on the envelope is peat and the title
Chalk Blue, as the artboard has them.

## Measurements off the artboard (1440 grid)

Band 930 tall · eyebrow at 57 · envelope 990 wide: top flap apex 111, base
289, 476 wide; side flaps 257 × 330; body 476 × 482; card 446 × 304 inset
15 / 10; bottom flap 168 · "THE REGISTER." caps 40 tall (~60px Junicode) ·
form labels mono 11 → 12 floor · Join button 320 × 56 · Circle button full
column · photograph 1340 × 933 (1.44) · columns' rule at 63% of its height.

## Pictures

- **Register card** — exists only in the artboard; cut at its edges (1585 ×
  1021) → `HA_REGISTER_CARD_ARTBOARD.png`. Its words are baked in (it is a
  picture of a card); a photograph of the printed card replaces it through
  the picker.
- **The Paris room** — exists only in the artboard, with the three columns
  baked into its lower third. Cut above the type (5583 × 2502, 2.2:1) →
  `HA_REGISTER_ROOM_PARIS_ARTBOARD.jpg`, so the table, chairs and floor are
  lost. Same shoot as `HartwickAtelier-Event-Paris.jpg`. **Aloha's original
  frame is needed**; the band takes whatever proportion it has.

## Deviations from the artboard, and why

1. **"makers" → "Masters"** twice: "Notes on materials, Masters and work in
   progress." and "Letters on cloth, Masters and the knowledge behind each
   piece." — the same call the homepage Register line took on 19 September.
   Hers to reverse.
2. **The envelope is drawn**, not cut: live text, theme colours, scales with
   the page. Its shading (the right flap a step darker, the bottom flap
   darkening to its edge) is peat at 2–16% over the paper, matched to the
   artboard's samples.
3. **Phones**: the envelope's body and card take the full width and the two
   side flaps sit beneath as a pair; the correspondence columns follow the
   photograph on the ground instead of sitting over it.
4. **Shade under the columns** (55%): the artboard's white type sits on the
   tiled floor and cannot be read.
5. **Privacy Policy** is a link (`/policies/privacy-policy`).
6. **Consent**: the Register form uses the artboard's line ("I would like to
   receive The Dispatch and Release notices.") in place of the 20 September
   CASL wording, since it is Aloha's. Whether the box itself must name
   Hartwick Atelier is for Christina. The Circle reply form has no consent
   box, as drawn; a setting adds one.
7. **Heading measure**: `.ha-reg__lead .ha-home__heading { max-width: 11em }`
   so "Cloth. People. / The work in between." breaks where the artboard does.

## Terminology and governance

- **The Circle reply form.** Framework v3: "No public form. No application
  route." This form is for someone who already holds an invitation, not an
  application — but it is a public form naming The Circle, and it exists on
  Aloha's design as the request form on The Circle page exists on her
  4 September email. Same treatment: built, on the development theme, behind
  `show_form`; off leaves the words and removes the form. **Christina to
  settle**, together with the earlier conflict.
- **Reserve** is named in Aloha's copy ("details of your early Reserve
  access"). Nothing of Reserve is built (Phase 2); the sentence is hers.
- The Circle reply's full name travels as the Klaviyo profile's first name
  and as a `full_name` property; the note as `invitation_note`. The success
  line says the reply was received — never acceptance.

## For Aloha

- The original photograph of the Paris room (the frame with the table).
- A photograph of the printed Register card, if there is one.
- "makers" → "Masters" in the two lines — keep, or her word?
- The shade under the three columns — 55% is the build's; her call.
- Consent wording — Christina.
- The Circle reply form — Christina, with the Circle page question.

## Accessibility and QA

- One `h1` (THE REGISTER.); every section an `h2`; the columns `h3`.
- Every form control labelled; required fields `aria-required`; one live
  region per form; invalid email marks the field `aria-invalid`.
- Verified in the browser pane: envelope geometry at 1440 and 375; validation
  (invalid email → message; valid email without consent → consent message)
  without a submission; no horizontal overflow at 1440 or 375; `theme check`
  clean on every touched file.

## 24 September 2026 — FinalHartwick_The_Register

Aloha's zip (`Temp Files`): the artboard PDF (1440 × 3490), her cut-outs
`Theregistryenvelope.png`, `Registryenvelope2.png`, `SH_CIRCLES_02.pdf.png`
and `Grain (1).png` (the same grain as the Journal's: grey at 60% alpha).
"These are actual dye and paper we use at Hartwick. So it's only wise we turn
them into simple invitations." Angela: keep the purple, not the artboard's
brown, with the grain.

| Change | Where |
|---|---|
| The opening is her envelope photograph (`HA_REGISTER_ENVELOPE_OPEN.png`, 590 wide on 1440, centred). Live words on the sheets, tilted with them: The Dispatch / Read. on the petal sheet (−2.2°), The Circle / By invitation. on the dyed sheet (+3.4°), both linking down the page; the h1 THE REGISTER on the envelope's front in the band colour; "Hartwick Atelier / Correspondence" up its right side. The CSS-drawn envelope, its card and the separate "THE REGISTER." heading are gone. | `ha-register-hero` |
| Band #502F37 (the artboard's button colour, which Angela calls "our purple"); `ha_correspondence_field` default changed from #512F38. Neither dev theme stored its own value. | settings schema, tokens |
| Grain over the whole page at 30%, on the band and the paper, not over the photographs or the binding bars, as in the PDF (three tiles at `/ca .29`). New setting **Register page grain** (default 30) → `--ha-grain-register`, applied by `.ha-reg-page`. | settings schema, CSS |
| Binding bar with rings under the opening; a plain bar above Your correspondence (`ha-home-binding` ×2). Join's top padding clears the rings' lower holes (169 on 1440). | template, CSS |
| Register card: her dyed sheet in glassine (`HA_REGISTER_CARD_ENVELOPE.png`) with THE REGISTER / "Correspondence from the Atelier." as live text, and the thread and seal she drew (peat line, dark disc with the House symbol). | `ha-register-join` |
| "Cloth. People. / The work in between." breaks as drawn: the heading is a textarea, a new line breaks it. | `ha-register-join` |
| The Circle: a spot of yellow dye (`HA_REGISTER_DYE_SPOT_YELLOW.png`, 190 on 1440) beside the quiet line, running on into the gutter; the reply button filled wine like Join's (was outlined). | `ha-register-circle` |
| Your correspondence: her full Paris-room frame, table and floor included, from the PDF (`HA_REGISTER_ROOM_PARIS.jpg`, 1862 × 1241, 1.5). Soft on a retina screen at full width; a larger original is welcome. | template |

Positions of the words, thread and seal are percentages of each photograph,
measured off the PDF; the type holds the role sizes until the photograph is
too small, then scales with it (`cqw`). A different photograph needs them
re-measured (said in the pickers' info).

Kept from 21 September: "makers" → "Masters" (twice), the shade under the
three columns, the site's own header and footer (the artboard's brown header
bar was not built).

Pushed to the CLI dev theme #190959223083 and Hartwik - Dev #190886576427
(sections, CSS, tokens, schema, then the template). Verified at 1440 and 375.

## 24 September 2026, later — "Hartwick_The_Register [Recovered].pdf"

Read with pymupdf (1440 × 3490). Changes from the version before:

| Her PDF | Built |
|---|---|
| The opening band is her **wine paper photograph** (2868 × 1998), running up under the menu; no grain tile over it (the photograph is the texture) | New `paper` picker on the opening → `HA_REGISTER_PAPER_WINE.jpg`, `cover`. The grain stays at 30% (a **Grain** switch on the section), as on the contact page |
| Menu transparent over it, wine hairline, dark words, dark House symbol | The header setting is now **Transparent on these pages** (`ha_trans_pages`, "contact, the-register"), replacing the contact-only switch. Ink colour and black symbol as on the homepage. The header keeps a class, `.ha-trans`, so the pages add the menu's height to their top padding without jumping when Luxe fills the bar on scroll |
| The words moved up their sheets and tilt more: The Dispatch (36.12%, 11.05%) −3.35°, Read. (37.34, 16.53); The Circle (61.42, 36.52) +3.67°, By invitation. (60.64, 43.8); THE REGISTER (49.36, 69.95) | Built to those percentages. Measured on the page: within 5 px of hers |
| Read. / By invitation. in **Junicode Italic Condensed** (27.7 / 20.8); THE REGISTER in **Junicode Cond Medium**; labels Porter Medium 9, widely tracked; side line Porter Medium 11 in Chalk Blue, ending 51 above the envelope's foot | Two new static cuts from the brand folder's variable originals: `ha-junicode-cond-italic.woff2` (wght 400, wdth 75) and `ha-junicode-cond-medium.woff2` (wght 500, wdth 75), 56–57 KB, added to `scripts/make-journal-fonts.py` and `snippets/ha-fonts.liquid`. They load only on this page |
| The Register card's photograph moved up 26; its words, thread and seal stayed where they were | Positions re-measured against the photograph: words 38.2% down, gap 3.2cqw, the line in Cond Italic; thread and seal at 72.8% |
| The yellow dye spot moved up beside the Circle's first paragraph (530–721, from 31 above it); the quiet line follows beneath | New markup: the paragraph and the spot share a row, and the quiet line comes after |
| Everything else (Join, the forms, the correspondence band, the bars and rings) | Unchanged |

Her header items (a yellow spot behind THE CIRCLE, and globe and translate icons) are in this
artboard too. They're site-wide, so they're not built. Asked.
