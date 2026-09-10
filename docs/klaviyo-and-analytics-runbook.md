# Klaviyo + Analytics Runbook — Hartwick Atelier

Written 7 September 2026. Launch is 10 September.
Order matters. Doing step 4 before step 2 creates duplicate lists and split profiles.

---

## 0. Before you touch anything — audit the account you were given

Angela's Klaviyo account is not a blank account until you have proved it is. Open it and
record what you find, because two of these findings change the plan.

| Check | Where | Why it matters |
|---|---|---|
| Is a Shopify store already connected? | Integrations → All integrations → Shopify | Klaviyo's native Shopify integration is **one store per account**. If a different store is connected, connecting `9c8a52-dc` is not a small decision — it is Aloha's call, and possibly a second Klaviyo account. |
| Existing lists and profiles | Audience → Lists & segments | A legacy "Newsletter" list with old subscribers changes the consent position. Imported profiles with no consent record cannot be mailed. |
| Account owner and users | Settings → Account → Users | You are admin. Note who else is. |
| Sending domain status | Settings → Domains (or Account → Domains) | If nothing is authenticated, this is the critical path — see §2. |
| Plan tier | Settings → Billing | Free tier is 250 contacts / 500 sends per month. Confirm launch volume fits. |
| Existing flows / campaigns | Flows, Campaigns | Anything live could email people on launch day without anyone deciding to. |

Write the findings into the daily update. If a different store is already connected, stop
and ask Aloha before doing anything else.

### A scope note to raise with Aloha

The Shopify collaborator access requested in `audit-and-plan.md` §H deliberately excluded
**Customers (PII)** and **Orders**. Klaviyo admin includes every customer profile, email
address, order history and revenue figure — so this access is materially wider than what
was asked for on the Shopify side. That is probably fine and probably intended, but it
should be *said*, not assumed. Two options worth offering:

- Keep admin (needed for sending-domain and integration setup), and note the widened
  scope in the daily update.
- Drop to **Manager** after setup is complete, which covers day-to-day work without
  account-level control.

Either is defensible. Silence is not.

---

## 1. Install the Shopify ↔ Klaviyo integration

**Who can do this:** whoever can install apps in Shopify. Collaborator access as scoped in
§H does **not** include app install/billing, so this is likely Gareth or Angela. Line it up
before you need it.

1. Shopify Admin → **Apps** → search **Klaviyo: Email Marketing & SMS** → Install.
   (Install from the Shopify side, not the Klaviyo side — it authorises cleanly.)
2. Sign in with **Angela's Klaviyo account**, not a personal one.
3. In the connection settings, set:
   - **Sync Shopify customers who have accepted marketing** → to the list you create in
     §3. Do *not* leave it pointed at a default "Newsletter" list.
   - **Historical order sync** → on (harmless on a new store; gives Klaviyo revenue data
     if any test/legacy orders exist).
   - **Onsite tracking / web pixel** → on. See §6 for the duplicate-tracking trap.
   - **Subscribe customers who check the marketing checkbox at checkout** → on.

### Consent sync — read this before flipping switches

Klaviyo syncs Shopify's marketing consent state both ways. If Angela's Klaviyo has legacy
profiles with no consent record, syncing can push or pull consent states you did not
intend. On a new store this is a non-issue; if §0 found legacy data, sync **Shopify →
Klaviyo only** at first and check the numbers before enabling the reverse.

---

## 2. Sending domain — do this FIRST, it is the only step with a clock on it

Klaviyo will send from a shared domain by default. For a brand launching to a waitlist,
that is poor practice and hurts deliverability. Authenticating a dedicated sending domain
requires DNS records, DNS propagation (up to 48h), and then Klaviyo's own verification.
**Launch is 10 September. Start today.**

1. Klaviyo → **Settings → Domains → Add a sending domain**.
2. Klaviyo gives you 3–5 **CNAME** records (DKIM keys, a bounce/return-path subdomain,
   and usually a link-tracking subdomain).
3. Send them to **Gareth** — DNS is not yours. Give him the records verbatim, in a table,
   with a note that they are CNAMEs and must not have the root domain appended twice
   (the single most common DNS mistake with these).
4. Wait, then hit **Verify** in Klaviyo. Do not send anything until it verifies.
5. Ask Gareth to confirm whether a **DMARC** record exists at `_dmarc.<domain>`. If none
   exists, `v=DMARC1; p=none; rua=mailto:...` is the safe launch value — monitoring only,
   no rejection. Do not set `p=reject` before launch.

**If DNS cannot be done in time:** send from Klaviyo's shared domain for launch and swap
after. Say so explicitly in the daily update — it is a deliverability risk, not a blocker.

---

## 3. Lists, and the terminology that is not negotiable

Klaviyo's own vocabulary and Hartwick's do not match. Map it once, deliberately.

| Hartwick term | Klaviyo object | Notes |
|---|---|---|
| **The Register** | One **list**, named `The Register` | The single public list. Every newsletter CTA on the site feeds this. |
| **The Dispatch** | **Campaigns** sent to The Register | Not a list. It is the editorial newsletter itself. Naming convention: `Dispatch — <date> — <subject>`. |
| **The Circle** | A **segment** or a manually-managed list, never a public signup | Invitation-only under Framework v3. No form feeds it. |
| Circle *requests* | A separate list: `Circle Requests` | Aloha's 4 Sep instruction. This is the disputed route — see §7. |
| The Lot / Style / Expression | **Profile properties** and **event properties** | Not lists. Never build a list per Lot. |

Rename Klaviyo's default "Newsletter" list to `The Register` rather than creating a second
one — the Shopify integration may already be pointed at it.

### Opt-in process — a decision needed today

Per list, Klaviyo offers single or double opt-in (List → Settings → Opt-in process).

**Recommendation: double opt-in for The Register.** A brand-new sending domain with zero
reputation, mailing a list of unconfirmed addresses collected pre-launch, is the standard
way to land in spam on day one. The Register's value is quality, not volume. Double opt-in
also gives you a defensible consent record under GDPR/POPIA.

**Cost of that choice:** it needs one confirmation email's copy, which is Christina's, not
yours. Ask for it today or the choice makes itself.

---

## 4. Wiring the forms

Two routes. They are not equivalent.

### Route A — keep the Shopify customer form (current state)
`ha-register.liquid` posts to Shopify's own customer form, and Klaviyo syncs the resulting
customer across. Works today, zero extra config.
**Limits:** no source attribution beyond a tag, no custom fields, sync is not instant, and
the city/note fields on the Circle page stay off because Shopify cannot store them.

### Route B — Klaviyo form (recommended)
Klaviyo carries the form directly. You get source properties, arbitrary custom fields, an
immediate profile, and the two disabled Circle fields become real.

1. Klaviyo → **Sign-up forms → Create form → Embed** (not popup — the wireframe has a
   fixed field in the dark band; a popup is a different design decision and Aloha has not
   asked for one).
2. Build the fields, point the form at `The Register`, and set a **hidden field** or a
   form-level property carrying the source, e.g. `register_source = homepage_band`.
3. Klaviyo gives you an embed ID — a `div` with a class like `klaviyo-form-XXXXXX`.
4. In the theme customiser, open the Register section:
   - If Klaviyo's app offers an **app block**, add it via the section's block picker —
     `ha-register` already accepts `@app` blocks, so it drops straight in.
   - If it does not, the embed `div` needs to go in the section. Ask me and I'll add a
     `klaviyo_form_id` setting to `ha-register` and `ha-circle-request` so the ID is
     pasted in the customiser rather than hard-coded. ~20 minutes.
5. Switch **"Show the Shopify form"** off in the section settings. Do not leave both on —
   two forms in one band, and duplicate profiles.
6. Repeat for the footer newsletter and any other CTA, each with a **different**
   `register_source` value. This is the whole point of doing it this way.

### Consent line
The consent wording is a **placeholder** and is Christina's, per `aloha-2026-09-04-response.md`.
Do not write final consent copy, and do not ship the placeholder to a published theme.
Klaviyo's form editor has its own consent checkbox — use it, wire it, leave the words
pending.

---

## 5. Flows — plumbing only, copy is not yours

Build the structure, leave the words as clearly-marked placeholders for Christina.

**Phase 1, launch-necessary:**
- **Welcome to The Register** — trigger: added to The Register. One email. If double
  opt-in is on, this fires after confirmation.
- **Abandoned checkout** — trigger: Started Checkout. Native to the Shopify integration.
- **Circle request received** — trigger: added to `Circle Requests`. An acknowledgement,
  not an acceptance. The wording here is delicate: it must not imply admission to an
  invitation-only group. Christina's, definitively.

**Not Phase 1:** browse abandonment, back-in-stock, post-purchase series, anything touching
**Reserve** (deposits are Phase 2 and explicitly out of scope).

Leave every flow **in draft** until Aloha has approved the copy. A live flow with lorem
ipsum will email a real person.

---

## 6. Shopify analytics and tracking

### 6a. Consent first, pixels second
Shopify Admin → **Settings → Customer privacy**.
- Turn on the **cookie banner**, set the regions where it shows (EU/UK/CA at minimum;
  add South Africa if the store trades under POPIA — that is a legal call, flag it to
  Christina rather than deciding it).
- Set data-sale/sharing preferences.
- This drives Shopify's Customer Privacy API, which Klaviyo and every properly-built pixel
  respect. Configure it **before** adding pixels, or you have tracking running without a
  lawful basis.

### 6b. What you get free, with no work
Shopify's own analytics (Analytics → Reports): sessions, conversion rate, AOV, top
products, traffic sources. It requires no setup and no pixel. For a launch this size it may
genuinely be enough — say so rather than installing things by reflex.

### 6c. GA4 — if Aloha wants it
Use **Shopify Admin → Sales channels → Google & YouTube** app. Connect the GA4 property
there. It installs a consent-aware pixel that covers checkout too.

**Do not** paste `gtag.js` or GTM into `theme.liquid`. It misses checkout entirely (Shopify
sandboxes checkout), it ignores the consent banner, and it is exactly the kind of
hard-coded change this build has avoided everywhere else.

If GTM is genuinely required, the supported route is
**Settings → Customer events → Add custom pixel**, which runs sandboxed and consent-aware.

### 6d. Meta / TikTok pixels
Only if there is a paid-media plan. Ask Aloha before installing — each one is a third-party
data flow that belongs in the privacy policy. Same route: the official sales-channel app,
not theme code.

### 6e. The duplicate-tracking trap
Klaviyo's current Shopify app installs onsite tracking **for you**, as a Shopify web pixel.
Older setup guides tell you to paste `klaviyo.js` into `theme.liquid`. **Do not do both** —
you get doubled `Active on Site`, `Viewed Product` and `Added to Cart` events, which
corrupts every flow trigger and every segment built on them.

Check which method your install used:
- Shopify → **Settings → Customer events** → is there a Klaviyo pixel listed?
- Online Store → Themes → **Customize → App embeds** → is "Klaviyo Onsite Javascript" on?

One of these. Not both, and never plus a manual snippet.

### 6f. App embeds are per-theme — the gotcha that bites at launch
App embed settings live in each theme's `settings_data.json`. Enabling Klaviyo's embed on
the **live** theme does **not** enable it on your unpublished dev theme, and vice versa.

So: enable it in the dev theme to test — and then, **after publishing on 10 September**,
re-open App embeds on the now-live theme and confirm it is still on. Put this on the
launch-day checklist, not in your memory.

---

## 7. The Circle conflict — do not let Klaviyo settle it

Framework v3: The Circle is invitation-only, no public form, no application route.
Aloha's 4 Sep email: Circle form submitters should be added to the list.

`ha-circle-request.liquid` already resolves this with a one-click switch — the form is
built, and `show_form` off removes the application route while leaving the page intact.

Keep that shape in Klaviyo:
- `Circle Requests` is its own list, **separate** from any list representing actual Circle
  members.
- No Klaviyo flow may send anything that reads as acceptance.
- If Christina rules against the public form, you switch `show_form` off and the list
  simply stops receiving. Nothing else has to change.

Do not merge Circle requests into The Register either — different consent, different
expectation.

---

## 8. Event map for Phase 1

**Automatic from the Shopify integration** (no work):
`Placed Order` · `Ordered Product` · `Fulfilled Order` · `Cancelled Order` ·
`Refunded Order` · `Started Checkout` · `Active on Site` · `Viewed Product` ·
`Added to Cart`

**Worth adding, cheap, high value:**

| Event / property | Set by | Used for |
|---|---|---|
| `register_source` | Hidden field per form placement | Which CTA actually works. Answers a real question at launch. |
| Circle request fields (city, note) | Klaviyo form, Route B | Turns on the two fields currently disabled. |
| `lot_interest` / `style_interest` | Profile property, set from a Lot or Style page form | Segmenting by Lot without a list per Lot. |

**Deliberately not tracked in Phase 1:** anything supporting Reserve, and any custom event
duplicating what the integration already sends.

---

## 9. Verification — prove it, don't assume it

Before you report this as done:

1. **Onsite tracking live?** Open the dev theme preview, then Klaviyo → Analytics →
   Metrics → `Active on Site`. Your visit should appear within a few minutes.
2. **Viewed Product firing once, not twice?** Visit one product page. Check the metric
   count incremented by exactly 1.
3. **Form → profile.** Submit The Register form with a tagged test address
   (`you+register01@gmail.com`). Confirm: profile created, on `The Register`, with the
   correct `register_source`, and consent recorded as expected.
4. **Double opt-in works** (if enabled) — confirmation email arrives, link confirms,
   profile flips to subscribed.
5. **Circle request lands separately** — `you+circle01@gmail.com` → `Circle Requests`,
   **not** The Register.
6. **Consent banner** — decline non-essential in a private window, confirm pixels do not
   fire.
7. **Checkout** — one test order end-to-end. Confirm `Placed Order` appears in Klaviyo
   with the right revenue.
8. **Shopify analytics** — the session shows in Analytics → Live view.

Use `+tag` addresses throughout so every test profile can be found and deleted afterwards.
Delete them before launch, or your first Dispatch open rate is a lie.

---

## 10. Who has to do what

| Task | Who | Blocking? |
|---|---|---|
| Install Klaviyo app in Shopify | Gareth / Angela (app install ≠ collaborator scope) | Yes — everything downstream |
| DNS records for sending domain | Gareth | Yes, with a 24–48h clock |
| Consent wording (Register + Circle) | Christina, via Aloha | Yes for publishing |
| Confirmation email copy (double opt-in) | Christina | Only if double opt-in |
| All flow copy | Christina | Flows stay in draft until then |
| GA4 / Meta — wanted or not? | Aloha | Small, but ask before installing |
| POPIA applicability | Christina / legal | Affects banner regions |
| Everything else | You | |

---

## 11. Suggested order for today and tomorrow

**Today (7 Sep), ~45 min, unblocks everything:**
1. Audit the Klaviyo account (§0). Report findings.
2. Raise the PII scope note with Aloha (§0).
3. Start the sending domain, send DNS records to Gareth (§2). **This is the clock.**
4. Ask Aloha for: app install, GA4/Meta decision, and Christina's consent + confirmation
   copy. One email, four asks.

**Tue 8 Sep, the 5 hrs the plan allots:**
5. Install and configure the integration (§1) — 45 min
6. Lists, naming, opt-in setting (§3) — 30 min
7. Klaviyo forms, embed into the theme, source properties (§4) — 90 min
8. Consent banner + GA4 if wanted (§6a, §6c) — 45 min
9. Flow skeletons in draft (§5) — 45 min
10. Full verification pass (§9) — 45 min

**10 Sep, launch day:** re-check App embeds on the published theme (§6f), delete test
profiles, take flows out of draft only once copy is approved.

---

# §0-RESULT — Audit findings, 7 September 2026

Read-only audit performed via the Klaviyo MCP server (`READ_ONLY=true`). No writes made.
Account `XK6Wjs` — "Hartwick Atelier", `hartwickatelier.com`. Not a test account.

## The good news — most of §0's worries are cleared

| Worry | Finding |
|---|---|
| Another Shopify store already connected? | **No.** Account created today, 13:14 UTC. Shopify integration connected at 13:14:56 — this store, no prior one. The "one store per account" risk is gone. |
| Legacy lists with unclear consent? | **No legacy lists.** Only Klaviyo's two auto-created defaults. |
| Live flows that could email someone? | **Zero flows exist.** Nothing can fire. |
| Live or scheduled campaigns? | **Zero campaigns.** Nothing queued. |
| Plan/volume | 4 profiles total. Free tier is not close to a constraint. |

**The Shopify integration is already installed** — runbook §1 is done. Metrics are
scaffolded for Placed Order, Ordered Product, Fulfilled Order, Cancelled Order, Refunded
Order and Checkout Started, all under the `shopify` integration key.

## Three blockers, in order of severity

### B1 — The account cannot send email at all
`default_sender_email` is **empty**, and the organisation's street address is **entirely
null** (only `country: United States` is set).

A marketing email needs both: a verified sender address, and a physical postal address in
the footer. The postal address is a legal requirement under CAN-SPAM and its equivalents,
and Klaviyo enforces it. Until both are filled, no campaign and no flow can go out — the
Welcome flow included.

**Needs:** Angela's sending address and Hartwick's registered postal address. Ask today.

### B2 — Onsite tracking has never fired
`Active on Site` and `Viewed Product` metrics exist but hold **zero events**. Every event
in the account (8 total) is a list/consent event. No storefront activity has ever reached
Klaviyo.

This is exactly runbook §6f: the Klaviyo app embed is not enabled on the theme, or the
theme carrying it has never been visited. Nothing is broken — it has simply never been
switched on. Enabling it on the dev theme and loading a product page will prove it.

### B3 — Sending domain: unknown, and I cannot check it
**Correction to what I told you earlier:** I said I could pull the DKIM records via the
API. I was wrong — the read-only toolset loaded here has no sending-domains tool. That
check is a UI job: **Settings → Domains**.

This still has the 48-hour DNS clock against a 10 September launch, so it remains the
first thing to look at. Nothing about the audit has made it less urgent.

## Four things to decide

### D1 — The account is scaffolded as a US business
Timezone `America/Los_Angeles`, currency `USD`, locale `en-US`, country `United States`.

If that matches the brand, fine. If Hartwick reports in another currency or sends from
another timezone, both are wrong now and awkward to change once revenue data exists —
campaign send-time scheduling and every revenue figure inherit these. Confirm with Aloha
before the first send, not after.

### D2 — The lists are unnamed defaults
Two lists exist, both Klaviyo's own scaffolding:

| List | ID | Opt-in |
|---|---|---|
| `Email List` | `Wf4A23` | double opt-in |
| `Preview List` | `UmZsaa` | double opt-in |

Neither is **The Register**. Per §3, rename `Email List` → `The Register` rather than
creating a third list, because the Shopify integration is probably already pointed at it.
`Preview List` is Klaviyo's internal preview-recipient list — leave it alone.

Both defaulting to **double opt-in** matches the §3 recommendation. That means the
confirmation email copy is now on the critical path, and it is Christina's.

### D3 — Nine auto-created segments, none of them ours
Klaviyo scaffolded: VIP Customers, Potential Purchasers, Repeat Buyers, Win-Back
Opportunities, Churn Risks (all Shopify), plus Engaged 30/60/90 Days and New Subscribers.

All harmless and all empty. They are not wrong, but they are not Hartwick's model either —
no Lot, Style or Register-source segmentation exists yet. Decide whether to keep them as
starters or archive them so the account reflects the actual brand structure.

### D4 — Existing profiles carry imported consent
Four profiles exist. Three are real people — Angela's, Christina's, and Ivan's own
addresses. One is empty with no events (created 13:16:54, likely a setup artifact).

Their `Subscribed to List` events are dated **3 August** and **28 August 2026** — before
this account existed. So consent was **imported with historical timestamps**, not collected
here. That is legitimate if there is a documented source, and a liability if there is not.
Ask Aloha where those three came from and keep the answer on file.

**One oddity worth a question:** Angela's profile was `Manually Suppressed` at 13:15:47
today and `Manually Unsuppressed` eight seconds later at 13:15:55. Almost certainly a
setup artifact, but it is the only manual consent action in the account, so it is worth
confirming nobody meant it.

## What the audit could not reach

Not visible through the read-only MCP toolset, and still needing the Klaviyo UI or Shopify
admin:

- Sending domain / DKIM status (**B3** — the urgent one)
- Shopify integration *sync settings* — which list it feeds, historical sync, consent
  sync direction
- Account users and roles
- Billing tier confirmation
- Sign-up forms
- Shopify App embed state, Customer events, and the consent banner

## Revised priority for today

1. **Settings → Domains** — start the sending domain, get the CNAMEs to Gareth. (B3)
2. **Ask Aloha for:** sender address + registered postal address (B1), currency/timezone
   confirmation (D1), and the provenance of the three imported profiles (D4).
3. **Ask Christina, via Aloha, for:** the double opt-in confirmation copy (D2) and the
   consent wording already outstanding since 4 September.
4. Enable the Klaviyo app embed on the dev theme and load a product page to prove B2.

Renaming the list, archiving segments and building flows are all **writes** — they wait for
Ivan's go-ahead and a non-read-only connection.

---

# §12 — Domain and DNS findings, 7 September 2026

Checked from public DNS. No credentials used, no logins performed.

## What `hartwickatelier.com` actually is right now

| Record | Value | Means |
|---|---|---|
| Registrar | **GoDaddy** (created 31 Mar 2024, expires 31 Mar 2028, transfer-locked) | Angela's GoDaddy login controls the *registration*. |
| Nameservers | `ns01–04.squarespacedns.com` + `dns1–4.p09.nsone.net` | **DNS is delegated to Squarespace.** The live zone is not at GoDaddy. |
| Apex A | `198.185.159.144/145`, `198.49.23.144/145` | Squarespace. |
| `www` | `CNAME → ext-sq.squarespace.com` | Squarespace. |
| MX | `aspmx.l.google.com` + alts | **Email is Google Workspace.** |
| SPF | **none** | No `v=spf1` record exists at all. |
| DMARC | **none** | `_dmarc` is empty. |
| `klaviyo` / `email` / `send` / `track` subdomains | none | Nothing set up yet. |

## F1 — The GoDaddy credentials do not edit DNS

This is the crux. GoDaddy is the **registrar**; Squarespace is the **DNS host**. The
nameservers point away from GoDaddy, so GoDaddy's own DNS panel is inert — records typed
there have no effect on the live domain.

The Klaviyo CNAMEs must be added **in Squarespace's DNS settings**, which needs a
Squarespace login, not a GoDaddy one.

**Do not "fix" this by pointing the nameservers back to GoDaddy.** That moves the whole
zone, and every record not manually recreated — the Squarespace site *and* Google Workspace
email — breaks at once. Three days before launch that is an unforced outage.

**Ask Angela for:** Squarespace access, or a named person there who can add four DNS
records on request.

## F2 — The launch domain currently runs a live Squarespace site

`hartwickatelier.com` serves Squarespace today. The Shopify build lives at
`9c8a52-dc.myshopify.com`.

Launching on 10 September therefore implies a **DNS cutover from Squarespace to Shopify** —
apex A record to Shopify's IP, `www` CNAME to `shops.myshopify.com`. That is a
business-visible event with downtime characteristics, and it appears **nowhere** in
`audit-and-plan.md`, the day-by-day plan, or the risk register.

This needs Aloha's answer before it needs any work:

- Is 10 September a **public launch on the live domain**, or a soft/internal launch with
  the Squarespace site staying up?
- Who decides when the Squarespace site comes down, and is anyone told first?
- Is there a redirect map from the old Squarespace URLs, or do they 404?

**The Google Workspace MX records must survive the cutover.** Replacing the zone without
carrying MX across is the single most common way a domain migration takes down a client's
email. Whoever performs it should change A and CNAME only, and leave MX and TXT untouched.

## F3 — No SPF and no DMARC on a domain that already sends mail

The domain sends through Google Workspace today with **no SPF record and no DMARC record**.
That is a pre-existing deliverability weakness, not something the Klaviyo work introduces —
but it is now in scope, because a first campaign from a cold setup into inboxes with no
sender authentication is how launch email goes to spam.

Minimum before the first send:
- **SPF** at the apex covering Google Workspace: `v=spf1 include:_spf.google.com ~all`
- **DMARC** at `_dmarc`: `v=DMARC1; p=none; rua=mailto:<address>` — monitoring only.
  Do **not** set `p=reject` before launch.
- Klaviyo's dedicated sending domain adds its own authenticated subdomain on top.

Flag to Aloha that this is a **pre-existing condition on Angela's domain**, found while
doing the Klaviyo work, and that fixing it touches the domain's existing email. It should
be an explicit instruction, not something done quietly.

## F4 — Credential handling

The GoDaddy customer number and password are **registrar-level control** — the ability to
transfer the domain, change nameservers, and reach the account that owns Hartwick's web
identity. It is the most sensitive credential in the business, and it does not even do the
job at hand (see F1).

Recommended instead, in order:
1. **GoDaddy Delegate Access** — grants a named account limited or full access without
   sharing the password, and is revocable in one click.
2. **Squarespace contributor access** for whoever adds DNS records, since that is where
   the records actually go.
3. Simplest of all: send the four Klaviyo CNAMEs to whoever holds Squarespace and have
   them paste them in. No access transfer needed at all.

Whatever is decided, the shared password should be **changed after launch** as a matter of
routine, and that should be said to Aloha rather than assumed.

---

## Updated blocker table

| # | Blocker | Unblocked by GoDaddy access? | Actually needs |
|---|---|---|---|
| B1 | No sender email, no postal address → account cannot send | **No** | Angela: sending address + registered postal address |
| B2 | Onsite tracking never fired | **No** | Shopify: enable Klaviyo app embed on the dev theme |
| B3 | Sending domain not started | **Partly** | Klaviyo UI to generate CNAMEs, then **Squarespace** to add them |
| F1 | DNS is at Squarespace, not GoDaddy | — | Squarespace access, or a person there |
| F2 | Launch-day domain cutover unscoped | **No** | Aloha: is 10 Sep a live-domain launch? |
| F3 | No SPF, no DMARC | **No** | Squarespace DNS + written instruction from Aloha |
| D2 | Double opt-in confirmation copy | **No** | Christina |
| — | Consent wording (open since 4 Sep) | **No** | Christina |

**Net: the GoDaddy credentials close none of the blockers on their own**, because the
records live at Squarespace. What they did do is surface F2 — an unscoped launch-day
domain cutover that was not in the plan, and is the largest new risk to 10 September.

---

# §13 — What you need in order to finish this yourself

Everything below is either information you must be *given*, access you must be *granted*,
or a decision someone else must *make*. Ordered by what unblocks the most.

## Tier 1 — has a clock, ask today

### 1.1 Squarespace DNS access (or a named person there)
The Klaviyo CNAMEs go in at Squarespace, not GoDaddy (§12/F1). Either you get access, or
you send the records to whoever holds it. **This is the 48-hour item.**

*Ask Angela. If unavailable, ask who administers the Squarespace site.*

### 1.2 The sending address — and who can verify it
Klaviyo needs a `default_sender_email`, and it **sends a verification email to that address**
before it will send anything. So you need either the mailbox itself, or Angela on hand to
click the link.

Email is Google Workspace, so the address should be a real mailbox on the domain.

- Which address sends The Dispatch? (e.g. `hello@`, `atelier@`, `register@`)
- Does that mailbox already exist in Google Workspace, or must it be created?
- Should **reply-to** differ from the sender?
- Who clicks the verification link?

*Ask Angela. Without this, nothing sends — not one flow, not one campaign.*

### 1.3 The registered postal address — complete
Currently null in Klaviyo. Legally required in the footer of every marketing email.
Needed in full: **street, city, region/state, postcode, country.**

*Ask Angela. Not optional and not something to approximate.*

### 1.4 Is 10 September a live-domain launch?
`hartwickatelier.com` runs a live Squarespace site today (§12/F2). This is unscoped
everywhere in the plan.

- Public launch on the live domain, or soft launch with Squarespace staying up?
- If live: who authorises the Squarespace site coming down, and is anyone told first?
- Redirect map from old URLs, or accept 404s?
- Who performs the cutover — you, or Squarespace/Gareth?

*Ask Aloha. This is the biggest open risk to the date, and it is not a dev decision.*

## Tier 2 — blocks building, no clock

### 2.1 Copy, all of it Christina's
You cannot write any of this yourself, and placeholder text must not go live.

| Needed | For |
|---|---|
| Consent line — The Register | The signup form. **Open since 4 September.** |
| Consent line — Circle request | The Circle page form. |
| Double opt-in confirmation email | Both lists are double opt-in (§0-RESULT/D2). |
| Welcome to The Register email | The one launch-necessary flow. |
| Circle request acknowledgement | Must not read as acceptance. Delicate. |

*Ask Aloha to route to Christina. Flag that flows stay in draft until it lands.*

### 2.2 Currency, timezone, trading entity
The account is scaffolded `USD` / `America/Los_Angeles` / `United States`. Awkward to change
once revenue data exists.

- Is USD correct for reporting?
- Which timezone should campaign send times use?
- Which country is the trading entity in? (Drives 1.3, and the consent-banner regions.)

*Ask Aloha. Confirm before the first send, not after.*

### 2.3 Where the three existing profiles came from
Angela's, Christina's and your own addresses carry `Subscribed to List` events dated
**3 and 28 August 2026** — before the account existed. Imported consent with historical
timestamps is fine with a documented source and a liability without one.

*Ask Aloha: where were these collected, and is there a record?*

## Tier 3 — decisions, quick but yours to obtain

| Question | Owner | Default if no answer |
|---|---|---|
| GA4 wanted? | Aloha | Yes — it's free and 5 minutes via the Google channel |
| Meta / TikTok pixel? | Aloha | No — don't install without a media plan |
| Consent banner regions (GDPR / UK / POPIA?) | Christina / legal | EU + UK on; ask about SA |
| Keep or archive the 9 auto-created segments? | You may decide | Archive; they don't match the brand model |
| Circle form on or off? | **Christina — open since 4 Sep** | Leave as built, switchable |
| Which list does Shopify sync feed? | You may decide | `The Register`, once renamed |
| Fix the missing SPF / DMARC? | Aloha, written | Do it — but never silently |

## What you do NOT need to ask anyone

These are yours, and none are blocked:

1. Rename `Email List` (`Wf4A23`) → **The Register**. Leave `Preview List` alone.
2. Create the `Circle Requests` list.
3. Enable the Klaviyo app embed: Online Store → Themes → Customize → **App embeds**.
   The dev theme currently carries only `instafeed`. Load a product page afterwards and
   confirm `Active on Site` fires — that closes B2.
4. Check **Klaviyo → Settings → Domains** and start the sending domain, so the CNAMEs exist
   to hand over under 1.1.
5. Check the Shopify integration's sync settings — which list, historical sync, consent
   direction.
6. Configure **Shopify → Settings → Customer privacy** (banner on, regions per Tier 3).
7. Build the forms in Klaviyo with a `register_source` per placement, then switch
   "Show the Shopify form" off in the section.
8. Place one test order to prove `Placed Order` reaches Klaviyo.
9. Delete every `+tag` test profile, and the empty setup profile
   (`01M1Y07E7GVKW9SKS0FFT997SB`), before launch.

## The single most valuable thing

**1.4 — the cutover question.** Every other item is work you can schedule. That one can
move the launch date, and nobody has asked it yet.

---

# §14 — Analytics without GA4: using Shopify's native reporting

Decision taken 7 September 2026. Supersedes §6c for Phase 1.

Nothing in `audit-and-plan.md` or the wireframes requires GA4. The mobile brief lists
"tracking requirements" generically. So native-only is a legitimate reading of the brief —
but it is a **scope decision**, and Aloha should be told it was taken, not left to discover
it.

## What Shopify gives you with zero setup

No pixel, no snippet, no consent category, no third-party data flow. Analytics → Reports:

**Traffic**
- Sessions over time; by traffic source, referrer, device, location, landing page
- **Live View** — real-time sessions, orders and visitor map

**Conversion**
- Online store conversion rate, and the funnel: sessions → added to cart → reached
  checkout → converted
- Conversion over time, and by traffic source

**Sales**
- Total and net sales, AOV, returning-customer rate
- Sales by product, by traffic source, by channel
- Top products by units and by revenue

**Customers**
- First-time vs returning, customer cohorts *(higher plans)*

⚠ **Report availability is plan-dependent.** Basic gets a reduced set; custom reports and
ShopifyQL need Shopify plan or above. I don't have Shopify admin, so I can't see which plan
Angela is on — check it before promising any specific report to the client.

## What you actually lose

Be honest about this rather than pretending native is equivalent.

| Lost without GA4 | Does it matter here? |
|---|---|
| Multi-session / assisted attribution | Barely. At launch volume, last-click is enough. |
| Custom funnels and path exploration | No — the funnel is short and Shopify reports it. |
| **Engagement on non-commerce pages** — Journal reading, scroll depth, time on page | **Yes. This is the real gap.** See below. |
| Audience export for ad platforms | Only if there's a paid media plan. There isn't one yet. |
| Cross-device user stitching | Klaviyo covers this better, by identity. |
| Google Search Console / Ads linking | Partly — see the recommendation. |

**The one genuine loss** is editorial engagement. Hartwick's site is unusually
content-heavy — the Journal, The Origin, Meet the Masters, the Material Record. Shopify's
analytics is commerce-shaped: it reports landing pages and sessions, but it will not tell
you whether anyone *read* a Masters story or how far down The Origin they scrolled. If
measuring the editorial is a stated goal, native alone won't do it and Aloha should know
that before it's decided.

## What compensates, and why this stacks up well

**Klaviyo carries the behavioural layer.** Once onsite tracking is on, you get
`Active on Site` and `Viewed Product` per identified person — not anonymous aggregates.
For a brand whose whole model is The Register, per-person behaviour is more useful than
GA4's session analytics.

**`register_source` answers the real launch question.** A hidden field per form placement
tells you which CTA actually converts — homepage band, footer, product page, Circle page.
That is the question worth asking at launch, and neither GA4 nor Shopify answers it. The
form does.

**Fewer data flows is a feature, not a compromise.** No GA4 means one less third party in
the privacy policy, one less consent category on the banner, and nothing to explain to a
customer who asks. For a brand positioning on discretion, that reads as deliberate rather
than cheap. It also saves hours against a 40-hour budget.

## Recommended Phase 1 stack

1. **Shopify native analytics** — on by default, nothing to do.
2. **Klaviyo onsite tracking** — the behavioural layer (still blocked on B2, the app embed).
3. **`register_source` on every form placement** — the attribution that matters.
4. **Google Search Console** — add it. It is *not* analytics and sets no cookie: it reports
   what Google's index sees, which queries surface the site, and any crawl errors after the
   domain cutover. Free, no consent implication, no pixel. Verification is a DNS TXT record
   or an HTML file — so fold it into the same Squarespace DNS trip as the Klaviyo CNAMEs.
5. **Nothing else.** No GA4, no Meta pixel, no GTM.

## This is reversible — say so

Choosing native now costs nothing later. If Aloha wants GA4 post-launch it goes on via
**Sales channels → Google & YouTube**, or a sandboxed custom pixel under
**Settings → Customer events**, in well under an hour. No theme rework, no rebuild, and the
Klaviyo work is untouched either way.

That reversibility is the argument to give Aloha: this isn't dropping a requirement, it's
declining to install something nobody has asked a question of yet.

## Still required regardless

Dropping GA4 does **not** remove the consent obligation. **Settings → Customer privacy**
still needs configuring — Shopify's own analytics and Klaviyo's onsite tracking both respect
the Customer Privacy API, and both need a lawful basis. Regions per §13 Tier 3.

## Reporting for the launch

Once there's data, launch-week questions worth a standing report:

- Sessions and conversion rate, by traffic source
- Top landing pages — does the homepage or a product page take the traffic?
- Register signups by `register_source` (Klaviyo, not Shopify)
- `Viewed Product` volume vs `Placed Order` — is the product page converting?

On Shopify plan or above these can be written as **ShopifyQL** queries rather than clicked
together by hand, which makes them repeatable week to week.

---

# §15 — Access-complete plan, 7 September 2026

Assumes: Ivan has **Klaviyo full admin**, a **Shopify Admin API token**, and Shopify
**collaborator** access to Online Store, Content and Products. Angela has Shopify owner,
Klaviyo owner, and **DNS**.

## The split — who gets asked what

`CLAUDE.md` records Aloha as the **sole route for scope and approvals**. Angela is access
and facts. Keep those separate or you create a second approval channel by accident.

| Goes to **Angela** | Goes to **Aloha** |
|---|---|
| Sending address + mailbox | Whether 10 Sep is a live-domain launch |
| Registered postal address | Whether the Squarespace site comes down, and when |
| DNS record insertion | Whether to fix the missing SPF/DMARC |
| Where the 3 imported profiles came from | GA4 dropped in favour of native analytics (§14) |
| Shopify Settings permission, or she configures consent herself | Consent-banner regions (via Christina) |
| Google Workspace mailbox creation | All copy (via Christina) |

## Part 1 — What to request from Angela

### Information (only she has it)

1. **The sending address.** Which mailbox sends The Dispatch — `hello@`, `atelier@`,
   something else? Does it exist in Google Workspace already, or must it be created?
   Should replies go elsewhere?
2. **Who clicks the verification link.** Klaviyo emails that address to verify it. Either
   you get mailbox access, or Angela is on hand for five minutes.
3. **The registered postal address, in full** — street, city, region, postcode, country.
   Legally required in every marketing email footer.
4. **Provenance of three existing profiles.** Hers, Christina's and yours carry
   subscription dates of 3 and 28 August, predating the account. Where were they collected?

### Actions only she can take

5. **Add DNS records at Squarespace** — the Klaviyo CNAMEs (you'll generate them), plus
   SPF and DMARC, plus a Google Search Console TXT record if §14 is agreed.
   *Bundle these into one request. Don't make her do four trips.*
6. **Configure Shopify → Settings → Customer privacy**, or grant you Settings permission.
   Collaborator access to Online Store / Content / Products does **not** reach Settings, and
   the consent banner lives there. Either route works — hers is faster, yours is more
   maintainable.
7. **Create the sending mailbox** in Google Workspace, if it doesn't exist.

### Access worth asking for while you're there

8. **Shopify Analytics permission** — requested in `audit-and-plan.md` §H, needed to read
   the reports §14 now depends on.
9. **Shopify Settings (read)** — to audit Payments/Shipping/Markets as originally scoped.

**Not worth asking for:** Klaviyo owner (admin covers everything you need), or Squarespace
access (one bundled DNS request beats an access transfer three days out).

## Part 2 — Step by step, once you have them

Timings are working estimates against the 5 hrs the plan allots to Tuesday 8 September.

### Stage A — Unblock the clock (30 min, do first)

**A1.** Klaviyo → **Settings → Domains** → add sending domain. Klaviyo generates 3–5
CNAMEs. Copy them exactly.
**A2.** Compose one DNS request to Angela containing: the Klaviyo CNAMEs, the SPF record
`v=spf1 include:_spf.google.com ~all`, the DMARC record
`v=DMARC1; p=none; rua=mailto:<address>`, and the Search Console TXT if agreed.
**A3.** State plainly in that message: **change nothing else.** The Google Workspace MX
records must not be touched.
**A4.** Wait. Verify in Klaviyo once propagated — up to 48 hrs, usually far less.

### Stage B — Make the account able to send (20 min)

**B1.** Klaviyo → Settings → Account → set `default_sender_email` and the full postal
address. You have admin; you only needed the values.
**B2.** Click the verification link in the sending mailbox (or Angela does).
**B3.** Confirm currency and timezone against the Shopify store's own settings. If Shopify
says one thing and Klaviyo says `USD` / `America/Los_Angeles`, fix Klaviyo to match Shopify
— the store is the source of truth for money.

### Stage C — Structure the account (30 min)

**C1.** Rename list `Email List` (`Wf4A23`) → **The Register**. Do not create a new list;
the Shopify integration is probably already pointed at this one. Leave `Preview List` alone.
**C2.** Verify the integration's sync target is now The Register.
**C3.** Create list **`Circle Requests`** — separate from The Register, different consent,
different expectation.
**C4.** Archive the nine auto-created segments, or keep them knowingly. They don't reflect
Lot / Style / Register-source, which is the model that matters here.
**C5.** Confirm the opt-in process on The Register. Both lists default to double opt-in,
which is the right call on a cold domain — but it makes Christina's confirmation copy a
launch dependency.

### Stage D — Turn tracking on (30 min)

**D1.** Online Store → Themes → **Customize** (dev theme) → **App embeds** → enable
**Klaviyo Onsite Javascript**. The dev theme currently carries only `instafeed`.
**D2.** Load a product page on the dev theme.
**D3.** Klaviyo → Analytics → Metrics → **Active on Site**. Confirm the event count moves
off zero. That closes B2.
**D4.** Check Shopify → Settings → **Customer events** for a Klaviyo pixel. If one is
there, do **not** also paste `klaviyo.js` anywhere — that doubles every event (§6e).
**D5.** Consent banner: Settings → Customer privacy. Angela's job or yours per Part 1 item 6.

### Stage E — Forms and source attribution (90 min)

**E1.** Klaviyo → Sign-up forms → **Embed** form (not popup), pointed at The Register.
**E2.** Add a hidden field `register_source`, unique per placement —
`homepage_band`, `footer`, `product_page`, `circle_page`. This is the whole point; it is
the one thing that answers "which CTA works" at launch.
**E3.** Add the consent checkbox. Leave the wording as a clearly-marked placeholder until
Christina delivers.
**E4.** Place the form. `ha-register` already accepts `@app` blocks; if Klaviyo exposes no
app block, ask me to add a `klaviyo_form_id` setting to `ha-register` and
`ha-circle-request` (~20 min) so the embed ID is pasted in the customiser.
**E5.** Switch **"Show the Shopify form"** OFF in the section settings. Never both.
**E6.** Repeat for the Circle request form → `Circle Requests`. With Klaviyo carrying it,
the **city and note fields can finally be switched on** — they were disabled only because
Shopify's customer form cannot store them.

### Stage F — Flows, in draft (45 min)

**F1.** Welcome to The Register — trigger: added to The Register.
**F2.** Abandoned checkout — trigger: Started Checkout.
**F3.** Circle request acknowledgement — trigger: added to `Circle Requests`. Must not read
as acceptance.
**F4.** **Leave all three in DRAFT.** A live flow with placeholder copy emails a real
person. They go live only when Christina's words land and Aloha approves.

### Stage G — Prove it (45 min)

**G1.** `you+register01@…` through the Register form → profile created, correct list,
correct `register_source`, consent recorded.
**G2.** Double opt-in confirmation arrives and confirms.
**G3.** `you+circle01@…` → lands in `Circle Requests`, **not** The Register.
**G4.** One test order → `Placed Order` appears in Klaviyo with correct revenue.
**G5.** Decline non-essential cookies in a private window → confirm tracking doesn't fire.
**G6.** Shopify → Analytics → Live View shows the session.
**G7.** Delete every test profile, and the empty setup profile
`01M1Y07E7GVKW9SKS0FFT997SB`.

### Stage H — Launch day, 10 September

**H1.** Publish the theme.
**H2.** **Re-check App embeds on the now-live theme.** App embed settings are per-theme;
enabling on the dev theme does not carry across. This is the classic launch-day miss.
**H3.** Confirm the sending domain still verifies after any DNS cutover.
**H4.** Confirm Google Workspace email still works after the cutover. Send one test.
**H5.** Take flows live only if copy is approved. Otherwise leave them in draft and say so.

## Part 3 — What stays blocked regardless

- **All copy** — Christina, via Aloha. Five pieces (§13 Tier 2.1).
- **The cutover decision** — Aloha.
- **Consent-banner regions** — depends on the trading entity; Christina/legal.
- **The Circle form conflict** — open since 4 September, still unresolved.

## Part 4 — Using the Shopify Admin API token safely

The token would let me read the shop's real currency, timezone and plan tier, and audit
theme settings directly. Two rules:

1. **This repo has no `.gitignore`.** A token committed to git is a token that must be
   revoked. Create `.gitignore` with `.env` in it *before* the file exists.
2. Put it in `.env` as `SHOPIFY_ADMIN_TOKEN=…` and `SHOPIFY_STORE=9c8a52-dc.myshopify.com`.
   Never paste it into chat. I read it from the environment; it never enters the transcript.

Rotate it after launch as routine, the same as the GoDaddy password.

---

# §16 — Choosing the sending subdomain

Decision made 7 September 2026. **Not escalated** — see reasoning below.

## Two different things, which Klaviyo's wizard runs together

| | What it is | Who sees it | Whose call |
|---|---|---|---|
| **From address** — `hello@hartwickatelier.com` | The address on the email | Every recipient, on every send | **Angela / Aloha** — already ask #1 |
| **Sending subdomain** — `send.hartwickatelier.com` | DKIM signing, bounce return-path, link tracking | Essentially nobody | **Ivan** — infrastructure |

They are independent. The sending subdomain does **not** change the From address. You can
send from `hello@hartwickatelier.com` with `send.hartwickatelier.com` underneath.

## The choice

All candidates verified free on 7 Sep — `send`, `email`, `mail`, `news`, `e`, `marketing`,
`hello`, `mktg`, `em`. No wildcard record, nothing to collide with. Only `www` is in use.

**Chosen: `send.hartwickatelier.com`.**

- **Not `mail.`** — conventionally a mail-server hostname. Leave it free in case Google
  Workspace or a webmail redirect wants it later.
- **Not `hello.`** — `hello@` is a mailbox. `hello.` as a subdomain reads like a website.
- **`email.` is equally defensible** if the reading matters more than the convention.

Where it is faintly visible: tracked links in campaigns resolve through the sending domain,
so hovering a link in an email shows `send.hartwickatelier.com/…`. That is the only place a
recipient could notice it.

## Two rules that actually matter

**1. Never use the root domain as the sending domain.** Keeping marketing on a subdomain
keeps its sending reputation separate from Google Workspace. If a campaign draws spam
complaints, it does not drag down Angela's own mailbox deliverability. That separation is
the entire reason the subdomain exists.

**2. Pick it once and never change it.** Reputation accrues to that exact subdomain.
Changing it later restarts from zero. This is a permanent choice — which is the only reason
it deserves any thought at all.

The DMARC record at `_dmarc.hartwickatelier.com` covers subdomains by default, so it applies
to `send.` too. At `p=none` nothing is rejected either way.

## Why this was not escalated

It is plumbing. Escalating costs a round trip against a three-day timeline and asks a
Creative Director to rule on a DNS naming convention. The professional move is to decide it,
then state it in one line — it is on Angela's domain, so she should know it exists, but
being told is not the same as being asked.

**Suggested line for the Angela message:** *"The emails will send through
`send.hartwickatelier.com` — a standard subdomain used only for email delivery. It doesn't
affect the website or your existing email in any way."*
