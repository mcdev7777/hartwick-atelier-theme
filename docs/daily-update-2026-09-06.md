# Daily update to Aloha — Day 4, Saturday 6 September 2026

Filled from `daily-update-template.md`. Hours are the only field left blank —
fill them before sending. Everything else is factual and checked.

**Subject:** Hartwick — Daily update, Sat 06 Sep

---

Aloha,

Covering today: your notes on the Masters Index, the product page and The Circle,
all worked through, plus the two follow-ups from your review this afternoon.

**Completed**

- **The Masters Index sits on a photograph.** Full-width, behind the live text,
  three-column structure untouched. Separate desktop and mobile crops, focus
  follows the point you drag on the file itself in Shopify, and a dark-overlay
  slider so you can tune readability against whichever picture is approved.
  Nothing can shift while it loads. The right-hand link now reads **Meet the
  Masters**.
- **The product page's information panel stays put** while you scroll the images,
  and the pictures are pulled back so they support the page rather than take it
  over. One slider controls the ceiling for every large image, so you can retune
  the whole page once your final crops land after Angela.
- **Text sizes retuned against Bode.** I measured their page rather than guessing:
  they set almost everything at 12px. Detail under *Decisions*, because the
  literal answer needs your call.
- **Click-to-zoom on the product images**, with arrow keys, Escape and a second
  click to magnify.
- **The Circle exists as a page** — hero, what it holds, Gatherings, how it
  works, atelier notes, the access form, the FAQ and The Register — with your
  design's copy in place and every image now a real photograph from the store.
- **The Material Record and Made by Masters now match your revised PDF**, measured
  off the file at 150dpi rather than eyeballed: the record's picture was taking
  62% of the band where your design gives it 47%, which was the whole of "the
  image is too big".

Nothing is published. The live theme has not been touched, and the storefront
password is still up, so none of this is public.

**In progress**

The Circle page still opens blank at its plain address because its template
cannot be attached to the page yet — a Shopify limitation, not a build problem
(see *Decisions*, item 1). Everything else on that page is finished and testable
through the preview link. Next on the bench is your FAQ copy and a proof-read of
the Circle text.

**Hours**

[__] used · [__] of 40 remaining. Today was heavier than a normal build day —
your three feedback rounds each touched layout that other sections share, so
several changes had to be re-measured across the whole page rather than made in
one place.

**Next priority**

Getting The Circle openable at `/the-circle` and reachable from the menu, because
until that is done you cannot review it the way a visitor would see it, and it is
the one page with an unresolved question sitting under it.

**Decisions I need**

1. **The Circle page cannot be finished without one of two choices.** Shopify only
   offers a page's template list from the *published* theme, and ours is
   deliberately unpublished. Either (a) I am given Admin access for two minutes to
   attach it directly through the API — my recommendation, nothing gets published
   — or (b) we briefly publish the development theme, attach it, and switch back.
   (b) works but makes the in-progress build the live theme for a minute, which I
   would rather avoid this close to launch.
2. **Bode's text sizes — how literal do you want this?** Bode set almost every
   word on their product page at 12px; their largest text anywhere is 16px and
   their product name is the same size as their body copy. I have matched what
   the *eye* sees rather than the number, because our Junicode is a serif with a
   much smaller x-height — 12px of Junicode reads about a fifth smaller than 12px
   of theirs. So body copy is 15px and labels are 12px. Headings are cut hard but
   not to 12px, because that would remove the editorial voice from the brand book
   rather than reduce it. Every slider reaches 12px, so if you want the literal
   version it is two drags and five minutes. **My recommendation: keep the current
   cut and look at it on screen before going further.**
3. **The Circle copy needs your eyes before it can be trusted.** I have taken the
   wording from your design file, but the body paragraphs were small in the image
   I was working from, so what is on the page is a careful reading and not a
   source of truth. If you can send the copy deck I will drop it in verbatim. The
   four FAQ answers are still marked as placeholders — your design draws those
   accordions closed, so that copy has never been visible to me.

**Scope / 10 September watch**

- **The Circle conflict** — Christina to confirm Framework v3 is being changed
  before this page goes anywhere near live. Framework v3 records The Circle as
  invitation-only with no public form and no application route; the page you have
  asked for is the opposite. Built, and built so one checkbox removes the
  application route without touching the page. *Open since 4 Sep.*
- **The Circle consent wording** — legal, needs Christina. *Open since 4 Sep.*
- **Porter's webfont licence** (risk R1) — still unresolved with the foundry. Ivan
  instructed serving it; it remains a live exposure until the licence is in hand.
  *Open since 3 Sep.*
- **Admin access** for the page template, the `/the-circle` redirect and the menu
  item. The menu item is now in place; the other two are not. *Open since 4 Sep.*
- **The panel across the whole product page** — worth seeing what it costs the
  full-width sections before deciding? *Open since 4 Sep.*
- **Hover-swap on the Masters photograph** — offered, not built. Roughly an hour,
  and it needs a static image for mobile anyway. *Open since 4 Sep.*
- **The page margin differs from your PDF** — your design sets the page edge at
  about 73px on a 1500px canvas; ours is 104px, raised deliberately in an earlier
  round because sections were running too close to the edge. The proportions
  *inside* each band match your file exactly. Changing it moves every section on
  every page, so I have left it. Say the word and it goes to your value site-wide.
  *New today.*
- **One product has no photographs of its own** (Bombay Trousers, Handwoven Neige
  Ikat) and falls back to a labelled frame. That is a content gap in the store,
  not a build one — flagging rather than hiding it behind a stand-in image. *New
  today.*
- **The Material Record's picture now crops** to sit level with the record beside
  it, so a landscape photograph loses its edges. If your final crops are landscape
  I can add the same focal-point control the Masters background has, about ten
  minutes. *New today.*

Ivan

---

## Notes for Ivan before sending — delete this section

- **Hours are the only blank.** I have not tracked them and will not invent them.
- **Two things I deliberately did not put in "Completed":** the internal
  re-measuring after each of your feedback rounds, and the regressions that came
  with it. They were caught and fixed the same day and never reached Aloha's
  review, so they belong in the hours line, not in her report.
- **Every open item is repeated verbatim from 4 September**, per the template's
  own rule, so the record shows how long each has been sitting.
- **Three decisions, not more** — the template's cap. The page margin, the
  hover-swap and the focal point are all real questions but they are scope-watch
  items, not blockers, so they sit at the bottom.
- **Preview link to include if she wants to look:**
  `https://9c8a52-dc.myshopify.com/?preview_theme_id=190886576427` (password
  `angela`). Tell her to paste links fresh rather than clicking through the site
  nav — an internal link drops the preview and lands her on the live theme, which
  has none of this work. The Circle needs both parameters until item 1 is
  resolved: `/pages/the-circle?view=the-circle&preview_theme_id=190886576427`
