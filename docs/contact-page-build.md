# The Contact page — Aloha's artboard, 24 September 2026

Source: her `Temp Files` zip, which held a screenshot of the artboard (1440 frame
shown at 884), `CONTACTATELIER.png` (the showroom photographs, stacked, on a
transparent ground) and `SH_CIRCLES_02.pdf (1).png` (a peach dye spot). The page is
`/pages/contact-us` (page #145062428971, template `contact`). Ivan: *"add the Grain
layer at 30%, and leave the Metal Rings binders and the actual photography images
above."*

Pushed to the CLI dev theme #190959223083 and Hartwik - Dev #190886576427. Verified
at 1440 and 375.

| Artboard | Built |
|---|---|
| "Hartwick Atelier / Correspondence" · "01 / Get in touch"; CONTACT across the page in wine, its O a spot of dye; three lines at the left; ways to write at the right, ruled; "Cloth. People. Correspondence." · "Mallorca / and elsewhere" | `ha-contact-intro`. The h1 is the page word, and the drawn word is `aria-hidden`. The spot image and the letter it replaces are settings. Each way to write is a block (label, optional line, address, link). |
| Dark bar with three rings | `ha-home-binding`, placement **Inset**, with the new **Grain on the bar** option |
| Sand band: "02 / Visit the showroom" · "Esporles / Serra de Tramuntana"; "Visiting Mallorca?"; the photograph stack; "By appointment, with Angela.", paragraph, rule, "To arrange your visit", "Email us with your preferred dates.", Loden Moss button; caption | `ha-contact-visit`. The button is `mailto:contact@hartwickatelier.com?subject=Showroom%20visit` |
| Grain everywhere, photographs and rings above | `.ha-page-grain` + `.ha-grain-block` on both bands and on the bar, at **Page grain** (was "Register page grain", same setting `ha_grain_register`, 30). The grain sits under content, so the dye spot, the photographs and the rings are clean |

Pictures in Files: `HA_CONTACT_SHOWROOM_STACK.png` (cut to its edges, 1400 wide) and
`HA_CONTACT_DYE_SPOT_PEACH.png`.

Measured (1440): gutters 52; CONTACT 52 → 1222 (built 52 → 1229); ways to write in a
476-wide column from 909; photographs 464 wide from 176; the text column 472 wide from
803; button 308 × 54 (all within a few px).

Colours: wine `--ha-field-correspondence` (#502F37), Loden Moss button (an archive
colour, #B2AA72), and the lower band on the existing sand field (page ground + 6%
peat). Her screenshot, with the grain taken out, samples at #F3F0E7 / #E5E0D4 / #AFA877.

## Decided one way, for Aloha

1. **CONTACT is Junicode Light**, per her 18 September rule. Her drawn word is
   heavier. It's sized to her width, so the caps stand a little lower (166 against 195).
2. **Type sizes** stay on the 22 September table. Only the word CONTACT scales with
   the page.
3. **Rings** use the homepage's inset placement (249 / 722 / 1239). Hers here are
   204 / 678 / 1194, off centre. The foot lines and the lower band's top lines sit clear
   of the rings, where hers cross them.
4. **Right-hand top lines** are set flush to the right gutter. Hers stop short at
   different points.
5. **The old page** (Luxe contact form, "Contact Hartwick Atelier", and Media Contacts
   with Olivia Johnston and Angela's phone numbers) is still in the template, switched
   off. The artboard has no form and no phone numbers. Say if the form should come back.
6. "Editorial image / Showroom photograph to follow" is her caption, shown as drawn.
   It says a showroom photograph is still owed.

## Same day, her second version — `Hartwick_Contact_Editable.pdf` (1440 × 2200)

Read with pymupdf: every image, fill and text span is at its exact position.

| Her PDF | Built |
|---|---|
| Grey paper photograph under each band (her own; the lower one placed turned 90°) | `paper` picker on both sections: `HA_CONTACT_PAPER_GREY_TOP.jpg` and `HA_CONTACT_PAPER_GREY_LOWER.jpg` (turned upright), `cover` |
| Menu transparent over the paper, peat hairline | New header setting **Transparent on the contact page** (`ha_trans_contact`, on). Same ink colour and black House symbol as the homepage (`ha-trans-ink`). The band's padding adds `--site-header-height-*` |
| CONTACT in Junicode **SemiCond SemiBold**, Chalk Blue #E9F3FF, 45 → 1224; spot 201 × 207 | The theme's SemiCond 600 cut, 18.83vw → 56 → 1236; spot 0.753em, 0.055em below the baseline |
| Labels in Porter Light 12 | Labels in the identify voice (Porter) at the label token; they were mono |
| Addresses Chalk Blue; rules peat | As drawn. Hover and focus take the ink, because Chalk Blue on the grey paper is quiet |
| "Mallorca / Serra de Tramuntana" (was Esporles …); "with Angela" without a full stop; no caption | Template text changed; caption empty |
| "See the collection in person." Junicode SemiBold Italic, wine | Italic 600 in the wine |
| Photographs 555 wide from 133, turned −5.33° | Grid 5.3vw / 38.5vw, `rotate(-5.33deg)` |
| Wine rule; Chalk Blue button with wine words (Porter Medium 10) | As drawn; on hover the colours swap |
| Rings at 225 / 698 / 1212 | New ring placement **Contact**: 225 / 720 / 1212, with the middle ring centred |
| No grain layer in the PDF (the paper photograph is the texture) | Grain kept at 30% as Ivan asked; it's now a **Grain** switch on each section |

Header items in her PDF that were **not** built (they're site-wide, not the contact page):
a yellow dye spot behind THE CIRCLE, and globe and translate icons in place of "US / USD".

Still decided one way: type keeps the role sizes. She draws the intro 36, "Visiting
Mallorca?" 70, "By appointment" 48 and the body 21; ours are 32 / 32 / 32 / 15. Her lower
band's labels sit 118 under the bar; ours sit at 153, clear of our longer rings.
