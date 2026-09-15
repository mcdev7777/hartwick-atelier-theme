# Review pack for Aloha — 14 September 2026

Prepared while Aloha is away this week, so that when she returns there is one
decision to make per page rather than a hundred open placeholders. **Nothing in
this folder has been put on the site.** The development theme is unchanged.

## What is in the folder

| File | What it is | Send to Aloha? |
|---|---|---|
| `copy-for-review.pdf` (and `.md`) | **The short version for Aloha** — only the proposed new lines, 5 pages, with ·A (her decision) and ·C (Christina) marks. | **Yes** |
| `copy-deck-full.pdf` (and `.md`) | The working record: every placeholder, current vs proposed, source tags and reasoning. 14 pages. Keep for yourself. | No |
| `mockups.pdf` | The four new page designs — Collection, The Masters, The Journal, The Register — desktop (1440) and mobile (390), 8 pages. | **Yes** |
| `mockups/*.png` | The same eight drawings as individual images, 2× (desktop) / 1.5× (mobile). | If she prefers images |
| `mockups/src/` | The HTML the drawings were rendered from. Uses the real brand fonts and the theme's tokens, so the drawings match what the theme renders. Edit `pages.py`, run `build.py`, re-shoot. | No |
| `README.md` | This note, plus the draft email below. | No |

## What was done, and the rules it was done under

**Copy.** Every marked placeholder across the homepage, product page, Circle page,
footer and forms now has a proposed line — and so do the four new pages. The
copy is built almost entirely from Christina's Framework v3 and the Brand Book
(tagged **[F]**), the naming spreadsheet (**[S]**), and Aloha's own wireframes
(**[W]**). Lines that are genuinely ours are tagged **[P]** and state no fact
we cannot support.

The content rules in `CLAUDE.md` were kept absolutely:

- **No artisan is named.** Every Master card reads *Published with permission*.
- **No provenance is asserted** beyond what the sheet confirms: West Bengal
  (Calcutta set), Jaipur (Scarf 001), Rajasthan (Belt 001). The current Featured
  Lot record (khadi / indigo / Rajasthan) is recommended for replacement with
  Skirt 003, the one apparel piece with a verified origin.
- **No care, delivery or returns terms are invented.** Care uses the hangtag
  language already in Framework v3; delivery and returns are a bracketed skeleton.
- **No wearer's quotation.** The section is recommended to stay hidden until a
  real, permission-confirmed one exists.
- **The health / petrochemical claims** in Brand Promise §03 are deliberately not
  used anywhere and flagged for Christina.
- **The Circle copy reads correctly whether the public form is on or off**, so
  it does not pre-empt the Framework-v3 conflict that is still with Christina.
- **Reserve is not promised** on the Register page (Phase 2).

**Design.** Four pages Aloha has not yet drawn, built in the language of the
pages she has: her homepage and product wireframes, the Circle mockup of
4 September and the revised product page of 3 September. Same eyebrow /
heading / body / record hierarchy, same labelled placeholder fields, same dark
Masters and Register bands, same footer. Placeholder image fields are used
rather than sourced imagery, per the rule against publishing external images —
and because that is how all four of her own mockups are drawn. Each page reuses
components already built in the theme, so build time is mostly configuration:

| Page | New components needed | Reuses |
|---|---|---|
| Collection | filter row; product card restyle of Luxe's grid | Release record table (Material Record snippet), dark band, Archive index (Collection Index list), Register |
| The Masters | technique index (Collection Index with images), Master card | Masters hero (index section with photo), statement bands, Journal cards, Register |
| The Journal | lead story; category index; Dispatch archive table | Journal cards (already built), Register |
| The Register | hero form (Register section, larger) | three-column rows (Circle columns), FAQ rows (Living), Journal cards |

Rough build estimate once approved: **6–8 hours for all four pages**, inside the
remaining budget only if the copy comes back approved rather than re-drafted.
Placing the copy-deck text into the existing pages is ~1.5 hours.

## Things Aloha has to decide (the [A] items, collected)

1. The **Lot I product list** — which seven Styles sit in the homepage index, and
   what is in the Release. Edition sizes and ship date for the Release record.
2. **Featured Lot** — Skirt 003 (verified) or another piece once Chanchal verifies it.
3. The **Core Style list** (Framework names Skirt 001/002 "for example" only).
4. **Process heading** on the product page — keep hers or take the proposed line.
5. **Journal rule** — is The Dispatch really sent to The Register before it is
   published on the site? The Journal page is written that way.
6. **Cadence** — how often The Dispatch goes out between Releases.
7. **Private appointment locations** (her design said Mallorca).
8. Whether **Lot II** exists yet, for the Archive index.
9. "**How the Collection works**" — an article, or a short page?

## Things that are Christina's (the [C] items)

Consent lines (Register and Circle), privacy answers, cookie banner, delivery
and returns terms, the Circle reading, and whether the health claims may appear
on the public site.

---

## Draft email to Aloha

**Subject:** Hartwick — copy for every placeholder, and four page designs, for your review

Aloha,

I know this week is heavy, so I have tried to turn the open placeholders into
decisions rather than questions.

**1. Copy — `copy-for-review.pdf`, five pages.** Only the new lines: a proposed
sentence for every placeholder on the existing pages, and the copy for the four
pages that do not exist yet (Collection, The Masters, The Journal, The Register).
Nearly all of it is lifted from Christina's Framework v3 or your own wireframes.
Nothing invented where the rules forbid it: no Master named, no provenance beyond
the naming sheet, no delivery terms, no wearer's quote. Lines marked ·A need a
detail only you have; ·C is for Christina. Both lists are at the foot.

**2. Design — `mockups.pdf`.** Desktop and mobile for the four missing pages,
drawn in the language of your homepage, product and Circle designs — the same
hierarchy, the same labelled image fields, the same dark bands. Every image is
a placeholder field, as in your own mockups. I would rather you tear these up
than have nothing to react to; the components are ones already built, so
changes are cheap.

Nothing is on the site. The development theme is unchanged until you say
otherwise. If it is easier, a single reply of "page X approved, page Y with
these changes" is all I need per page.

Ivan
