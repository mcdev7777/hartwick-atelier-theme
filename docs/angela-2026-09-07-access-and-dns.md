# Draft message to Angela — 7 September 2026

**Updated 8 September 2026 — ready to send.** Klaviyo has issued the records and they are
now in section 3. They turned out to be an **NS delegation**, not the CNAMEs originally
expected, which adds one prerequisite: Squarespace has to be *able* to create NS records on
a subdomain, and not every DNS panel can. That check is the first thing in section 3 and it
takes Angela thirty seconds. If the answer is no, nothing is lost — Klaviyo has a CNAME
route and I send a revised list.

One message, one trip to the DNS panel, rather than four.

Scope and approval questions are deliberately **not** in here — those go to Aloha.

---

Subject: **Hartwick — four things I need from you to finish email setup before the 10th**

Hi Angela,

Klaviyo is connected and the account is in good shape — nothing legacy, nothing that could
email anyone by accident, and the Shopify link is already working.

Four things need you. The DNS one is the only one with a deadline, because DNS changes can
take up to 48 hours to take effect.

## 1. Which address should the emails come from?

Klaviyo needs a "from" address before it can send anything at all. Two questions:

- **Which address?** `hello@hartwickatelier.com`, `atelier@`, or something else. This is
  the address customers see on every email and reply to, so it's your call, not mine.
- **Does anything exist on that domain yet?** I notice you use
  `angela@hartwickcreative.com` — is there a Google Workspace mailbox on
  `hartwickatelier.com` at all yet?

**It does not need to be a new paid mailbox.** Any of these work, and the middle one is
what I'd suggest:

| Option | Cost | Good for |
|---|---|---|
| A full Google Workspace user | Another licence | Only if someone lives in that inbox |
| **A Google Group** | Free | **Recommended** — replies reach you, Aloha, whoever should see them, and it survives any staff change |
| An alias on your existing account | Free | Simplest, but replies land in your personal inbox and it disappears if your account ever changes |

If you go with a Google Group, one setting matters: posting permission must allow
**anyone**, including people outside the organisation. Groups default to members-only, and
that would silently reject both Klaviyo's verification email and every customer reply.

Whichever you choose, it must be able to **receive** mail — Klaviyo sends a verification
link there and someone has to click it, and customers will reply to it. Please don't use a
no-reply address; it hurts deliverability and it reads badly from a brand like this.

## 2. Hartwick's registered postal address

Marketing emails are legally required to carry a physical postal address in the footer —
it's a requirement in the US, UK and EU, and Klaviyo enforces it. The field is currently
empty, which is part of why nothing can send yet.

I need the full registered address: street, city, state/region, postcode, country.

## 3. Seven DNS records — this is the one with the clock

This is what lets email actually arrive rather than land in spam.

One thing worth knowing before you start: **the domain's DNS is hosted at Squarespace, not
GoDaddy.** GoDaddy is only the registrar — where the name is bought and renewed. The records
that actually answer live in the Squarespace panel. I checked this from the outside rather
than assuming it, so it's certain.

### First — a thirty-second check, before you change anything

In Squarespace: **Settings → Domains → hartwickatelier.com → DNS Settings → Custom Records
→ Add Record**, and open the **Type** dropdown.

**Is `NS` one of the options?**

That's the whole check — don't add anything yet, just tell me yes or no. Klaviyo's setup
needs four NS records, and some DNS panels don't allow them on a subdomain. If NS isn't
there, nothing is broken and nothing is your fault — I take a different route in Klaviyo and
send you a revised list. If NS *is* there, carry straight on below and do it all in one
sitting.

### Then — the seven records

| Type | Host / Name | Value |
|---|---|---|
| NS | `send` | `ns1.klaviyo.com` |
| NS | `send` | `ns2.klaviyo.com` |
| NS | `send` | `ns3.klaviyo.com` |
| NS | `send` | `ns4.klaviyo.com` |
| TXT | `@` | `klaviyo-site-verification=XK6Wjs` |
| TXT | `_dmarc` | `v=DMARC1; p=none` |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |

All four NS records are needed — three won't do.

**On the Host field:** enter exactly what's in the middle column — `send`, not
`send.hartwickatelier.com`. Squarespace adds the domain itself, and entering the full
version produces `send.hartwickatelier.com.hartwickatelier.com`, which fails without any
error message. It's the most common way this goes wrong.

**Important — please change nothing else.** In particular, leave the MX records exactly as
they are. Those are what deliver your Google Workspace email, and replacing them is the
usual way a domain change accidentally takes a company's email offline.

### Why the last two records are there

The domain currently has **no SPF and no DMARC record at all**, which is unusual for a domain
already sending through Google Workspace. That isn't something this project created — it
predates me — but it does mean our first campaign is more likely to be filtered as spam, so
I'd like to fix it while we're already in the panel.

Both are safe. The DMARC one is monitoring-only: it changes nothing about how your existing
email behaves. The SPF one simply states that Google is allowed to send on your behalf,
which is already true.

One follow-up, deliberately not in the list above: **which address should receive the DMARC
reports?** Your own is fine. I've left it out for now because adding it before Klaviyo
verifies can trip the verification, so I'd rather add it as a one-line edit afterwards than
risk a false failure this week.

If you'd rather I did this directly, Squarespace access would let me. Either works.

## 4. One Shopify permission, or five minutes of your time

Shopify's cookie consent banner lives under Settings → Customer privacy, and my
collaborator access doesn't reach Settings. Either:

- add **Settings** and **Analytics** permissions to my collaborator account, or
- turn the banner on yourself and I'll tell you exactly which options to pick.

Whichever is easier. It needs to be done before launch either way, since both Shopify's
analytics and Klaviyo's tracking depend on it.

## One question, no rush

Three profiles already exist in Klaviyo — yours, Christina's and mine — with subscription
dates in early and late August, before the account was created. So they came in from
somewhere. Do you know where those were originally collected? It's only so I can note the
source properly.

---

On the GoDaddy login you sent: I haven't needed it, and as it turns out it wouldn't have
worked for this anyway, since the records live at Squarespace. Worth knowing that a
registrar password is the highest-level access a domain has — it can move the domain
entirely. GoDaddy has a "Delegate Access" feature that shares what's needed without the
password, and it can be revoked in one click. Worth switching to that, and changing the
password once we're past launch.

Thanks — 1 and 3 are the two that unblock everything else, and the thirty-second NS check at
the top of 3 is the one I need first, since it decides which list you end up entering.

Ivan
