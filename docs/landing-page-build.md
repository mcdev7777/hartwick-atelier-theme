# Landing page — build note, 10 September 2026

Built against **Hartwik - Dev** (#190886576427), unpublished. Live theme untouched.
Requested by Aloha the same day, with a mockup and a written type/colour spec.
**Rebuilt the same day against her second mockup** — see *Second mockup* below.

## What was built

| File | What it is |
|---|---|
| `sections/ha-landing.liquid` | The page. Every string, colour, size and asset is a setting. |
| `layout/landing.liquid` | A layout with no header, footer, nav, cart or Luxe CSS/JS. |
| `templates/index.landing.json` | Alternate homepage template — preview at `/?view=landing`. |
| `templates/page.landing.json` | Same page as a page template, for any page — `?view=landing`. |
| `assets/ha-landing-scrapbook.mp4` | `Scrapbook LANDING03.mp4`, unchanged. 1080×1920, 8.2s, 8.0 MB. |
| `assets/ha-noto-mono-cond-medium.woff2` | New — see Typography below. |
| `snippets/ha-fonts.liquid` | One added `@font-face` for the above. Nothing else changed. |

Preview (store password required):

    https://9c8a52-dc.myshopify.com/?view=landing&preview_theme_id=190886576427

## Second mockup — what changed

Aloha sent a revised design and a new clip a couple of hours after the first build.
Four changes, all absorbed by the existing section:

1. **Headline copy** — "...by hand, **just like** everything else **here**."
2. **The Porter statement line is gone.** The setting stays, empty, so it can come
   back without a code change. Porter is now unused on this page.
3. **The paragraph moved up beside the last line of the headline**, right-aligned,
   instead of sitting under it.
4. **The House Symbol and contact line moved into the text column**, centred under
   the rule, instead of a full-width band across the foot. The film now runs the
   full height of the page. The symbol also grew, 46px to 66px.

New clip: `Scrapbook LANDING03.mp4`, same 1080×1920 portrait shape, 8.2s, 8.0 MB.
It replaced the old file under the same asset name, so no setting had to change —
`asset_url` carries a version hash, so the CDN picks up the new file immediately.

### How the paragraph sits beside the headline

It is an ordinary block in normal flow, pulled up by 40% of one headline line so it
lands in the empty space to the right of the short last line. **It is not floated.**
A float would have to come before the headline in the markup, which would hand a
screen reader the paragraph before the `h1` on a page that has three elements on it.

The trade-off of not floating is that nothing forces the two apart if the headline's
last line grows. So the lift is applied only from 1100px up, where the headline
reliably breaks with a short last line; below that the paragraph drops back under the
headline, which is what it does on a phone regardless. Checked at 1450, 1000 and 375.
`copy_lift` set to 0 turns it off everywhere.

### Vertical position

The mockup sits the whole column low in the page — the gap under the contact line is
the same ~54px as the gaps between the rule, the symbol and the contact line, while
there is 325px of air above the headline. That is bottom-anchored, not centred, so
that is what is built. On a much taller screen it will read as bottom-heavy, so
`text_position` offers Top / Centre / Bottom in one click. Default is Bottom.

## Aloha's first round of feedback — 10 September 2026

> "The header title is a bit too wide. Can you bring the header more narrow in…
> If the subtitle is a little big, simply downsize it. There is a lot of space in
> the Header."

Both are the same fault, and it was mine. The headline is justified, so the word
spaces stretch to fill the line — the wider the column, the wider the gaps. At the
width it shipped at, the three headline lines were carrying **+47, +34 and +54px of
extra space in every word gap**. That is the "lot of space" she is looking at.

The fix is the measure, not the type size. Bringing the column in until the
headline's natural width nearly fills it leaves justification almost nothing to
stretch. Measured across candidate widths at 1450px:

| Column | Extra space per word gap | Lines |
|---|---|---|
| 44em (as shipped) | +47 / +34 / +54 px | 4 |
| 40em | +38 / +25 / +40 px | 4 |
| 38em | +27 / +14 / +24 px | 4 |
| **36em → now 12 headline ems** | **+16 / +3 / +7 px** | 4 |
| 34em | +6 / +49 / **+314** / +107 px | **5** |

Note the cliff. One step narrower and the headline breaks to five lines, stranding
"JUST LIKE" alone on a line that then justifies to 314px per gap. The setting's
`info` text says so, because it is not something you would guess from dragging the
slider — you would just see it fall apart and not know why.

The paragraph went from ~16.7px to **15px**, which is also the size at which
Junicode matches Bode by eye elsewhere in the build.

### "Align the sentence next to the full stop"

Her second note, same round. The paragraph was sitting beside the headline's last
line but **11px below its baseline** — close enough to look intentional, far enough
to look like a mistake. Aligning the two baselines is what makes it read as
continuing from the full stop rather than floating under it.

The lift went from 40% to **60% of one headline line**. That is measured, not
eyeballed: it is the headline's half-leading plus descent, plus the paragraph's
ascent, over one headline line. Both terms are shares of their own type size, so
the alignment survives the fluid type — baseline delta is **0px at 1450, +1px at
1200, −2px at 1920**.

The horizontal gap after the full stop is left alone at ~29px. That is 5.1% of the
column, against 5.8% in Aloha's own mockup, so it is already a shade tighter than
what she drew.

### The measure is set in headline ems, not rem

This is the part worth keeping. The headline is fluid — it scales with the viewport
between its two clamp stops. A column fixed in `rem` would hold still while the type
shrank underneath it, and the gaps would open straight back up on any screen
narrower than the one it was tuned on. Tying the measure to the display size keeps
the ratio constant, so the spacing tuned at 1450px is the spacing you get
everywhere. Verified:

| Viewport | Headline | Column | Extra per gap |
|---|---|---|---|
| 1920 | 53.6px | 643px | +17 / +3 / +8 |
| 1450 | 47.9px | 574px | +16 / +3 / +7 |
| 1200 | 39.6px | 475px | +13 / +3 / +6 |
| 375 | 28px | 327px | not justified on mobile |

Two new settings: **Text column width** (headline ems) and **Paragraph size** (px).

## Typography — Aloha's spec, and the one thing it needed

Junicode is a variable font here (weight axis 300–700), so **Bold 700** for the
headline and **Light 300** for the paragraph are both real weights, not synthesised.

Porter Light was already in the theme and is used as specified. Porter is subset to
uppercase A–Z and space only — the brand rule is that it carries no numbers,
punctuation or symbols — so the commas and full stop in the statement line render in
Junicode. That is the type system behaving as designed, and it matches the mockup.

**Noto Sans Mono Condensed Medium did not exist in the theme.** The only mono file
was the Regular (400), a static instance with no weight axis, so asking it for Medium
would have made the browser fake the weight — the same synthesis that made the footer
policy links look like a mix of bold and regular in an earlier build. The Medium was
subset from the brand assets to the same 443 codepoints as the Regular (18 KB) and
added as a second `@font-face`. Noto is SIL OFL, so unlike Porter there is no licence
question. Nothing else on the site uses it; `.ha-record` stays on 400.

## Colour

Aloha's values are used exactly: text `#332820`, ground `#F3F0E7`.

`#332820` is **Peat Fibre**, already in the Material Archive palette. `#F3F0E7` is new —
the rest of the site runs on `--ha-page-ground` `#F2EFE9`, two points cooler and darker.

### The ground was in two places, and they disagreed

Aloha came back with "make the background colour #F3F0E7", which read at first like a
setting that was already right. It wasn't. The **section** was `#F3F0E7`; the **page
behind it** was `#F2EFE9`, because the landing layout painted the body from the
site-wide `ha_page_ground` and that setting resolves to its schema default rather than
to blank — so the `| default: '#F3F0E7'` fallback written into the layout could never
fire. Two creams, one shade apart.

The section covers the viewport, so this hid well. It showed in four places:

- rubber-band overscroll at the top and bottom of the page, on macOS and iOS
- the strip left when a mobile browser's address bar collapses and the visual viewport
  grows past `100svh`
- the mobile browser chrome, via `theme-color`
- any moment before the section's CSS was parsed

Now the section declares `html` and `body` from its own Background setting, so there is
one source of truth instead of two values that agreed only by coincidence. The layout
keeps `#F3F0E7` as the first-paint value only. Verified: `html`, `body`, the section,
the film panel and `theme-color` all report `#F3F0E7`.

**The rest of the site is still `#F2EFE9`.** That is untouched and deliberate — this was
a landing-page instruction. Whether the two should be unified is still open (below).

## Judgement calls, for the record

- **The video is served from theme assets, not Shopify Files.** Shopify accepted the
  MP4 as an asset and it plays. Files is the better long-term home — it serves several
  sizes — so the section also has a Shopify Files video picker that takes precedence
  the moment someone uploads the clip there. No code change needed to switch.
- **No poster image yet.** There is no `ffmpeg` on this machine, so a still could not be
  cut from the clip. Until one is set, the media panel is the ground colour for the
  first moment of a cold load, and visitors on `prefers-reduced-motion` see the ground
  rather than a still. A single exported frame in the "Still image" setting fixes both.
- **8.0 MB, with an audio track.** It plays muted, so the audio is dead weight —
  stripping it and re-encoding would cut the file materially. Worth doing before this
  page is public, and it is not a code change.
- **The password page was left alone.** A holding page and Shopify's password page are
  different things: the password template carries the entry form, and replacing it
  would lock everyone out of the preview. If Aloha wants this served as the password
  page, say so and it can be done properly, with the form kept.

## Open questions for Aloha

1. Where does this page go — the homepage, or a page at its own URL? Nothing has been
   switched over; both routes are built and previewable.
2. `#F3F0E7` or the site's `#F2EFE9`? Her number is in, and it is one field either way.
3. Is a still frame from the clip available for the poster?
4. The Porter voice no longer appears anywhere on this page. Intended, or should the
   statement line come back?
