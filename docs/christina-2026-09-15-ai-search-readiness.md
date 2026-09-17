# Reply to Christina — AI / agentic search readiness (15 Sep 2026)

cc: Aloha

Hi Christina,

Thanks — this is the right time to raise it, and most of it is achievable. Below is
what's already in place, what I can build, what has to come from your side, and what
I'd add to the list. Because it's new scope against the 40-hour cap I've put an estimate
at the end and will start once Aloha confirms in writing.

## Already in place

- Product, article and breadcrumb structured data (Schema.org JSON-LD) — Shopify's
  standard set: name, images, price, SKU, availability, brand.
- Sitemap, canonical URLs, hreflang for the 27 markets, and robots.txt — all generated
  by Shopify automatically.
- The product data model already holds the attributes you list — fibre, yarn, weave,
  dye, place of weaving / dyeing / construction, silhouette, fit, the Masters,
  techniques, lot and edition. The structure is right; what's missing is the verified
  content to fill it (see "From you").

## What I can build in the theme

1. **Enriched product JSON-LD** — map the Hartwick metafields into Schema.org:
   material, colour, size, country of origin, technique / weave / dye / lot as
   additional properties, each Master as a named Person, the atelier as Organization.
   Validated with Google's Rich Results test and the Schema.org validator.
2. **Indexable Masters, technique and origin pages** — Shopify lets metaobjects have
   their own URLs. Today the Masters only exist inside product pages, so an AI agent
   cannot retrieve "who is this Master" as a page. This is the biggest gain not on
   your list.
3. **AI-readable FAQ page** with FAQPage schema (sizing, care, availability through
   The Register, shipping, returns).
4. **robots.txt** explicitly allowing the AI crawlers (GPTBot, OAI-SearchBot,
   ClaudeBot, PerplexityBot, Google-Extended, Bingbot) alongside the standard rules.
5. **llms.txt / llms-full.txt** — Shopify cannot host root files, so these are served
   via a redirect to a hosted file. Cheap to do, so I'll do it, but to set
   expectations: no major AI search engine has confirmed it reads these files.
6. **Image alt text** — a rule so every product image carries
   "Style — Expression, fibre, colour" automatically unless a specific alt is written,
   plus a pass over the editorial imagery.
7. **Collection pages** — a short indexable description per collection from the
   collection metafield, so categories are retrievable and not image-only.

One note on **agents.md**: that convention is for code-editing agents (Cursor,
GitHub Copilot in an editor), not shopping agents. It does nothing for discovery, so
I'd leave it out unless you have a specific reason.

## From you — admin configuration and data (not code)

These are the items that decide whether the list above actually works:

- **Cloudflare AI-crawler setting (urgent).** Since the domain moved to Cloudflare,
  note that Cloudflare blocks AI crawlers by default on new zones. If that switch is
  on, none of the above is visible to ChatGPT, Perplexity or Copilot. Whoever holds the
  Cloudflare login needs to check Security → Bots → "AI Scrapers and Crawlers" and
  the managed robots.txt, or give me access to check.
- **Shopify Catalog / agentic storefront** is an opt-in sales channel in the admin.
  What it reads is the Shopify standard product category and its attributes
  (material, fabric, colour, pattern, fit, size system, gender) — not our custom
  metafields. So "mapping into Catalog" means assigning each product a category and
  filling those standard attributes, product by product. I can set up two products as
  the model and write the sheet for the rest; population across the catalogue is a
  data task sized like the product population we discussed with Aloha. It also
  generally requires Shopify Payments active, which is outside my permissions.
- **Shopify Knowledge Base** (Settings → Knowledge base) is written by the merchant:
  shipping, returns, sizing, care, who the Masters are, how The Register works. I'll
  send a structured template; the content needs to come from you.
- **Verified provenance.** Under our "never invent" rule, anything still marked
  pending verification stays a placeholder — and a placeholder is worse than nothing
  here, because an AI agent will index it as fact. Confirmed Master names, places,
  techniques and materials are the real gating item for "structured artisan and
  provenance data".
- **Google Search Console** — needs a Google account you own, verified through the
  Cloudflare DNS. I'll do the setup and submit the sitemap once I have access.
- **Google Merchant Center and Microsoft Merchant Center** — these are what feed
  Gemini / Google AI Mode and Copilot shopping. GMC connects through Shopify's
  Google & YouTube app; Microsoft is a separate connection. Both need accounts on
  your side; I'll do the connection and check the product feed for disapprovals.
- **Bing Webmaster Tools + IndexNow** — quick, and Bing is Copilot's index.

## Beyond your list

- The Masters / origin pages above (largest single gain).
- Organization schema with the atelier's legal name, logo and social profiles so
  agents attribute the brand correctly.
- A "Through The Register" availability note that is also expressed in structured data,
  so an agent doesn't tell a customer a Register-only piece is simply "in stock".
- Product descriptions in plain prose, not only in imagery or PDFs — anything that
  lives inside an image or a video is invisible to an agent.

## What to expect

We can make every product and Master accurately retrievable and described. No one can
guarantee that ChatGPT, Gemini or Copilot *recommend* them — that ranking is theirs.
I'll give you a before/after using live queries in each assistant so the effect is
visible.

## Estimate

Theme work (items 1–7): [X–Y] hrs. Audit, admin configuration and documentation:
[X–Y] hrs. Per-product category and attribute population: [X] min per product, so
[X] hrs for the catalogue — or done by your side from my sheet. Current position on
the 40 hours: [used] used, [remaining] remaining.

Aloha — could you confirm in writing whether this goes ahead as an addition, and in
what order against the remaining launch work?

Thanks,
Ivan
