# Final typography system + final homepage — 24 September 2026

Source: Aloha's "HARTWICK ATELIER | FINAL TYPOGRAPHY SYSTEM" note and
`FinalHartwick_Homepage_Editorial [Recovered].pdf` ("FINAL HOMEPAGE APPROVED -
Including bottom footer!!"), with the photographs in `1-20260924T192533Z-1-001.zip`.
Built on the CLI development theme (#190959223083) through `shopify theme dev`.

## The five roles

| Role | Face | Where it is set |
|---|---|---|
| 01 Navigation / global UI | Porter Medium, **Porter Light on hover / focus / current** | `--ha-role-nav*`; header nav rule in `snippets/ha-fonts.liquid`; `.ha-nav` (footer) |
| 02 Section labels / index headings | Porter Light | `.ha-label`, `.ha-identify`, `.ha-eyebrow`, `.ha-home__eyebrow`, `[class*="__eyebrow"]` |
| 03 Links, CTAs, buttons, references, data, **all numbers** | Noto Sans Mono Medium | `.ha-record`, `--ha-role-record`; digits everywhere via the `HA Figures` face |
| 04/05 Editorial body, information, titles | Junicode Light | `.ha-narrate`, `--ha-role-text`, Luxe `--font-heading-*` / `--font-body-*` |
| 06 Editorial emphasis / pull line | Junicode SemiBold Italic | `.ha-pull`, `--ha-role-pull*` |

The classes that apply them are the **TYPE ROLES** block at the very end of
`assets/ha-sections.css`, so an older section rule cannot quietly overrule a role.

### How "all numbers in Noto Mono" works

`snippets/ha-fonts.liquid` declares two faces from `ha-noto-mono-medium.woff2`:

- **HA Mono**: the whole weight range (100–900) points to the one Medium file. Any
  weight a rule asks the record voice for renders as Medium, never as a
  synthesised bold.
- **HA Figures**: digits only (`unicode-range: U+0030-0039`), placed at the front
  of the Junicode stack. The Porter stack has **HA Figures Porter**, which covers
  digits and `/`. Numbers in Junicode or Porter text therefore draw in Noto Mono
  Medium without any markup. `size-adjust` (93% for Junicode, 98% for Porter)
  matches their cap heights.

### What moved

- Body copy: Noto Sans Mono Condensed → Junicode Light (`ha_body_voice` now
  defaults to `narrate`).
- Header and footer navigation: Noto Condensed → Porter Medium, Light on hover
  (`ha_chrome_voice` now defaults to `identify`). The footer's underline on
  hover is gone, because the weight change is now the hover state.
- The ~38 elements marked `ha-identify` that were buttons, links or titles now
  carry `ha-record` or `ha-narrate`. The ones left on `ha-identify` are labels,
  now drawn in Porter Light.
- Journal: the Noto SemiBold/Bold kickers, the Junicode Cond ticker titles and
  the Junicode SemiCond category links now use the roles (the category links
  are links, so they are Noto Mono).
- Italic statements became SemiBold Italic: story titles, the opening tagline,
  the Masters quote, the index intro, the Lots line, the About subline.

### Type scale

**Sizes are Aloha's 22 September table, unchanged.** For a few hours on
24 September the scale was re-measured from the homepage artboard (body 19,
titles 42, and so on). Ivan reversed that the same day: "if she only gave us
the design image with big font sizes, don't accept the font sizes in the
design image. we must follow the given font rules." None of her 24 September
notes (type system, header, Register box) gives a size, so the 22 September
numbers stand: body 13, intro 15, h1 26, h2 20, h3 16, links and buttons 11,
navigation 11, labels and captions 10, legal 9. The section-level size bumps
made to follow the artboard were undone as well.

Watch-out for Aloha: body copy is now Junicode Light (role 04) at her 13px.
That table was drawn when body copy was Noto, and Junicode's small letters are
about 20% shorter at the same size, so 13px Junicode reads small. Changing it
is her decision; the Body copy slider in Theme settings is the place.

## Homepage changes

- **Cards**: new style **Glassine sleeves**. Aloha's sleeve artwork is cut from
  the PDF (`assets/ha-card-sleeve.png`, turned 180° and drawn at 59%, both as
  she had it). The label sits on the sleeve in Chalk Blue. Her photographs:
  DSCF6885 (Collection Index), 4R1A4457 (The Masters) and DSCF6865 (Founder).
  For the first and third she also sent a mono version, and the new
  "Monochrome version" picker uses it. That file sits over the colour file and
  fades out on hover, so the theme's greyscale filter is not used. The third
  link now reads "Read our history".
- **Index**: the wide frame is DSCF6909, turned 90° counter-clockwise as she
  placed it. It is now 546:364. Each montage frame can carry its own caption
  (01 / Apparel · 04 / Yoga · 03 / Fine Jewellery · 02 / Fine Silk).
- **Masters band**: the list is Noto Mono Medium. It still lists the Masters page techniques, not the artboard's
  role titles, which are not verified content.
- **Journal**: her Into Pieces sheet, turned 90° counter-clockwise as placed,
  shown whole with its own shadow (the new `own_mat` option). The CTA reads
  "Read the Journal Newspaper".
- **Register band**: new form style **Button only**, a filled Chalk Blue
  button to `/pages/the-register#join-the-register`. New heading style **Pull
  line**. Copy is the artboard's.
- **Opening**: the heading is typed in capitals in the template rather than
  uppercased by CSS. The paragraphs have her wider gap.
- **Footer**: new layout **row**. The wordmark is centred above one line of
  links in her order, with © at the left. Links: Collection · The Masters ·
  The Journal · The Register · The Circle · About · Contact · Instagram ·
  LinkedIn · Our policies · Cookie preferences.
- **Header**: Region is a globe icon (`ha_util_icons`). Language shows the same
  kind of icon, but only once a second language is published.

## Open with Aloha

1. **"A record of the making."** is SemiBold Italic on the artboard, but her note
   lists it as a Junicode Light title. It is built Light, following the note.
2. **The Register band paragraph** is set in Noto Mono on the artboard. The
   rule says editorial information is Junicode Light, so it is built in
   Junicode.
3. **The Masters band list**: the artboard uses Noto Mono *Light* at 23px. The
   rule allows only Noto Mono Medium, so it is built in Medium.
4. **Uppercase titles elsewhere**: the Collection Index, Masters, product and
   Journal titles are still uppercased by CSS, as those designs drew them. Her
   note says casing should follow the copy. Converting them means retyping
   each title in capitals and removing the transform, page by page.
5. **Artwork left as drawn**: the CONTACT word (Junicode SemiCond 600) and the
   Register envelope (Junicode Cond) are pieces she drew today in faces outside
   the five roles.
6. **Header**: her artboard sets THE CIRCLE and BAG in Noto Mono, and THE
   MASTERS in Porter Light. The rule says Porter Medium, so all are Medium.
   The bag count "(0)" is kept.

## Header, final direction (24 September 2026, later the same day)

- **Height**: the bar is 60px, down from 80, and the House symbol is 40px, down
  from 50 (`header-group.json` `nav_bar_height` / `logo_size_dt`). The header is
  still sticky. On desktop the side inset is 3.7vw, about 53px on 1440 as in her
  reference; Luxe's default is 20px.
- **Nav**: Porter Medium 12px, 0.04em tracking, on every item. Hover, focus and
  the current section all switch to Porter Light. `header-nav-desktop.liquid`
  now marks the current section with `aria-current="page"`, and a path inside
  a menu item's own path (e.g. /collections/apparel) counts as that item.
- **No pencil marks in the header, phone menu or footer navigation.**
  `assets/ha-marks.js` has a `NEVER` list and those selectors are out of `RING`.
- **Region / Language**: slim 0.9-stroke globe and translate icons drawn for the
  theme, replacing her placeholders. The Language icon now shows while only
  English is published (`ha_util_language_single` defaults on), and its drawer
  offers English alone until another language is published.
- **The Circle**: her yellow dye spot (the one beside The Circle on the Register
  page) behind the end of the word, as `assets/ha-circle-blotch.webp` (128px,
  4 KB). It doesn't change on hover and has no mark. It can be reused anywhere
  through `.ha-circle-mark` / `--ha-circle-blotch`.
- **BAG**: Noto Sans Mono SemiBold 12px, the one exception in the bar. It shows
  "BAG" when the cart is empty and "BAG (2)" otherwise. The brackets are spans
  hidden with the count. It opens the existing cart drawer.
- **Noto Sans Mono Condensed is retired**: its three `@font-face` rules are
  removed. The 22-Sep "record" voice option and the landing page's preload now
  use normal-width Noto. The three `ha-noto-mono-cond*.woff2` files are still in
  assets but nothing references them.

## The Register box, site-wide (24 September 2026)

Aloha: "THE REGISTER BOX: Fixed on all pages, except on The Register page."

- The homepage band moved into the **footer group** (`sections/footer-group.json`,
  section `register`, above the footer), so it shows on every page. The
  `ha-register` setting **Site-wide Register box** (`site_wide`) makes it render
  nothing on `page.the-register`.
- The 15 per-template `ha-register` bands are **disabled**, not deleted, so
  their own copy is kept: index, blog, the four range collections, the
  collection index, About, The Masters, The Circle and the five product
  templates. Re-enabling one would show two bands on that page.
- Her faces for this box only, set deliberately outside the five roles:
  THE REGISTER in Porter Medium; the sentence in **Junicode Exp Medium
  Italic** (`ha-junicode-exp-medium-italic.woff2`, wght 500 / wdth 125 from
  JunicodeVF-Italic); the Dispatch paragraph in **Noto Sans Mono Regular**
  (`ha-noto-mono-regular.woff2`), 14px, justified; JOIN THE REGISTER in Noto Sans
  Mono SemiBold. Both new files come from `scripts/make-journal-fonts.py`.
- The box is inset 47px on 1440, as in her artboard.
- `register_source` is `footer`. The box's button goes to the Register page's
  form, and that form records its own source there.
