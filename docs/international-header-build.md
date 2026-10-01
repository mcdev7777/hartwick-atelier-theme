# REGION / LANGUAGE / THE CIRCLE / BAG — build note

Built 23 September 2026 from Aloha's "HARTWICK ATELIER | INTERNATIONAL & MEMBER
EXPERIENCE" (22 Sep, PDF in Downloads). Findings and the original estimate are in
`aloha-2026-09-22-international-and-member.md`; this note records what was built.

Verified on the CLI development theme #190959223083, then pushed by Ivan to
**Hartwik - Dev #190886576427** the same day and checked there (row, Circle drawer,
empty bag).

## What a visitor sees

Desktop header, right side: `US / USD   THE CIRCLE   BAG (0)` in the navigation
voice, every gap the menu's 26px. LANGUAGE (`EN`) joins the row on its own once a
second language is published. On a phone the first three are ruled rows at the
foot of the menu (`REGION … US / USD`, `THE CIRCLE`); BAG stays in the bar.

All four open the same right-hand drawer: page-ground paper, a head rule level
with the header's bottom rule, the title in the navigation voice, one close
control, Escape and the overlay close it, focus held inside and returned to the
button. One drawer at a time.

| Drawer | Contents |
|---|---|
| **Change your region** | CURRENT United States — USD $ · one line · a country search (27 countries) · ruled list, name left, `EUR €` right, the current one marked. Choosing posts Shopify's `/localization` form, so Markets sets currency, prices, shipping and availability. Tested: US → France gave `FR / EUR` and a €608,95 bag. |
| **Change language** | Published languages by their own names, current marked; posts the same form with `language_code` → `/fr`, `/de`. Hidden while English is the only language. |
| **The Circle** | Visitor: THE CIRCLE / *A private space for members of Hartwick Atelier's Circle.* / MEMBER SIGN IN / ABOUT THE CIRCLE. **No Create Account anywhere.** Member: greeting by first name, a member note, the member links, Orders & details, Sign out. Signed-in non-member: her line, "Circle membership is by invitation.", About The Circle, Your orders, Sign out. |
| **Your bag** | Empty: YOUR BAG IS EMPTY / short line / VIEW THE COLLECTION. Filled: image, name (TRIBECA SKIRT), Expression beneath, size, quantity stepper, line price, Edit and Remove, subtotal, one tax/shipping line, Checkout. No note, no recommendations, no payment badges, no cart message. |

**Region detection suggests; it never switches.** On load the theme asks Shopify
(`/browsing_context_suggestions.json`) where the visitor appears to be. If that is
a country Hartwick sells to and not the one showing, a small note under the header
offers *Shop in France — EUR €* or *Stay in United States*. "Stay" is remembered in
that browser. Tested by switching to France from a US connection.

## The Circle — how membership works

**Changed 28 September 2026** (Aloha's invitation/approval logic). Membership is
the customer metafield **Circle status** (`hartwick.circle_status`, choices
Approved / Removed), set by Angela on the customer page in Admin. Signing in
unlocks the member drawer only when it reads **Approved**. It used to be the tag
`circle-member`; that was dropped because any storefront customer form can post
`contact[tags]`, so a visitor could have tagged themselves. A metafield can only
be written from Admin.

The rest of the chain:

- Segment **The Circle – Approved** (`metafields.hartwick.circle_status = 'Approved'`).
- Shopify Flow: *Customer joined segment* → add tag `circle-approved`; *left
  segment* → remove it. The tag exists only so Klaviyo sees approval (Shopify
  Tags); it grants nothing on the site.
- The Circle page form (INVITATION REQUEST) records the Klaviyo event
  `Circle Invitation Request`; the Circle form on The Register page (INVITATION
  RESPONSE) records `Circle Invitation Response`. Events, not list
  subscriptions: no double opt-in, no marketing consent, nothing joins The
  Register. The old double-opt-in `Circle Requests` list is no longer written.
- Klaviyo flows (built in Klaviyo, not the theme): approval → invitation (or
  welcome, if they already replied); response → alert + welcome if approved,
  else "We've received your note"; request → alert + "We've received your note".
  Email drafts: `Circle 1 – Invitation`, `Circle 2 – Welcome`, `Circle 3 – Thank you`.
- The invitation's ACCEPT INVITATION links to `/pages/the-register#the-circle`.

MEMBER SIGN IN opens Shopify's hosted sign-in (new customer accounts). That page
shows no "Create account" either — it asks for an email and sends a code — but
**anyone who enters an email gets a customer account**. That account is not
membership, because Circle status gates the Circle space, so Aloha's rule holds. Only
the hosted page's look is outside the theme (Admin > Settings > Customer accounts:
logo and colours).

Not built (Phase 2, per the brief): invitations, events, early access, a private
Journal. The **Member links** menu setting is where each goes as it exists, with
no code change.

## Language infrastructure

Every new interface word is a theme locale string (`hartwick.utilities.*`,
`hartwick.bag.*` in `locales/en.default.json`) or a theme setting, so Translate &
Adapt reaches all of it. Nothing is hard-coded English. The region and language
choices use Shopify's form, not a widget.

## Files

- `snippets/ha-utilities.liquid` — the row, the phone rows, the three drawers, the suggestion.
- `assets/ha-utilities.js` — open/close/focus, country search, suggestion.
- `snippets/cart-drawer.liquid` — the bag, rewritten on Luxe's element IDs so
  cart.js and cart-drawer.js are untouched (tested: add from the product page,
  quantity +, remove to empty).
- `sections/header.liquid` — three render points; Luxe's own region, language and
  account items stand down while the Hartwick utilities are on.
- `assets/ha-sections.css` — block "HEADER UTILITIES" at the end.
- `config/settings_schema.json` — group "Hartwick — Header utilities".
- `locales/en.default.json` — `hartwick.*` strings.

## Wording to put in front of Aloha

Her words are used verbatim where she gave them. These lines are mine, marked
here and editable in Theme settings:

- Bag empty short line: "Pieces you add will appear here." (she asked for "a short line", no text given)
- Region line: "Prices, currency and delivery follow the country you choose."
- Suggestion: "You appear to be in [country]."
- Non-member line: "Circle membership is by invitation." (Framework v3 wording on The Circle)
- Bag and drawer titles "Your bag", "Change your region", "Change language"
- The one tax/shipping line under the subtotal (can be switched off)

## Still Admin work, not theme work

1. **Languages**: publish French/Spanish/German/Italian (Settings > Languages) only
   once translated and reviewed; LANGUAGE then appears by itself.
2. **Tag the first Circle members** `circle-member` and build the segment.
3. Shopify Markets' own geolocation pop-up (if the Geolocation app is installed)
   would duplicate the theme's suggestion — keep one.

## To deploy to Hartwik - Dev (#190886576427)

Snippets and assets first, then the header (push order matters — see memory):

```bash
shopify theme push -t 190886576427 --nodelete --only config/settings_schema.json --only locales/en.default.json --only snippets/ha-utilities.liquid --only snippets/cart-drawer.liquid --only assets/ha-utilities.js --only assets/ha-sections.css
```

```bash
shopify theme push -t 190886576427 --nodelete --only sections/header.liquid
```

`assets/ha-sections.css` in this working copy also carries the size-box change of
23 September, which is already on Hartwik - Dev — the push does not undo it.
