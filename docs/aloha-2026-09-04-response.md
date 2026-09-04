# Response to Aloha — 4 September 2026

What is built, what is waiting on someone with Shopify Admin access, and the two
places where an instruction collides with something already agreed.

Everything below is on the **unpublished development theme**. Nothing is public.

---

## 1. The Masters Index — the photograph  ✅ built

> "the full-width photograph is an important part of the section's structure.
> The text sits over the image rather than appearing on a plain colour block."

| Asked | Built |
|---|---|
| Temporary full-width workshop / process / Master photograph | `001_ATELIER_7_89-Theme_Film.jpg`, already in the store's own Files — nothing sourced from outside |
| Keep the three-column structure | Untouched. The photograph is a new layer *behind* the existing grid; not one line of the column geometry changed |
| Restrained dark overlay | A peat wash, not black — black greys a photograph, the brand's own dark tint keeps its warmth. A 0–90% slider, default 60% |
| Every piece of text live | All of it. Nothing is baked into the image; the roles, intro and link are the same selectable, translatable, screen-readable text they were |
| Background editable in Shopify | Image picker, in the section's own settings |
| Separate desktop and mobile crops **or** focal-point controls | Both. Two pickers (mobile falls back to desktop), and focus follows the focal point you drag on the file itself in Shopify's picker, with per-breakpoint overrides |
| Reserved at a fixed proportion, no layout movement | Two ways at once: the image is positioned out of the document flow so it *cannot* move anything as it loads, and the section separately reserves its proportion (16:9 desktop, 4:5 mobile, both selectable) so the shape is right from the first paint |

**The right-hand link** now reads **"Meet the Masters"** and points at the Masters
page. The piece count became opt-in — a count answers a question about the shop,
not about the people.

**One thing to look at when you review it.** A very pale photograph under a 60%
overlay leaves the text at roughly 4.9:1 contrast — it passes, but only just.
If the approved picture is light, push the overlay slider up. It is one drag.

### Changing the photograph on hover — yes, it is straightforward

Roughly an hour: each Master gets its own image field, and the background
cross-fades on hover and on keyboard focus. Two caveats worth knowing before you
decide: there is no hover on a phone, so mobile needs the static image anyway;
and it means loading several full-width photographs instead of one, which is a
real cost on a slow connection. Say the word and it goes in — I have left the
markup shaped so it does not need restructuring.

### Is this separate from the Material Record? — Yes. Your understanding is right.

They share nothing but a page.

- **The Material Record** (`ha-product-record`) is the structured specification —
  fibre, yarn, weave, weight, dye, where it was woven, where it was dyed, the
  Lot. It reads `hartwick.*` metafields and renders a table. It has no Masters
  in it.
- **The Masters** (`ha-masters-index`) is the human section, with its own
  photograph and its own `master` metaobjects. It is one component with two
  compositions — the index on the homepage, the feature on a product page — so
  the wording, the data path and the accessibility behaviour are written once.

Changing one cannot affect the other.

---

## 2. Product page — the information panel  ✅ built

> "the left column with the garment details scrolls away after the images"

Fixed, and worth explaining why it was happening, because it was not simply
"sticky is off".

A sticky panel only travels while there is room below it inside its container.
The left rail's content — name, cloth, description, key facts, fit, three
accordion rows — is taller than most laptop screens, so its own height ate the
entire travel. It pinned once, with its lower half sitting off-screen where you
could not read or reach it, then left with the page as soon as the image rail
ran out. That is exactly the behaviour you described.

The panel is now capped to the height of the screen, which is what makes it
behave like the fixed panel you asked for: always fully readable, always exactly
one screen tall, and pinned for the whole length of the image rail. Long records
scroll gently inside the panel rather than disappearing off the bottom of it.

**Where I stopped, and why.** You asked for it to stay visible "while the user
scrolls through the images **and the rest of the page**". Through the images:
done. Through the rest of the page: I have not done, because the sections below
the hero — The Garment, the Material Record, The Origin, The Masters, The
Register — are full-width bands by design, and a panel that stayed fixed over
them would have to reserve a permanent column, which would narrow every one of
those compositions for the whole length of the page. That is a design decision
rather than a technical limit, and it is yours to make. If you want it, say so
and I will show you what those sections look like with the column taken out.

---

## 3. Product page — image sizes  ✅ built

> "the images feel oversized for the space, which makes them dominate the layout"

Three changes:

- **One ceiling for every large picture**, set as a share of screen height rather
  than in pixels, so the restraint holds on a 13-inch laptop and on a 27-inch
  monitor. Default 56% — no photograph can take much more than half the screen.
  It is a single slider in Theme settings, because you are re-editing the
  pictures after Monday and will want to retune once the real crops land.
- **The product media column narrows** from 1.8 to 1.5 of the three-column split.
  On a wide monitor a single garment photograph was running past 700px across.
  This also gives both information rails more room, which is the other half of
  what you asked for.
- **Two sections that were deliberately exempt** from every earlier ceiling — the
  Material Record, whose picture was tied to the height of the record table
  beside it, and Authorship, which had a 600px floor — are now under it. The
  Material Record's photograph sits at the top of its column with the record
  continuing beneath, which is the proportion Handcrafted Modern actually uses.

---

## 4. Text sizes, against Bode  ✅ built — with one number you should see

I measured their page rather than eyeballing it.

**Bode set essentially their entire product page at 12px.** Product name, price,
description, sizes, Add to bag, navigation — 52 of the 61 visible pieces of text
on that page are 12px. The largest text anywhere on it is 16px. Their `<h1>` is
hidden from sight entirely. Their hierarchy is carried by weight and position,
not by size.

**But matching that number would not match what you see**, and this is the part
worth knowing. Measured from the actual font files:

| Face | Where | x-height |
|---|---|---|
| Neue Haas Unica | Bode's whole site | **0.508 em** |
| Junicode | our editorial and body voice | **0.415 em** |
| Noto Sans Mono Condensed | our labels and technical voice | 0.536 em |

Junicode is an old-style serif and sits about a fifth smaller than Unica at the
same nominal size. **12px of Junicode reads visibly smaller than 12px of Bode.**
So the new defaults match Bode's *apparent* size instead:

- body copy **15px** (= Bode's 12px, to the eye)
- labels and technical text **12px** — our mono voice matches Bode at their own
  number, because it is already a sans of similar proportion
- product name 48px → **26px**, editorial headings 52px → **32px**

Luxe's own native heading and body sizes came down with them, so the pages the
theme still renders itself — collection, cart, account — match rather than
drifting large.

**The one thing I did not do.** You wrote "I want all the text on the website to
have the same size text as Bode's." Read literally that means 12px everywhere,
including headings — which would not shrink Hartwick's editorial voice so much as
delete it, since the brand book's display typography would cease to exist as a
distinct thing. I have cut hard but stopped short of that, and made every slider
reach 12px so the decision stays yours and needs no developer. If you want the
literal version, two drags in Theme settings → Hartwick — Material Archive →
Type scale does it, and I can do it in five minutes.

---

## 5. The Circle  ⚠️ built, and it needs a decision above my head

### Please read this part

`CLAUDE.md` records Christina's **Framework v3**, which is the top of the agreed
source-of-truth hierarchy — above your emails, by the arrangement we set up. It
says of The Circle:

> Invitation-only group of founding friends. **No public form. No application
> route.**

A public page at `/the-circle` carrying an access-request form is the opposite of
that. I have built it, because you asked in writing and because it is on an
unpublished theme where nothing is visible to anyone. But I cannot resolve the
conflict, and I do not think it should go live until Christina has confirmed the
change — otherwise the site says something the brand framework says it must not.

It is built to be reversed in one click. A checkbox, **"Show the access form"**,
removes the application route and leaves the page, its wording and its layout
completely intact. Nothing else on the site depends on it.

### What is built

The page, at `templates/page.the-circle.json`, following the structure in your
design: hero, "What the Circle holds", Gatherings, "How it works", "From the
atelier", the request form, the FAQ, and The Register band at the foot. Two new
reusable sections; everything else is components you have already approved.

**All body copy is a marked placeholder.** The headings are transcribed from your
own design. Not one sentence describing what The Circle offers, how someone is
considered, or what a member receives has been written by me — that rule holds
even when it leaves the page looking unfinished. Every section shows its
provisional notice on screen.

### Keeping The Circle and The Register separate — done, and here is the mechanism

Both forms create a real customer record rather than an email someone has to
re-key. The tag is what holds them apart in a single customer list:

| Form | Tag written |
|---|---|
| The Register | `the-register` |
| The Circle | `Circle: Requested Access` |

Joining The Register never writes the Circle tag, so it can never confer Circle
access. Someone requesting Circle access **is** added to the Register, as you
asked, and carries the extra tag that records the request. Nothing in the theme
*grants* anything — the tag says access was requested, and a person decides.
Deliberately not automatic.

Ticked interests are added as their own tags (`Circle interest: Gatherings`, and
so on) so they arrive as CRM segments rather than as prose. The list of possible
tags is fixed by the section's settings, so no visitor can invent one and litter
the customer list.

### Two things you need to know about the form

**City and the free-text note are switched off.** Shopify's storefront customer
form accepts an email address, a first name, a last name and tags — and nothing
else. A city and a personal note *cannot* be stored on the customer record by any
theme-only code. Rather than ask someone for information the store would silently
throw away, those two fields are off by default. They turn on the moment Klaviyo
is carrying this form, which is already on the list. Your call — say the word and
they go on with the caveat, or stay off until Klaviyo lands.

**The consent wording is a placeholder** and is a legal matter, not a design one.
It needs Christina before this page is published.

### Three things a theme cannot do — these need Shopify Admin

1. **Create the page.** Content → Pages → Add page, titled "The Circle", handle
   `the-circle`, and set its Theme template to `the-circle`. Until that exists,
   the template I have written is inert.
2. **The address.** Shopify serves pages at `/pages/<handle>` and has no
   root-level pages at all. `/the-circle` needs a URL redirect (Content → Menus →
   URL redirects) pointing `/the-circle` → `/pages/the-circle`. That redirect is
   the only way to give you the address you asked for.
3. **The navigation.** Menus live in Content → Menus, not in the theme. "The
   Circle" has to be added to the main menu there.

Gareth holds access. Ten minutes' work; I can talk whoever has the login through
it, or do it myself if I am given access.

---

## 6. Order confirmation and shipping emails  ⏸ not started — deferred on your note

> "If necessary, we can prioritise getting the essential transactional
> functionality working correctly first and refine the visual treatment
> afterwards."

Taking you at your word, so it is not started. Three things to know when we do
pick it up:

- **They are not in the theme.** Shopify's transactional notifications live in
  Settings → Notifications in Admin, as their own templates. They cannot be
  reached from this repository, so this needs Admin access whoever does it.
- **They cannot use Porter or Junicode.** Email clients do not load webfonts
  reliably — Outlook and Gmail's app will both ignore them. The email identity
  has to be built from colour, spacing, the logo image and a carefully chosen
  system-font stack rather than from the typefaces. That is a design
  conversation, not just a build one, and worth having before anyone starts.
- **Roughly 3–4 hours** for order confirmation, shipping confirmation and
  shipping update as a set, once the above is settled.

---

## 7. Assets and metaobjects  ✅ already how it works

The structure does not wait on content. Every section renders from metafields and
metaobjects the moment they exist, and shows a clearly marked placeholder until
then. Nothing is hard-coded, so populating the real content later is data entry,
not development.

---

## Still open, needing you or Christina

1. **The Circle conflict** — Christina to confirm Framework v3 is being changed
   before this page goes anywhere near live.
2. **The Circle consent wording** — legal, needs Christina.
3. **Porter's webfont licence** (risk R1) — still unresolved with the foundry.
   Ivan instructed serving it; it remains a live exposure until the licence is in
   hand.
4. **Literal Bode type sizes** — do you want headings at 12px too, or is the
   current cut right?
5. **The panel across the whole product page** — worth seeing what it costs the
   full-width sections before deciding?
6. **Hover-swap on the Masters photograph** — offered, not built.
7. **Admin access** for the page, the redirect and the menu item.
