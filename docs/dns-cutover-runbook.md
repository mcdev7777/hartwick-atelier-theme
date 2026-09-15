# DNS + launch cutover runbook — hartwickatelier.com

**Written 10 September 2026.** Supersedes the phase list discussed in chat.

Read this top to bottom once before doing anything in it.

---

# PART 0 — INCIDENT: the zone is currently down

**Status at time of writing: unresolved. This is the only thing that matters until it is fixed.**

**Update, later 10 September — the zone is back, but empty, and the failure mode got
worse.** Squarespace's nameservers answer again (no more `REFUSED`), so step 1 below
happened. But the custom records did **not** return. Verified from outside against
`ns01.squarespacedns.com`:

| Record | Now | Was |
|---|---|---|
| MX ×5 | **absent** | Google Workspace |
| A ×4 / `www` CNAME | absent | Squarespace site |
| TXT `@` SPF | **`v=spf1 -all`** — Squarespace's parked default | `v=spf1 include:_spf.google.com ~all` |
| TXT `_dmarc` | **`p=reject; sp=reject; adkim=s; aspf=s`** — parked default | `v=DMARC1; p=none` |
| TXT `@` klaviyo-site-verification | absent | present |
| TXT `@` google-site-verification | absent | present |
| NS `send` ×4 | **present** | present |

Why this is worse than `SERVFAIL`: a `SERVFAIL` made sending servers *queue* mail and
retry. A zone that answers with **no MX and no A** makes them **bounce it
permanently**. And the parked SPF/DMARC defaults tell every receiving server that
`hartwickatelier.com` sends no mail at all — so Google Workspace's *outbound* mail
from Angela's account is now being rejected too. Both directions are down, and it is
no longer a queue.

Go straight to **step 3 — rebuild**, in the order Part 1 gives: MX first. The SPF and
DMARC entries must **replace** the parked defaults, not sit beside them — two SPF
records is a permanent error, which fails everything.

## What happened

The domain was disconnected from the Squarespace *site*. In Squarespace, the domain's
DNS zone is tied to that connection — so disconnecting did not merely release the
auto-managed A records and `www` CNAME. It removed the whole zone.

## How we know

GoDaddy (the registrar) still delegates the domain to Squarespace's nameservers:

    hartwickatelier.com.  172800  IN  NS  connect1.squarespacedns.com.
    hartwickatelier.com.  172800  IN  NS  connect2.squarespacedns.com.

But both of those servers now answer `REFUSED` for the domain — they no longer hold
the zone:

    dig @connect1.squarespacedns.com SOA hartwickatelier.com   -> status: REFUSED
    dig @connect2.squarespacedns.com SOA hartwickatelier.com   -> status: REFUSED

Consequently every public resolver returns `SERVFAIL`. Verified against Google
(8.8.8.8), Cloudflare (1.1.1.1) and Quad9 (9.9.9.9) — all three, same result.

## What is actually broken

| Thing | State | Notes |
|---|---|---|
| **Incoming email** | **Not being delivered** | SERVFAIL is a *temporary* failure. Sending servers queue and retry, typically 24–48 hours. Mail is stuck, not lost — but the clock is running. |
| **The website** | Up, on cache only | The apex A records are still answering from resolver caches. Roughly 3 hours of life left, then the site goes dark. |
| **Klaviyo sending domain** | Up, on cache only | `send.hartwickatelier.com` NS delegation, same situation. |
| **The domain itself** | Safe | Still registered, still yours, still delegated. Nothing has been lost at the registrar. |

## Fix it — in this order

### 1. Recreate the zone

In Squarespace, reconnect / re-add `hartwickatelier.com`. Squarespace normally
retains custom records when a domain is unlinked from a site, so MX, TXT and the
Klaviyo NS records should return on their own.

### 2. Verify from outside

    dig +short MX hartwickatelier.com

Google's mail servers appearing here means email is flowing again. Until they do,
nothing else in this document should be started.

### 3. If the records did NOT come back, rebuild them

Full inventory in Part 1 below. Rebuild **before** doing anything else.

## The lesson worth keeping

**"Disconnect the domain from the site" and "stop Squarespace hosting the DNS" are
not the same action, and the first one silently performs the second.**

This is exactly the failure mode the original plan was built to avoid — it was the
whole reason for choosing "connect existing domain" over "transfer domain" in
Shopify. The plan avoided it on the Shopify side and then walked into it from the
Squarespace side.

**Rule from here on: never change anything about the Squarespace domain connection
without first having the full zone written down, and without checking `dig +short MX`
immediately afterwards.**

---

# PART 1 — The complete zone, for rebuilding

Captured from live DNS on 10 September 2026, before the zone was removed, plus the
DNS panel screenshot. This is the recipe. Keep it.

## Email — Google Workspace. Highest priority. Rebuild these first.

| Type | Host | Priority | Value |
|---|---|---|---|
| MX | `@` | 1 | `aspmx.l.google.com` |
| MX | `@` | 5 | `alt1.aspmx.l.google.com` |
| MX | `@` | 5 | `alt2.aspmx.l.google.com` |
| MX | `@` | 10 | `alt3.aspmx.l.google.com` |
| MX | `@` | 10 | `alt4.aspmx.l.google.com` |

All five. The priority numbers matter — lower is tried first, and the two pairs at
5 and 10 are the fallbacks.

## TXT records

| Type | Host | Value |
|---|---|---|
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `@` | `klaviyo-site-verification=XK6Wjs` |
| TXT | `_dmarc` | `v=DMARC1; p=none` |
| TXT | `@` | `google-site-verification=18Umt0bs3C--4WVIH909szYbWhr2Jld9bu2-TyOxXyo` |

**On the last one — RECOVERED.** It was captured in full by a `dig +short TXT
hartwickatelier.com` run on 10 September, before the zone was destroyed, while the
Klaviyo DNS work was being verified. The value above is exact and can be re-entered
as-is. (It only proves ownership to Google Search Console, so it is the lowest
priority of the five — but there is no longer any reason to lose it.)

## Klaviyo sending domain — four NS records on a subdomain

| Type | Host | Value |
|---|---|---|
| NS | `send` | `ns1.klaviyo.com` |
| NS | `send` | `ns2.klaviyo.com` |
| NS | `send` | `ns3.klaviyo.com` |
| NS | `send` | `ns4.klaviyo.com` |

All four are required — three will not do.

**Host field warning:** enter exactly `send`, not `send.hartwickatelier.com`.
Squarespace appends the domain itself, and the long form produces
`send.hartwickatelier.com.hartwickatelier.com`, which fails with no error message.
This is the most common way this record goes wrong.

## Website — the records being replaced

These are what Squarespace was auto-managing. Listed for completeness and for
rollback. **Do not recreate these** unless you are rolling back to the Squarespace
site.

| Type | Host | Value |
|---|---|---|
| A | `@` | `198.185.159.144` |
| A | `@` | `198.185.159.145` |
| A | `@` | `198.49.23.144` |
| A | `@` | `198.49.23.145` |
| CNAME | `www` | `ext-sq.squarespace.com` |

## Confirmed absent

- **No CAA record.** Good — nothing will block Shopify from issuing an SSL certificate.

---

# PART 2 — A decision to make before continuing

The zone has to be rebuilt somewhere regardless. That makes this the cheapest moment
this project will ever have to choose where it lives.

## Option A — Rebuild at Squarespace, migrate later

**Do this if:** email needs to be back in the next ten minutes.

Fastest possible restoration. But it leaves the project exactly where it started,
with the DNS zone tied to a Squarespace subscription that has to be kept alive purely
as a DNS host — and with the same trap sitting there waiting for the next person who
clicks "disconnect".

## Option B — Rebuild at Cloudflare, once (RECOMMENDED)

**Do this if:** email can wait an hour or two, or is already restored under Option A.

Free. Faster resolvers. Per-record TTL control that actually works. No coupling
between "the website" and "the DNS zone" — disconnecting one cannot destroy the
other. And it removes the Squarespace subscription from the critical path entirely,
which was already scheduled as Phase 7 work.

The cost is one nameserver change at GoDaddy and a propagation wait.

## The recommendation

**Restore at Squarespace first (Option A), confirm mail is flowing, then migrate to
Cloudflare deliberately (Option B) as a separate, calm piece of work.**

Doing the migration *while* email is down converts a one-hour outage into a
several-hour one, and every step gets taken in a hurry. Get mail moving, then move
house properly.

Part 3 assumes the zone is healthy again, wherever it lives.

---

# PART 3 — The revised launch phases

**Entry condition for everything below:**

    dig +short MX hartwickatelier.com

returns Google's mail servers. If it does not, go back to Part 0.

---

## Phase 1 — Push the theme

**Goal:** a copy of the landing page on Shopify, unpublished, viewable.

### 1.0 — The trap, restated

The landing page lives in `templates/index.landing.json`, an **alternate** template.
It only renders with `?view=landing` on the URL.

`templates/index.json` is still the full seven-section homepage — hero, house,
collection index, Masters index, featured Lot, journal, register — with placeholder
copy throughout.

**Publish this repo as-is and the public sees the unfinished homepage, not the
landing page.**

Fix it in a scratch copy so the repo stays intact:

    rm -rf /tmp/ha-live-base \
      && cp -R /Users/administrator/Sites/hartwick-theme /tmp/ha-live-base \
      && cp /tmp/ha-live-base/templates/index.landing.json /tmp/ha-live-base/templates/index.json \
      && rm -rf /tmp/ha-live-base/.git

Now `/` in that copy *is* the landing page.

### 1.1 — Check the auth token is loaded

    echo ${SHOPIFY_CLI_THEME_TOKEN:0:8}

Expect `shptka_`. Nothing means this shell has not read `~/.zshrc` — open a fresh
Terminal tab. (The token line is present in `~/.zshrc`; it is only read by
interactive shells.)

### 1.2 — Push as a new unpublished theme

    shopify theme push --path /tmp/ha-live-base -e dev --unpublished --theme "Hartwick - Landing (live base)"

- `--path` — push the scratch copy
- `-e dev` — use the `[environments.dev]` block in `shopify.theme.toml`
- `--unpublished` — **create a new theme, do not touch the live one.** The safety flag.
- `--theme` — the name it gets in the theme list

### 1.3 — Confirm it is not live

    shopify theme list -e dev

`Hartwick - Landing (live base)` must appear with **no** `[live]` marker. If it says
`[live]`, stop.

### 1.4 — Look at it

Open the preview URL. Store password: `angela` (the storefront preview gate from
`shopify.theme.toml` — not an admin credential).

Check:
- the landing page renders at `/` — headline, paragraph beside the full stop, rule,
  House Symbol, contact line
- the film plays, loops, silently
- no header, no footer, no cart — `layout/landing.liquid` strips all of it
- narrow the window: under 1100px the paragraph should drop *below* the headline.
  That is designed, not broken.

### 1.5 — Leave it unpublished

Publishing is Phase 5.

---

## Phase 2 — Content pre-flight

Five things that are wrong or missing right now. Each is only embarrassing once the
page is public, which is why they come before the cutover.

### 2.1 — Cut a poster frame

**What it is:** a still from the film, shown while the video downloads, and shown
*instead of* the video for anyone whose system is set to reduce motion — a real
accessibility setting, common with vestibular disorders.

The `poster` setting is currently empty, so those visitors get a blank column.

`ffmpeg` is **not installed** on this Mac. Install it once:

    brew install ffmpeg

Then grab a frame from 1.5 seconds in:

    ffmpeg -ss 00:00:01.5 -i /Users/administrator/Sites/hartwick-theme/assets/ha-landing-scrapbook.mp4 -frames:v 1 -q:v 2 ~/Desktop/ha-landing-poster.jpg

Adjust the timestamp to taste — the clip is 8.2 seconds. If the frame is
motion-blurred, try another moment.

Without installing anything: open the .mp4 in QuickTime, pause on a good frame,
`Cmd+C`, paste into Preview via `File -> New from Clipboard`, export as JPEG.

Upload it: Shopify admin -> Online Store -> Themes -> `Hartwick - Landing (live
base)` -> **Customize** -> click the Landing section -> **Still image**.

### 2.2 — Write the alt text

Same panel, the field directly below: **Still image alt text**. Its own help text
says *"Required before this page goes public."*

**What it is:** the sentence a screen reader speaks in place of the image, and what
shows if the image fails to load.

**How to write it:** describe what is in the frame, plainly, one sentence. Do not
begin with "Image of". Do not invent — per `CLAUDE.md`, no artisan names, no place
names, no material claims that are not verified.

### 2.3 — Re-encode the MP4

Currently 8.0 MB for 8.2 seconds. Heavy for a holding page whose entire argument is
that it loads on a bad connection.

    ffmpeg -i /Users/administrator/Sites/hartwick-theme/assets/ha-landing-scrapbook.mp4 -an -vcodec libx264 -crf 26 -preset slow -movflags +faststart -pix_fmt yuv420p ~/Desktop/ha-landing-scrapbook.mp4

- `-an` — **strip the audio.** The video is muted anyway; the audio is bytes nobody
  will ever hear.
- `-crf 26` — quality dial. Lower is better and bigger. 23 is high quality, 28 is
  visibly soft. Start at 26 and judge by eye.
- `-movflags +faststart` — moves the file index to the front so playback starts
  before the whole file arrives. Matters a great deal on mobile.

Compare sizes, watch it full-screen, and if it holds up, replace
`assets/ha-landing-scrapbook.mp4` and push again. **Keep the filename identical** —
the section setting points at it by name, and `asset_url` appends a version hash, so
the CDN picks up the new file with no setting change.

### 2.4 — Confirm the contact address receives mail

The page tells the world to write to `contact@hartwickatelier.com`.

Per `docs/angela-2026-09-07-access-and-dns.md`, the sender-address question with
Angela was still open, and a Google Group defaults to **members-only posting** —
which silently rejects outside mail with no bounce.

Send a real email from an account **not** on `hartwickatelier.com` and confirm it
arrives. If it does not, that address must not ship on a public page.

**Note:** this test is meaningless until Part 0 is resolved. Do it after.

### 2.5 — Check the social card

When someone pastes the URL into Slack or iMessage, the preview is built from `og:`
meta tags.

`snippets/meta-tags.liquid` only emits `og:image` **if `page_image` exists** — and on
a homepage that comes from the store's social sharing image. If it is unset, the card
unfurls with no picture: title and description only.

Set it at Shopify admin -> **Online Store -> Preferences -> Social sharing image**.
The poster frame works, though a wider crop reads better in a card.

Test by pasting the preview URL into a Slack DM to yourself. Slack **caches**
unfurls — append `?x=1` to bust it after a fix.

---

## Phase 3 — TTL prep

**This phase changed.** The original version assumed a live zone with 4-hour TTLs to
lower. The zone is being rebuilt, so instead:

**Set the TTL to 300 seconds (5 minutes) on every record as you create it.**

Nothing to age out, nothing to wait for. You get the fast-rollback property for free,
simply by never setting a long TTL in the first place.

Raise the TTLs back to something normal — 3600, or 14400 — a week after launch is
stable. Low TTLs mean more lookups; harmless at this scale, but no reason to keep
them forever.

### Screenshot the finished zone

Once rebuilt, screenshot **every record**. Type, Host, Value, Priority, TTL, all
legible. Then capture it as text too:

    for t in A AAAA MX TXT NS CNAME CAA; do echo "--- $t ---"; dig +short $t hartwickatelier.com; done

    echo "--- www ---"; dig +short CNAME www.hartwickatelier.com
    echo "--- klaviyo send ---"; dig +short NS send.hartwickatelier.com

Save both somewhere that is not this machine. Part 0 is what happens without them.

---

## Phase 4 — Connect the domain in Shopify (before publishing)

**Goal:** tell Shopify the domain is coming. Nothing goes live here.

### 4.1 — Start the connection

Shopify Admin -> **Settings -> Domains -> Connect existing domain** ->
`hartwickatelier.com`.

### 4.2 — Choose "Connect existing domain", NOT "Transfer domain"

**Transfer** moves DNS hosting to Shopify. Every record in the zone would have to be
recreated by hand inside Shopify: Google's MX, SPF, DMARC, the Klaviyo verification
TXT, and four NS records delegating a subdomain — which Shopify's DNS panel may not
even support.

**Connect** leaves the zone where it is and repoints two things: the apex A and the
`www` CNAME. Everything else stays untouched and working.

Part 0 is a live demonstration of what happens when a zone gets torn down. Do not
volunteer for a second one.

### 4.3 — Record the target values Shopify gives you

Shopify will display what to point at. As of writing these are normally:

| Record | Value |
|---|---|
| apex `@` A | `23.227.38.65` |
| `www` CNAME | `shops.myshopify.com` |

**Use the values on your screen, not these.** Shopify has changed them before.
Screenshot that screen.

### 4.4 — Expect "not connected"

Shopify will verify and fail, because DNS still points elsewhere. That is correct.
The domain stays listed as pending until Phase 5.

---

## Phase 5 — Cutover

The live moment. Do it when you can sit with it for an hour, not last thing at night.

With 5-minute TTLs from Phase 3, rollback is a 5-minute operation.

### 5.1 — Publish the theme

Online Store -> Themes -> `Hartwick - Landing (live base)` -> **Publish**.

The previous theme is not deleted — it drops into the library, and republishing it is
one click. That is the theme-level rollback.

### 5.2 — Turn off password protection

**Online Store -> Preferences -> Password protection** -> disable.

Until this is done, every visitor sees the password gate. This is the step people
forget, and then spend twenty minutes debugging DNS that was working perfectly.

**Order matters:** publish first, password off second. Reversed, the public briefly
sees whatever theme was live before.

### 5.3 — Point the two website records at Shopify

In the DNS panel:

- **A record**, host `@`, value = Shopify's IP from 4.3, TTL 300
- **CNAME**, host `www`, value = `shops.myshopify.com`, TTL 300

Then stop. **Touch nothing else.** Specifically leave alone:

- the five **MX** records
- `v=spf1 include:_spf.google.com ~all`
- `klaviyo-site-verification=XK6Wjs`
- `v=DMARC1; p=none`
- the four `send` NS records for Klaviyo

None of those has anything to do with where the website lives, and each one breaks
something if removed.

### 5.4 — Set the primary domain

Shopify -> Settings -> Domains -> primary = **`www.hartwickatelier.com`**.

**What primary means:** the single address Shopify canonicalises to. The other form
gets a 301 redirect to it.

**Why www:** it matches today's canonical, so existing links, anything indexed and
anything printed all stay coherent, with no extra redirect hop. Choosing the apex is
not wrong; it just silently changes every existing link's destination for no gain.

### 5.5 — Wait for SSL

Shopify provisions the certificate automatically, but only **after** DNS resolves to
Shopify — the certificate authority verifies ownership by lookup.

Usually minutes. Officially up to 48 hours. A certificate warning during the wait is
expected, not a mistake.

There is no CAA record on the domain (confirmed in Part 1), so nothing will block
issuance. If one is ever added, it must permit Let's Encrypt.

---

## Phase 6 — Verify

Do not trust the browser. Browsers and macOS cache DNS aggressively. `dig` asks
properly.

### 6.1 — The site points at Shopify

    dig +short A hartwickatelier.com

Expect Shopify's single IP. Four `198.x` addresses means the old Squarespace answer
is still cached or the record did not save.

    dig +short CNAME www.hartwickatelier.com

Expect `shops.myshopify.com.` — the trailing dot is normal.

### 6.2 — Email is still Google. Check this explicitly.

    dig +short MX hartwickatelier.com

All five Google servers must be there. **Empty output means the company's email is
down** — restore immediately from the Phase 3 capture.

Do this check twice. Email failure is silent: nothing errors, mail simply stops
arriving and nobody notices for a day. Part 0 is precisely this failure, caught only
because someone happened to run the command.

### 6.3 — The rest of the zone survived

    dig +short TXT hartwickatelier.com
    dig +short NS send.hartwickatelier.com

SPF, the Klaviyo verification, and all four Klaviyo nameservers.

### 6.4 — Send a real email

Not a `dig` check. An actual message from an outside account to
`contact@hartwickatelier.com`. DNS can look perfect while delivery is broken.

### 6.5 — Look at the site as a stranger

Use a **private window** — the normal browser has the old site, the password cookie
and stale DNS all cached, and will lie to you.

- desktop: does `/` show the landing page? Padlock?
- phone **on cellular, not office wifi** — a different resolver, so a genuinely
  independent check
- type the address without `www`; confirm it redirects to `www`
- no password gate

---

## Phase 7 — After

### 7.1 — Do NOT cancel Squarespace until DNS lives elsewhere

If the zone was restored at Squarespace (Option A), Squarespace is still hosting the
DNS — including the MX records that deliver Angela's email. **Cancelling the
subscription deletes the zone.** Email does not degrade; it stops.

Part 0 is what that looks like, and it happened without anyone cancelling anything.

Two safe exits:

1. **Move to Cloudflare first.** Recreate the zone there using the Part 1 inventory,
   change the nameservers at **GoDaddy** — the registrar is the only place
   nameservers are set — verify with the Phase 6 commands, *then* cancel Squarespace.
2. **Or keep paying Squarespace** purely as a DNS host. Boring, cheap, zero risk.

Either way: **the website going live and the Squarespace subscription ending are two
separate projects.** Do not let them touch.

### 7.2 — Reinstate Google Search Console verification

The `google-site-verification` TXT record could not be recovered in full. Issue a new
one from Search Console and add it. Low priority — it affects nothing but Search
Console.

### 7.3 — Export anything still wanted from the Squarespace site

Copy, images, blog posts, form submissions, contacts. Gone when the subscription
ends. Do it while it is still up.

### 7.4 — Expect Google to re-index `/` as "the website is being rebuilt"

That headline becomes the search snippet within days. Honest, temporary, and it
reverses on its own once the real site ships and is crawled.

To steer it, set a proper `page_description` so the description under the snippet
says something more useful than the headline.

---

# Appendix — every verification command in one place

    # Is the zone alive at all? (Part 0)
    dig @connect1.squarespacedns.com SOA hartwickatelier.com | grep status:

    # Where is the domain delegated? (registrar level)
    dig @a.gtld-servers.net NS hartwickatelier.com +norecurse

    # Email — the one that matters most
    dig +short MX hartwickatelier.com

    # Website
    dig +short A hartwickatelier.com
    dig +short CNAME www.hartwickatelier.com

    # Everything else
    dig +short TXT hartwickatelier.com
    dig +short NS send.hartwickatelier.com
    dig +short CAA hartwickatelier.com

    # Full sweep
    for t in A AAAA MX TXT NS CNAME CAA SOA; do echo "--- $t ---"; dig +short $t hartwickatelier.com; done

    # Check across independent resolvers — rules out local cache
    for r in 8.8.8.8 1.1.1.1 9.9.9.9; do echo "== $r =="; dig @$r +short MX hartwickatelier.com; done
