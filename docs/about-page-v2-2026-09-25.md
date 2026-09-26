# About page v2 — 25 September 2026

Source: Aloha's `1-20260925T133700Z-1-001.zip`, which holds
`FINAL_ABOUTPAGE_DESKTOP_EDITABLE.pdf` (1440 × 5649) and her images: `aboutx.png`,
`collage01.png`, `Into Pieces - 18.png`, `SH_CIRCLES_02.pdf (3).png` and
`pinkbackground.png`. It's on the CLI dev theme #190959223083 and on Hartwik - Dev
#190886576427. The live theme wasn't touched.

Preview: `/pages/about-the-atelier?preview_theme_id=190886576427`

## Bands

| Artboard | Section | Notes |
|---|---|---|
| Pink paper, envelope, ABOUT HARTWICK | `ha-about-opening` | The header is transparent here (`about` added to header setting "Transparent on these pages"). The envelope is `aboutx.png` turned 67.25° CCW, which is the angle of her placement matrix. |
| A LIFE ACROSS PLACES / FOUNDER · ANGELA HARTWICK | `ha-about-life` | Justified with the last line centred, as she drew it. Her collage is turned upright. |
| Ring bar | `ha-home-binding` placement **About, upper** (197/670/1184) | New option. |
| A JOURNEY INTO THE HOUSE, 01–08 | `ha-about-journey` | Blocks. Each swatch is placed at her drawn width. Numbers come from block order. |
| Ring bar | `ha-home-binding` placement **About, lower** (290/763/1277) | New option. |
| THE WORK AHEAD | `ha-about-work` | Her "Into Pieces" prints. The ruled link goes to /pages/the-masters. |
| Register band, footer | site-wide | Unchanged. |

The 15 Sep bands are still in `templates/page.about.json`, switched off.

## Images (Files)

- `HA_ABOUT_PAPER_PINK.jpg`, `HA_ABOUT_ENVELOPE.png`, `HA_ABOUT_COLLAGE_LIFE.png`,
  `HA_ABOUT_WORK_PIECES.png`, `HA_ABOUT_DYE_01…08.png`
- Grey bands: after two revisions on 25 Sep they now use The Register's ground
  (#F3F0E7) and grain (0.18), the standing site-wide rule. Her artboard's grey paper
  was layout reference only. The `HA_ABOUT_PAPER_GREY_*` files are in Files but unused.
- The dye swatches come from the PDF at about 300px, so they're slightly soft on
  retina screens.

## For Aloha

1. **Four journey texts are cut off in the artboard.** Each one ends at its last
   complete sentence. Nothing was completed:
   - 04 stops at "…I began designing contemporary kan-"
   - 05 stops at "…made as heirlooms to be handed down through"
   - 06 stops at "…I designed my dress for the opening with"
   - 07 stops at "…I put the film on ice and made a full wom-"
2. **Sizes follow the 22 Sep type table, not the artboard.** Her drawing is set larger.
3. **Faces.** ABOUT HARTWICK and ANGELA HARTWICK are Porter Medium, as drawn. The
   subline is Junicode Light Italic, as drawn, and isn't a pull line. THE WORK
   AHEAD label is Porter Light (label role), where she drew it in mono.
4. In the Founder band, "localisation,opportunity" is typeset without a space in
   the artboard. It was read as a typo and given one.
