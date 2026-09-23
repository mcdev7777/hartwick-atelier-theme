# Paper texture — test build, 22 September 2026

Aloha's request (22 Sep, following Angela's earlier suggestion): a very subtle paper
grain across the whole interface, so that backgrounds, colour fields and editorial
photography feel like one printed surface. It should not look distressed, vintage or like
a filter. Product photography stays accurate. She wants to test it on the development
theme and control the strength before committing.

**Status:** live on the CLI development theme #190959223083 (synced by `theme dev`).
**Not yet** on Hartwik - Dev #190886576427, and not on the live theme.

## Two modes, and the preview button

While this is a test, the theme keeps both looks (Ivan, 22 Sep):

- **Current**: the site exactly as it was. No texture layer, no grain, nothing restacked.
  This is the default.
- **Paper**: the texture described below. Every rule is scoped to `html.ha-paper`.

A small **Preview · Current | Paper** switch sits in the bottom-left corner of every page.
The choice is remembered in that browser as you move between pages. On the product page on
a phone the switch sits above the sticky buy bar.

- It shows only on preview and development themes. It checks `Shopify.theme.role` and hides
  itself on the published theme.
- It is hidden inside the theme editor, where the setting is the switch.
- To turn it off: **Show the Current / Paper preview button**.
- To make Paper the default for everyone, including the published theme once committed: tick
  **Open in paper mode**.

## What she asked for, and where it is

| Ask | Built |
|---|---|
| Small seamless WebP/AVIF texture | `assets/ha-paper-grain.avif` (63 KB) / `.webp` (83 KB), 512 px, periodic by construction, so there is no seam |
| Repeated, not one enormous image | One tile repeated across a fixed, screen-sized layer (`snippets/ha-paper-grain.liquid`) |
| Very low opacity | Now **40%**, calibrated to the grain of Aloha's two references (see Strength below). Her 6–10% is barely visible with any real paper texture |
| No interference with clicks or scrolling | `pointer-events: none` on every grain layer. Checked: links, buttons and the drawers still take clicks |
| Background colour controlled independently | The tile is neutral grey blended `hard-light`: 50% grey leaves the colour unchanged. Ground and field colours stay in Theme settings |
| Responsive, desktop and mobile | Fixed to the screen at `100lvh`, so it still covers when a phone's address bar slides away. Checked at 1440, 800 and 375 px |
| No visible repetition | Nothing in the tile is large or distinctive enough to show a repeat: no clouds, and only about 20 tiny specks. Checked at an exaggerated 20% |
| Strength controlled through CSS | Tokens `--ha-grain-ui / -editorial / -product / -size` in `snippets/ha-tokens.liquid` |
| Her control over opacity | **Theme settings → Hartwick — Material Archive → Paper texture (test)**: default mode, preview button, three strength sliders, grain size |
| Interface 6–10% | `ha_grain_ui`, default **40%** (slider 0–100) |
| Journal / Circle / Masters + editorial photography 10–15% | `ha_grain_editorial`, default **55%** (slider 0–100). The whole blog, article, `the-circle` and `the-masters` templates run at this strength. Elsewhere, editorial photographs get extra grain on top of the page layer to reach it |
| Product gallery 0–4% or none | `ha_grain_product`, default **0** (slider 0–20). Product photographs sit *above* the grain layer, so they show the photograph untouched |

## Quick comparison without the editor

Add to any preview URL (preview themes only):

- `?grain=on` / `?grain=off`: Paper / Current, remembered like the button
- `?grain=6` / `?grain=10`: Paper at that interface strength
- `?grain=8,14,2`: Paper at interface, editorial and product strengths
- `?grain=reset`: forget everything and go back to the theme settings

Strength overrides last for the browser tab.

## Which photographs are "product" and which are "editorial"

The two lists are in `assets/ha-sections.css`, block **PAPER TEXTURE**.

- **Product (no grain):** product-page gallery column, cloth details (the Matka silk
  close-ups), collection-page product cards, related pieces, product record, garment and lot
  figures, the "piece" in Continue, cart line images, Luxe product cards, and the zoom lightbox
  (it stacks above everything).
- **Editorial (topped up to the editorial strength):** homepage hero, stories, Lots, index frames, Masters band,
  journal prints; About hero, founder and feature; authorship, house, wearer, "story" in
  Continue; Circle figures; Register room photo; collection feature and category images;
  Collection Index head, editorial and directory images.
- Any photograph on neither list gets the interface grain. To protect another photograph,
  add the class `ha-grain-product-plate` to its frame. To strengthen one, add
  `ha-grain-editorial`.

## Layering (why the product photos stay clean)

Paper mode only. Current mode keeps the original stacking.

page content (under the grain) → grain layer z 97 → product photographs z 98 → mobile
sticky buy bar and the collection category bar z 99 → header z 100 and the drawers.

The header, menu drawer, cart drawer, sticky buy bar and category bar sit above the grain
layer, so each one paints its own copy of the grain. The header's tile lines up with the page
tile, so no edge shows. The sticky buy bar was z 5 and the category bar z 5; both had to move
to 99, or the product photos would have scrolled over them.

Print, Windows high-contrast mode and "increase contrast" get the flat page.

## Not covered

- Shopify's own cookie banner, the search/quick-add modals and header dropdown panels have
  no grain (they stack above the grain layer).
- The coming-soon layout (`layout/landing.liquid`) is left alone. It does not load the theme
  stylesheet, and the live landing is a separate theme.

## Strength and character, matched to the references (22 Sep, third pass)

Ivan: "the visual paper effect must be as strong as these images" (the Nicci K. site and
the plain paper sheet).

- **Strength, measured.** In both references the paper detail (finer than 24 px) has a
  luminance standard deviation of about **0.05**, on light paper, on the photo's sky and on
  its dark ground alike. At 40% the tile gives 0.050 on the page ground and 0.044–0.047 on
  the wine, peat and mid-tone photographs. At 55% (editorial) it gives about 0.06–0.07. Run
  `scripts/make-paper-grain.py --measure` to see these figures.
- **Character.** The earlier tiles were plain noise. At the same contrast that reads as
  speckle or TV static, not paper. What makes the references read as paper is relief:
  a dense felt of 1–2 px fibres lit from one side, each with a highlight and a shadow. The
  tile is now built that way: a fibre height field lit from the upper left. It was compared
  with the reference at native pixels until grain size and density matched.
- **Side effect.** At this strength the grain darkens the page ground by about 3% on
  average, and lightens the peat and wine fields by about 2%. A real sheet of paper does the
  same. The colour settings are unchanged.

## Source

`scripts/make-paper-grain.py` regenerates both files. The texture is generated, not
photographed, so there is no image licence to clear. Its character (fine tooth, fibre flecks,
rare specks) was matched to the reference paper Aloha sent, but no pixels from her reference
are used. If she would rather use that exact sheet, it can be cut into a tile once its licence
is confirmed.

## To put it on Hartwik - Dev

These files also carry today's uncommitted typography work (`ha-sections.css`,
`ha-tokens.liquid`, `settings_schema.json`). Push them only once that work is ready to go too:

```bash
shopify theme push -t 190886576427 --nodelete --only "assets/ha-paper-grain.*" --only "assets/ha-sections.css" --only "snippets/ha-paper-grain.liquid" --only "snippets/ha-tokens.liquid" --only "config/settings_schema.json" --only "layout/theme.liquid"
```
