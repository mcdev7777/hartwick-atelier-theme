# Landing page — deployment runbook

**Goal:** `hartwickatelier.com` stops serving the Squarespace site and starts serving the
Hartwick landing page from Shopify.

Written 10 September 2026. Route C of the three options — the landing page becomes the
public homepage of a published Shopify theme, and the domain is repointed at Shopify.

---

## Status

| | |
|---|---|
| Theme built and on the store | **Done** — `Hartwick - Landing (live base)` **#191186141483**, unpublished |
| Landing page verified on that theme | **Done** — renders at `/`, no Luxe header, correct ground, film playing |
| Domain connected to Shopify | Not started |
| Store opened to the public | Not started |
| DNS repointed | Not started |

Preview (needs the storefront password):

    https://9c8a52-dc.myshopify.com?preview_theme_id=191186141483

---

## Three findings that shape the whole job

### 1. Mail for this domain runs on Google Workspace, in the Squarespace zone

    MX   aspmx.l.google.com  (+ 4 alternates)
    TXT  v=spf1 include:_spf.google.com ~all
    TXT  klaviyo-site-verification=XK6Wjs
    TXT  google-site-verification=18Umt0bs3C--4WVIH909szYbWhr2Jld9bu2-TyOxXyo

Those records live in the **Squarespace DNS zone**. `contact@hartwickatelier.com` is the
only call to action on the landing page.

**Two ways to kill it:**

- Moving DNS hosting to Shopify ("transfer domain") without recreating every record above.
- Cancelling the Squarespace subscription while it is still hosting the zone.

Both are silent. Nothing errors; mail simply stops arriving. This is the biggest risk in
the deployment and it has nothing to do with the theme.

**The answer to both:** connect the domain to Shopify as a *third-party* domain, change
only the two records that point at the web server, and leave the zone where it is until
DNS has been deliberately moved somewhere else.

### 2. The Shopify plan is "Pause and Build", and no custom domain is connected

`store-snapshot/shop.json` reports `plan.displayName = "Pause and Build"` and
`primaryDomain.url = https://9c8a52-dc.myshopify.com`.

Confirm with Shopify **before** any DNS work that this plan allows a connected custom
domain and a publicly reachable storefront. If it does not, the plan has to change first
and everything else waits. Re-check in the admin as well — the snapshot may be stale.

One useful side effect if you stay on this plan: checkout is disabled, so no one can place
an order against the old Luxe catalogue while the landing page is up.

### 3. The DNS as it stands

| Record | Current value | Meaning |
|---|---|---|
| Apex `A` | `198.185.159.144`, `.145`, `198.49.23.144`, `.145` | Squarespace |
| `www` `CNAME` | `ext-sq.squarespace.com` | Squarespace |
| Apex behaviour | `301` → `https://www.hartwickatelier.com/` | **`www` is canonical today** |
| TTL | **14400s (4 hours)** | Cutover and rollback both take 4h unless lowered |
| Nameservers | `dns1-4.p09.nsone.net` **and** `ns01-04.squarespacedns.com` | Eight, across two providers |

Registrar is **GoDaddy**; DNS is hosted at **Squarespace**. The split nameserver set is
unusual and should be understood at GoDaddy before anything is changed.

---

## What is in theme #191186141483

A pull of the **live** theme (#173395738923) — deliberately not the dev theme, so none of
the Luxe upgrade or the half-built product pages come with it — plus:

    sections/ha-landing.liquid
    layout/landing.liquid
    snippets/ha-tokens.liquid
    snippets/ha-fonts.liquid
    assets/ha-junicode.woff2, ha-junicode-italic.woff2
    assets/ha-porter-light.woff2, ha-porter-medium.woff2
    assets/ha-noto-mono-cond.woff2, ha-noto-mono-cond-medium.woff2
    assets/ha-house-symbol-black.png
    assets/ha-landing-scrapbook.mp4
    templates/index.json            <- the landing page
    templates/index.luxe-original.json  <- the old homepage, kept
    templates/page.landing.json

Verified after upload: renders at `/`, no Luxe header or footer, body `#F3F0E7`, film
playing, House Symbol present, Junicode 300/700 and Noto Sans Mono Condensed 500 loaded.

### Two things to know about this theme

**`templates/product.no-pricing.json` was removed.** It is a **live theme** file and it
would not upload — Shopify rejected it:

    Dynamic source 'product.metafields.custom.process | metafield_text: field: 'title''
    does not exist.

The store no longer has a `custom.process` metafield; it has `custom.process_1` … `_4` and
`hartwick.process_steps`. The key was renamed and the live theme's template was never
updated, so it now carries a dead reference. **Zero products use the `no-pricing`
template**, so removing it changes nothing — but note that the *live* theme still contains
this fault and will hit it on any future push.

**Porter is not loaded on this theme.** The Hartwick settings panel was deliberately not
inserted into its `settings_schema.json`, so `settings.ha_porter_licensed` is nil and no
Porter `@font-face` is emitted. That is harmless today because the Porter statement line is
empty in the current design. **If that line is ever switched back on for this theme, Porter
will silently fall back to Junicode** until the panel is added. `ha-tokens.liquid` has
`default:` guards on every colour, so nothing else is affected.

---

## Phase 0 — Verify before spending effort

1. **Confirm the plan supports this.** Shopify support: does *Pause and Build* allow a
   connected custom domain and a publicly visible storefront?
2. **Look at the registrar.** GoDaddy → the nameserver delegation for
   `hartwickatelier.com`. Work out which of the two NS sets is authoritative.
3. **Get Aloha's written approval.** This publishes to the live storefront and changes what
   the domain serves. Project rule, and it is the right rule here.
4. **Agree the canonical host.** `www` is canonical today. Keeping `www` primary means
   existing links and any SEO equity stay coherent. Changing to apex is a decision, not a
   default.

---

## Phase 1 — The theme *(done)*

5. Theme **#191186141483** is on the store, unpublished, verified. Nothing more to do here.

If it ever needs rebuilding from scratch, the working copy is at:

    /private/tmp/claude-501/-Users-administrator-Sites-hartwick-theme/<session>/scratchpad/livebase

and the push is:

```bash
shopify theme push -t 191186141483 --store 9c8a52-dc.myshopify.com --path <that path>
```

That directory is a scratchpad and will not survive indefinitely. If this deployment is
more than a few days out, copy it somewhere permanent.

---

## Phase 2 — Content pre-flight

Do all of these before the page is public. None of them are theme work.

6. **Cut a poster frame** from `Scrapbook LANDING03.mp4` and set it in the section's
   *Still image* field. Until then, anyone with `prefers-reduced-motion` on sees flat
   cream, and so does everyone else for the first moment of a cold load.
7. **Write the alt text** for that still. The field is empty.
8. **Re-encode the film.** It is 7.6 MB and carries an audio track that is never heard —
   the page plays it muted. Stripping the audio and compressing is the single biggest
   performance win available on a page whose only job is to load fast.
9. **Prove `contact@hartwickatelier.com` receives mail.** Send to it from an outside
   account and confirm arrival. It is the only action on the page.
10. **Check the social card.** Paste the preview URL into Slack or a draft email and look
    at the preview. `meta-tags` pulls the image and description from store settings, not
    from the landing section.
11. **Set the favicon** in theme settings if it is not already set.

---

## Phase 3 — DNS preparation *(a day ahead)*

12. **Lower the TTL.** In the Squarespace DNS panel, change the TTL on the four apex `A`
    records and the `www` `CNAME` from **14400 → 300**.
13. **Wait at least 4 hours** for the old TTL to age out of resolvers worldwide.

    This is the most valuable step in the runbook. It turns both the cutover and the
    rollback from a four-hour commitment into a five-minute one.

14. **Screenshot the entire Squarespace DNS zone.** Every record, including MX and all
    TXT. This is your undo, and you will not be able to reconstruct it from memory.

---

## Phase 4 — Connect the domain to Shopify *(before publishing)*

15. Shopify Admin → **Settings → Domains → Connect existing domain** →
    `hartwickatelier.com`.
16. **Choose "Connect existing domain". Do not choose "Transfer domain".**

    Transfer moves DNS *hosting* to Shopify, which means recreating by hand: the five
    Google MX records, the SPF TXT, both verification TXTs, and Klaviyo's NS delegation
    for the sending subdomain. Connecting instead leaves the zone at Squarespace and
    changes two records. Every risk in finding 1 lives in the difference between these
    two buttons.

17. Shopify will show you the target values. At time of writing they are:

    | Record | Host | Value |
    |---|---|---|
    | `A` | `@` | `23.227.38.65` |
    | `CNAME` | `www` | `shops.myshopify.com` |

    **Use the values on Shopify's screen, not these.** They do change.

---

## Phase 5 — Cutover

18. **Publish** theme `Hartwick - Landing (live base)` (#191186141483).
19. **Online Store → Preferences → turn off password protection.** Until this is off, the
    public sees the password page and nothing else — the domain change will look broken.
20. In the **Squarespace DNS panel**, change **only**:
    - the four apex `A` records → replaced by Shopify's single `A` record
    - the `www` `CNAME` → `shops.myshopify.com`

    **Do not touch MX. Do not touch SPF. Do not touch either verification TXT.**
21. Back in Shopify Domains, set the **primary domain** to whichever host you agreed in
    step 4. Shopify redirects the other one to it automatically.
22. Wait for Shopify to issue the SSL certificate. Usually minutes; allow up to 48 hours.
    The site will show a certificate warning until it lands.

---

## Phase 6 — Verify

```bash
dig +short A hartwickatelier.com          # -> Shopify's IP
dig +short CNAME www.hartwickatelier.com  # -> shops.myshopify.com
dig +short MX hartwickatelier.com         # -> STILL aspmx.l.google.com. Check this.
dig +short TXT hartwickatelier.com        # -> SPF + both verification records intact
curl -sSI https://hartwickatelier.com/ | head -5
```

23. Run all five. The MX check is the one that matters most and the one most likely to be
    skipped.
24. **Send a real email** to `contact@hartwickatelier.com` from an outside account. Confirm
    it arrives. DNS answering correctly is not the same as mail flowing.
25. Load the site in a private window, desktop and phone. Check the padlock, the film
    playing, and the contact link opening a mail client.
26. Check that Klaviyo still reports the site verification as valid.

---

## Phase 7 — Afterwards

27. **Do not cancel Squarespace yet.** It is still hosting the DNS zone that carries your
    Google MX records. Cancelling it takes your email with it.

    Either move DNS to another host first — Cloudflare is free and considerably better —
    or keep the Squarespace subscription alive purely as a DNS host until you do. If you
    move the zone, copy every record from the screenshot in step 14 and verify MX again
    afterwards.
28. **Export anything you still want** from the Squarespace site before it goes.
29. **Expect re-indexing.** Google will eventually show "the website is being rebuilt" as
    the description for the domain. Reversible, but worth knowing rather than discovering.
30. Consider whether the rest of the storefront should be reachable. With the landing page
    published, `/collections/…`, `/products/…` and `/cart` all still resolve to the old
    Luxe content. On *Pause and Build* nobody can check out, but the pages are visible.
    URL redirects to `/` are the fix if that is not wanted.

---

## Rollback

Both halves, independently, either direction.

**Theme** — Admin → Themes → republish the previous live theme (`Luxe - Fashioncan`,
#173395738923). Under a minute. Re-enable password protection if you want the store closed
again.

**DNS** — restore the four apex `A` records and the `www` `CNAME` from the screenshot taken
in step 14. With TTL at 300 you are back within about five minutes. This is what Phase 3
buys you, and it is why Phase 3 is not optional.

---

## Open questions

1. Does *Pause and Build* permit a connected custom domain and a public storefront?
   Everything else depends on this.
2. `www` or apex as primary?
3. Where does the DNS zone live after Squarespace is cancelled?
4. Should the rest of the storefront be redirected to `/`, or left reachable?
5. Is a still frame from the film available for the poster?
