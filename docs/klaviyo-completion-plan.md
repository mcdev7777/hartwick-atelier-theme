# Klaviyo + tracking — remaining stages to done

Written **10 September 2026**. Companion to `klaviyo-and-analytics-runbook.md` (§15 Part 2
is the original stage plan) and `sending-domain-walkthrough.md`. This file supersedes both
on *sequence and current state* — they remain correct on reasoning and on the DNS detail.

Owner tags: **[Ivan]** = at the screen · **[Claude]** = repo / verification from outside ·
**[Blocked]** = waiting on Angela, Aloha or Christina.

---

## State verified 10 September, not assumed

### DNS — all seven records live

Queried `ns01`/`ns02.squarespacedns.com` and `dns1.p09.nsone.net` directly, so this is the
zone's actual content rather than a cache:

| Type | Host | Value | Status |
|---|---|---|---|
| NS | `send` | `ns1.klaviyo.com` | ✅ in zone, TTL 14400 |
| NS | `send` | `ns2.klaviyo.com` | ✅ |
| NS | `send` | `ns3.klaviyo.com` | ✅ |
| NS | `send` | `ns4.klaviyo.com` | ✅ |
| TXT | `@` | `klaviyo-site-verification=XK6Wjs` | ✅ propagated to 8.8.8.8 / 1.1.1.1 |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | ✅ propagated |
| TXT | `_dmarc` | `v=DMARC1; p=none` | ✅ propagated |
| MX | `@` | Google Workspace ×5 | ✅ **untouched** |

Squarespace's Type dropdown **does** offer `NS` — the Step 4a fallback to the CNAME setup is
not needed and that branch is now closed.

**Correction to a common assumption:** DNS records are not approved or reviewed by anyone.
The zone is authoritative the moment Squarespace saves. Propagation delay affects public
resolver caches only, never the authoritative nameservers — which is why querying
`ns01.squarespacedns.com` directly is the only check worth trusting.

### Klaviyo — Angela's two blockers are closed

`default_sender_email` = `CONTACT@HARTWICKATELIER.COM`, sender name `Hartwick Atelier`, and
the postal address is filled. B1 from the 7 September audit is closed on the data side.
Whether that address is **verified**, and whether the mailbox exists at all, is Stage 2.

### New finding — the entity is Canadian

The registered address is **PO Box 16, Tatlayoko Lake, British Columbia, Canada, V0L 1W0**.
The account is still set to `USD` and was scaffolded as a US business.

This is not a formatting detail. It changes three things:

- **CASL governs these emails, not CAN-SPAM.** CASL requires *express* consent and has no
  soft opt-in. The double opt-in already set on both lists is therefore the correct call,
  and Christina's consent wording becomes a compliance item rather than a style one.
- **Cookie-banner regions** must include Canada.
- **Currency** — USD against a BC entity needs confirming. The Shopify store's own currency
  is the source of truth for money; the entity question is Christina's.

Timezone needs no change: BC and Los Angeles are both Pacific.

### Still untouched

- Lists are the defaults: `Email List` (`Wf4A23`) and `Preview List` (`UmZsaa`). Both
  `double_opt_in`.
- **Zero flows exist.**
- `Active on Site` and `Viewed Product` hold **zero events** — onsite tracking has still
  never fired. B2 remains open since 7 September.
- `hartwickatelier.com` still resolves to Squarespace (`198.185.159.x`, `www` →
  `ext-sq.squarespace.com`). No cutover has happened.

---

## Stage 1 — Finish the sending domain

The DNS half is done. What remains is Klaviyo's half.

- [x] **[Ivan]** Klaviyo → Settings → Domains → click **Verify** on
      `send.hartwickatelier.com`. *Done 10 Sep.*
- [x] **[Claude]** Confirm Klaviyo is actually *serving* the delegated zone. *Confirmed —
      `ns1`/`ns2.klaviyo.com` went from `REFUSED` to authoritative (`aa` flag, NOERROR), and
      DKIM resolves end-to-end:*
      `s1._domainkey.send.hartwickatelier.com → s1.domainkey.u161779.wl030.sendgrid.net`
      *carrying a live RSA key. MX unchanged.*
- [x] **[Ivan]** Click **Activate**. Klaviyo shows `Verified` with an **Activate** button and
      a *"ready to activate"* banner — that is the verified-but-not-selected state, and it
      fails silently by continuing to send from the shared domain. *Done 10 Sep.*

**Recorded for the file:** verification was immediate. The 24–48h figure is a worst case for
resolver caches and was moot here. Two settings seen on that screen, neither a blocker:
`Routing Type: Dynamic` is **correct** — a dedicated IP needs sustained volume to warm and
would hurt deliverability at launch volume; **branded click-tracking requires a plan
upgrade**, so Dispatch links will carry a Klaviyo domain rather than Hartwick's. That is a
spend, so it is Aloha's, and it is not recommended for launch.

**Why Verify cannot wait, and why nothing happens without it:** `ns1–4.klaviyo.com`
currently return `REFUSED` for `send.hartwickatelier.com`. That is not a fault and not
propagation — with the NS setup Klaviyo stands the zone up on their side *when you verify*.
Until the button is pressed, the delegation points at nameservers hosting nothing. Klaviyo's
Verify is a manual action; nothing is queued or running in the background.

Proof to run after verifying:

```bash
dig +short SOA send.hartwickatelier.com @ns1.klaviyo.com
dig +short NS send.hartwickatelier.com
```

A returned SOA means the zone is live inside Klaviyo. Empty still means not provisioned.

---

## Stage 2 — Prove the account can send

Independent of Stage 1 — a sender *address* and a sending *domain* are different things and
are easy to conflate.

- [x] **[Ivan]** Klaviyo → Settings → Account: is `contact@hartwickatelier.com` **verified**
      or **pending**? *Reported done 10 Sep. The API does not expose sender-verification
      state, so this one rests on Ivan's reading of the UI — it is the only item in this file
      not independently confirmed from outside.*
- [ ] **[Ivan]** If pending, confirm the mailbox actually exists. MX points at Google
      Workspace, but that does not mean `contact@` was ever created — and a bounced
      verification looks identical to an unclicked one.
- [ ] **[Blocked → Angela]** If the mailbox doesn't exist, it needs creating. A Google Group
      is still the better shape than a licensed user: free, replies reach several people,
      survives staff change. Posting permission must allow **anyone**, including external
      senders, or it silently rejects both Klaviyo's verification mail and every customer
      reply.
- [ ] **[Blocked → Christina/Aloha]** USD vs CAD, given the BC entity.

Nothing sends until: sending domain verified **and** selected · sender address verified ·
postal address filled. All three, or nothing goes out.

---

## Stage 3 — Account structure (~10 min)

Blocks Stage 5, so do it before the forms.

- [ ] **[Ivan]** Rename `Email List` (`Wf4A23`) → **The Register**. **Rename, do not
      create** — the Shopify integration is already pointed at that list ID. There is no
      list-rename route in the API toolset, so this is a UI job.
- [ ] **[Ivan]** Create list **`Circle Requests`** — separate from The Register. Different
      consent, different expectation. Never merged, in either direction.
- [ ] **[Ivan]** Leave `Preview List` alone.
- [ ] **[Ivan]** Archive the nine auto-created segments, or keep them knowingly. None of
      them reflect Lot / Style / Register-source, which is the model that matters here.
- [ ] **[Claude]** Verify via API that the integration's sync target followed the rename and
      that both lists still read `double_opt_in`.

---

## Stage 4 — Turn tracking on (~15 min, do this first of the parallel work)

Closes B2. Highest value per minute of anything left, and entirely in Ivan's hands.

- [x] **[Ivan]** Online Store → Themes → **Customize** on the **dev** theme → **App embeds**
      → enable **Klaviyo Onsite Javascript**. *Reported done 10 Sep.*
- [ ] **[Ivan]** Load a product page on the dev theme preview.
- [ ] **[Claude]** Query `Active on Site` and `Viewed Product` — confirm they move off zero,
      and that `Viewed Product` increments by exactly **1**, not 2. **Still zero as of the
      last check.** See the note below before treating that as a fault.
- [ ] **[Ivan]** Shopify → Settings → **Customer events**: is a Klaviyo pixel listed? If yes,
      the app embed is a duplicate and one of the two must go. Never both, and never either
      plus a hand-pasted `klaviyo.js` snippet — doubled events corrupt every flow trigger
      and every segment built on them.
- [ ] **[Ivan or Blocked → Angela]** Settings → **Customer privacy** → cookie banner on,
      regions set (EU/UK/California **and Canada**). Needs the **Settings** collaborator
      permission from the 8 September tick-list. Configure this *before* any pixel, or
      tracking runs without a lawful basis.
- [ ] **[Blocked → Christina/legal]** Whether POPIA applies — it decides whether South
      Africa joins the banner regions. A legal call, not a developer one.

**Why zero events is not yet evidence of a fault.** Klaviyo's `Active on Site` and
`Viewed Product` only attach to a *profile*, and a browser is anonymous until it is
identified — by submitting a Klaviyo form, or by arriving via a tracked email link. An
anonymous first visit is cookied but creates no profile event. So the honest test is: submit
the Register form with a `+tag` address from that browser, then load a product page, and the
events appear. Until the forms exist (Stage 5), the cleanest proof is simply that
`klaviyo.js` is present in the dev theme's page source.

The local repo cannot confirm the embed either way: `config/settings_data.json` here was last
touched 4 September and still lists only `instafeed`. App-embed state was written to the
**remote** dev theme by the customiser, so the remote theme is the source of truth, not this
working copy.

---

## Stage 5 — Forms and source attribution (~90 min)

> **Superseded 14 September — the forms are the theme's own, posting to Klaviyo.**
> The embedded Klaviyo form (`XiXtvW`) worked end-to-end on 14 Sep (profile,
> `register_source`, consent, double opt-in all confirmed) but could not be made to
> match the design without keeping the palette in Klaviyo as well as the theme. So
> `ha-register` and `ha-circle-request` now submit their existing markup to Klaviyo's
> client subscription endpoint via `assets/ha-klaviyo-form.js`. Company ID and both
> list IDs are theme settings (Hartwick → Klaviyo); each placement sets its own
> `register_source`. Consent checkbox is required and never pre-ticked; wording is a
> labelled placeholder until Christina's lands. Circle city/note fields are now real
> (`city_country`, `circle_note`), interests travel as `circle_interests`. Lost:
> Klaviyo's own `Form viewed / submitted` metrics. Kept: everything the brief
> requires. Form `XiXtvW` stays in Klaviyo, unpublished, as the fallback.
>
> **[Ivan]** on the dev theme: push · remove the Klaviyo app block from the Register
> section (homepage) and the Circle section · tick "Show the form" on both · submit
> `+register02` and `+circle01` · click the Register confirmation · load a product
> page. **[Claude]** then verifies list, source, consent and that `Viewed Product`
> attached to the profile.

**The original plan for this stage, kept for the record:** `ha-register.liquid` already accepts `@app` blocks
and already carries the `show_native_form` switch. If Klaviyo's Shopify app exposes a
sign-up-form app block, it drops straight in and no theme change is needed.

- [ ] **[Ivan]** Klaviyo → Sign-up forms → **Embed** form (not popup) → The Register.
- [ ] **[Ivan]** Add a hidden field **`register_source`**, unique per placement:
      `homepage_band`, `footer`, `product_page`, `circle_page`. This is the point of the
      whole exercise — it is the one thing that answers "which CTA actually works" at
      launch.
- [ ] **[Ivan]** Add the consent checkbox. Wording ships as a clearly-labelled placeholder
      until Christina delivers.
- [ ] **[Ivan]** Check the customiser's block list for a Klaviyo form app block.
- [x] **[Claude]** **`ha-circle-request.liquid` now accepts `@app` blocks.** It previously
      declared only `interest` blocks, so the Klaviyo form had nowhere to go — `ha-register`
      accepted `@app` and the Circle section did not. Added the same block loop and a
      `show_native_form` switch mirroring `ha-register`, so the Klaviyo form drops straight
      in. *No `klaviyo_form_id` setting is needed unless Klaviyo turns out to expose no app
      block at all; both sections are now ready either way.*
- [ ] **[Ivan]** In `ha-circle-request`, switch **"Show the Shopify form"** off once the
      Klaviyo block is in — and note it is **not** the Framework v3 switch. "Show the access
      form" is the one that removes the application route; the new one only decides who
      carries the form when there is one. The schema `info` says so at the point of use.
- [ ] **[Ivan]** Switch **"Show the Shopify form"** OFF in the section settings. Never both
      forms live at once.
- [ ] **[Ivan]** Repeat for the Circle request form → `Circle Requests`. With Klaviyo
      carrying it, the **city and note fields can finally be enabled** — they were disabled
      only because Shopify's customer form cannot store them.
- [ ] **[Blocked → Christina]** Consent line for The Register (outstanding since
      4 September) and for the Circle form.

**The Circle constraint stands regardless of Klaviyo.** `Circle Requests` is its own list.
No flow may send anything that reads as acceptance into an invitation-only group. If
Christina rules against the public form, `show_form` off in `ha-circle-request` removes the
application route and the list simply stops receiving — nothing else changes.

---

## Stage 6 — Flows, in draft only (~45 min)

- [ ] **[Ivan]** Welcome to The Register — trigger: added to The Register.
- [ ] **[Ivan]** Abandoned checkout — trigger: `Checkout Started`.
- [ ] **[Ivan]** Circle request acknowledgement — trigger: added to `Circle Requests`.
- [ ] **[Ivan]** **Leave all three in DRAFT.**
- [ ] **[Blocked → Christina]** All copy: the double opt-in confirmation, the Welcome, and
      the Circle acknowledgement. The last needs the most care — it must not read as
      acceptance.

A live flow carrying placeholder copy emails a real person. These go live only when the
words land *and* Aloha approves.

---

## Stage 7 — Prove it, don't assume it (~45 min)

Use `+tag` addresses throughout so every test profile can be found and deleted.

- [ ] **[Ivan]** `you+register01@…` through the Register form.
      **[Claude]** confirm: profile created, on The Register, correct `register_source`,
      consent recorded as expected.
- [ ] **[Ivan]** Double opt-in mail arrives; the link flips the profile to subscribed.
- [ ] **[Ivan]** `you+circle01@…` → lands in `Circle Requests`, **not** The Register.
      **[Claude]** verify.
- [ ] **[Ivan]** One test order end-to-end. **[Claude]** confirm `Placed Order` with the
      correct revenue.
- [ ] **[Ivan]** Decline non-essential cookies in a private window → confirm pixels do not
      fire.
- [ ] **[Ivan]** Shopify → Analytics → **Live View** shows the session.
- [ ] **[Claude]** List every test profile for deletion, plus the empty setup profile
      `01M1Y07E7GVKW9SKS0FFT997SB`.
- [ ] **[Ivan]** Delete them **before** launch — otherwise the first Dispatch open rate is a
      lie.

---

## Stage 8 — Launch day / cutover

**Unowned and undecided.** Aloha's ask #1 — is 10 September a live-domain launch, and who
performs the cutover — is still unanswered. That is a decision, not a task, and it is not
ours to make.

Establish *before* the cutover, not during it:

- [ ] **Can Shopify's DNS hold `NS` records on a subdomain?** If the zone moves to Shopify
      and it cannot, sending breaks at the moment of cutover with no in-place fix. Keeping
      the zone at Squarespace and pointing only A/`www` at Shopify avoids the problem
      entirely.

If it proceeds:

- [ ] **[Ivan]** Publish the theme.
- [ ] **[Ivan]** **Re-open App embeds on the now-live theme** and confirm Klaviyo Onsite is
      still enabled. Embed settings live in each theme's `settings_data.json` and do not
      carry across from the dev theme. This is the classic launch-day miss.
- [ ] **[Claude]** Re-run the full `dig` set: `send` delegation, both root TXT, `_dmarc`,
      and MX.
- [ ] **[Ivan]** Send one test message to and from a Google Workspace address to prove
      Angela's mail still flows.
- [ ] **[Ivan]** Confirm the sending domain still shows verified in Klaviyo.
- [ ] **[Ivan]** Flows live **only** if copy is approved. Otherwise they stay in draft and
      that is stated plainly in the update.

Whoever performs the cutover changes the **A record and the `www` CNAME only**. Replacing
the zone wholesale is the usual way a migration takes a client's email offline — and here it
would also orphan the entire `send` subdomain at once, taking DKIM, return-path and link
tracking with it, because those only ever existed inside Klaviyo's zone.

---

## What stays blocked regardless of effort

| Item | Owner | Blocks |
|---|---|---|
| Five pieces of copy (consent ×2, confirmation, welcome, Circle ack) | Christina, via Aloha | Publishing forms; flows going live |
| Cutover decision and owner | Aloha | Stage 8 entirely |
| Public Circle form — keep or remove | Christina / Framework v3 | Nothing; built behind a switch either way |
| Cookie-banner regions incl. POPIA | Christina / legal | Stage 4 completeness |
| USD vs CAD | Christina | Revenue reporting accuracy |
| Sending mailbox, if `contact@` doesn't exist | Angela | All sending |
| Shopify **Settings** permission | Angela | Consent banner only |

---

## Verification commands, in one place

```bash
# Delegation, from the authoritative source rather than a cache
dig +short NS send.hartwickatelier.com @ns01.squarespacedns.com

# Is Klaviyo serving the delegated zone? (empty until Verify is clicked)
dig +short SOA send.hartwickatelier.com @ns1.klaviyo.com

# The three TXT records
dig +short TXT hartwickatelier.com
dig +short TXT _dmarc.hartwickatelier.com

# MX intact — Angela's email
dig +short MX hartwickatelier.com

# Cutover state
dig +short A hartwickatelier.com; dig +short CNAME www.hartwickatelier.com
```

---

## Suggested order for the rest of today

1. **Stage 1** — click Verify. Two minutes, and it unblocks the 24–48h clock properly.
2. **Stage 4** — app embed. Fifteen minutes, closes a blocker open since 7 September.
3. **Stage 3** — lists. Ten minutes, unblocks Stage 5.
4. **Stage 2** — read the sender-address status while you're in Settings anyway.
5. **Stage 5** — the forms. The real 90 minutes.
6. **Stage 6** then **Stage 7**.

Stages 2–7 are all independent of DNS. Only Stage 8 depends on it.
