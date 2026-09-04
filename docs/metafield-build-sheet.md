# Metafield & Metaobject Build Sheet — step by step

A checklist for building the Hartwick content model **by hand in the Shopify admin**.
Work top to bottom. The order matters — see "Why the order matters" below.

Everything here is transcribed from the theme code, so the keys are not suggestions.
`sections/ha-*.liquid` and `snippets/ha-*.liquid` already read these exact names. A key
spelled differently is not an error you will see — it is a row that silently never appears.

Fields marked **◆** are read by the theme *today*. Unmarked fields are specified in
`docs/data-model.md` for Phase 2 (Reserve, the Masters page, The Dispatch) and are worth
creating now so no data migration is needed later — but nothing breaks if you skip them
on the first pass.

Every table below gives four things: the **key** (what the theme reads), **One or List**,
the **type** to pick, and the **validation** to set. Where a column says "—" there is
nothing to configure.

---

## Before you start

- Work in the **Shopify admin**, not the theme editor: `Settings → Custom data`.
- Everything you create here is **store data, not theme data**. It is shared by the live
  theme and the dev theme. Creating *definitions* is safe — they are empty containers.
  Creating *entries* and filling product fields is real content, so keep anything
  unverified clearly marked (see Stage 6).
- Nothing in this document publishes anything or touches the live theme.

### The five rules that will cost you an afternoon if you miss them

**1. Namespace must be `hartwick`.**
`custom.fibre` will not work. `hartwick.fibre` will.

⚠️ **The namespace/key row is not on the blank form.** It appears only after you type a
Name. So:

1. Type the **Name** — use the snake_case key itself, e.g. `fibre`
2. A line appears under the Name box reading `custom.fibre`, with an **edit / pencil**
   control at its right
3. Click it and change the namespace `custom` → **`hartwick`**; confirm the key
4. Then choose the Type

Typing the key as the Name means only the namespace needs changing. Type `Weight (gsm)`
and you have to correct both halves.

Also on that form: **Storefront API access** is already ON for product metafields (unlike
metaobjects, which default OFF — see rule 3). Leave it on. **Category assignments** —
leave empty; it would restrict the field to certain product categories.

**2. Metaobject *type* must match exactly.**
When you create a metaobject definition you type a **Name** ("Process Step") and Shopify
generates a **type** (`process_step`). The theme reads the *type*. Check it, and correct
it if the generated value differs from this sheet. `master`, not `masters`.

**3. Storefront access is OFF by default for metaobjects.**
A metaobject definition ships with storefront access set to `none`. Liquid then reads
nothing — the admin looks perfect and the page stays on placeholders. On each metaobject
definition find **Storefronts API access** and turn it on.
`sections/ha-masters-index.liquid` reads `shop.metaobjects.master.values` and returns
nothing at all without this.

**4. One vs List is not a style choice.**
A "One" field holds a single value; a "List" field holds an ordered set. The theme reads
them with different Liquid, so getting it wrong breaks the field. There are exactly
**10 List fields in this entire build** — 4 in metaobjects, 6 in metafields. Every other
field is One. They are called out in the tables and summarised at the end of Stage 4.

**5. Every File field must be limited to Images.**
`snippets/ha-figure.liquid` renders through `image_url` / `image_tag`, which handle
**images only**. A video or PDF in one of these fields renders nothing at all, with no
error. When you add a File field, open its **Validation** tab and change
**Accepted file types** from the default "Any file type" to **Images**.
There are 7 File fields, all in metaobjects, and all of them are Images.

### Why the order matters

A reference field can only point at a definition that already exists. `master` has a
`region` field pointing at `origin`, so `origin` must be built first. The order in
Stage 1 is the dependency order — follow it and you will never hit a missing target.

```
origin  →  technique  →  dye  →  process_step  →  style  →  master  →  lot  →  release
```

---

## Stage 1 — Create the 8 metaobject definitions

`Settings → Custom data → Metaobjects → Add definition`

Do not create a `handle` field — every metaobject entry gets a handle automatically.

### How the form actually works

- **Name (top of the page)** sets the definition's **Type**, shown just beneath it.
  The type is what the theme reads. Check it matches this sheet.
- **Each field has one Name box**, not a separate name and key. Shopify derives the key
  from what you type and shows it as `Key: …` when you expand the field. Typing the
  snake_case key directly (`landscape_image`) is the safest approach — what you type
  becomes the key. Confirm it on the expanded field either way.
- **The One / List dropdown** sits between the name box and the type. Default is One.
- **Validation** is a tab that appears when you expand a field. It is where you set
  Accepted file types on a File field, and the target definition on a Metaobject field.
- ⚠️ **Leave every field optional.** If a field is marked required you cannot save an
  entry that leaves it empty — and most fields here stay empty until Aloha sends content.
  At most mark the display field (e.g. `place`) required.

### Editing or deleting a definition after you save it

Shopify splits metaobjects across two screens with almost the same name:

| What you want | Where |
|---|---|
| Edit the **schema** — fields, types, validation | `Settings → Custom data → Metaobjects` → click the definition |
| Create/edit **entries** — the actual records | `Content → Metaobjects` |

Under **Content** you cannot change fields and there is no delete for the definition.
That is the usual cause of "I can't edit it".

**To delete a definition:** `Settings → Custom data` (labelled **Metafields and
metaobjects** on some admin versions) → click the definition under **Metaobjects** →
**Delete** → confirm. The Delete button is on the definition page itself. It is not
reachable from `Content → Metaobjects`.

**To edit fields:** open the same definition page and expand the field you want to change.

**Permanent once saved:** a field's **key** and **type**.
**Still editable:** the field's name, and all **validation** (accepted file types,
reference target, preset choices).

To change a key or type, expand the field and use the red **Delete field**, then re-add
it. To start over, delete the whole definition — while it has no entries this is free.

⚠️ Delete a definition **before** anything references it. Once `technique.origin` points
at `origin`, deleting `origin` breaks that reference too. Deleting a definition also
deletes every entry inside it.

### The Metaobject options panel — same settings on all 8

| Setting | Set to | Why |
|---|---|---|
| Storefronts API access | **ON** | Rule 3. Without it Liquid reads nothing. |
| Publish entries as web pages | **OFF** | Would give every entry a public, crawlable URL. Our `master` entries are unnamed placeholders — they must not be published. The theme links to a page URL + `#handle` anchor, not to metaobject routes. |
| Active-draft status | ON | Adds a Draft/Active switch per entry. ⚠️ Draft content is staged, not published — **set entries to Active** in Stage 2 or they will not render. Worth keeping on: unverified content can sit as Draft rather than going live as fact. |
| Translations | Ignore | Single-locale store. |
| Customer Account API access | OFF | Not customer-account data. |
| Display name | The definition's main text field | Cosmetic. Shopify usually picks correctly. |
| Fields used as filters | Skip, except on `style` | With ~54 `style` entries, add `category` to filter by Skirt/Shirt/etc. |

---

### 1.1 `origin` — place records

| Key | One / List | Type | Validation |
|---|---|---|---|
| `place` ◆ | One | Single line text | — |
| `region` | One | Single line text | — |
| `country` ◆ | One | Single line text | — |
| `landscape_image` ◆ | One | File | **Accepted file types → Images** |
| `why_here` ◆ | One | Rich text | — |
| `local_practice` ◆ | One | Rich text | — |

Display name: `place`.

### 1.2 `technique` — craft techniques

| Key | One / List | Type | Validation |
|---|---|---|---|
| `name` | One | Single line text | — |
| `description` | One | Rich text | — |
| `origin` | One | Metaobject | **Target definition → `origin`** |
| `image` | **List** | File | **Accepted file types → Images** |
| `unesco_listed` | One | True or false | — |

### 1.3 `dye` — natural / ayurvedic dyes

| Key | One / List | Type | Validation |
|---|---|---|---|
| `name` ◆ | One | Single line text | — |
| `source_plant` | One | Single line text | — |
| `swatch` | One | Color | — |
| `properties` | One | Rich text | — |
| `image` ◆ | One | File | **Accepted file types → Images** |

⚠️ `properties` carries health claims. Angela's written approval before anything goes in it.

### 1.4 `process_step` — Fibre → Finished Garment

| Key | One / List | Type | Validation |
|---|---|---|---|
| `order` | One | Integer | — |
| `label` ◆ | One | Single line text | — |
| `description` ◆ | One | Multi-line text | — |
| `image` | One | File | **Accepted file types → Images** |

Note: `sections/ha-process.liquid` renders the steps in the order they appear in the
product's `process_steps` list, not by the `order` field. Keep `order` for reference,
but arrange the list on the product.

### 1.5 `style` — permanent silhouette identity

| Key | One / List | Type | Validation |
|---|---|---|---|
| `number` | One | Single line text | Text, not Integer — keeps the leading zeros in `001` |
| `category` | One | Single line text | — |
| `display_name` ◆ | One | Single line text | — |
| `silhouette_description` | One | Multi-line text | — |
| `fit_notes` | One | Multi-line text | — |
| `is_core` | One | True or false | — |
| `legacy_name` | One | Single line text | — |

Display name: `display_name`. Add `category` under **Fields used as filters** — this
definition gets ~54 entries and filtering by Skirt / Shirt / Dupatta will save you time.
⚠️ `legacy_name` (Tribeca, Palma…) is internal SKU mapping. Nothing renders it.

### 1.6 `master` — The Masters

| Key | One / List | Type | Validation |
|---|---|---|---|
| `name` | One | Single line text | — |
| `role` ◆ | One | Single line text | — |
| `region` ◆ | One | Metaobject | **Target definition → `origin`** |
| `techniques` | **List** | Metaobject | **Target definition → `technique`** |
| `portrait` ◆ | One | File | **Accepted file types → Images** |
| `workshop_images` ◆ | **List** | File | **Accepted file types → Images** |
| `stories` | One | Rich text | Single field despite the plural name — rich text has no list type |

Display name: `role` (until real names exist).
⚠️ **Leave `name` empty.** No artisan name appears in any file you have — I checked every
PDF and the spreadsheet. Roles only until Aloha supplies real people.

### 1.7 `lot` — production batch

| Key | One / List | Type | Validation |
|---|---|---|---|
| `number_roman` ◆ | One | Single line text | — |
| `number_internal` | One | Single line text | — |
| `opened_on` | One | Date | — |
| `masters` | **List** | Metaobject | **Target definition → `master`** |
| `story` | One | Rich text | — |
| `image` | One | File | **Accepted file types → Images** |

⚠️ `number_roman` holds **`I`**, not `1` and not `Lot I` — the theme prepends "Lot ".
`number_internal` is never displayed anywhere.

### 1.8 `release`

| Key | One / List | Type | Validation |
|---|---|---|---|
| `title` | One | Single line text | — |
| `lot` | One | Metaobject | **Target definition → `lot`** |
| `ship_date` | One | Date | — |
| `opens_at` | One | Date and time | — |
| `closes_at` | One | Date and time | — |
| `dispatch_article` | One | Blog post `[article_reference]` | — |
| `status` | One | Single line text | **Limit to preset choices:** Announced, Reserve, Public, Sold Out, Archived |

Nothing reads `release` yet. It exists so Reserve (Phase 2, 50% deposit) drops in without
a migration — an approved architecture decision, so build it now.

---

## Stage 2 — Create the entries

Definitions are empty containers. **Entries** are the records that go in them.

`Content → Metaobjects → [definition] → Add entry`
(you can also reach Add entry from the definition page under Settings)

### How the entry form works

- **Status: set every entry to Active.** Draft entries are staged, not published — the
  theme will not see them. This is the single most common reason a correctly-built
  definition renders nothing.
- **The handle is generated** from the display-name field (`West Bengal` → `west-bengal`).
  You can edit it, but there is no reason to. `sections/ha-masters-index.liquid` uses
  `master.handle` for its anchor links, so leave them tidy.
- **Empty fields are expected.** Nothing here is required, and most content has not been
  approved yet. An empty field is the correct state, not an unfinished one.
- **Reference fields show a picker** listing entries from the target definition. If the
  picker is empty, you have not created those entries yet — check the order below.

### Order to create them

Entries reference other entries, so the same dependency rule applies:

```
origin  →  technique  →  process_step  →  style  →  master  →  lot
```

`master.region` points at an `origin` entry and `master.techniques` at `technique`
entries, so both must exist before you build the Masters.

---

### 2.1 `origin` — 3 entries

The only three places any supplied file states as fact. Everything else on these records
is unwritten.

| `place` | `region` | `country` | `landscape_image` | `why_here` | `local_practice` |
|---|---|---|---|---|---|
| West Bengal | *(empty)* | India | *(empty)* | *(empty)* | *(empty)* |
| Jaipur | Rajasthan | India | *(empty)* | *(empty)* | *(empty)* |
| Rajasthan | *(empty)* | India | *(empty)* | *(empty)* | *(empty)* |

Jaipur sitting in Rajasthan is plain geography, not brand content, so filling `region`
there is safe. `why_here` and `local_practice` are editorial and must come from Aloha.

⚠️ See the Origin-section warning in Stage 6 before you point a product at one of these.

### 2.2 `technique` — 5 entries

The five named in Framework v3, your top source of truth. Nothing reads this definition
yet, so these are groundwork for the Phase-2 Masters page.

| `name` | `unesco_listed` | `description` | `origin` | `image` |
|---|---|---|---|---|
| Khadi | false | *(empty)* | *(empty)* | *(empty)* |
| Ajrakh | false | *(empty)* | *(empty)* | *(empty)* |
| Ikat | false | *(empty)* | *(empty)* | *(empty)* |
| Jamdani | **true** | *(empty)* | *(empty)* | *(empty)* |
| Gota Patti | false | *(empty)* | *(empty)* | *(empty)* |

Jamdani is the only one Framework v3 marks UNESCO Intangible Cultural Heritage.

⚠️ `docs/data-model.md` also lists **Mashru**, **Banaras Brocade** and **Gota**.
"Gota" duplicates Gota Patti. Mashru and Banaras Brocade appear in the client's own
product descriptions but not in Framework v3's list. Ask Aloha rather than guessing —
they cost nothing to add later.

### 2.3 `process_step` — 8 entries

Labels from the mobile product brief §8. Descriptions are **not written** — the section's
own defaults carry none either, so leave them empty.

| `order` | `label` | `description` | `image` |
|---|---|---|---|
| 1 | Fibre | *(empty)* | *(empty)* |
| 2 | Spinning | *(empty)* | *(empty)* |
| 3 | Weaving | *(empty)* | *(empty)* |
| 4 | Dyeing | *(empty)* | *(empty)* |
| 5 | Cutting | *(empty)* | *(empty)* |
| 6 | Construction | *(empty)* | *(empty)* |
| 7 | Finishing | *(empty)* | *(empty)* |
| 8 | Wear | *(empty)* | *(empty)* |

`order` is reference only — `sections/ha-process.liquid` renders in the order the steps
appear in the product's `process_steps` list, so you will sequence them again in Stage 5.

⚠️ The desktop wireframe shows **7** steps (no Construction); the mobile brief and
`data-model.md` show **8**. Built to 8. Open question #2.

### 2.4 `style` — 54 entries

Mechanical transcription from the spreadsheet. Fill four fields per entry:
`number`, `category`, `display_name`, `legacy_name`.
Leave `silhouette_description`, `fit_notes` and `is_core` empty.

⚠️ **Leave `is_core` false on all of them for now.** Framework v3 names Skirt 001 and
Skirt 002 as Core Styles but says "for example" — it is not the full list, and `is_core`
drives pre-order availability. A partial list would make real Core Styles
non-preorderable. Ask Aloha for the complete set.

**You only need two entries to reach Stage 5: `Skirt 003` and `Shirt 003`.** Do those
first, verify the product page, then grind through the rest.

| `display_name` | `number` | `category` | `legacy_name` |
|---|---|---|---|
| Skirt 001 | 001 | Skirt | Tribeca Skirt |
| Skirt 002 | 002 | Skirt | Palma Skirt |
| **Skirt 003** | 003 | Skirt | Calcutta Skirt |
| Shirt 001 | 001 | Shirt | Amman Shirt |
| Shirt 002 | 002 | Shirt | Prague Shirt |
| **Shirt 003** | 003 | Shirt | Calcutta Blouse |
| Shirt 004 | 004 | Shirt | Hanoi Shirt |
| Shirt 005 | 005 | Shirt | Santa Fe Shirt |
| Shirt 006 | 006 | Shirt | Pine Shirt |
| Shirt 007 | 007 | Shirt | Magnolia Shirt |
| Shirt 008 | 008 | Shirt | Jodhpur Blouse |
| Shirt 009 | 009 | Shirt | Tokyo Blouse |
| Shirt 011 | 011 | Shirt | Monaco Shirt |
| Trouser 001 | 001 | Trouser | Bombay Trousers |
| Trouser 002 | 002 | Trouser | Lucca Trousers |
| Trouser 003 | 003 | Trouser | Paris Trousers |
| Trouser 004 | 004 | Trouser | Seoul Trousers |
| Trouser 007 | 007 | Trouser | Cedar Trousers |
| Coat 001 | 001 | Coat | Marylebone Coat |
| Dress 001 | 001 | Dress | Samarkant Dress |
| Dress 002 | 002 | Dress | Jasmine Dress |
| Robe 001 | 001 | Robe | Okanagan Long Robe |
| Robe 002 | 002 | Robe | Okanagan Short Robe |
| Kaftan 001 | 001 | Kaftan | Marrakesh Kaftan |
| Shorts 006 | 006 | Shorts | Blossom Shorts |
| PJ 001 | 001 | PJ | Cyprus Pyjama Set |
| Scarf 001 | 001 | Scarf | Jaipur Scarf |
| Belt 001 | 001 | Belt | Venice Belt |
| Tote 001 | 001 | Tote | Sitges Tote |
| Pouch 001 | 001 | Pouch | Camden Pouch |
| Dupatta 01 | 01 | Fine Silk | Dupatta 01 |
| Dupatta 02 | 02 | Fine Silk | Dupatta 02 |
| Classic Stole 01 | 01 | Fine Silk | Classic Stole 01 |
| Classic Stole 02 | 02 | Fine Silk | Classic Stole 02 |
| Shayla 01 | 01 | Fine Silk | Shayla 01 |
| Shayla 02 | 02 | Fine Silk | Shayla 02 |
| Shayla 03 | 03 | Fine Silk | Shayla 03 |
| Shayla 04 | 04 | Fine Silk | Shayla 04 |
| Large Square 01 | 01 | Fine Silk | Large Square 01 |
| Large Square 02 | 02 | Fine Silk | Large Square 02 |
| Large Square 03 | 03 | Fine Silk | Large Square 03 |
| Large Square 04 | 04 | Fine Silk | Large Square 04 |
| Medium Square 01 | 01 | Fine Silk | Medium Square 01 |
| Medium Square 02 | 02 | Fine Silk | Medium Square 02 |
| Medium Square 03 | 03 | Fine Silk | Medium Square 03 |
| Petit Square 01 | 01 | Fine Silk | Petit Square 01 |
| Petit Square 02 | 02 | Fine Silk | Petit Square 02 |
| Petit Square 03 | 03 | Fine Silk | Petit Square 03 |
| Rich Ribbon 01 | 01 | Fine Silk | Rich Ribbon 01 |
| Rich Ribbon 02 | 02 | Fine Silk | Rich Ribbon 02 |
| Rich Ribbon 03 | 03 | Fine Silk | Rich Ribbon 03 |
| Rich Ribbon 04 | 04 | Fine Silk | Rich Ribbon 04 |
| Khadi Edition | - | Yoga Mat | Khadi — Sand / Rose / Sky Blue / Evergreen |
| Ayurvedic Edition | - | Yoga Mat | Ayurvedic — Indigo / Marigold / Turmeric |

Notes on the awkward ones:

- **Fine Silks** have no separate style number in the sheet — `Style` and `Old Name` are
  identical, so `legacy_name` just repeats. Fill it anyway for consistency.
- **Yoga Mats** have `Style Number` = `-`. Two Styles carry seven Expressions between
  them; the colour lives in the Expression, not the Style.
- **`number` is text, not integer** — it must keep the leading zeros in `001`.

### 2.5 `master` — 5 entries

| `role` | `name` | `region` | `techniques` | `portrait` | `workshop_images` | `stories` |
|---|---|---|---|---|---|---|
| Master Weaver | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* |
| Khadi Spinner | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* |
| Natural Indigo Master | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* |
| Pattern Cutter | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* |
| Hand Finisher | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* |

⚠️ **`name` stays empty on all five.** No artisan name appears in any supplied file —
every PDF and the spreadsheet were checked. `region` also stays empty: which Master works
where is not recorded anywhere, and West Bengal / Jaipur / Rajasthan are fabric origins,
not stated Master locations. Do not infer one from the other.

Role is the display name, so entries will list by role and the auto handles come out as
`master-weaver`, `khadi-spinner`, and so on.

⚠️ Wireframe shows 5 roles; brief §7 records that Angela wants 3 initially. Built with 5
and a limit setting. Open question #3.

### 2.6 `lot` — 1 entry, once Aloha confirms

| `number_roman` | `number_internal` | `opened_on` | `masters` | `stories` | `image` |
|---|---|---|---|---|---|
| I | *(empty)* | *(empty)* | *(empty)* | *(empty)* | *(empty)* |

`number_roman` holds **`I`** — not `1`, not `Lot I`. The theme prepends "Lot ".
Do not create this until Aloha confirms Lot I is what launches on 10 September.

### Do not create yet

**`dye`** — `properties` carries health claims needing Angela's written approval, and no
product has a verified dye. **`release`** — needs dates and a status from Aloha.

---

## Stage 3 — Product metafield definitions

`Settings → Custom data → Products → Add definition`

Remember rule 1: click the pencil beside the auto-generated key and set the namespace to
`hartwick`.

No File fields here — every image in this build lives on a metaobject.

### The 30 the theme reads today

**Identity** — `snippets/ha-pdp-identity.liquid`

| Key | One / List | Type | Validation |
|---|---|---|---|
| `style` ◆ | One | Metaobject | **Target → `style`** |
| `expression` ◆ | One | Single line text | — |
| `lot` ◆ | One | Metaobject | **Target → `lot`** |
| `edition_size` ◆ | One | Integer | — |
| `edition_number` ◆ | One | Integer | — |

**Three added 3 September 2026**, after Aloha's letter removing scarcity
language. Two of them are gates: they exist so a number cannot reach the page
until someone has confirmed it.

| Key | One / List | Type | Validation |
|---|---|---|---|
| `individually_numbered` ◆ | One | True/false | Tick ONLY where each garment carries its own number. `Edition 07 / 25` renders nowhere unless this is true **and** `edition_number` is set. |
| `production_quantity` ◆ | One | Integer | The run size, as a count of pieces. |
| `production_quantity_verified` ◆ | One | True/false | Tick once the number has actually been checked. Until then the Material Record shows no quantity at all — an unverified figure reads to a customer as a verified one. |

**Material Record** — `snippets/ha-material-record.liquid`

| Key | One / List | Type | Validation |
|---|---|---|---|
| `fibre` ◆ | One | Single line text | — |
| `yarn` ◆ | One | Single line text | — |
| `weave` ◆ | One | Single line text | — |
| `weight_gsm` ◆ | One | Integer | — |
| `colour_name` ◆ | One | Single line text | — |
| `dye` ◆ | One | Metaobject | **Target → `dye`** |
| `place_of_weaving` ◆ | One | Metaobject | **Target → `origin`** |
| `place_of_dyeing` ◆ | One | Metaobject | **Target → `origin`** |
| `place_of_construction` ◆ | One | Metaobject | **Target → `origin`** |
| `finishing` ◆ | One | Single line text | — |
| `availability_note` ◆ | One | Single line text | — |

**The Garment** — `sections/ha-garment.liquid`

| Key | One / List | Type | Validation |
|---|---|---|---|
| `garment_heading` ◆ | One | Single line text | — |
| `garment_intro` ◆ | One | Rich text | — |
| `silhouette` ◆ | One | Single line text | — |
| `fit` ◆ | One | Single line text | — |
| `movement` ◆ | One | Single line text | — |
| `garment_length` ◆ | One | Single line text | — |
| `model_height` ◆ | One | Single line text | — |
| `size_worn` ◆ | One | Single line text | — |
| `construction_details` ◆ | One | Rich text | — |

**Relationships**

| Key | One / List | Type | Validation |
|---|---|---|---|
| `masters` ◆ | **List** | Metaobject | **Target → `master`** |
| `process_steps` ◆ | **List** | Metaobject | **Target → `process_step`** |

### The 8 defined now, unused at launch

| Key | One / List | Type | Validation |
|---|---|---|---|
| `techniques` | **List** | Metaobject | **Target → `technique`** |
| `journal_articles` | **List** | Blog post `[article_reference]` | — |
| `care_instructions` | One | Rich text | — |
| `ageing_patina` | One | Rich text | — |
| `repairs` | One | Rich text | — |
| `release` | One | Metaobject | **Target → `release`** |
| `reserve_eligible` | One | True or false | — |
| `deposit_percent` | One | Integer | — |

⚠️ **Known divergence, needs a decision.** `docs/data-model.md` specifies
`care_instructions` / `ageing_patina` / `repairs` as metafields, but Care & Ageing
shipped as Luxe's native `collapsible-content` with the copy held in the section. So
these three definitions will exist and render nowhere. Either accept that (cheap,
future-proof) or rewire the section to read them. Worth raising with Aloha rather than
leaving as a silent gap.

### Do not create — Luxe already has these

`custom.cross_links` and `custom.color` already drive Style → Expressions with colour
swatches in the buy column. Reuse them. Do not build a parallel `hartwick` version.

---

## Stage 4 — Article and collection metafields

**`Settings → Custom data → Blog posts`**

| Key | One / List | Type | Validation |
|---|---|---|---|
| `category` ◆ | One | Single line text | **Limit to preset choices:** The Loom, The Colour, The Wearer |
| `standfirst` ◆ | One | Multi-line text | — |
| `dispatch_number` | One | Integer | — |
| `is_dispatch` | One | True or false | — |
| `related_products` | **List** | Product | — |
| `related_masters` | **List** | Metaobject | **Target → `master`** |

**`Settings → Custom data → Collections`**

| Key | One / List | Type | Validation |
|---|---|---|---|
| `lot` | One | Metaobject | **Target → `lot`** |
| `release` | One | Metaobject | **Target → `release`** |
| `index_intro` | One | Rich text | — |

### Every List field in the build — check these 10

If you set nothing else as a List, set these:

| Where | Key |
|---|---|
| `technique` metaobject | `image` |
| `master` metaobject | `techniques` |
| `master` metaobject | `workshop_images` |
| `lot` metaobject | `masters` |
| Product metafield | `masters` |
| Product metafield | `process_steps` |
| Product metafield | `techniques` |
| Product metafield | `journal_articles` |
| Blog post metafield | `related_products` |
| Blog post metafield | `related_masters` |

(Ten listed. Eight if you skip the Phase-2 fields.)

### Every File field in the build — all Images

`origin.landscape_image` · `technique.image` · `dye.image` · `process_step.image` ·
`master.portrait` · `master.workshop_images` · `lot.image`

All seven are in metaobjects. All seven must have **Accepted file types → Images**.

---

## Stage 5 — Bind the two sign-off products

### 5.1 Pick the products

Six of the 85 spreadsheet rows carry a verified origin. Use two of them:

| | Product A | Product B |
|---|---|---|
| Style | Skirt 003 | Shirt 003 |
| Title | `Skirt 003 . Handspun Cotton, White with Blue Border` | `Shirt 003 . Handspun Cotton, White with Blue Border` |
| SKU | `AP-SKI-003-HWC-WH-BB` | `AP-SHI-003-HWC-WH-BB` |
| Legacy name | Calcutta Skirt | Calcutta Blouse |

They are a matched set from the same "Calcutta" group, both verified to West Bengal, and
their descriptions name the craft in the client's own words.

**These may or may not already exist in your store** — I have never seen the product
list. Search Products for `Calcutta`, then for `Skirt 003`.

- **If a matching product exists**, use it. Rename the Title to the Full Name above.
- **If not**, `Products → Add product`. Title, Description and SKU from the table in 5.3.
  Leave price and inventory alone — neither is confirmed (open question #6).
- **Template doesn't matter.** `product.json` and all four suffix templates
  (`celestial` / `liminal` / `terrene` / `upaya`) were rebuilt to the same wireframe
  layout, so any product renders it. Only `product.no-pricing` differs.

### 5.2 Where the metafields are

Open the product and **scroll to the very bottom**. Metafields sit below Search-engine
listing, in a card headed **Metafields** with a "Show all" link.

They only appear once the Stage 3 definitions exist. If the card is missing or empty,
your definitions were not created against the **Products** owner type.

### 5.3 Fill these — real, sourced data

Same for both products except where the table splits.

| Field | Product A (Skirt 003) | Product B (Shirt 003) |
|---|---|---|
| **Title** | `Skirt 003 . Handspun Cotton, White with Blue Border` | `Shirt 003 . Handspun Cotton, White with Blue Border` |
| **Description** | Fully pleated mid-length skirt from the Calcutta set, with matching sari-style blouse. Handspun fine cotton, handwoven blue border woven by master weavers in West Bengal. | Sari-style blouse matching the Calcutta skirt set. Handspun fine cotton, handwoven blue border woven by master weavers in West Bengal. |
| **Variant SKU** | `AP-SKI-003-HWC-WH-BB` | `AP-SHI-003-HWC-WH-BB` |
| `hartwick.style` | pick `Skirt 003` | pick `Shirt 003` |
| `hartwick.expression` | `Handspun Cotton, White with Blue Border` | `Handspun Cotton, White with Blue Border` |
| `hartwick.place_of_weaving` | pick `West Bengal` | pick `West Bengal` |
| `hartwick.masters` | pick all 5 master entries | same |
| `hartwick.process_steps` | pick all 8, **in order** Fibre → Wear | same |

⚠️ **`process_steps` order is set here, not on the metaobject.**
`sections/ha-process.liquid` renders the list in the order you arrange it on the product
— the `order` field on the entries is reference only. Drag them into sequence.

### 5.4 Leave these empty — deliberately

| Field | Why |
|---|---|
| `fibre` `yarn` `weave` `weight_gsm` `colour_name` | No verified fabric spec. The Expression string hints at fibre but inferring a spec from a marketing phrase is invention. |
| `dye` `place_of_dyeing` `place_of_construction` | Unverified. Only *weaving* is sourced to West Bengal. |
| `finishing` `availability_note` | Not written. |
| `edition_number` `edition_size` | Run sizes vary by technique; nothing structured exists. |
| every Garment field | No approved copy for silhouette, fit, movement, model height, size worn. |
| `lot` | Lot I unconfirmed. |

**Empty is the correct outcome, not an unfinished one.** Every section collapses a missing
field with no orphaned label (mobile brief §5), and shows marked wireframe copy where a
whole block has no data. That is the honest state until Chanchal's verification lands.

### 5.5 Optional — the Expressions relationship

Each of these Styles has a second Expression in the spreadsheet (Red-Brick Pinstripe). If
you build those too, set Luxe's existing **`custom.cross_links`** on each product to point
at its sibling. That is what renders Style → Expressions in the buy column. Do not build a
`hartwick` equivalent — the Luxe field already does it.

---

## Stage 6 — Verify

### 6.0 Test the homepage first — no products needed

The fastest check of Stage 1 and 2, before you touch a single product.

`templates/index.json` runs `ha-masters-index` with **no `source` setting**, so it reads
`shop.metaobjects.master.values` — every `master` entry in the store, automatically.

1. `Online Store → Themes → Hartwik - Dev → ⋯ → Preview`
2. Scroll to the dark Masters section.

| What you see | Meaning |
|---|---|
| **5 roles**, no placeholder note | ✅ Working. Metaobject data is live. |
| **9 roles** ending Dye House, Jewellery Artisan, Textile Researcher | ❌ Still the section's built-in placeholders — the theme cannot see your entries |
| **5 blank rows** | ❌ Entries found but `role` key is wrong |

Nine roles means one of: Storefronts API access off, entries left as Draft, or the type is
not exactly `master`. Fix that before going further — nothing else will work either.

### 6.1 Then the product page

Preview the dev theme and open the product. The page runs ten sections in this order:

```
main-product · ha-garment · ha-product-record · ha-origin · ha-masters-index
ha-process · collapsible-content · ha-journal · related-products · ha-register
```

With exactly the data from 5.3, here is what **correct** looks like:

| # | Section | Expected |
|---|---|---|
| 1 | Buy column identity | **`Skirt 003`** as the h1 — short, not the full product title. Expression beneath it. Eyebrow still reads placeholder `Lot I · Edition 07 / 25`, and the placeholder note is **still shown** — correct, because Lot is unbound. |
| 2 | The Garment | All wireframe copy, marked placeholder. Correct — nothing is bound. |
| 3 | Material Record | Title `Skirt 003`, intro = the Expression, and **`Woven in — West Bengal`** as real data. The other 11 rows keep marked placeholder values. |
| 4 | The Origin | Place line **`West Bengal, India`**. ⚠️ See 6.2. |
| 5 | Meet the Masters | Your 5 roles, **placeholder note gone**. Note still showing = `hartwick.masters` is unset or empty. |
| 6 | Fibre → Garment | 8 steps with labels, in your order, note gone. Numbers with blank labels = wrong `label` key. |
| 7–10 | Care, Journal, Related, Register | Unchanged — none read `hartwick.*` product data. |

**The two signals that prove the whole chain works** are the h1 reading `Skirt 003`
(product metafield → `style` metaobject → `display_name`) and `Woven in — West Bengal`
(product metafield → `origin` metaobject → `place`). Both traverse a reference. If those
two land, your model is correct.

### 6.2 ⚠️ Known bug — The Origin section

Not your data. Mine.

`sections/ha-origin.liquid` decides whether to show its placeholder warning from whether
an `origin` metaobject is bound *at all*, not from whether the displayed text came from it:

```liquid
assign body = origin.why_here | default: section.settings.intro
assign has_real_data = false
if origin != blank
  assign has_real_data = true
```

Your West Bengal entry has an empty `why_here`, so the body falls back to **wireframe
copy** while `has_real_data` flips true and **removes the placeholder warning**. You get
unapproved prose beside a real place name, unmarked — the one thing CLAUDE.md prohibits.

`ha-masters-index` and `ha-process` share the shape: entries existing flips them to the
real path even if every field is empty, giving blank rows with no warning.

Expect it in 6.1 row 4. It is a code fix, not a data fix.

### 6.3 Troubleshooting

| Symptom | Cause |
|---|---|
| Everything still placeholder | Storefronts API access off, or entries left Draft |
| One section placeholder, others fine | That section's product metafield is unset |
| A list shows only one item | Field created as One instead of List |
| Rows appear but blank | Metaobject field key typo — entries found, field not |
| h1 shows the full title, not `Skirt 003` | `hartwick.style` unset, or `style` namespace is `custom` |
| `Woven in` still placeholder | `place_of_weaving` unset, or `origin.place` key wrong |
| Metafields card missing on the product | Definitions created against the wrong owner type |
| Image slot empty with a file attached | Not an image — rule 5 |

### 6.4 Homepage regression

`ha-masters-index` and `ha-material-record` are shared with the homepage. After binding
products, re-check the homepage: Masters still listing, Featured Lot record intact,
collection index rows unchanged. Product data must not alter the homepage.

---

## What to ask Aloha before this can be finished

Blocking the Material Record entirely:

1. **Chanchal's verification** — 79 of 85 rows have no verified fabric/technique origin.
   Until then `fibre`, `weave`, `weight_gsm`, dye and the two other places cannot be
   filled as fact on any product.
2. **Master names** — no artisan name exists in any supplied file. Roles only.
3. **Lot** — which Lot is live, its Roman numeral, opened date.
4. **Edition sizes** — Framework v3 says runs vary (25, 2, 6) by technique and capacity.
   Some spreadsheet descriptions embed "Limited Edition /2" as prose; nothing structured.
5. **Dye properties** — health claims need Angela's written approval.

Already-open questions this stage depends on:

6. **Product titles** (open q4) — built as `Skirt 003` / Expression beneath. If wrong,
   `style` and `expression` are populated wrong across all 85.
7. **Masters: 3 or 5** (open q3). **Process steps: 7 or 8** (open q2).
8. **Care fields** — the divergence flagged in Stage 3.
