# Friends & Family feedback page — 1 October 2026

Christina's request: a quick review form for friends and family, sent as a
Klaviyo link. No button or popup; the email links straight to the page.

## What was built (phase 2)

| Piece | Where |
|---|---|
| Section, questions as blocks (1–5 scale / choice / written) | `sections/ha-feedback.liquid` |
| Page styles (this page only) | `assets/ha-feedback.css` |
| Template, **placeholder questions** until Christina sends hers | `templates/page.feedback.json` |
| Shared Klaviyo script: ticked choices only, `answers` / `answers_text`, required questions | `assets/ha-klaviyo-form.js` (backwards-compatible) |
| Page record | **Friends & Family Feedback**, handle `friends-and-family`, template `feedback`, published, `seo.hidden = 1` (renders `noindex,nofollow`), in no menu — `gid://shopify/Page/178233540907` |

Pushed to the CLI dev theme #190959223083 only. Preview:
`https://www.hartwickatelier.com/pages/friends-and-family?preview_theme_id=190959223083`

The page record is store-wide. On the live landing theme, which has no
`feedback` template, the URL shows Luxe's plain page with the title only.

## What reaches Klaviyo

Event **Friends & Family Feedback** (metric `U49ekD`) on the respondent's
profile. It is not a subscription and records no consent. Properties:
`overall`, `pages_viewed` (list), `liked`, `unclear`, `anything_else`
(the block "Klaviyo key"s), `answers` (`[{question, answer}]`),
`answers_text`, `full_name` / `first_name` / `last_name`, and
`register_source: friends_family_feedback`.

Verified 1 Oct with a real submission (ivanzhang7777@outlook.com, "Ivan Test").
Event `7uUMPc989N6` arrived with every answer. Validation was checked with fetch
stubbed: an unanswered required question blocks sending and is marked. No
overflow at 375px.

## Phase 3 — the alert flow (Klaviyo UI)

Trigger: metric **Friends & Family Feedback** → **Internal alert** to
ivanzhang7777@outlook.com during development, then Angela's address.

Subject: `New feedback from {{ person.first_name|default:'a friend' }}`

Body:

```
{{ person.first_name }} {{ person.last_name }} ({{ person.email }}) sent feedback.

{% for a in event.answers %}
{{ a.question }}
{{ a.answer }}

{% endfor %}
```

## Alert email template (1 Oct)

Klaviyo template **S5ajVD**, "Friends & Family Feedback — alert to Angela (final)".
It has the page ground, the record voice for labels, a serif for answers, the
sender's name and email, then one row per question from `event.answers`, so it
needs no editing when questions change. It has no unsubscribe link on purpose:
in an internal alert `person` is the respondent, so the link would unsubscribe
them. U9uYCP is an earlier draft with a wrong footer line; delete it.
Flow: XC3ZfP "Friends & Family Feedback → Angela" (live).

## Open

- Christina's questions and introduction replace the placeholders, in the theme editor.
- Aloha's written OK (new scope), and approval to put the template on the live theme.
- Delete the test profile/event before sending to friends, if wanted.
