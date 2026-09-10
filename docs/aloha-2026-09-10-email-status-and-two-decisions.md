# Draft email to Aloha — 10 September 2026

Sending domain is done, so this is mostly good news. Two decisions and one cost sit behind
it, and the cutover question from 7 September is **still unanswered** — that one is now the
largest open risk to the date.

Deliberately not in here: anything Christina owns. Her five pieces of copy are already
outstanding; repeating them adds noise rather than urgency.

---

Subject: **Hartwick — email sending is live. Two decisions, one cost, one still-unanswered question.**

Aloha,

The email infrastructure is finished and verified. `send.hartwickatelier.com` is delegated,
signing keys are published, and the domain is active on the account. I checked it
independently rather than trusting the dashboard. Angela turned the DNS around quickly and
Google Workspace was untouched throughout — nobody's existing email was at any point at
risk.

Three things need you.

## 1. Still unanswered from 7 September — is the 10th a live-domain launch?

`hartwickatelier.com` still resolves to the Squarespace site. Nothing has been cut over, and
the cutover has no named owner.

I'm not asking to move the date. I'm asking because it's a business-visible event with an
audience and it currently belongs to nobody. If it's a soft launch with Squarespace left up,
that's a clean answer and I'll plan around it.

One technical constraint for whoever performs it: the cutover changes the **A record and the
`www` CNAME only**. Replacing the zone wholesale would take Angela's email offline *and*
orphan the entire sending subdomain in one move — signing keys, return path and link
tracking all vanish together, because they exist only inside that delegated zone. There is
no in-place fix once that happens.

Before any cutover, one thing has to be established: whether Shopify's DNS can hold
delegation records on a subdomain. If it can't, the answer is to leave the zone where it is
and point only the two records at Shopify.

## 2. Hartwick is registered in British Columbia — which changes the email rules

The registered address on the account is a PO Box in Tatlayoko Lake, BC. I'd been working on
the basis of a US entity, which is how the account was originally scaffolded.

Canadian marketing email is governed by **CASL**, which requires **express** consent — there
is no implied-consent route. Practically:

- We're already using confirmed opt-in on both lists, so we're on the right side of it.
  Nothing needs undoing.
- **The consent wording on the two signup forms is now a legal requirement rather than a
  style choice.** That's the item outstanding with Christina since 4 September. I'm not
  writing it and I won't ship invented wording, but the standard it has to meet has changed
  and she should know that.
- The cookie banner needs Canada in its regions.

Separately: the store is set to **USD** against a Canadian entity. That may well be
deliberate. It drives every revenue figure we report from here on, so I'd like it confirmed
rather than assumed.

## 3. A cost, for information — not a recommendation

Branded click-tracking is not available on the current Klaviyo plan. In practice: links
inside a Dispatch will carry a Klaviyo tracking domain rather than `hartwickatelier.com`.

It doesn't affect deliverability and it isn't a launch blocker. I'm raising it only because
it's visible — anyone hovering a link in the first Dispatch will see a domain that isn't
Hartwick's, and for a brand this attentive to detail that's the kind of thing that gets
noticed after send rather than before.

It's a plan upgrade, so it's a spend, so it's yours. I'm not recommending it for launch.

---

## Where the build actually stands

| | |
|---|---|
| Sending domain | ✅ verified, active, independently confirmed |
| SPF + DMARC | ✅ added — the domain had neither before, despite already sending through Google Workspace |
| Sender address | Set to `contact@hartwickatelier.com`; verification with Angela |
| Postal address | ✅ filled |
| Onsite tracking | Switched on today; being verified |
| Lists, forms, flows | Building now — flows stay in **draft** until Christina's copy lands and you approve |
| Cutover | **Unowned** |

Nothing on that list is blocked on me except the copy, and the flows are built to sit in
draft safely until it arrives.

Ivan
