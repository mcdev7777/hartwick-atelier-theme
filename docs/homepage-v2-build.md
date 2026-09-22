# Homepage v2 — Aloha's editorial artboard, 19 September 2026

Built 19 September 2026 from `finalHartwick_Homepage_Editorial.png` (12334 × 21309:
the 1440-wide homepage on the left, her "HOMEPAGE / DESIGN & CONNECTIONS"
notes §01–§10 on the right). Verified on the CLI development theme
(#190959223083) at 1440 and 375, then pushed to **Hartwik - Dev**
(#190886576427). Live theme untouched.

Preview: `https://www.hartwickatelier.com/?preview_theme_id=190886576427`

## What was built

Seven new homepage sections, prefixed `ha-home-`, and two settings added to
the shared Register. `templates/index.json` is rebuilt; the earlier homepage
sections (`ha-hero`, `ha-house`, `ha-collection-index`, `ha-masters-index`,
`ha-featured-lot`, `ha-journal`) stay in the theme — `ha-hero` and `ha-journal`
are still used by The Circle page — but no longer appear on the homepage.

| § | Artboard | Section | Notes |
|---|---|---|---|
| 01 | The new opening | `ha-home-hero` | Two frames, each its own picker, link and ink colour. Left carries the house line as live text (h1); right the destination label and record-voice link. Left image is the one preload (§10). Phones stack (a setting keeps the diptych). |
| 02 | Founder note & signature | `ha-home-note` | Centred. Signature is an image slot; until picked, the typeset stand-in cut from the artboard shows from `assets/ha-signature-placeholder.png`. |
| 03 | Three stories | `ha-home-stories` | Uppercase heading with flanking hairlines; three prints on paper mats; number, italic title, copy, ruled link. Per-story monochrome switch → colour on hover/focus (§07). A story with no link text stays as text (§03). |
| 04–05 | Collection Index feature | `ha-home-index` + `assets/ha-home-pair.js` | Ruled four-row index (Apparel, Fine Silk, Fine Jewellery, Yoga), each row a real link; hover/focus swaps the montage, click follows the link, a finger just follows the link (§07). Montage per Category block: tall 332×602, two small 236×276, wide 540×400, as measured; every frame links to the category; vertical captions beside the small frames as drawn. |
| 09 | Made in Lots | `ha-home-lots` | Text + a print. No Lot numbers, counts or allocations. |
| 06 | Masters Index feature | `ha-home-masters` + `ha-home-pair.js` (fade mode) | Dark band over the charkha frame from the Masters shoot (`4R1A4525`, cropped below the face). List = the eleven verified techniques from The Masters page, each linking `/pages/the-masters#<key>`, which that page opens on arrival. Hover/focus cross-fades the technique's photograph behind the directory. Monochrome; scrim is a setting (default 40%). |
| 09 | The Journal | `ha-home-journal` | Print + invitation. No article list. |
| 09 | The Register | `ha-register` | Two new settings: `heading_style: caps` and `form_style: line` (label left, Join The Register right, one rule). Every other template keeps `sentence` / `box`. Same form, consent and success behaviour. |

Shared homepage styles are one block at the end of `assets/ha-sections.css`
("HOMEPAGE — Aloha's Hartwick_Homepage_Editorial artboard"). Every size is a
multiple of a type token; nothing is hard-coded.

## Measurements off the artboard (1440 grid, 4.218× scale)

Page gutter 50 · header 70 · hero 769 tall, seam at 697 · section headings
Junicode Light ~44 (built 1.375× editorial = 44 desktop) · lead paragraphs 24/30
(built statement×1.05 = 22/29) · story copy 20/26 (built body×1.2 = 18/26) ·
index rows 43 pitch, mono 14 · eyebrows Porter 10 (held at the 12 floor) ·
ruled/corner links 10 (held at 12) · Register heading uppercase 36 (built
editorial×1.15) · Register band 267 · Masters band ~717 (2:1, capped at 88vh).
Ground #F3F0E7 vs the site's #F2EFE9; band #33291F vs peat #332820 — same colours.

## Photographs

Found in Files or the supplied folders:

- Story 01 yarn hank — `HartwickAtelier-Menu-02.jpg`
- Story 03 tiled step — `HartwickAtelier-Menu-03.jpg` (a photograph of the print; the raw frame would be better if Aloha has it)
- Lots — `HartwickAtelier-DropOne.jpg` (the Hawa Mahal). The artboard's folded two-sheet collage is her treatment; the section shows the photograph on a paper mat instead, so the ground colour can change without a baked cream rectangle.
- Masters band — `~/Downloads/MASTERS/4R1A4525.jpg`, cropped y 1080–2400 so no face is published → uploaded as `HARTWICK_MASTERS_CHARKHA_HANDS_4R1A4525.jpg`
- Yoga — `IMG_5481` (rolled mat), `IMG_5328` (pool), `IMG_5501` (stacked), from THE BRAND BOOK/IMAGE → uploaded as `HARTWICK_YOGA_*`

Only in the artboard — cut at its full resolution (2400–2700 px wide for the
hero) and uploaded to Files as `HA_HOMEPAGE_*`: the hero rail and tray (cropped
above the baked-in text, so both lose their bottom ~95 design px), the block
printer, the Apparel montage's robes, curtains and ring hand, and the Journal's
pattern paper. The hero's halftone treatment is therefore baked in.

Provisional montages for Fine Silk, Fine Jewellery and Yoga are picks from
existing Hartwick photography (`212_…DUPATTA`, `100_…DUPATTA02`, `105_…STOLE01`,
`224_…PETITSQUARE`; `006_…RAJMAHAL_BANGLES`, `StepRingRhodolite-01`,
`DropEarrings-01`, `IMG_8996`; the three yoga uploads plus
`CollectionHeader-Yoga`). §04 says Aloha will supply the verified sets.

## Deviations from the artboard, and why

1. **Clothing → Apparel** in every label (hero "The Collection / Apparel",
   "Explore all Apparel", the montage captions, the story list). Aloha retired
   "Clothing" as the range name on 18 September; the artboard still uses it
   in labels while its own index row says APPAREL. Left as written in editorial
   sentences: "Clothing carries memory." (the headline) and "A Lot is a numbered
   series of clothing." — hers to change.
2. **Masters list** is the eleven verified technique names, not the artboard's
   nine roles. §06 forbids "Master Weaver · Rajasthan" (a location) and the
   others were the old homepage's placeholder roles.
3. **"makers" → "Masters"** in the Register line ("Materials, Masters and work in
   progress."), matching The Masters page's Register. "independent makers" in
   story 03 is left as written — a common noun, not the label — for Aloha.
4. **Binder rings** are drawn as SVG rather than cut from the artboard (they
   are baked into its photographs) — see Ivan's pass below.
5. **Signature** is the artboard's typeset stand-in and says so on the page;
   Angela's original replaces it through the section's picker.
6. **Scrim** on the Masters band (40%). The artboard has none and its heading
   sits on the white cloth.
7. **Yoga** links to `/collections/yoga`, the range page. No yoga-mat product
   exists on the store, so §05's "single yoga mat product with swatches" has no
   confirmed URL yet.
8. **Journal** links to `/blogs/news`, as The Masters page does. The header's
   JOURNAL entry still goes to `/pages/press`; there is no approved Journal
   landing page to point at. One setting fixes it when there is.
9. **Consent line** stays under the Register form (CASL) although the artboard
   draws none.
10. **Footer** is untouched — the artboard's is a one-row stand-in; the footer
    on the site is Aloha's own 15 September instruction.

## For Aloha

- Approve the founder copy (Angela) and send the real signature (PNG, transparent).
- Confirm the hero pair (the rings are built; a checkbox removes them).
- Supply the Fine Silk, Fine Jewellery and Yoga montage sets (tall, two small, wide).
- Name the Journal landing page.
- "Clothing" in the headline and Lots copy — keep, or Apparel?
- Every section still carries its placeholder notice; each has a switch.

## Responsive pass — 20 September 2026

Checked at 320, 375, 768 (upright tablet), 1024, 1440 and 1920 in the browser
pane; no horizontal overflow anywhere. Fixed:

- **Hero height** is now `min(84vh, 54vw)` (floor 36rem, ceiling 96rem). An
  upright tablet gave two 376px frames 860px of height and cropped both
  photographs to a sliver of hangers; 54vw is the artboard's own 769-on-1440.
- **Three stories**: the ruled links close all three columns on one line
  regardless of copy length (flex column, link pushed to the foot).
- **Made in Lots** and **The Journal** go to two columns from 750, not 990;
  the tablet no longer stacks a small print over a wide paragraph.
- **Collection Index feature** below 1200: rail fixed at 280, gap 48,
  captions beneath the small frames (the vertical captions and 60px inset
  are for 1200 and up, where the gutter exists for them). Headings step down
  to 1.2× between 990 and 1199 so "Four collections." holds one line. On wide
  monitors the rail scales at the artboard's 1 : 2.9 so the montage does not
  take three-quarters of a 1920 page.
- **Masters band**: the corner link never breaks before its mark
  (`white-space: nowrap`) and the aside column sizes to it.
- **Phones**: the montage's tall frame is 4:5 rather than the artboard's 11:20,
  which at full width ran to 680px of picture on an 812px screen.

## Ivan's pass — 20 September 2026

- **Consent line** is real wording now, on every Register form and the Circle
  request: "Yes, add me to The Register. Hartwick Atelier may write to me with
  The Dispatch and news of each Release. I can leave at any time." Names the
  sender, says what is sent, says it can be withdrawn (CASL). Christina may
  still refine it.
- **Colour on hover**: all three story prints are monochrome at rest now (the
  yarn hank was the one always in colour). Four frames — story 02 and 03, the
  Apparel robes and curtains — keep the artboard's photographs at Ivan's
  instruction; those files are flattened monochrome exports, so on them the
  hover has no colour to reveal until Aloha's colour originals replace them
  through the pickers. The CSS treatment is already in place for that.
- **Opening**: light type on both frames, a 30% peat wash over the
  photographs (section setting "Dim the photographs"), a 3px dark seam, and
  the **binder rings** — drawn as SVG in `snippets/ha-home-rings.liquid`, on
  the seam at 24% and 74% of the height as the artboard places them, turning
  90° when the frames stack on a phone. A section checkbox removes them.

## Aloha's images — 21 September 2026

Aloha sent `mixed media` (six files) to replace the artboard cut-outs. Each was
cut to its content and uploaded to Files; nothing was colour-corrected.

| Her file | Slot | Now in Files | Replaced |
|---|---|---|---|
| `IMG_6402.JPG` — her photograph of the two bound prints (5232 × 9300) | Opening, left and right | `HA_HOMEPAGE_HERO_RAIL_IMG6402.jpg`, `HA_HOMEPAGE_HERO_TRAY_IMG6402.jpg` | `HA_HOMEPAGE_HERO_RAIL/TRAY.jpg` |
| `Untitled design (1).png` — yarn hank on its mat | Story 01 | `HA_HOMEPAGE_STORY_01_YARN_PRINT.png` | `HartwickAtelier-Menu-02.jpg` |
| `2.png` — block printer on its mat | Story 02 | `HA_HOMEPAGE_STORY_02_BLOCK_PRINTER_PRINT.png` | `HA_HOMEPAGE_STORY_BLOCK_PRINTER.jpg` |
| `Untitled design (2).png` — tiled step on its mat | Story 03 | `HA_HOMEPAGE_STORY_03_TILED_STEP_PRINT.png` | `HartwickAtelier-Menu-03.jpg` |
| `Untitled design.png` — the Hawa Mahal across two folded sheets | Made in Lots | `HA_HOMEPAGE_LOTS_HAWA_MAHAL_COLLAGE.png` | `HartwickAtelier-DropOne.jpg` |
| `fake signature.png` | Founder note placeholder | `assets/ha-signature-placeholder.png` (theme asset) | the artboard's typeset stand-in |

- **The opening pair.** `IMG_6402` is the source photograph behind the artboard's
  hero: the same two prints, bound with real rings, photographed upright-stacked.
  On the artboard each print is turned 90° anticlockwise and framed from its top
  edge at ~0.95 w:h; the cuts do the same (rail 2808 × 2956, tray 2895 × 3047),
  so the framing is hers, now in colour and at higher resolution than the
  artboard could give. The real rings and the punched holes beside them are cut
  out — the SVG rings take their place on the seam and turn with it on a phone,
  where the stacked hero now reads as her photograph.
- **Prints on their own mats.** The four PNGs carry Aloha's paper mat, its
  shadow and a transparent surround, so the theme's own mat would have doubled
  it. A block setting on Three stories and a section setting on Made in Lots —
  "Print carries its own paper mat" — adds `ha-home__print--own-mat`: no
  padding, background or shadow, `object-fit: contain` inside the existing 4:5
  / 4:3 box, so the three story columns still align and the ground shows
  through. Off by default; a plain photograph gets the theme's mat as before.
  The Lots section's earlier compromise (photograph on a mat instead of the
  collage) is gone; her folded sheets sit straight on the ground.
- **Signature** is still a stand-in — her file is named "fake signature" — so it
  replaced the theme asset, not the picker, and the placeholder notice stays.
- Alt text updated where the picture changed materially (the Lots collage, the
  story prints). Mono-at-rest, colour-on-hover behaviour unchanged; 02 and 03
  are monochrome files, as before.

Verified on the CLI development theme at 1024 and 375 (hero, note, stories,
Lots; hover on 01; no overflow; every new file 200 from the CDN).

## Accessibility and QA

- One `h1` (the hero headline); every section an `h2`, in reading order.
- Every hover pairing also works from the keyboard (focus), and touch never
  needs a hover step. `prefers-reduced-motion` removes every transition.
- Ruled rows follow the house idiom: the rule brightens, no underline.
- Theme Check: 0 errors. No console errors. No horizontal overflow at 375.
- Found while testing: Luxe's `base.css` hides every empty `<div>`
  (`div:empty { display: none }`) — the scrim needed two classes to win — and
  `a:not(.button) { color: inherit }` outranks a single class, so the hero's
  ink rules carry two.
