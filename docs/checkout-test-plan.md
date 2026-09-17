# Cart, checkout and payment — the step-by-step plan

Written **15 September 2026** for Aloha's priority #2: *"Finalise and test the cart,
checkout and 100 per cent payment journey."* Written for a first-timer: every step says
exactly where to click, what you should see, and what to do if you don't see it.

**Who does what.** Every step is tagged:

| Tag | Meaning |
|---|---|
| **[Ivan]** | Only you can do it — it needs the Shopify admin, or a card number. |
| **[Claude]** | I do it. You just say "go", or paste me what I ask for. |
| **[Ivan → Claude]** | You do a two-minute thing, then hand it to me. |
| **[Aloha]** / **[Christina]** | A decision that is theirs. We ask; we do not decide. |

Rough time: **Ivan ≈ 60–75 minutes** of clicking spread through the day. Claude does the rest.

---

## 0. Before you start — read this once

### What "100 per cent payment" means
Nothing special. It is the ordinary Shopify checkout where the customer pays the full price.
The phrase exists only to distinguish it from **Reserve** (a 50% deposit), which is Phase 2
and is *not* being built. So there is nothing to code here — the job is to **configure,
test and prove** what Shopify already provides.

### The three parts of the journey, and who owns each

| Part | What it is | Where it is controlled |
|---|---|---|
| **Bag (cart)** | The drawer that slides out after "Add to bag", and the `/cart` page | The **theme** (our code). Luxe's native cart, untouched. Claude's territory. |
| **Checkout** | The pages where the customer types their address, picks shipping, and pays | **Shopify admin → Settings → Checkout**. Not the theme. Shopify hosts it. |
| **Payment** | The card is charged | **Shopify admin → Settings → Payments**. Shopify Payments (almost certainly — see §1.1). |

This matters because *most of this task is admin settings, not code*. That is why so many
steps are tagged [Ivan]: the admin can only be operated by a logged-in person.

### What I already know (read through the API, read-only, 15 Sep)

- Store currency **USD**. Registered entity **Canada** (British Columbia). Prices exclude tax.
- **Zero orders have ever been placed.** No test order has been done yet.
- Shop Pay, Apple Pay and Google Pay are enabled → the gateway is **Shopify Payments**.
- Shipping: five zones — Canada, USA, UK, Europe (16 countries), International (8 countries:
  AU, HK, JP, MY, NZ, SG, KR, AE). Each has *Standard* ($20 UK/US, $25 elsewhere) and
  *Free over $300*. Details and two small faults in §4.
- **Any other country cannot check out** — there are no rates, so checkout stops with
  "no shipping available". That includes South Africa, India, Mexico, all of South America.
  This is a business decision for Aloha (§4.3), not a bug.
- The bag already says **"Bag"**, not "Cart", on every string I could find in the theme.

### Safety rules for today
1. **Never publish the development theme.** We test on it via a preview link.
2. **Turn test mode off when you finish** (§5.6). While it is on, real customers cannot pay.
3. **Use `+tag` email addresses** for every test (e.g. `you+order01@gmail.com`) so every
   test order and profile can be found and deleted before launch.
4. **Cancel test orders afterwards** (§7) — otherwise they inflate the first sales report.

### The links you will use all day
- Dev theme preview (the whole site):
  `https://9c8a52-dc.myshopify.com/?preview_theme_id=190886576427`
  Storefront password: `angela`
- Test product (in stock, three sizes, **$295** — one is under the $300 free-shipping line,
  two are over it, which is exactly what we want to test):
  `https://9c8a52-dc.myshopify.com/products/tokyo-blouse-handwoven-ikat-in-mesa-white?preview_theme_id=190886576427`
- A sold-out product, to see the "unavailable" state:
  `https://9c8a52-dc.myshopify.com/products/paris-trousers-handwoven-fresh-pink-cotton-khadi?preview_theme_id=190886576427`
- Admin: `https://admin.shopify.com/store/9c8a52-dc`

> The product names are still the legacy internal ones (Tokyo, Paris…). That is the product
> population job, separate from this. Ignore it today.

---

## 1. Read the four admin screens I cannot see · [Ivan, ~10 min]

The API gives me no access to payment or checkout settings — none exists for any app. So
the first job is yours: open four screens and tell me what is on them. **Screenshots are
best** (Cmd+Shift+4 on Mac, drag over the area, the file lands on your Desktop; paste it
into the chat). If you prefer, type what you see.

### 1.1 Settings → Payments
Path: Admin → bottom-left **Settings** → left menu **Payments**.

Look for and tell me:
- [ ] The box at the top. Does it say **Shopify Payments** with a green "Active"? Or does it
      say "Choose a provider" / "Complete account setup"?
- [ ] Any **yellow or red banner** — e.g. "Add bank account", "Verify your business",
      "Payouts on hold". Copy the wording.
- [ ] Click **Manage** inside the Shopify Payments box. Scroll to the bottom. Is there a
      **"Test mode"** section with a checkbox *Enable test mode*? (Don't tick it yet — that
      is §5.1.) Just tell me whether it exists.
- [ ] Further down the Payments page: **Manual payment methods** — are any listed (bank
      deposit, money order…)? They should be **none** for a luxury launch.
- [ ] **Payment capture** — "Automatically" or "Manually"? Note it.

### 1.2 Settings → Checkout
Path: Settings → **Checkout**.

Tell me the setting under each heading:
- [ ] **Customer accounts** — "Don't show", "Optional" or "Required"? (We want *Optional*
      or not shown. *Required* kills conversion.)
- [ ] **Customer contact method** — "Email" or "Phone number or email"?
- [ ] **Marketing options → Email** — is "Show a sign-up option at checkout" on? And
      underneath it, is **"Preselect the sign-up option"** ticked? *This one matters legally*:
      the entity is Canadian, CASL forbids pre-ticked consent. If it is ticked, note it and
      **untick it** (that change is safe and correct).
- [ ] **Tipping** — on or off? Should be **off**.
- [ ] **Address collection** — "Require a shipping address" etc. Note what's ticked.
- [ ] **Order processing** — "Use the shipping address as the billing address by default",
      "Enable address autocompletion". Note.
- [ ] **Abandoned checkout emails** — on or off, and after how long.

### 1.3 Settings → Taxes and duties
Path: Settings → **Taxes and duties**.

- [ ] Under *Manage sales tax collection*: is **Canada** listed with a tax number, or does it
      say "Not collecting"? Is **any** other country collecting?
- [ ] Is "Include tax in prices" on or off? (The API says off. Confirm.)

You are only reporting. Whether Hartwick should register for GST/HST or VAT is a
**[Christina]** question — put it in the update, do not change anything here.

### 1.4 Settings → Notifications
Path: Settings → **Notifications** → under *Customer notifications* click **Order
confirmation**.

- [ ] Does it look like the plain Shopify default (grey/white, "Thank you for your
      purchase!")? Almost certainly yes. Just confirm.
- [ ] Top-right of that screen there is a **Send test email** button. Press it. It goes to
      the store owner address. Tell me whether it arrives and who the *From* name is.

**Send me all of that and stop.** I will reply with a short list: "change X to Y, leave the
rest". No coding, no risk.

---

## 2. I walk the whole journey up to the payment page · [Claude, ~30–40 min]

Nothing for you to do here except say "go" — and it can run while you do §1.

What I will do, in the in-app browser, on the dev-theme preview, at desktop width and at
390 px (iPhone width):

1. **Product page** — select each size; confirm price, "Add to bag" label, sold-out
   variant is disabled with the right wording; the sticky mobile Add-to-bag bar works.
2. **Add to bag** — the drawer opens, line shows the right variant and price, quantity
   up/down works, remove works, subtotal is right, the "Checkout" button is present.
3. **Cart page** (`/cart`) — same checks on the full page; any discount-code field; the
   "Bag" wording throughout; nothing left over from Luxe's demo (e.g. shipping calculator,
   gift-wrap, "you may also like" that shows the wrong products).
4. **Into checkout** — click Checkout. Confirm it opens Shopify's checkout, that the header
   shows *something* (logo or store name — branding comes in §3), and that the policy links
   in the checkout footer exist and point at real pages.
5. **Contact + address step** — fill a test address for **Canada**, then **USA**, then
   **UK**, then **South Africa**, and note which shipping rates appear for each and at what
   price. The South Africa run should fail with "no shipping" — that proves §0's point for
   Aloha.
6. **Shipping step** — with one blouse ($295) I expect *Standard*; with two ($590) I
   expect *Free*. I check both.
7. **Stop at the payment step.** I do not enter card numbers, test or otherwise. That is
   §5, and it is yours.

I fix anything that is theme-side (wording, a broken drawer state, a leftover Luxe block),
push it to the dev theme, and list anything that is an admin setting for you.

**Output:** a short pass/fail table in the chat, plus the theme fixes (if any) pushed.

---

## 3. Make the checkout look like Hartwick · [Claude prepares → Ivan clicks, ~15 min]

Shopify's checkout is not styled by the theme. It has its own editor, and only a logged-in
admin can operate it. I give you the values; you paste them.

### 3.1 The values (from the theme's own tokens — `snippets/ha-tokens.liquid`)

| Checkout editor field | Value | Why |
|---|---|---|
| **Logo** | upload `assets/ha-wordmark.svg` from this repo (or export a PNG of it at 600 px wide if SVG is refused) | The supplied wordmark; never live type. |
| Logo size | Small or Medium; try both, pick the one that fits the header without crowding | |
| **Background colour** (page / main area) | `#F2EFE9` | Page ground. *Still a placeholder pending Brand Book confirmation* — same as the site. |
| **Order summary background** | `#F2EFE9` (or leave white if it reads better; both are fine) | |
| **Text colour** | `#0B0603` | "Soot black" |
| **Primary button** background | `#0B0603` | Same as the site's solid buttons |
| **Primary button** text | `#E9F3FF` | "Chalk blue" — the site's inverted text |
| **Accent / link colour** | `#541F00` | "Cutch resin" |
| **Error colour** | leave Shopify's default red | Do not make errors brand-coloured; they must be seen |
| **Corner radius** | None / 0 | The site has square corners everywhere |
| **Heading font** | see note | |
| **Body font** | see note | |

**Font note.** The site uses Porter, Junicode and Noto Mono, which are our own webfont
files. The checkout editor only offers Shopify's built-in font list unless the store is on
**Shopify Plus** (it is on plain *Shopify*), so our fonts cannot be used in checkout. Pick
the quietest match from the list: for headings a plain serif (**"Cardo"** or **"Libre
Baskerville"** are closest in feel to Junicode), for body a neutral sans (**"Helvetica"**
or the default **system font**). This is a compromise; say so to Aloha in one line rather
than let her discover it.

### 3.2 Where to click

1. Admin → **Settings** → **Checkout**.
2. At the top, the box *Checkout customisation* → button **Customize**. A new editor
   opens (it looks like the theme editor but is separate).
3. Left rail → **Branding** (paint-brush icon). You will see three groups:
   *Logo*, *Colours*, *Typography* (sometimes a fourth, *Corner radius / Layout*).
4. **Logo** → *Add image* → upload the wordmark → set position **Left** (or Centre if
   Aloha's mockups centre it — they do not; Left).
5. **Colours** → there is a *Global* set and *Colour schemes* (Scheme 1 = main form area,
   Scheme 2 = order summary). Set the values from the table in **Scheme 1**; set Scheme 2
   to the same background or white.
6. **Typography** → Heading and Body, per the font note.
7. **Save** (top right). Then **Preview** to see it; then close.

If a field in the table does not exist in your editor, skip it — Shopify moves these
around. Tell me which one and I will find its new home.

---

## 4. Shipping — two small corrections and one question · [Ivan after Aloha, ~10 min]

What is configured now (read via the API, 15 Sep):

| Zone | Standard | Free | Fault |
|---|---|---|---|
| Canada | $25 for orders 0–300 **USD** | orders ≥ 300 **CAD** | Two different currencies on the same threshold. 300 CAD ≈ 220 USD, so a Canadian with a $250 order sees **both** rates; the boundary is wrong either way. |
| USA | $20 for 0–300 USD | ≥ 300 USD | Fine. (At exactly $300 both appear — harmless.) |
| UK | $20 with **no condition** | ≥ 300 USD | Over $300 a UK customer sees *both* Free and $20. Untidy, not broken. |
| Europe (16) | $25 for 0–300 | ≥ 300 | Fine. |
| International (8) | $25 for 0–300 | ≥ 300 | Fine. |
| **Everywhere else** | — | — | **No rate → cannot check out.** |

### 4.1 Fix the UK rate
Settings → **Shipping and delivery** → click **General profile** (under *Shipping*) →
scroll to the **United Kingdom** zone → on **Standard Shipping** click the **⋯** → **Edit
rate** → under *Conditional pricing* choose **Based on order price** → Minimum `0`,
Maximum `300` → **Done** → **Save** (top right).

### 4.2 Fix the Canada threshold
Same screen, **Canada** zone → **Free Shipping** → Edit rate → the condition currently reads
*300 CAD*. Change it to **300 USD** so it matches Standard's cap and every other zone —
**unless** Aloha wants a Canadian-dollar threshold, in which case Standard's cap must
change to CAD too. Either is fine; they must simply agree. Ask her (§8) before touching it
if you are unsure; the fix is thirty seconds once she answers.

### 4.3 The question for Aloha — rest of world
> "Should a customer outside Canada, the US, the UK, the 16 EU countries and the 8
> Asia-Pacific/Gulf countries be able to order at all? Right now they cannot — checkout
> stops with 'no shipping available'. If yes, what should the rate be?"

If yes: same screen → **Create zone** → name it *Rest of world* → tick **Rest of world** →
add a rate (a flat price, e.g. $40, or Free ≥ 300 like the others) → Save.

---

## 5. Place the test orders · [Ivan, ~20 min, Claude verifying in parallel]

This is the heart of the task. Read all of §5 once before starting.

### 5.1 Turn on test mode
Settings → **Payments** → Shopify Payments box → **Manage** → scroll to the bottom →
**Test mode** → tick **Enable test mode** → **Save**.

A yellow banner "Test mode is on" appears at the top of admin. **Real cards will now be
refused** until you turn it off (§5.6). Tell me when it is on.

> If there is **no** test-mode section (e.g. Shopify Payments isn't fully activated),
> stop and tell me — the fallback is Shopify's "Bogus Gateway", which is enabled from
> the same Payments page under *Manual/Third-party providers → (for testing) Bogus
> Gateway*. Its test cards are different: card number `1` = success, `2` = declined,
> `3` = error. I'll walk you through it if needed.

### 5.2 Open a clean browser
Open a **private/incognito window** (Cmd+Shift+N in Chrome, Cmd+Shift+P in Safari).
Why: your normal browser is logged into admin and has old cookies; a private window
behaves like a real customer.

Paste the test-product link from §0. Enter the storefront password `angela` if asked.
Check the page shows the **dev theme** (the Hartwick design, not the landing page). If
you see the landing page, the `preview_theme_id` got lost — paste the link again.

### 5.3 Order 1 — the successful order (one item, under $300 → Standard shipping)
1. Pick size **M**. Click **Add to bag**. The drawer opens.
2. Click **Checkout** in the drawer.
3. **Contact:** email `you+order01@gmail.com` (use your real inbox with `+order01`; Gmail
   delivers it to you). If a marketing checkbox is shown, leave it **unticked** this time.
4. **Delivery address:** use a real-looking Canadian address so tax and shipping behave
   normally. Any real street works; e.g. your own name, `100 Main Street`, `Vancouver`,
   `British Columbia`, `V6B 1A1`, Canada. Phone if required: `604 555 0100`.
5. Click **Continue to shipping**. You should see **Standard Shipping — $25.00** (and, until
   §4.2 is fixed, possibly *Free* too — pick Standard).
6. Click **Continue to payment**.
7. **Card:** number `4242 4242 4242 4242`, expiry any future month/year (e.g. `12/30`),
   CVC `123`, name anything. This is Shopify's official test card; nothing is charged.
8. Billing address: *Same as shipping*.
9. Click **Pay now**.
10. You should land on the **Thank you** page with an order number like `#1001`.
    Screenshot it. Tell me the order number.

### 5.4 Order 2 — the declined card
Repeat 5.3 with email `you+order02@gmail.com` and card **`4000 0000 0000 0002`**.
Shopify should refuse it with a red message ("Your card was declined"). Screenshot the
message — this is what a real customer sees when their bank says no. Then close the tab;
no order is created.

### 5.5 Order 3 — free shipping and a different country (optional but recommended)
Add **two** blouses ($590). Use a **US** address (e.g. `1 Market Street, San Francisco, CA
94105`) and email `you+order03@gmail.com`. At the shipping step you should see **Free
Shipping** and only that. Pay with `4242…` as before.

### 5.6 Turn test mode OFF
Settings → Payments → Manage → untick **Enable test mode** → Save. The yellow banner goes.
**Do not skip this.**

### 5.7 Check your inbox
Within a minute or two you should have an **order confirmation** email for each successful
order. Note: the *From* name, whether it says "Bag"/"Order", whether the logo shows, and
anything that looks like a Luxe or generic Shopify leftover. Forward one to me or
screenshot it.

---

## 6. I verify every order landed everywhere it should · [Claude, ~15 min]

Once you give me the order number(s), I check, read-only:

- **Shopify** — the order exists, is flagged *test*, financial status *Paid*, correct
  variant, price, shipping line, tax line, address, and the customer record was created.
- **Klaviyo** — a `Placed Order` event exists on the `+order01` profile with the correct
  value; `Started Checkout` fired; the profile is **not** on The Register (they didn't tick
  the box). If the box was ticked on a later run, the profile *is* subscribed with a
  `checkout` source — this is how we prove the consent path works.
- **Shopify Analytics** — the order appears in Live View / sales (as a test).
- **Email** — the confirmation you forwarded reads correctly.

I report a pass/fail table and anything that needs an admin change.

---

## 7. Clean up · [Claude lists → Ivan clicks, ~5 min]

Test orders and profiles must not exist at launch — they corrupt the first report and the
first Dispatch's open rate.

1. I give you the list of order numbers and Klaviyo profile IDs.
2. **Orders:** Admin → **Orders** → open each test order → top-right **⋯** → **Cancel
   order** → reason *Other*, refund *yes* (it's test money) → **Cancel order**. Then **⋯** →
   **Archive**.
3. **Customers:** Admin → **Customers** → find `you+order01…` → open → **⋯** → **Delete
   customer**. Repeat for each.
4. **Klaviyo profiles:** I will delete the `+order` profiles via the API when you say so,
   or you do it in Klaviyo → Audience → Profiles → search → Delete.

---

## 8. Write it up, and the questions to send · [Claude drafts, Ivan sends]

I write `docs/checkout-test-2026-09-15.md`: what was tested, what passed, what was fixed,
and screenshots' filenames. And I draft the paragraph for today's daily update.

The decisions that come out of this task, for the update:

| Question | Whose | Why it matters |
|---|---|---|
| Rest-of-world shipping — allow or not, and at what rate? (§4.3) | **Aloha** | Currently those customers cannot check out at all. |
| Free-shipping threshold in USD or CAD for Canada? (§4.2) | **Aloha** | The two rates disagree today. |
| Store currency: stay USD, or CAD to match the BC entity? | **Aloha / Christina** | Open since 10 Sep. Drives every revenue figure. |
| Tax registration — GST/HST, VAT, anything? (§1.3) | **Christina** | Currently collecting nothing. A legal/accounting call. |
| Delivery and returns terms for the Shipping and Refund policies | **Christina** | Checkout links to them; they are skeletons today. |
| Payment capture — automatic, or manual (charge when the piece is ready)? (§1.1) | **Aloha** | For made-to-order pieces manual capture is common; Shopify auto-cancels uncaptured authorisations after 7 days, so it needs a process. |

---

## 9. If something goes wrong

| You see | It means | Do this |
|---|---|---|
| The password page, and `angela` doesn't work | Storefront password changed | Check Online Store → Preferences → Password page. |
| The **landing page** instead of the Hartwick site | `preview_theme_id` dropped | Paste the full link from §0 again. Checkout itself has no theme, so this only matters before checkout. |
| "This store can't accept payments right now" | Shopify Payments isn't activated, or test mode is on and you used a real card | Report the exact wording to me. Check §1.1's banners. |
| "Shipping not available for your address" | The country has no zone | Expected for anything outside the 26 countries. Use a Canadian/US/UK address. |
| Two shipping options where you expected one | The §4 conditions overlap | Pick either; note it; fix in §4 later. |
| Checkout shows a **tax** line you didn't expect | A tax registration exists (§1.3) | Note it; not a fault. |
| "Continue shopping" after paying lands on the **landing page** | That's the *live* theme — correct while the landing page is live | Not a fault. |
| Card `4242…` is declined | Test mode is not on, or you're on the Bogus gateway (use `1`) | Check §5.1. |
| No confirmation email after 5 minutes | Notification disabled, or the store's sender email is unverified | Settings → Notifications → check *Sender email*; tell me. |
| The yellow "Test mode" banner is still there at the end of the day | You skipped §5.6 | Turn it off now. |

---

## 10. One-page checklist

Tick as you go. Order matters only where the arrow says so.

**Ivan**
- [ ] §1 Screenshot the four admin screens → send to Claude
- [ ] §1.2 If "Preselect the sign-up option" is ticked, untick it
- [ ] §3 Paste the branding values into the checkout editor, Save
- [ ] §5.1 Test mode ON
- [ ] §5.3 Order 1 — `4242…`, Canada, one item → note order number
- [ ] §5.4 Order 2 — declined card → screenshot
- [ ] §5.5 Order 3 — two items, US, free shipping
- [ ] §5.6 Test mode **OFF**
- [ ] §5.7 Forward one confirmation email
- [ ] §7 Cancel + archive test orders, delete test customers (after Claude's list)
- [ ] §4 Shipping fixes — after Aloha answers
- [ ] §8 Send the update with the six questions

**Claude**
- [ ] §2 Browser walkthrough desktop + mobile, up to payment; fix and push theme issues
- [ ] §3 Branding values (this file, §3.1)
- [ ] §6 Verify orders in Shopify, Klaviyo, Analytics, email
- [ ] §7 List orders/profiles to delete; delete Klaviyo test profiles on request
- [ ] §8 Write `docs/checkout-test-2026-09-15.md` and the daily-update paragraph

**Waiting on others**
- [ ] Aloha — rest-of-world shipping, CAD/USD threshold, currency, capture mode
- [ ] Christina — tax registration, delivery/returns terms
