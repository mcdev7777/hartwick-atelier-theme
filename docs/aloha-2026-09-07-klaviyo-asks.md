# Draft email to Aloha — 7 September 2026

Subject: **Klaviyo and analytics — four things I need, and one question about the 10th**

---

Aloha,

Klaviyo is connected and I've audited the account. Most of it is clean: no legacy data, no
flows or campaigns that could fire, and the Shopify integration is already talking to the
store. The details are in my notes and I'll bring them to the daily update.

Five things need you or the team. The first one is the one I'd read first.

## 1. Is 10 September a launch on the live domain?

`hartwickatelier.com` currently serves a live Squarespace site. The Shopify build is on its
own myshopify address. So launching on the live domain means a DNS cutover from Squarespace
to Shopify — and that isn't in the plan I wrote on 1 September, because I didn't know the
domain was in use.

I need to know:

- Is the 10th a public launch on `hartwickatelier.com`, or a soft launch with the
  Squarespace site left up?
- If it's public: who authorises the Squarespace site coming down, and does anyone need
  telling first?
- Should old Squarespace URLs redirect, or is a clean break fine?
- Who performs the cutover?

I'm not raising this to move the date. I'm raising it because it's a business-visible event
with an audience, and it currently has no owner.

One technical note for whoever does it: the domain's email runs on Google Workspace. The
cutover must change the A record and the `www` CNAME only, and leave MX untouched. Replacing
the zone wholesale is the usual way a migration takes a client's email down.

## 2. Angela — the account cannot send email yet

Two fields are empty in Klaviyo, and both are required before anything can go out:

- **A sending address.** Which address should The Dispatch come from — `hello@`,
  `atelier@`, something else? Does that mailbox already exist in Google Workspace? Should
  replies go somewhere different? Klaviyo sends a verification link to that address, so
  either I need access to the mailbox or Angela needs to click it.
- **The registered postal address, in full** — street, city, region, postcode, country.
  This is a legal requirement in the footer of every marketing email, not a preference.

Until both exist, no campaign and no welcome email can send.

## 3. Christina — five pieces of copy

I won't write any of these, and I won't ship placeholder wording to a live site.

1. Consent line for The Register signup *(outstanding since 4 September)*
2. Consent line for the Circle request form
3. The double opt-in confirmation email
4. The "Welcome to The Register" email
5. The Circle request acknowledgement — this one needs care, as it must not read as
   acceptance into an invitation-only group

The flows will be built and left in draft until these arrive.

Also still open from 4 September: whether the public Circle access form stays. It's built
and switchable in one click either way — but Framework v3 records The Circle as
invitation-only with no application route, and that conflict is still unresolved.

## 4. DNS access — GoDaddy isn't where the records live

Thank you for the GoDaddy details. GoDaddy is the registrar, but the domain's nameservers
point to Squarespace, so the DNS records actually live there — anything entered at GoDaddy
has no effect.

Simplest route: I generate the four Klaviyo records and send them to whoever administers
the Squarespace account to paste in. No access needs to change hands.

Two related notes:

- The domain currently has **no SPF and no DMARC record** at all, while already sending
  through Google Workspace. That predates this project, but it means a first campaign from
  a new setup is likely to be filtered. I'd recommend adding both. It touches Angela's
  existing email, so I'd want that instructed in writing rather than doing it quietly.
- On the credentials: a registrar password is domain-transfer-level control, and it doesn't
  reach the records we need anyway. GoDaddy's Delegate Access does the same job without
  sharing a password. Worth changing it after launch either way.

## 5. Two quick confirmations

- The Klaviyo account is set to **USD** and **Los Angeles time**. Both drive revenue
  reporting and campaign send times, and both are awkward to change once data exists. Are
  they right?
- Three profiles already exist — Angela's, Christina's and mine — carrying subscription
  dates of 3 and 28 August, which predate the account. So they were imported. Where were
  those collected? Imported consent is fine with a documented source; I'd like to know
  there is one.

---

Nothing here is blocked on me. Items 1 and 2 are the ones that decide whether email works
on launch day.

Ivan
