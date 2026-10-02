# Typography, 2 October 2026: Troja / Porter / Typewriter / Junicode Italic

Source: Aloha's email of 2 October 2026 ("Website font rules", worked out with
Angela), her About The Circle artboard and the Illustrator screenshot, all in
`docs/typography-2026-10-02/`. Built and checked on the CLI dev theme #190959223083, then pushed (code
files only, no templates) to Hartwik - Dev #190886576427 on 2 October at
Ivan's request and checked there.

## Roles as built

| # | Her rule | Face | Where it lands |
|---|---|---|---|
| 1 | TROJA PRO, large titles | GC Troja Pro Regular (`HA Troja`) | h1–h3 and anything named `__title` / `__heading`; Luxe headings. As her artboard draws it, this includes section and card titles (Ivan chose "follow the image"). |
| 2 | PORTER, nav, labels, structural headings | Porter Medium | menu bar (unchanged), labels and eyebrows (now **Medium**, as drawn, not Light), breadcrumbs (`__crumb`), buttons and text links (Luxe accent family). |
| 3 | TYPEWRITER, information | typrighter (`HA Text`) | body, descriptions, product copy and data, prices, grid product names; running paragraphs at **82% opacity** on her 17/20 leading. |
| 4 | TYPEWRITER BOLD, standalone numbers | typrighter | `__num` elements at full strength; the figures in Porter labels (`HA Figures Porter`). |
| 5 | JUNICODE ITALIC, notes | Junicode SemiBold Italic (`HA Note`) | `.ha-pull`, intros already set in italic, and **any italic in the Typewriter voice**. `HA Text`'s italic slot is this file. |

typrighter comes in **one weight (Bold)**, so "Typewriter" and "Typewriter Bold"
are the same file. They differ the way she drew them: paragraphs at 82%,
numbers at 100%. Every face is declared over weights 100–900, so the browser
never synthesises a weight.

typrighter lacks en and em dashes, the ellipsis, and à/è/ñ. Those characters
fall back to Noto Sans Mono.

## Sizes: hers this time (Ivan, 2 October)

She asked for the reference to be used as the size guide, and her screenshot
states 17pt on 20pt. Ivan chose "her stated + measured". That lifts the 24 Sep
"never size from an image" rule for this reference. Measurements are from the
1440 artboard at 1:1, cap height ÷ the face's cap ratio:

| Row | Desktop | Phone | Source |
|---|---|---|---|
| hero | 77 | 40 | THE CIRCLE |
| h1 | 51 | 32 | A CLOSER CONNECTION TO HARTWICK |
| h2 | 36 | 26 | not on the board, set between h1 and h3 |
| h3 | 24 | 19 | PIECES FOR THE CIRCLE / KNOWN THROUGH… |
| body | 17, line 1.18 | 15 | stated, 17pt / 20pt |
| num (new) | 21 | 18 | 01 02 03 |
| intro | 18 | 16 | the Junicode note |
| ui / nav | 13 | 12 / 11 | button, menu |
| label / meta | 12 | 11 | THE COLLECTORS, eyebrows |
| detail / price | 15 | 13 / 14 | interpolated |
| legal | 11 | 10 | interpolated |
| style | 24 | 19 | product name = h3 |

All of these are sliders under Theme settings › Type scale. The hero and h1
ranges were widened to allow them.

## Exceptions kept

- Header bar: unchanged (Porter Medium nav, Noto Sans Mono SemiBold BAG).
- Drawn lettering: the Register envelope words (Junicode), the Register
  letter title and note, and the CONTACT word.
- Landing page: its own earlier faces, pinned in `ha-landing.liquid`.
- The Circle page: titles in capitals and KNOWN THROUGH… at h3 size, as on
  her board. Everywhere else the casing still follows the copy.

## Found and fixed while checking

- The footer links wrapped inside words at 1440 (13px Porter). Links now never
  break internally. The row is one line from 1400px and wraps, centred, below that.
- The homepage index heading broke COLLECTIONS mid-word at 51px in its 306px
  column. It now uses the section-title size, scaled to the column.
- About / Masters opening titles and the founder's name moved from tracked Porter to Troja.
- Collection grid product names moved from Troja to Typewriter.
- Product page: added space between the Expression line and the
  introduction. The introduction is now at 82%.

## Open with Aloha

1. **Licences.** GC Troja Pro (Glyphonic, 2025) and typrighter (Jadugar
   Design Studio) are commercial desktop files with no web licence. Both are
   served as webfonts on the unpublished theme. A web licence is needed
   before launch (same position as Porter, R1).
2. Her text says "do not use Troja for small headings", but her board sets the
   card titles in Troja. We built what the board shows.
3. Buttons and text links are now Porter (the board's MEMBER SIGN IN). Noto
   Sans Mono no longer appears anywhere except BAG.
4. Casing: her board's Troja titles are all capitals, but most page copy is
   sentence case. Should Troja titles be uppercased site-wide?
5. Justified Typewriter paragraphs (About journey, Masters story) show wide
   gaps and hyphen breaks. Her board justifies too, so we left them justified.

## Files

`snippets/ha-fonts.liquid` (faces, roles), `snippets/ha-tokens.liquid` (sizes),
`config/settings_schema.json` (slider defaults and ranges, new Numbers row),
`assets/ha-sections.css` ("TYPE ROLES, 2 OCTOBER" at the end, plus in-place
edits to the Register box, About years, Circle title and number rules, and the
footer row), `sections/ha-landing.liquid`, and the new assets
`ha-troja.woff2`, `ha-typewriter.woff2`, `ha-junicode-semibold-italic.woff2`.
