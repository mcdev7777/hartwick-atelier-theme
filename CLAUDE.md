# Hartwick Atelier — Shopify Build (Phase 1)

## What this is
Local working copy of the **Luxe 5.1.0** theme (Winter Studio) from store
`9c8a52-dc.myshopify.com`. We are building the full Hartwick Atelier storefront on top
of it. Work happens in an **unpublished development theme** — never the live theme.

- Launch: **10 September 2026**
- Budget: **40 hrs max / R600 p/h** (4 hrs already consumed by review & planning)
- Client contact: **Aloha Makai** (Creative Director) — sole route for scope + approvals.
  Christina Domecq = payments/brand messaging. Angela Hartwick = founder. Gareth = access.
- Daily written update required (see `docs/audit-and-plan.md` §Reporting).

## Source-of-truth hierarchy
1. **Christina's `MASTER_Brand Messaging and Framework v3`** — final authority on all
   terminology. Overrides everything below.
2. Aloha's written email instructions.
3. The approved wireframes (`Wireframe (01) HOMEPAGE`, `Wireframe (03) PRODUCT PAGE`).
4. The mobile developer briefs (`.docx` / `.pdf` alongside each wireframe).
5. Strategy + brand-book PDFs — context only, not implementation direction.

Materials live in `~/Documents/Shopify - Ivan/Website Development/`.

## Terminology — NON-NEGOTIABLE
The mobile homepage brief (`Hartwick_Atelier_Mobile_Homepage_Developer_Brief.docx`) is
**superseded** on terminology. It says "Join the Circle" and "The Makers". Both are wrong.

| Use | Never use | Meaning |
|---|---|---|
| **The Register** | ~~The Circle~~ (for signup) | Public, free-to-join community + waitlist. All newsletter CTAs say **"Join The Register"**. |
| **The Dispatch** | ~~newsletter~~ | Editorial newsletter sent to The Register. |
| **The Circle** | — | Invitation-only group of founding friends. **No public form. No application route.** Editorial appearances only, with approval. |
| **The Masters** | ~~The Makers~~, ~~artisans~~ (as a label) | The artisans in India. |
| **Style** | — | Permanent silhouette identity. **Customer-facing name = the original location name** (`Tribeca Skirt`, `Amman Shirt`) with the Expression beneath it — Aloha, 21 Sep 2026. The numbered code (`Skirt 001`) is internal (`style.code`). Fine-silk pieces have no location name recorded, so their code is their name (`Shayla 03`). |
| **Expression** | — | The fabric/dye/colour realisation of a Style. One Style → many Expressions. |
| **Edition** | — | `3/25` — piece position / run size. |
| **The Lot** | — | Production batch. Customer-facing as **Roman numerals**: Lot I, Lot II. |
| **The Release** | — | The curated selection available at a given moment. |
| **Reserve** | — | Register-only right to secure a piece pre-Release (50% deposit). **Phase 2 — do not build.** |
| **Origin** | — | Full provenance story of a piece. |
| **The Archive** | — | Record of everything made; not a sale section. |

**Naming, 21 Sep 2026 (Aloha):** the location names (Tribeca, Palma, Bombay…) are the
customer-facing product names again, with the Expression beneath. Style codes
(`Skirt 001`) and worksheet IDs (`P001`) are internal. This reverses the earlier rule
("legacy names are internal SKU mapping only"); the Framework v3 wording has not been
re-issued to match — flagged to Aloha. Store title format: `Tribeca Skirt | Handspun
Matka Silk, Emerald Changeant`.

## Content rules
- **Never invent** artisan names, provenance, materials, production detail, health claims,
  product facts, or Circle member quotations. Anything unverified ships as a clearly
  labelled placeholder in the unpublished theme, and Aloha is told about it.
- Do not source or publish external imagery without approval.
- `[pending Chanchal verification]` in the naming spreadsheet = unverified origin. Treat
  as placeholder.
- **Product copy comes only from Aloha's sheet, through `scripts/sheet-to-shopify.py`.**
  A row whose Approval notes say DRAFT / to review stays in `hartwick.*` metafields
  (read by the unpublished theme only, marked "Draft copy" there); `--launch` — title,
  description, price on the live product — refuses it. Only P001's introduction and
  description are approved as of 21 Sep 2026.

## Architecture decisions (approved by Aloha)
- Reusable sections + **metafields/metaobjects**. No hard-coded product or editorial pages.
- Retain Luxe natives wherever they meet the requirement; custom sections only where they
  don't. See `docs/audit-and-plan.md` for the native-vs-custom split.
- Brand styling stays in **theme settings / CSS variables** — the Brand Book is only
  partially final, so final colours and type must be applied centrally, not per-section.
- Structure content and code so **Reserve** (50% deposit) can be added later without rebuild.

## Docs
- `docs/audit-and-plan.md` — theme audit, native/custom split, day-by-day plan, risks.
- `docs/data-model.md` — metafield + metaobject specification.

## Working rules
- Development theme only. Never push to the live theme.
- Do not exceed 40 hrs or change scope without Aloha's written approval.
- Log hours per stage as you go.
