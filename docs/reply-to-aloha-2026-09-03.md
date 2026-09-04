# Draft reply to Aloha — 3 September 2026

Ivan to send. Follows the daily-update shape (`daily-update-template.md`).
**Fill in the hours line from the log before sending** — this file records only
the cost of today's revision.

**Subject:** Hartwick — Daily update, Thu 3 Sep

---

Aloha,

Covering today. Your feedback on the product page is built — all of it — and the
answers to your two questions are below.

**Your question first: yes, and it needs no custom development.**

Both arrangements you describe are existing settings on the Luxe product section
we are already using. Choosing between them is one field in the theme editor, not
a rebuild.

| | Your preference — vertical stack | Studio Standard — single image |
|---|---|---|
| Desktop | one image under another, one column | one image, manual arrows |
| Mobile | swipe | swipe |
| Image counter | not shown — every image is already on screen | `01 · 06` |
| Custom development | none | none |
| Extra hours | 0 | 0 |

The wireframe's two-up arrangement was the same setting on a third value. I have
built your preference — the vertical stack with the sticky panel — and tested the
other, so you can see both before you revise the wireframe.

**Which is cleaner and more efficient: the stack, on both counts.** Nothing moves,
there is nothing to operate, and no controls sit over the photograph — the visitor
scrolls, which they were doing anyway. The single-image gallery asks them to click
through six images to see the garment; the stack shows it. Loading and speed are
identical; neither adds anything to the page.

Its one cost is page length. The sticky panel is what pays for that: price, size
and Add to Bag stay on screen the whole way down.

**Automatic transitions: possible, roughly 2 hours, and I would advise against
them.** Not built. A gallery that moves on its own takes the garment out from
under someone mid-look, is a recognised accessibility failure, and reads as a shop
window rather than an atelier — it is the one thing in your letter that works
against a calmer frame. Say the word and it goes in.

**Completed**

- **Gallery and panel rebuilt to your structure.** Vertical image stack on the
  left; the information panel narrowed from 402px to 360px and now stays with the
  customer as they scroll, with Add to Bag reachable at any window size.
- **Panel holds exactly what you listed** — Style, Expression, price, size,
  availability, Add to Bag, the appointment link — with the longer information in
  four restrained accordion rows: Description, Size & Fit, Delivery & Returns,
  Care & Ageing. The description is closed by default, which is what takes the
  copy off the first screen.
- **Your type hierarchy implemented exactly, and as settings rather than code** —
  because you asked for the numbers to be starting points. Nine values live in
  Theme settings → Hartwick → Type scale and drive the whole site. Style name 40,
  Expression 20, body 16/25, price 19, labels 13, metadata 12, editorial headings
  40; mobile 31 / 18 / 16-23 / 32, nothing below 12. Measured on the rendered page
  at both widths. Navigation was 12px and buttons were 10px — both under your
  floor; now 13.
- **Limited Edition removed, and kept out.** Badges come from product data, not
  from the theme, so deleting the markup would not have removed the words. Every
  badge on the site now passes through a filter with a suppression list you can
  edit. A stale tag left in the admin is harmless.
- **"Edition 07 / 25" gone.** It returns only where a garment is genuinely
  individually numbered. Production quantity is now a factual Material Record row
  and renders only once the number has been marked verified — an unchecked figure
  reads to a customer exactly like a checked one.
- **Announcement bar removed.** No banner, no countdown, anywhere. The Register
  keeps its place in the navigation and footer.
- **Request Private Appointment is now a modal.** Name, email, telephone,
  preferred date or general availability, message — with the Style, Expression,
  Lot, product and the size on screen recorded automatically. The customer never
  leaves the page.
- **Lot I homepage rows disconnected.** The section now has a "Lot I product list
  confirmed" switch, off until you send the approved list. While it is off it
  ignores any collection outright, shows unnamed rows, and says on the page that
  it is placeholder. The legacy names are gone.

Nothing is published. The live theme is untouched.

**Product naming** — thank you for confirming; nothing to change. The numbered
Style is the heading with the Expression beneath it, and TIDE / VALE / STONE
appear nowhere customer-facing.

**In progress**

Two things need you before they can be finished: the appointment email address,
and a look at the rebuilt page so you can revise the wireframe against something
real rather than a description.

**Hours**

Today's revision: **12 hours**. [Ivan: running total and remainder from the log.]
Automatic gallery transitions (~2 hrs) are not included and not built.

**Next priority**

Your view of the rebuilt page, so the wireframe revision and the build stop
diverging.

**Decisions I need**

1. **The appointment email address.** Shopify sends every enquiry to the store's
   sender address, which is an admin setting rather than something the theme can
   set. Give me the address and I will set it, or set it yourself under
   Settings → Notifications. Every submission is already tagged
   "Enquiry type: Private appointment" so they can be routed.
2. **Two pages still say "limited edition" and I have left them alone
   deliberately.** The Press Release page carries Hartwick's own October 2024
   release — "A New Era of Limited Edition Slow Fashion" — and the Story page
   repeats the phrase. That is a dated published document and editorial prose,
   not a badge, and rewriting a press release would misrepresent it.
   **My recommendation: leave the press release as the record it is, and reword
   the Story page.** Your call, and I will do whichever you prefer.
3. **Delivery, Returns, Care and Ageing now sit in the panel**, as you asked. They
   were also a full-width section lower down the page, so keeping both would have
   printed the same copy twice. I have disabled the lower section rather than
   deleting it — one toggle brings it back. Happy either way; tell me if you want
   it in both places.

**Scope / 10 September watch**

- **The store access token has expired.** I could not render the page against real
  products today, so everything above was verified on a faithful copy of the
  markup rather than on the store itself. A new Theme Access token from Gareth
  unblocks it. Until then the page has not been seen with real data.
- **Lot I product list** — still outstanding, and now the only thing standing
  between the homepage collection index and being finished.
- **Verified production quantities** — the Material Record will not print a
  quantity until someone marks it verified. Nothing will show until it is.
- **Imagery** — still unresolved and still the largest risk to 10 September. The
  vertical stack makes photography more prominent, not less: one image at 900px
  wide shows everything.
- **Product population and the remaining page designs** carry forward from
  1 September, unchanged.

Ivan
