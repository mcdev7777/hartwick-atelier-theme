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

## Later on 2 October: sizes reverted, all links in Porter

Aloha: "all the text looks so big again. The links are in the wrong font on
the collection page, all links must be in Porter. Pls make all the links in
Porter and recover the original font sizes."

- **Sizes** are back to the 1 October table (desktop hero 37 / h1 31 / h2 24 /
  h3 19 / body 14 …, phone unchanged from 1 October, body line 1.6). Every
  size override from this morning is undone: the Circle title, KNOWN THROUGH,
  About/Masters titles, the homepage index heading, the paragraph leading and
  the footer row. The faces stay as built above.
- **All links in Porter Medium, capitals** (the ALL LINKS IN PORTER block at
  the end of `ha-sections.css`). This covers every link in the page,
  footer and drawers, and every word inside it: the Collection Index list
  and category cards, product cards on the range pages and on All products,
  title links, and links inside paragraphs. Images and pencil marks are
  unaffected. The exceptions are the menu bar (its own rules) and the
  Register envelope's drawn words.
- On CLI dev and Hartwik - Dev. Checked with no non-Porter link text on the
  Collection Index and Apparel pages.

## Later still on 2 October: product names in Troja, thinner Typewriter

Aloha: "All Page titles should be in Troja Font, as well as our product names,
and in the circle part. Make sure that the collection index product names are
also in Troja … The individual product page feels chaotic. I have placed a
thinner version for typrighter font, maybe you can place that in instead when
we have info."

- **Thinner Typewriter**: `typrighterV1-1.ttf` (TyprighterV1 Regular, same
  foundry, no web licence either) → `ha-typewriter-regular.woff2` (Latin, 24 KB;
  original in `docs/typography-2026-10-02/`). `HA Text` now has two faces by
  weight: Regular for 100–599 (every text role asks 400), Bold for 600–900
  (`__num` asks 700). That is her original rule 3 / rule 4 split, so it
  applies site-wide, not just on the product page. Checked: the only Bold
  Typewriter left on the main pages is the standalone numbers.
- **Product names in Troja, capitals** wherever a name is printed: range
  pages, Collection Index rows, Luxe cards (All products, search, cart,
  recommendations, predictive search), the product page's related pieces and
  title. Names inside links are excluded from the all-links-in-Porter rule;
  the rest of each link (Expression, VIEW PIECE) stays Porter.
- **The Circle panel** (header drawer) title is Troja.
- Product page origin record: the five column titles now use the card-title
  size and never split mid-word ("CONSTRUCTI / ON").
- The Register's "01 / The Dispatch" is a label: Porter, not Typewriter Bold.
- Already Troja and checked on every page: page titles on Collection Index,
  range pages, All products, product, Circle, About, Masters, Journal, cart, search.

## Homepage story buttons (Ivan, 2 October)

"we need to change these buttons to be more like buttons": WINDOW SHOP /
LEARN FROM THE MASTERS / READ OUR HISTORY on the homepage story cards were
ruled links. Now they are filled Correspondence-wine buttons with
page-ground Porter letters (the product page's COLLECT style), softening on
hover, and Aloha's pencil ring still drawn round them. Only the story
cards; the other ruled links on the homepage are unchanged.

## Homepage story titles in small Troja (Ivan, 2 October)

"make these titles in a small Troja font": Cloth, considered / Knowledge,
kept in use / Small Lots. Close attention. were Junicode SemiBold Italic pull
lines at the h2 row. Now Troja, upright, at the card-title row (19 desktop,
16 phone). They read in capitals because GC Troja Pro draws its lowercase
as capitals: the face is all-caps by design, so every Troja title on the
site reads uppercase whatever the copy's casing (this settles open
question 4 above).

## One small button everywhere, and Contact on the homepage (Ivan, 2 October)

- "have buttons smaller, with the porter in medium weight … add the same
  buttons to anywhere that has the old version, not too big again". The old
  version is the ruled link `.ha-home__ruled`, used in the homepage stories,
  Lots (EXPLORE ALL APPAREL) and Journal (READ THE JOURNAL NEWSPAPER), the
  About page (LEARN FROM THE MASTERS) and the new Contact band. All of them
  are now one button: wine #502F37, Chalk Blue Porter Medium (500), label
  size (11 desktop / 10 phone), compact padding. The "THE BUTTON, 2 OCTOBER"
  block in `ha-sections.css`. Other solid buttons (JOIN THE REGISTER, MEMBER
  SIGN IN, the Contact page's appointment button, COLLECT, checkout) were
  already buttons and are unchanged.
- "I want to add a contact info on the homepage too somewhere": new section
  `sections/ha-home-contact.liquid` ("HA — Home: Contact"), placed after The
  Journal and before the Register box. Every word comes from the Contact page
  on Hartwik - Dev: Get in touch, its intro lines, the contact@ / angela@ /
  Instagram rows, the Mallorca showroom by appointment, and its Request an
  appointment mailto. All editable in the theme editor (rows are blocks).
  The emails show in capitals because every link is Porter.
- `templates/index.json` was rebuilt from Hartwik - Dev's own copy (Aloha's
  editor changes kept) plus the new section, and checked unchanged on the
  server before the push.

## The @ in Porter (Ivan, 2 October)

"I can't recognize @ easily. pls make it bigger like the other letters." The
Porter webfont is cut to A–Z, so the @ in the homepage emails fell through to
the Typewriter, whose @ is lowercase-height. `ha-porter-at.woff2` (816 bytes)
is Porter Medium's own @ alone, cap height like the letters, declared as
"HA Porter At" with unicode-range U+0040 and placed second in the Porter
stack. The A–Z cut of the main Porter files is unchanged. Same licence
position as Porter (R1).
