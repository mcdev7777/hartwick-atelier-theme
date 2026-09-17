# Cart, checkout and payment — test record

Companion to `checkout-test-plan.md`. Filled in as each stage completes. **15 September
2026.** Everything below was done on **Hartwik - Dev (#190886576427)** via preview; the
live theme was not touched.

---

## §1 — Admin screens (Ivan, 15 Sep)

| Screen | State found | Action |
|---|---|---|
| Settings → Payments | **Hidden from Ivan's account.** Only "Gift card expiration" and "Apple Wallet passes" show — the collaborator has no payments permission. | **[Angela]** grant the Payments permission (Settings → Users → Ivan → Store settings → Payments), *or* screenshot the screen and toggle test mode herself when asked. |
| Settings → Checkout → Contact method | "Phone number or email". No SMS app installed, so a phone-only customer would receive nothing. | **[Ivan]** switch to **Email**. |
| Settings → Checkout → Marketing opt-in | Email shown at checkout + sign-in, label "Email me with news and offers", **preselect: none** (CASL-correct). | **[Ivan]** relabel **"Join The Register"** as a placeholder; final consent line is **[Christina]**. |
| Settings → Checkout → "Track with Shop" link | On. | **[Aloha]** decide; recommendation off (brand discretion). |
| Settings → Checkout → Tipping / SMS / WhatsApp | All off. | Leave. |
| Settings → Checkout → Customer information | Name required, phone required, company off, address 2 optional. | Leave — couriers need a phone. |
| Settings → Taxes and duties | Shopify Tax active; **every region "—" (collecting nothing)**; tax-in-prices off; tax on shipping off. | Leave. Registration is **[Christina]**. |
| Settings → Notifications → Order confirmation | Stock Shopify template **with the Hartwick wordmark already in place**. Delivery estimate line is driven by Shipping → transit times. Purple "Track order with Shop" button present. | Leave for now. Transit times need **[Aloha]**'s real lead times (her item #7). Shop button: her call. |

Not yet seen: **Customer accounts** page (classic/new, optional/required) and **abandoned
checkout emails** setting. Not blockers.

---

## §2 — Browser walkthrough (Claude, 15 Sep)

Desktop 1440 px and mobile 375 px. Product: Tokyo Blouse, $295.

### Passed
- Product page: three sizes selectable, price, "Add to bag", "Duties and taxes shown at
  checkout", sticky mobile Add-to-bag bar. Sold-out helper text ("Unavailable") exists in
  the markup but is only shown for an unavailable variant — correct.
- Bag drawer (desktop + mobile): one line, variant, price, Remove, Total, "View bag",
  Checkout. Quantity stepper deliberately hidden (`cart_show_quantity: false`) — suits
  edition pieces; left as is.
- Cart page: "Shopping Bag" heading, Order Summary, Checkout, express buttons.
- Footer on cart page: Instagram / Contact / The Register + Privacy, Refund, Terms,
  Shipping, Contact information, **Cookie preferences** (the new link renders).
- Checkout opens (Shopify one-page). Contact, delivery, shipping method, payment sections
  all present. **Credit-card fields are live** (Visa/MC/Amex/+4), plus PayPal → a card
  gateway is active. Marketing checkbox unticked by default.
- Checkout footer: Refund policy, Shipping, Privacy policy, Terms of service, Contact.
- **Shopify's cookie banner is already switched on** (Accept / Decline / Manage
  preferences, links to the privacy policy). Customer privacy has been configured —
  Aloha's item #4 is further along than the 10 Sep docs say.
- Shipping rates, US address: **Standard $20.00** only, total USD 315.00. Correct.

### Fixed (theme)
- Browser-tab title on `/cart` read **"Your Shopping Cart"** — Shopify's hard-coded
  `page_title`. Overridden in `layout/theme.liquid` to the theme's "Shopping Bag" string.
  Pushed to the dev theme; verified.

### Found — needs a decision or an admin change
1. **Only 27 countries are selectable at checkout.** The country dropdown lists AU, AT,
   BE, CA, CZ, DK, FI, FR, DE, HK, IE, IT, JP, MY, NL, NZ, NO, PL, PT, SG, KR, ES, SE,
   CH, AE, GB, US. South Africa, India, Mexico etc. **do not appear at all** — a customer
   there is stopped at the country field. Controlled by **Settings → Markets**. **[Aloha]**
2. **Markets is converting currency live.** Selecting Canada showed **CAD $420.00** for the
   $295 blouse; UK showed **£224.00**. The store is not USD-only in practice. This is why
   the 10 Sep "USD vs CAD" question matters more than it looked: prices, thresholds and
   reporting are all being converted. **[Aloha / Christina]**
3. **Canada free-shipping threshold is wrong.** Canada: **Free Shipping only**, because
   CAD 420 ≥ the CAD 300 threshold. The same blouse costs $20 to ship to the US. The
   Canada threshold is 300 **CAD** (≈ USD 220) while every other zone is 300 **USD**.
   Fix in Shipping → General profile → Canada → Free Shipping → condition. **[Aloha
   decides the number; Ivan edits]**
4. **UK shows both rates under the threshold.** £224 order (≈ $295 < $300) offered
   **Free Shipping** *and* **Standard £16.00**, Standard preselected. UK Standard has no
   price condition (API), and the Free condition is being converted GBP↔USD at a rate
   that lets £224 through. Fix: add 0–300 to UK Standard; consider expressing the UK
   threshold in GBP. **[Ivan]**
5. **Checkout is unbranded** — plain-text store name, Shopify blue "Pay now", default
   fonts. §3 of the plan (checkout editor) — values are ready; needs an admin with
   Checkout access to paste them. **[Ivan]**
6. **PayPal is enabled** as a second provider (yellow button on cart page and in
   checkout). Keep or remove is **[Aloha]**'s; if kept, it needs the same test as the card.
7. **Navigation** (Online Store → Navigation → Main menu, not the theme):
   - **THE REGISTER** links to `/` (homepage top) — should point at `/#the-register` or a
     Register page once one exists.
   - **THE MASTERS** links to `/pages/the-makers` — the page *handle* still says "makers",
     which is visible in the URL bar. Rename the page handle to `the-masters` and add a
     redirect. Terminology rule.
   - **JOURNAL** links to `/pages/press`.
   - **The Circle is not in the main menu.** ✅ (Aloha's item #6.)
   **[Ivan, 5 min in admin]**
8. Store front password: **not asked for** on the preview — the password page appears to
   be off. Fine while the live theme is the holding page; note it for the launch runbook.

### Not tested (blocked)
- Payment itself — needs test mode (§5), which needs the Payments permission (§1).
- Confirmation email on a real shipped order — follows §5.

---

## §5–§7 — Test orders, verification, clean-up

*Pending: Payments permission or Angela toggling test mode.*

| Order | Email | Country | Items | Rate seen | Result | Klaviyo `Placed Order` | Cleaned up |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

---

## §8 — Questions to carry into today's update

| Question | Whose |
|---|---|
| Allow orders outside the 27 countries? If yes, which, and at what rate? | Aloha |
| Keep live currency conversion (CAD, GBP, EUR…) or sell in USD only? | Aloha / Christina |
| Free-shipping threshold — one number in one currency for every zone? | Aloha |
| Keep PayPal alongside Shopify Payments? | Aloha |
| "Track with Shop" button/link — on or off? | Aloha |
| Real transit times per zone for the delivery estimate | Aloha |
| Payment capture — automatic or manual? | Aloha |
| Tax registration (GST/HST, VAT)? | Christina |
| Delivery and returns terms for the Shipping and Refund policies | Christina |
| Consent line for the checkout marketing checkbox | Christina |
| Payments permission for Ivan, or toggle test mode on request | Angela |
