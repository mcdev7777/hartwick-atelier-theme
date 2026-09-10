# Draft message to Angela — 8 September 2026

**Permission request.** Send separately from the DNS message
(`angela-2026-09-07-access-and-dns.md`) — that one has a deadline and I don't want this
buried under it. This supersedes item 4 of that message, which asked for the same thing in
vaguer terms.

**Before sending, check what I already hold.** Shopify → Settings → Users and permissions →
Collaborators → my account. Delete rows from the tick-list below that are already ticked, so
Angela isn't asked for access she's already given.

**Note on Payments:** per the brand structure, payment *decisions* are Christina's. This
asks only for the access to configure and test what's already been decided — it is not a
request to decide anything about payments. Worth keeping that distinction visible if Angela
forwards this on.

---

Subject: **Hartwick — Shopify permissions tick-list (5 minutes, one screen)**

Hi Angela,

To finish the storefront before the 10th I need a few more Shopify permissions than my
collaborator account currently has. This is all on one screen and should take about five
minutes.

**Where to go:** Shopify admin → **Settings** → **Users and permissions** → under
**Collaborators**, click my name → tick the boxes below → **Save**.

I've grouped these by what they're for, so you can see exactly what each one buys. Several
appear more than once — that's expected, and you only tick each once.

---

## 1. Payments

- [ ] **Settings**
- [ ] **Orders**
- [ ] **Finances**

Lets me see how payment methods are configured, check that the right ones are live, and
place and refund test orders so we don't discover a broken checkout with a real customer.

*I am not asking to change your payment setup or banking details, and Shopify wouldn't let
me — see the note at the bottom.*

## 2. Checkout

- [ ] **Settings**
- [ ] **Themes**

Checkout configuration lives under Settings → Checkout: what fields customers see, whether
guest checkout is on, marketing opt-in at checkout. That last one matters for us — it's one
of the two places people join The Register.

## 3. Cart

- [ ] **Themes**

Cart behaviour is theme code, so this is likely already ticked. Included for completeness.

## 4. Shopify Analytics

- [ ] **Analytics** *(may read "Dashboards" or "View Shopify analytics")*
- [ ] **Reports**

So I can confirm after launch that sales, sessions and conversion are actually being
recorded, rather than assuming they are.

## 5. Tracking and cookie consent

- [ ] **Settings**

Two things live here. **Customer privacy** is the cookie consent banner — legally required
for UK and EU visitors, and currently off. **Customer events** is where tracking pixels are
installed. Nothing measures anything until both are set up.

## 6. Klaviyo integration

- [ ] **Apps and channels**
- [ ] **Customers**
- [ ] **Orders**
- [ ] **Products**
- [ ] **Settings**

Klaviyo is already connected, but its on-site tracking, its sync of products and orders, and
its signup forms each need a different piece of the admin.

---

## The short version

Six sections, but only **seven distinct boxes**:

- [ ] Settings
- [ ] Orders
- [ ] Products
- [ ] Customers
- [ ] Apps and channels
- [ ] Analytics *(and Reports, if listed separately)*
- [ ] Finances
- [ ] Themes *(probably already on)*

**Settings** is the one that matters most — it alone unlocks checkout, customer privacy,
customer events and payment configuration. If you only do one thing on this list, do that
one.

## What this does not give me

Worth stating plainly, since some of these sound broader than they are:

- **Payments setup and your bank details** are restricted to the store owner. I cannot reach
  them with any permission you grant, and I'm not asking to.
- **Your plan and billing** — owner only. Untouched.
- **Users and permissions** — I'm not asking for this. I can't add anyone or change my own
  access.
- **Deleting the store, or transferring ownership** — owner only.

If any single item makes you uncomfortable, leave it off and tell me which — I'll work
around it or come back with a narrower ask. I'd rather you granted less and we talked about
it than granted something you weren't sure of.

And whenever you like — after launch, or the moment anything feels wrong — all of this comes
off in one click on the same screen.

Thanks,

Ivan

---

## Notes to self — not for sending

**Labels shift between Shopify releases and plans.** If a box above isn't there under that
exact name, the nearest match is right — the capability groupings are stable even when the
wording isn't. Don't send Angela hunting for a literal string.

**If she grants only "Settings":** that covers items 2, 5, and the visible half of 1. Enough
to unblock the cookie banner and checkout work, which are the launch-critical pieces.
Analytics verification and the Klaviyo sync checks can wait a day if they have to.

**Verify after she saves** — sign out and back in. Collaborator permission changes don't
always take effect in an open session, and an hour spent debugging a "broken" admin page
that is really a stale session is an hour off the 40.

**Item 4 of the DNS message** asked for Settings + Analytics in passing. If that message has
already gone, open this one by saying it replaces that request, so she isn't answering the
same thing twice.
