# International & member experience — findings and plan

Reply to Aloha's "HARTWICK ATELIER | INTERNATIONAL & MEMBER EXPERIENCE", 22 September 2026.

Everything below was checked against the live dev theme and the storefront, not
assumed. Where something needs an Admin setting I cannot see from here, it says so.

---

## The short version

Three of the four utilities are straightforward — the plumbing is already in the
theme and simply switched off. The fourth, **The Circle**, cannot be built the
way the brief describes while the store is on its current account system, and
that decision needs making before any of it is worth designing.

| Utility | State today | What it needs |
|---|---|---|
| **Region** | 27 countries and 3 markets configured, selector **switched off** — a visitor currently has no way to change region anywhere on the site | Turn on + rebuild the panel in Hartwick's system |
| **Language** | Theme is ready; **only English is published in the store**, so there is nothing to select | Admin work + translation, before any theme work matters |
| **The Circle** | Account icon off; store is on **new customer accounts** | **Blocked as specified** — see below |
| **Bag** | Already opens a drawer from the side | Restyle + her copy |

---

## REGION

**This is the finding I'd flag hardest: the region selector is currently invisible.**

The store has 27 countries across three markets (United States, Canada,
International) and Markets is converting currency correctly. But the header's
`enable_international` setting is **off**, so the selector renders into the page
hidden and no visitor can reach it — on desktop or on a phone. Somebody in Paris
sees USD and has no way to change it.

So this is less "improve the international experience" and more "the
international experience is not currently switched on". Good news for the
estimate: the hard part (Markets, currency, 27 countries) is already done and
verified. What is missing is the control.

Turning it on is one setting. Luxe's own button already renders exactly the thing
Aloha asked for — the *current* value rather than a bare icon:

```
US ($)
```

What needs building is the panel it opens. Luxe's is a generic list with flags;
hers is a clean **Change Your Region** panel in Hartwick's typography, spacing and
rules — which, after this week's type work, means it inherits the system for free.

**Automatic detection.** The theme has no market detection today. Two options:
Shopify's own market-recommendation prompt (an Admin setting in Markets, no theme
work), or a small piece of theme code that reads Shopify's suggestion endpoint and
offers — never forces — a switch. Aloha's instinct is right and worth stating in
the build: detection *suggests*, the manual selector always stays. Nobody gets
trapped in a region because an IP lookup guessed.

---

## LANGUAGE

> "Can you check our current Luxe theme setup and confirm how best to implement
> Shopify's native multilingual architecture?"

**Confirmed on both counts, including her example.** Shopify does treat region and
language as two independent choices, exactly as she assumes: someone can select
Switzerland as their market — getting CHF, Swiss shipping and Swiss product
availability — and still read the site in French rather than German. Likewise
someone in Spain can buy in EUR and read in English. Region drives Markets;
language drives the URL and the content. Separating the two controls in the header
is not a stylistic choice copied from Injiri, it matches how the platform works.

**The theme is already built for it.** Luxe ships a proper language selector that posts to Shopify's
`/localization` form, and the theme carries translation files for 38 languages
including all four she named — French, Spanish, German, Italian. No translation
widget, no third-party overlay. Her preference is the correct one and it costs us
nothing to follow.

**But the blocker is not in the theme.** Only English is published in the store.
`/fr`, `/de`, `/es` and `/it` all return 404, and no language selector can render
because there is nothing to select. Publishing a language is Admin work
(Settings → Languages), and it needs someone with the right permission — worth
checking against the access position, since Ivan does not have Payments
permission and may not have this one either.

**The order of work matters**, and it is worth being blunt about it:

1. Publish the languages in Admin. *(Admin — minutes)*
2. Machine-translate the mundane interface strings with Translate & Adapt —
   "Add to bag", "Size", "Quantity", "Shipping". *(Admin — hours, largely automatic)*
3. **Human-review the language that is Hartwick's intellectual property.**
   *(Content — this is the real cost, and it is not a developer task.)*
4. Then the theme work: switch on the selector, build the panel. *(2–3 hrs)*

Step 3 is the one to plan around. Aloha has already named the terms that must not
be machine-translated — Masters, techniques, cloth, provenance, natural dyes,
production — and I'd add that this runs straight into the project's standing rule
that we never invent or approximate provenance language. A machine translation of
a Master's biography into French is, in effect, invented content in French.

She has already reached the answer herself — *"Some of those may actually remain
in English as Hartwick terminology, even when the explanatory material surrounding
them is translated."* I'd make that the rule rather than the exception:
**treat the Hartwick terminology as untranslated proper nouns** —
The Register, The Dispatch, The Circle, The Masters, Lot, Expression, Origin stay
in English in every language, exactly as a French fashion house leaves *atelier*
and *prêt-à-porter* in French. That is both the safer position and the more
convincing one. It also shrinks step 3 to the explanatory prose around those terms.

**One genuine benefit worth confirming to her:** she is right that this is not
decoration. Published languages give real `/fr` and `/de` URLs with Shopify
generating `hreflang` automatically, so a French page is indexed as a French page.
That is a structural SEO gain a translation widget cannot give.

---

## CART / BAG

Already closer than she may think. The cart is **already configured as a drawer**
— clicking the bag opens a side drawer, not the cart page. What it needs:

- Her empty state, replacing Luxe's "Your shopping bag is empty":
  **YOUR BAG IS EMPTY** / a short line / **VIEW THE COLLECTION**
- Line items in Hartwick's structure, her full list: image, product name,
  **Expression underneath**, size, quantity, price, remove/edit controls, then
  **subtotal** and **checkout**.
- The Hartwick visual system, and the quiet she asked for — no upsell, no
  countdown, no discount prompt, no generic Shopify messaging.

The name/Expression split needs a note: on the product page these are two
separate fields, but Shopify's cart line item carries the single store title
(`TRIBECA SKIRT | Handspun Matka Silk`). The drawer will need to split it on the
`|`, the same way the collection grid does. Worth knowing it is a small piece of
logic rather than a given.

---

## THE CIRCLE — the part that is blocked

> "Can you check how best to achieve this through Shopify customer accounts,
> tags/segments or another appropriate method?"

I checked. **The store is running Shopify's new customer accounts.** Both
`/account/login` and `/account/register` redirect out of the theme entirely, to a
Shopify-hosted page. That has three consequences that go directly against the brief:

1. **The sign-in screen is not ours to design.** It is hosted by Shopify.
   The theme's `templates/customers/*` files are inert — I confirmed they never
   render. So "THE CIRCLE / *A private space for members of Hartwick Atelier's
   Circle* / MEMBER SIGN IN" cannot be put on that screen. Customisation is
   limited to a logo and colours set in Admin.

2. **There is no "Create Account" to hide, because the whole flow is
   self-registration.** New customer accounts sign people in with a code sent to
   their email address; the account is created on first use. Any visitor who types
   any email address becomes an account holder. Aloha's requirement — "I don't
   want visitors assuming anybody can simply register" — is not achievable here,
   because on this system anybody *can*.

3. It follows that signing in cannot mean membership. Which is exactly the thing
   she says she wants to avoid: *"normal customers aren't automatically treated as
   Circle members simply because they have purchased something."*

**What would give her what she describes** is classic customer accounts, where the
sign-in page is a theme template we control completely, and Circle membership is a
**customer tag** (`circle`) applied in Admin — so the theme can show the Circle
space to tagged members and an ordinary order history to everyone else. Membership
then stays invitation-led and under Aloha's control, which is the whole point, and
it matches the standing rule that The Circle has no public application route.

**On tags vs segments specifically**, since she named both: they are not
interchangeable here. A **tag** is a property of the customer record and the theme
can read it directly on the page — `customer.tags contains 'circle'` — which is
what lets the site behave differently for a member. A **segment** is a saved query
built *from* tags and behaviour, and it lives in Admin for marketing and Klaviyo
audiences; the theme cannot read one at page-render time. So the answer is: **tag
for the experience, segment for the communications.** Tag a member `circle`, and
build the Circle segment on top of that tag for The Dispatch and invitations. One
source of truth, used by both.

Two honest caveats before anyone switches anything:

- Shopify has been moving stores towards new customer accounts and away from
  classic. Whether this store can still switch back is an Admin question I cannot
  see from here. **That needs checking before we design anything.**
- Even on classic accounts the registration URL remains reachable unless we
  deliberately remove the route. A tag is a clean gate for the *experience*; it is
  not a lock on the front door. If the Circle must be genuinely closed, that is a
  larger conversation than a header icon.

**My recommendation for launch:** do not build a member area yet. Aloha's own
sentence is the right one — *"What matters now is establishing the correct
architecture and language."* So:

- Settle the account-mode question in Admin first. It is a decision, not a build.
- Until it is settled, the fourth header slot reads **THE CIRCLE** and opens a
  short panel carrying her own words — **THE CIRCLE**, *A private space for
  members of Hartwick Atelier's Circle* — with her named secondary action,
  **ABOUT THE CIRCLE**, and no sign-in and no registration. That is honest, it is
  consistent with The Circle having no public route, and the panel is already the
  right shape to take a **MEMBER SIGN IN** line the day the account question is
  settled.
- Keep the member space (profile, order history, invitations, early access,
  private Journal) for Phase 2, alongside Reserve.

---

## The header

Her four utilities —

```
REGION  /  LANGUAGE  /  THE CIRCLE  /  BAG
```

— work as a row, and work better after this week's typography pass: all four sit
on the 11px navigation row in Noto Sans Mono Condensed, sharing one set of
borders, spacing, drawer behaviour and close controls, so they read as one system
rather than four unexplained icons. That shared system is now a thing we have
rather than a thing we'd have to invent for this.

Of her two presentations I'd take the second — showing the current value:

```
ES / EUR  ·  EN  ·  THE CIRCLE  ·  BAG (0)
```

It tells a visitor where they already are before they click anything, and Luxe's
region button already prints exactly that. Until languages are published the `EN`
slot should simply not render — an inert control is worse than no control.

And her distinction is the one that should govern the fourth slot:
**The Circle is membership, not account administration.** That is why it reads
THE CIRCLE and not ACCOUNT, why it does not offer registration, and why the
member space belongs in Phase 2 rather than being approximated now with Shopify's
stock account furniture.

---

## Scope and hours

This is a new feature set, not a revision of something already approved, so it
needs Aloha's written go-ahead before I start. Rough estimates, theme work only:

| Piece | Hours | Depends on |
|---|---|---|
| Region: switch on, Change Your Region panel, Hartwick system | 3–4 | nothing |
| Cart drawer: restyle, her copy, name/Expression split | 3–4 | nothing |
| Header utility row, showing current values | 2–3 | the two above |
| Market detection that suggests rather than forces | 1–2 | Admin check |
| Language: selector + panel + hreflang verification | 2–3 | **languages published in Admin first** |
| The Circle: explanatory panel only (recommended for launch) | 1–2 | nothing |
| The Circle: themed sign-in + tag-gated member space | 5–8 | **account-mode decision** |

**Roughly 12–18 hrs for the launch-sensible set** (region, cart, header, detection,
Circle panel), and 5–8 hrs more if the member space is wanted for launch.
Translation content is not in these numbers and is not developer time.

**This needs to be set against the remaining budget.** The plan of 1 September
recorded 4 of 40 hrs used; a great deal has been built since — homepage v2, The
Masters, The Register, the range and collection pages, the product copy import and
this week's typography system — and the running total needs reconciling before
committing to another 12–18 hrs. I'd rather put that number in front of Aloha now
than discover it at the end.

---

## What I need from Aloha and Gareth

1. **Account mode** — can this store go back to classic customer accounts? Until
   that is answered, the Circle member space cannot be designed, only guessed at.
2. **Go-ahead and priority** on the region, cart and header work, which is ready
   to start and does not depend on anything.
3. **Who publishes the languages in Admin**, and who reviews the translations —
   Christina, given the Framework governs the terminology.
4. **Confirmation that Hartwick's proper nouns stay in English** across all
   languages. My recommendation, but hers to make.
