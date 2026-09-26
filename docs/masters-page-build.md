# The Masters — build note, 18 September 2026

Source: Aloha's **The Masters: Build Brief for Ivan** (PDF) and the founder's
`Hartwick_The_Masters.png` — three boards: the public desktop page (left),
interaction and content notes (centre), the expanded glossary copy (right).
Aloha, same day: the page is confirmed by Angela; **do not use the icons on
the artboard** — she will place something else; the Masters edited images
are in a Drive folder (not yet in the store).

Preview: `/pages/the-masters` on the CLI dev server or Hartwik - Dev.
Pushed to **Hartwik - Dev** (#190886576427), both steps, settings verified
by pulling the templates back.

## What was built

| Brief | Built as |
|---|---|
| One editorial page: hero, intro, still + film, archive + quote, glossary, archive film, The work continues, Register, footer | `sections/ha-masters.liquid` on `templates/page.the-masters.json`, then the shared `ha-register`; header and footer from the groups |
| Wide colour-thread hero with the framed monochrome inset overlapping into the introduction | hero figure at the artboard's proportion (38.4vw, capped by `--ha-media-cap`); inset absolutely placed, 8:13, hanging 16vw; on a phone it sits below the photograph, never over text |
| THE MASTERS as the single H1; THE PEOPLE. THE KNOWLEDGE. THE WORK.; Angela's introduction across THE CLOTH / THE KNOWLEDGE / THE HANDWORK, complete wording | one `<h1>`; three columns from settings; the artboard's symbol positions are **optional image slots, empty** (Aloha's instruction) |
| Still left, weaving film right; captions "A moment held." / "A process in motion."; play control belongs to the film | two figures; `snippets/ha-masters-film.liquid` renders a play control **only when a video is attached** — no weaving film exists in the store, so the right panel is a still with no play control and no "Play film" line |
| Three archive tiles, play icon only where the matching film exists; the Gandhi quotation | three `archive` blocks; tile 1 carries the store's block-carving film (real, 19 s); tiles 2–3 are stills; quote in italic Junicode Light, Cutch Resin |
| Eleven techniques as compact ruled rows, title + short line + expand control, in the brief's order | eleven `technique` blocks; number / title / short line at the half-way point / hairline "+" |
| One entry open at a time, explicit Close, real button with expanded state and labelled region, Enter/Space, visible focus, sensible reading position, no scroll hijacking | `assets/ha-masters.js`: `aria-expanded` buttons, `role="region"` panels, Close returns focus to the row, Escape closes; the page never scrolls on open; on close the row title is brought back only if it has left the screen |
| Stable IDs `#khadi`, `#handwoven` …; a direct link reveals the entry; normal Back behaviour | `id` on each row (`khadi`, `hand-spun`, `handwoven`, `block-printed-by-hand`, `hand-carved-wooden-blocks`, `natural-dye`, `ajrakh`, `ikat`, `gota-patti`, `jamdani`, `banaras-brocade`); hash read on load and on `hashchange`; history is never written |
| Complete glossary text in the page even when collapsed | panels are in the HTML; the script collapses them (`hidden`); no-JS readers get the whole glossary |
| Films start on explicit play; pause, captions, sound, full screen; one at a time; pause when out of view; no hover/scroll playback; transcripts | own Play button → native `controls`; `preload="none"`; one MP4 rendition (long side ≤ 1280); IntersectionObserver pauses at < 20% visible; a film pauses when its entry closes; start muted = "sound on request" (setting); `<track>` when a .vtt URL is given; Transcript disclosure per film |
| Reserve media dimensions, lightweight posters, responsive sizes | every frame has an aspect ratio; posters are responsive `image_tag`s; the video element is empty until Play |
| Mobile: stack in reading order, still before film, title and quote scale, tiles stay readable, inset never covers text, 44px controls | done; checked at 375 |
| Semantic headings, alt text, empty alt on decorative symbols, reduced motion, colour treatments as drawn (no B&W hover) | done; the inset and the archive band are grayscale as drawn, nothing else |
| Search: selectable text, stable canonical, title/meta, VideoObject only for playable films matching what is shown | text throughout; layout already emits canonical; `VideoObject` emitted only when a film has title + description + recorded date (both carving films: 2024-12-02, their upload date to Files) |
| Track glossary opens, film plays, Journal visits within existing analytics/consent | DOM events `ha:glossary-open`, `ha:film-play`, `ha:journal-visit`, pushed to `dataLayer` if present; no new script |
| Later phase: reusable fields — technique ID, title, summary, expanded text, media, poster, alt, caption, transcript, credit; Master record IDs separate from destination links; hidden until content is ready | every `technique` block carries all of these plus `credit`, `master_id` (never shown), `master_text`, `master_url`; the credit line and the Master link render only when filled |
| Register uses the existing form behaviour | `ha-register` with a new source value `masters_page` |

## Copy

Transcribed from the boards: introduction (Angela's wording, complete),
captions, the quotation and attribution, the eleven short lines, the eleven
expanded entries and their eyebrows, the handwork note, THE WORK CONTINUES.
Things to raise with Aloha:

- The Register line on the artboard reads "Materials, **makers** and work in
  progress." Built as "Materials, **Masters** and work in progress." per
  Framework v3 (never "makers" as a label). Her call.
- Three sentences in the expanded copy read as production notes rather than
  reader copy and were kept verbatim as the draft: Gota Patti ("Close-up
  photography and film can show…"), Banaras brocade ("Show both the loom and
  the cloth closely…"), Ajrakh ("The archive shows colour preparation…").
  The brief says the expanded board is the editorial draft pending Angela's
  review, so nothing was edited.

Khadi already explains both handspun yarn and handloom weaving (brief §3).

## Imagery — the Masters shoot (Aloha, 18 September, `~/Downloads/MASTERS`, 69 frames)

Fourteen frames uploaded to Files as `HARTWICK_MASTERS_<subject>_<frame>.jpg`
with alt text (`scripts/files-upload.py`). Several are the very frames on
the artboard — the hero, the inset, the still and the archive band.

| Position | File | Subject |
|---|---|---|
| Hero | `HARTWICK_MASTERS_LOOM_WARP_4R1A4467.jpg` | the artboard's warp-thread hero |
| Inset (mono) | `HARTWICK_MASTERS_BLOCK_IN_HAND_BW_4R1A4412.jpg` | the artboard's inset: a hand holding the finished Hartwick block |
| Still — "01 / Handspinning" | `HARTWICK_MASTERS_SPINNER_HANDS_4R1A4494.jpg` | the artboard's still: a spinner's hands and the thread |
| Film poster — "02 / Handweaving" | `HARTWICK_MASTERS_LOOM_BEAM_4R1A4470.jpg` | the loom under its awning; still no weaving film, so no play control |
| Archive tile 1 (film) | poster `HARTWICK_MASTERS_CARVING_CHISEL_BW_4R1A4427.jpg` + `HA LOGO BLOCK _ TRIMMED.mov` | the carving film with a matching still |
| Archive tiles 2–3 | `HARTWICK_MASTERS_BLUE_WARP_4R1A4518.jpg`, `HARTWICK_MASTERS_FINISHED_BLOCKS_BW_4R1A4617.jpg` | blue warp on the loom; the finished Hartwick blocks |
| Glossary | Khadi `…WEAVER_AT_LOOM_4R1A4504` · Hand spun `…CHARKHA_4R1A4460` · Handwoven `…WARP_CLOSE_4R1A4475` · Block printed `…BLOCK_FACE_4R1A4565` · Hand carved `…CARVING_PATTERN_4R1A4442` (poster for the 45 s film) · Natural dye `…DYED_BOBBINS_4R1A4528` | Ikat, Gota Patti and Jamdani keep the store's product photographs of those cloths (the shoot has none); Ajrakh and Banaras brocade stay without media |
| Archive band — "At the printing table." | `HARTWICK_MASTERS_WORKSHOP_BW_4R1A4387.jpg` | the artboard's own B&W frame of the carver's workshop |
| The work continues | empty slot | the artboard's square is a symbol; Aloha is replacing the symbols |

Not used: the frames that show a Master's face (4R1A4385/6, 4R1A4392–97,
4R1A4432, 4R1A4531, 4R1A4556, 4R1A4607) — no Master is pictured
identifiably until Angela confirms names, credits and permission (brief
§7). Portrait-free frames of the same work were preferred. The remaining 55
frames are on Ivan's machine and can be uploaded on request; every slot is
a theme-editor picker.

Alt text describes what is visible; it names no person, place or dye.
"Master" is used only as the brand's term for the person at the loom.

## Colour

The artboard's headings, row titles and quotation sample to ≈ #4A2106,
i.e. Cutch Resin (#541F00) after anti-aliasing; page ground #F3F0E8 and
the Register #332920 match the tokens. Built on `--ha-cutch-resin` with a
section switch `ink` (Cutch Resin / Peat) because the brief says not to
assume the Clothing colour applies. Confirm against the editable artwork.

## Admin — done 18 Sept, by API after Ivan re-authed with content scopes

Page `gid://shopify/Page/176711205163` updated in place: title **The
Masters**, handle `the-masters`, theme template `the-masters`, SEO title
*The Masters | Handwork & Heritage Techniques | Hartwick Atelier*, meta
description from the introduction, and a redirect `/pages/the-makers` →
`/pages/the-masters` (verified 301). The header menu's THE MASTERS item is
a page reference, so it now resolves to `/pages/the-masters` on its own.
The theme's own links (footer, About, All Clothing, homepage) already
pointed there. The live landing theme has no route to the page, so nothing
visible changed on the live site.

The page is now `/pages/the-masters` on any theme that carries the
template — Hartwik - Dev and the CLI dev theme.

## Not done, and why

- Weaving film and printing-table film: not on the store. Slots render as
  stills without play controls until the videos are uploaded.
- Captions (.vtt) for the carving films: none exist; both are silent, and
  their Transcript disclosure carries a description instead (brief §4).
- Master credits, names, locations: none published; fields exist, empty.
- Symbols: slots exist, empty, per Aloha.

## 26 September 2026 — Aloha's new order (MASTERS.pdf)

She rearranged the page using screenshots of the site. Section setting **Layout:
26 September**. The 18 September order is one click away.

1. **Opening:** yellow paper (header treatment) with the khadi quotation centred.
   **MADE BY MASTERS** is the H1, at the lower right in white, with "Plants, Minerals.
   Sunlight. Rainfall. Time" beneath it. Then a ring bar (placement `masters`,
   239/711/1225).
2. **The knowledge behind the work:** the three columns (labels now in capitals as
   drawn), each with a dye swatch (the columns' symbol slots). Her yellow swatch hangs
   from the third ring. Her collage (`HA_MASTERS_COLLAGE_BLOCKPRINT.png`) sits beside
   three new paragraphs, verbatim. Then a plain bar.
3. The glossary, then a ring bar straight onto the still and the film (no gap).
4. At the printing table. The work continues. Then the site-wide Register band.

The three small archive tiles aren't in her order, so they aren't shown in this
layout (the blocks are kept). Backgrounds follow The Register; see
`hartwick-one-ground-one-grain`.

**For Aloha:** her new paragraphs say "artisans" and "the name of the artisan"
(Framework v3: *the Masters*). "Every Hartwick piece ships with … the name of the
artisan who made it" is a promise the product records can't keep yet, because the
Master fields are empty. The subline reads "Plants, Minerals. Sunlight." (comma, then
full stops), kept as she typed it.
