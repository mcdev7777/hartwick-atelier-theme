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
