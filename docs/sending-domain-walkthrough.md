# Sending domain — step-by-step

Written 7 September 2026. **Revised 8 September 2026** — Klaviyo served the *delegated
subdomain* (NS) setup, not the CNAME setup this doc originally assumed. Sections 3, 5 and 6
rewritten against the records actually issued. Companion to
`klaviyo-and-analytics-runbook.md` §16.

Klaviyo's exact wording changes between releases, so this describes **what each step means
and what to choose**, rather than promising specific button labels. Where the screen differs
from this, the reasoning still holds.

---

## The question you're being asked right now

Klaviyo offers two setup routes:

| Route | What happens | Needs |
|---|---|---|
| **Connect automatically** (via Squarespace/GoDaddy/etc.) | Klaviyo hands off to a DNS automation service, you log into the DNS provider, it writes the records for you | **A Squarespace login** — which you don't have |
| **Manual / "add records myself"** | Klaviyo shows you the records; someone adds them by hand | Nothing. You copy them and send them on |

### Which zone — settled, 8 September

Verified from outside the account, so this is fact rather than assumption:

```
Registrar:    GoDaddy.com, LLC          <- Angela's customer number opens this
Name Server:  CONNECT1.SQUARESPACEDNS.COM
Name Server:  CONNECT2.SQUARESPACEDNS.COM
```

GoDaddy is the **registrar** — where the name is bought and renewed. The **zone that
answers queries is at Squarespace**. Records added in GoDaddy's DNS tab will sit there
answering nothing. When a setup wizard asks which DNS provider you use, the answer is
**Squarespace**.

## Choose manual. Three reasons.

1. **You don't hold Squarespace credentials.** Angela does. The automatic route would need
   her sitting at the screen doing an OAuth handoff, which is more of her time, not less.
2. **That zone carries Google Workspace MX records.** An automated tool writing into a live
   zone that also delivers Angela's email is a risk you cannot review before it happens.
   Manual gives you an exact, readable list you can check first — and lets you say "add
   these four, change nothing else."
3. **It gives you an artefact.** A written record list is something you can send, log in the
   daily update, and verify against later. An automated write leaves you nothing to check.

*The one case for automatic:* if Angela is doing the entire thing herself, at her own
screen, and wants it done in two minutes. Even then, the MX risk argues for manual.

---

## Step by step

### Step 1 — Enter the sending domain
When asked for the domain, give: **`send.hartwickatelier.com`**

Some versions ask for the root domain and a prefix separately. If so: root
`hartwickatelier.com`, prefix `send`. (Reasoning for `send` is in runbook §16 — the short
version: never the root domain, and never change it once chosen.)

### Step 2 — Choose "manual" / "I'll add the DNS records myself"
Per the reasoning above.

### Step 3 — Copy the records exactly

Klaviyo offers **two different setups**, and which one you get changes everything downstream.
Check which you're looking at before going further:

| Setup | What you see | Who holds the keys |
|---|---|---|
| **CNAME** | `kl._domainkey.send.…` and a return-path CNAME | You publish each record; Klaviyo reads them |
| **Delegated subdomain (NS)** | Four `NS` records pointing at `ns1–4.klaviyo.com` | You hand Klaviyo the whole `send.` zone; it manages DKIM, return-path and tracking inside it |

**Hartwick got the NS setup**, issued 8 September:

| Type | Name | Value |
|---|---|---|
| NS | `send` | `ns1.klaviyo.com` |
| NS | `send` | `ns2.klaviyo.com` |
| NS | `send` | `ns3.klaviyo.com` |
| NS | `send` | `ns4.klaviyo.com` |
| TXT | `@` | `klaviyo-site-verification=XK6Wjs` |
| TXT | `_dmarc` | `v=DMARC1; p=none` |

That is the complete set — **there are no DKIM CNAMEs to chase.** Their absence is correct
here, not a missing step. `send.hartwickatelier.com` was confirmed empty before delegation,
so nothing collides.

Do not retype them. **Use the copy buttons.** A single wrong character means it will not
verify, and you will lose hours to it.

**⚠ The NS setup has a prerequisite the CNAME setup doesn't:** the DNS panel must be able to
create `NS` records on a subdomain. Not all can. See Step 4a — check this *before* anyone
starts adding records.

Leave the Klaviyo tab open, or exit with **Back**. Do not click **Verify** yet — verifying
against records that don't exist yet only fails. The domain stays pending and the same
records are waiting when you return via Settings → Domains.

### Step 4a — Confirm the DNS panel can make NS records (do this first)

Thirty seconds, no changes made:

> Squarespace → Settings → Domains → `hartwickatelier.com` → DNS Settings →
> Custom Records → **Add Record** → open the **Type** dropdown. Is `NS` in the list?

Squarespace's custom records are built around A / AAAA / CNAME / MX / TXT / SRV, and
subdomain NS delegation is a known gap. **If `NS` isn't offered, the four NS records are
dead on arrival** — go back into Klaviyo and take the CNAME-based sending domain instead.
Same destination, records Squarespace can actually hold.

Finding this out before the message goes to Angela saves a full round-trip against a
launch deadline.

### Step 4 — Send them to Angela, with the two warnings
Paste them into the message draft (`angela-2026-09-07-access-and-dns.md`, section 3),
together with the SPF and DMARC records, so it is **one trip to the DNS panel**.

Two things that must be in that message:

**⚠ Warning 1 — the host field.** Squarespace's Host field expects only the part **before**
the domain — it appends `hartwickatelier.com` itself. Pasting a full hostname produces
`send.hartwickatelier.com.hartwickatelier.com`, which fails silently. **This is the single
most common mistake in this whole process.**

The NS-setup screen happens to show *short* names already (`send`, `@`, `_dmarc`), so this
trap is mostly disarmed — copy them verbatim and they are already correct. It bites hard on
the CNAME setup, which shows full hostnames:

| Klaviyo shows | Squarespace Host field |
|---|---|
| `send` | `send` (already short — paste as-is) |
| `@` | `@` |
| `kl._domainkey.send.hartwickatelier.com` | `kl._domainkey.send` |
| `_dmarc.hartwickatelier.com` | `_dmarc` |

**⚠ Warning 2 — change nothing else.** The MX records deliver Angela's Google Workspace
email. They must not be touched, reordered or "tidied".

### Step 5 — Where Angela goes in Squarespace
Squarespace → **Settings → Domains** → select `hartwickatelier.com` → **DNS Settings** →
**Custom Records** → *Add Record*.

For each: set **Type** (CNAME or TXT), **Host** per the table above, and **Data/Value** as
the exact string Klaviyo gave.

### Step 6 — Wait, then verify yourself before clicking Verify
DNS propagation is usually minutes, occasionally up to 48 hours. Check it yourself first —
clicking Verify repeatedly against unpropagated records achieves nothing.

The delegation itself:

```bash
dig +short NS send.hartwickatelier.com
```

Expect all four `ns1–4.klaviyo.com`. Fewer than four is a partial add, not propagation lag.

The two TXT records:

```bash
dig +short TXT hartwickatelier.com; dig +short TXT _dmarc.hartwickatelier.com
```

Then the real proof — that Klaviyo is actually *serving* the delegated zone, which the
records alone don't tell you:

```bash
dig +short DKIM._domainkey.send.hartwickatelier.com @ns1.klaviyo.com; dig +short SOA send.hartwickatelier.com
```

Empty output means it hasn't propagated (or the host field was wrong — check Warning 1
first, it's usually that). Once the NS set and both TXT records return, go back to Klaviyo
and click **Verify**.

### Step 7 — Set it as the account's sending domain
Once verified, confirm Klaviyo is actually *using* it — verified but not selected is a real
state, and it fails silently by continuing to send from the shared domain.

### Step 8 — Set the From address (separate step, easy to conflate)
This is **not** the sending domain. The From address is what recipients see, and it lives
at the root: e.g. `hello@hartwickatelier.com`, per Angela's answer to ask #1.

Klaviyo emails a verification link to that address. Someone with the mailbox has to click
it. Until that happens, the account still cannot send.

### Step 9 — Confirm the whole chain
- Sending domain: **verified** and **selected**
- From address: **verified**
- Postal address: **filled** (runbook B1 — still required, still blocks all sending)

All three, or nothing sends.

---

## If verification fails

| Symptom | Cause, in order of likelihood |
|---|---|
| No `NS` option in the Type dropdown | Squarespace can't delegate subdomains — switch to the CNAME setup (Step 4a) |
| Record not found | Host field had the domain appended twice (Warning 1) |
| Still not found after an hour | Record added to the wrong zone — GoDaddy instead of Squarespace |
| Fewer than four NS returned | Only some of the four were added — all four are required |
| Found but mismatched | Retyped instead of pasted; or a trailing dot added/removed |
| DMARC record rejected | An `rua=` was added before first verification — see the note below |
| Verifies, then unverifies later | Record edited or removed afterwards |

**On DMARC and `rua=`:** publish `v=DMARC1; p=none` *exactly as Klaviyo shows it* for the
first pass. It is unknown whether Klaviyo's checker parses the record or string-matches it,
and a helpfully-added `rua=` that trips a string match costs an hour of hunting a
self-inflicted problem. Verify clean, then add reporting. SPF is unaffected — separate
record, not checked by Klaviyo.

If it still fails after all four are ruled out, `dig` the exact hostname and compare the
output character by character against what Klaviyo displays. It is nearly always a
transcription error, not a Klaviyo fault.

---

## After the domain cutover on 10 September

If `hartwickatelier.com` moves from Squarespace to Shopify, **the sending domain records
must survive the move.** Whoever performs the cutover changes the A record and the `www`
CNAME only.

**The NS setup raises the stakes here.** A CNAME setup that loses a record breaks one piece.
Losing the `send` NS delegation orphans the entire subdomain at once — DKIM, return-path and
link tracking all vanish together, because they only ever existed inside Klaviyo's zone.
And Shopify's DNS panel may have the same subdomain-NS limitation Squarespace does, which
would make the cutover the moment sending breaks with no way to restore it in place.

**Establish before the cutover, not during it:** whether Shopify's DNS can hold `NS` records
on a subdomain. If it can't, either keep the zone at Squarespace and point only the A/`www`
records at Shopify, or migrate Klaviyo to the CNAME setup first.

Add to the launch checklist: after cutover, re-run the `dig` checks above and re-confirm the
sending domain still shows verified in Klaviyo. A zone rebuild that drops these records takes
email down silently — nothing errors, mail just stops arriving.
