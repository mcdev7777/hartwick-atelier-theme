# About The Circle — build note, 30 September 2026

Aloha's About The Circle artboard (the page before a member signs in) and
Ivan's seven build notes. Built on the CLI dev theme #190959223083 only.

## Built
| Artboard | Section | Notes |
|---|---|---|
| Opening + envelopes + seal | `sections/ha-circle-invite.liquid` | Her new envelopes (30 Sep evening): `HA_CIRCLE_ENVELOPES.png` (transparent; cropped from her `Psd 4.png`, the stray faint canvas-edge lines removed) with `HA_CIRCLE_SEAL.png` laid over the front flap (35.5% / 48%, 3.9% wide, turned 12°; editor settings). The seal is a link to `#within-the-circle` until the letter exists; its label "Break the seal" is screen-reader only (`show_seal_text` shows it). The drawn Inkstone envelope and its flap/foot lines are retired. |
| 01 / Within the Circle | `sections/ha-circle-within.liquid` | Three column blocks; stack on phones. |
| The Collectors, sign in, note on membership | `sections/ha-circle-members.liquid` | Photo = her `HA_JOURNAL_INSTAGRAM_JEWELLERY.jpg`. Sign-in button for visitors only; members (`hartwick.circle_status` = Approved) see `member_url` once set. |

Styles: "ABOUT THE CIRCLE, 30 SEPTEMBER" block at the end of
`assets/ha-sections.css`. Sizes are the role tokens, not the artboard's.
Hairlines between bands as drawn; no brown divider on these three.

`templates/page.the-circle.json`: the three sections first; every
4 September section (hero, holds, gatherings, how, notes, **request**,
details) is disabled, not deleted.

Heading changed to her "A closer connection to Hartwick" (no full stop, as in her screenshot).

## Not built — waits for the updated invitation-form design
- The letter behind the seal (note 01) — the seal becomes a real button then (note 05).
- The questionnaire (note 03) and upload/permission step (note 04).
  Drafts: `docs/circle-draft-2026-09-29/` (prefs, share, gate).
- Member pages / `member_url`; the login design (a later phase, note 01).

## For Aloha
- The public request form is off on this page (her design has none). The
  Register page's invitation-reply form is unchanged.
- The site-wide Register box and the footer follow the page, as on every page.
- "Pieces for the Circle" (pouches and tote bags) — note 07: product photography,
  availability and wording need Angela's review.
- Page title and body text use the agreed size table, so they're smaller than
  drawn on the artboard.

## 1 October 2026 — grey paper and colours (Aloha)
- Opening on her grey paper `HA_CIRCLE_HEADER_PAPER_GREY.jpg` (`paper` setting;
  cover, anchored at the top so its light edge shows, grain over it), running
  under the transparent menu: `sections/header-group.json` → "Transparent on these
  pages" now includes `the-circle`.
- THE CIRCLE and her line on the right in Chalk Blue; the line is a pull line
  (Junicode SemiBold Italic). Reference line and label stay ink.
- Not `.ha-paper-head` (that class turns every word Chalk Blue for the navy heads);
  the section paints its own paper + grain.
- For Aloha: Chalk Blue on the lighter top of the paper is low-contrast, most of
  all on a phone where the line wraps onto the lightest part.
