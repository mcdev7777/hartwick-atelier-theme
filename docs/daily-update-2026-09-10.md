# Daily update to Aloha — Thu 10 September 2026

Filled from `daily-update-template.md`. **Hours are the only blank** — I have not tracked
them and will not invent them. Fill before sending.

Send this *or* `aloha-2026-09-10-email-status-and-two-decisions.md`, not both — that one is
the same material at more length. If the two decisions need room to breathe, send that.
If the thread is stacking well, send this.

**Subject:** Hartwick — Daily update, Thu 10 Sep

---

Aloha,

Covering today.

**Completed**

- **Email sending works.** `send.hartwickatelier.com` is delegated, verified and active.
  Hartwick's emails will now be signed as Hartwick rather than sent from a shared Klaviyo
  domain, which is the single largest factor in whether the first Dispatch reaches an inbox
  or a spam folder.
- **Verified it independently**, not from the dashboard — the delegation resolves publicly,
  the signing keys are published and answering, and Google Workspace's mail records are
  untouched. Nobody's existing email was disturbed at any point.
- **Added SPF and DMARC.** The domain had neither, despite already sending through Google
  Workspace. That predates this project, and it would have made a first campaign from a new
  setup markedly more likely to be filtered.
- **The account can now send at all** — sender address and registered postal address are
  both filled. Both were empty and both are hard requirements; until today no campaign and
  no welcome email could have gone out.
- **Onsite tracking switched on** for the development theme, which is what lets us see which
  pieces people actually look at. Currently being verified.
- **Circle request section now accepts a Klaviyo form.** Small piece of groundwork: it means
  the city and note fields on that form can finally be real. They have been switched off
  because Shopify's own form silently discards free text, and collecting something we then
  throw away is worse than not asking.

Nothing has been published. The live theme is untouched and the storefront is unchanged.

**In progress**

Lists, forms and flows in Klaviyo. The forms carry a hidden source field per placement, so
at launch we can answer "which call to action actually worked" rather than guess at it. All
flows will be built and left in **draft** — a live flow with placeholder wording emails a
real person, so nothing goes live until Christina's copy lands and you approve it.

**Hours**

[__] used · [__] of 40 remaining.

**Next priority**

The two signup forms and their source tracking. It is the last substantial build item, and
everything after it is verification rather than construction.

**Decisions I need**

1. **Is 10 September a live-domain launch?** *Open since 7 September.* The domain still
   serves the Squarespace site, and the cutover has no named owner. Options: public launch
   on `hartwickatelier.com`, or soft launch with Squarespace left up. Either is workable —
   I need to know which, and who performs it. My recommendation, given the copy still
   outstanding, is a soft launch.
2. **Is the trading entity Canadian, and should the store sell in CAD?** The registered
   address is in British Columbia; the store is set to USD. This may be deliberate. It
   drives every revenue figure we report from here on, so I would rather confirm than
   assume. It also means **CASL** governs these emails, which makes the consent wording a
   legal requirement rather than a matter of taste — worth passing to Christina with item 3.
3. **Christina's consent wording for The Register and the Circle form.** *Open since
   4 September.* The forms are built and cannot be published without it. I will not write it
   and will not ship invented wording.

**Scope / 10 September watch**

- **The Circle public form conflict.** *Open since 4 September.* Framework v3 records The
  Circle as invitation-only with no application route; your 4 September email asks for a
  public form. Built and switchable in one click either way, so nothing is blocked — but the
  conflict is unresolved and it is Christina's to settle.
- **The cutover is unowned.** *Open since 7 September.* Impact: whoever performs it must
  change two records and nothing else. Replacing the zone wholesale takes Angela's email
  offline and destroys the sending setup completed today, with no way to restore it in
  place. Recommendation: name the owner before anything is touched.
- **Branded click-tracking needs a Klaviyo plan upgrade.** New today. Links inside a
  Dispatch will show a Klaviyo domain rather than Hartwick's. No deliverability impact and
  not a blocker — raising it because it is visible, and because it is a spend and therefore
  yours. I am not recommending it for launch.
- **Shopify Settings permission** still outstanding with Angela. It blocks only the cookie
  consent banner, which is required before launch either way.

Ivan
