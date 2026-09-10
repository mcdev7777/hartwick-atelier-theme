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
The difference is invisible on its own but would show if the landing page ever sat
beside another page. Both are section settings, so reconciling them later is one field,
not a code change.

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
