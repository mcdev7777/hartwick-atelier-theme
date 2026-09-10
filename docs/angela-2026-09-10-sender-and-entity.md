# Draft message to Angela — 10 September 2026

**Short, and only two asks.** The DNS work she did is finished and working — say so first,
because the last message asked her for seven records and a thirty-second check, and she
delivered. The two open items are small.

The CASL point is the one that matters. It is not a criticism of anything she has done; it
is a consequence of the registered address being in British Columbia, which I only learned
from the Klaviyo account itself.

---

Subject: **Hartwick — sending domain is live. Two small things left.**

Hi Angela,

The DNS records went in correctly and the sending domain is verified and active. I checked
it from outside rather than trusting the dashboard: all four delegation records resolve,
the signing keys are published, and your Google Workspace MX records are untouched and
answering exactly as before. Nothing about your existing email changed.

Thank you — that was the item with the deadline on it, and it's closed.

Two things left, both small.

## 1. Is `contact@hartwickatelier.com` a real mailbox?

That's the address now set as the sender in Klaviyo. Before anything can send, Klaviyo
emails a verification link there and someone has to click it.

Two ways this can quietly fail, and they look identical from my side:

- the mailbox doesn't exist yet, so the verification bounced
- it exists, the link arrived, and nobody has clicked it

Could you confirm which? If it doesn't exist yet, a **Google Group** is the better shape
than a full licensed user — it's free, replies reach whoever should see them, and it
survives any staff change. One setting matters if you go that way: posting permission must
allow **anyone**, including people outside the organisation. Groups default to
members-only, and that silently rejects both Klaviyo's verification email and every
customer reply.

## 2. Hartwick is a Canadian entity — which changes the email rules

The registered address in the account is the PO Box in Tatlayoko Lake, British Columbia. I
had been working on the basis of a US entity, which is what the account was originally set
up as.

That matters because Canadian marketing email is governed by **CASL**, not the US rules,
and CASL is stricter in one specific way: it requires **express** consent. There's no
"they bought something, so we can email them" route.

Nothing is wrong and nothing needs undoing — we're already using confirmed opt-in on both
lists, which is exactly what CASL wants. But it does mean two things I'd rather flag now
than discover later:

- The consent wording on the signup forms becomes a legal requirement rather than a matter
  of taste. That's with Christina already; I'm letting her know the standard it has to meet.
- The cookie banner needs Canada included in its regions.

One question for you, since it's yours rather than Christina's: **is the trading entity
Canadian, and should the store be selling in CAD?** Klaviyo is currently set to USD. If the
store is in USD deliberately, that's fine and I'll match Klaviyo to it — I just don't want
to assume, because it drives every revenue figure we report from here on.

## Still open from last week

The Shopify **Settings** permission on my collaborator account — it's the last thing
blocking the cookie consent banner. Five minutes, one screen: Settings → Users and
permissions → Collaborators → my name.

Thanks again for turning the DNS around quickly.

Ivan
