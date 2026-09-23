# GA4 — custom pixel and event map

Written **22 September 2026**. This is the brief's §5 deliverable: *"a simple event map or
implementation note so reporting can be checked after launch."*

- **GA4 property:** Hartwick Atelier · Measurement ID **`G-N3073NKV8P`** · owned by
  Angela's Hartwick Google Workspace account.
- **Installed as:** a Shopify **custom pixel** (Settings → Customer events), *not* the
  Google & YouTube channel. The channel gates its GA4 step behind a Merchant Center
  account, which is Google Shopping — a business decision for Aloha, out of scope, and
  it would fail Merchant Center's store requirements while the domain serves the landing
  page.
- **Lives in Shopify Admin, not in the theme.** Nothing here is pushed with the theme. If
  the pixel is edited in Admin, update this file to match.

---

## 1. Settings in Shopify Admin

Settings → **Customer events** → **Add custom pixel**.

| Field | Value | Why |
|---|---|---|
| Pixel name | `GA4 — Hartwick` | |
| Customer privacy → **Permission** | **Required** → tick **Analytics** only | The pixel does not load at all until the visitor accepts analytics cookies. This is the consent gate; the check in the code is only a second line. |
| Customer privacy → **Data sale** | **Data collected does not qualify as data sale** — *placeholder, confirm with Christina* | A legal classification under California law. Not a developer's call. |
| Code | Section 2, in full | |

Then **Save** → **Connect**. A pixel that is saved but not connected does nothing.

---

## 2. The code

Paste the whole block. Replace nothing — the ID is already in it.

```js
// Hartwick Atelier — GA4 via Shopify custom pixel.
// Record: docs/ga4-custom-pixel.md in the theme repo. Keep the two in step.
//
// Runs in Shopify's pixel sandbox (an iframe), so:
//  - automatic page_view is OFF and every event carries the real page URL,
//    title and referrer from Shopify's event context — otherwise GA4 would
//    record the sandbox iframe's address instead of the shop page.
//  - every event comes from Shopify's own stream, once per action, which is
//    what keeps page views and purchases from double-counting.
//
// Every function is declared at the top level: Shopify's editor is strict
// mode, which rejects function declarations inside if/else blocks.

const MEASUREMENT_ID = 'G-N3073NKV8P';

window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

function page(event) {
  const d = (event.context && event.context.document) || {};
  return {
    page_location: d.location ? d.location.href : undefined,
    page_referrer: d.referrer || undefined,
    page_title: d.title || undefined
  };
}

function money(m) {
  return m && m.amount != null ? Number(m.amount) : undefined;
}

function item(variant, quantity) {
  if (!variant) return null;
  const p = variant.product || {};
  return {
    item_id: variant.sku || String(variant.id || ''),
    item_name: p.title || variant.title,
    item_variant: variant.title,
    item_brand: p.vendor,
    item_category: p.type,
    price: money(variant.price),
    quantity: quantity || 1
  };
}

function checkoutParams(checkout) {
  return {
    currency: checkout.currencyCode || (checkout.totalPrice && checkout.totalPrice.currencyCode),
    value: money(checkout.totalPrice),
    items: (checkout.lineItems || []).map((l) => item(l.variant, l.quantity)).filter(Boolean)
  };
}

function send(name, event, params) {
  gtag('event', name, Object.assign(page(event), params || {}));
}

function start() {
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, { send_page_view: false });

  analytics.subscribe('page_viewed', (event) => {
    send('page_view', event);
  });

  analytics.subscribe('collection_viewed', (event) => {
    const c = event.data.collection || {};
    send('view_item_list', event, {
      item_list_id: String(c.id || ''),
      item_list_name: c.title,
      items: (c.productVariants || []).map((v) => item(v)).filter(Boolean)
    });
  });

  analytics.subscribe('product_viewed', (event) => {
    const v = event.data.productVariant;
    send('view_item', event, {
      currency: v && v.price ? v.price.currencyCode : undefined,
      value: v ? money(v.price) : undefined,
      items: [item(v)].filter(Boolean)
    });
  });

  analytics.subscribe('search_submitted', (event) => {
    const r = event.data.searchResult || {};
    send('search', event, { search_term: r.query });
  });

  analytics.subscribe('product_added_to_cart', (event) => {
    const line = event.data.cartLine || {};
    const cost = line.cost && line.cost.totalAmount;
    send('add_to_cart', event, {
      currency: cost ? cost.currencyCode : undefined,
      value: money(cost),
      items: [item(line.merchandise, line.quantity)].filter(Boolean)
    });
  });

  analytics.subscribe('checkout_started', (event) => {
    send('begin_checkout', event, checkoutParams(event.data.checkout || {}));
  });

  analytics.subscribe('payment_info_submitted', (event) => {
    send('add_payment_info', event, checkoutParams(event.data.checkout || {}));
  });

  analytics.subscribe('checkout_completed', (event) => {
    const c = event.data.checkout || {};
    send('purchase', event, Object.assign(checkoutParams(c), {
      // Order id when Shopify provides it; the checkout token otherwise.
      // GA4 de-duplicates purchases on this value, so it must be stable.
      transaction_id: (c.order && c.order.id) || c.token,
      tax: money(c.totalTax),
      shipping: money(c.shippingLine && c.shippingLine.price)
    }));
  });
}

// Belt and braces: the pixel's Permission setting already blocks loading
// without analytics consent. This stops it if that setting is ever changed.
const consent = init.customerPrivacy || {};
if (consent.analyticsProcessingAllowed !== false) {
  start();
}
```

---

## 3. Event map

What fires where, across the three systems. **Currency is the visitor's presentment
currency** — Markets converts prices (see store config, 15 Sep), so a Canadian visitor's
`purchase` arrives in CAD and GA4 converts it to the property currency for reporting.

| Visitor action | Shopify Analytics | GA4 (this pixel) | Klaviyo |
|---|---|---|---|
| Any page load | Sessions, Live View | `page_view` | `Active on Site` (identified visitors only) |
| Opens a collection | ✓ | `view_item_list` | — |
| Opens a product | ✓ | `view_item` | `Viewed Product` |
| Searches | ✓ | `search` | — |
| Adds to bag | ✓ | `add_to_cart` | `Added to Cart` *(if enabled in Klaviyo)* |
| Starts checkout | ✓ | `begin_checkout` | `Checkout Started` |
| Enters payment | — | `add_payment_info` | — |
| Places order | Orders, revenue | `purchase` | `Placed Order` |
| Joins The Register | Customer (no-JS path only) | — *(see §5)* | `Subscribed to List` · `register_source` |
| Requests Circle access | Customer (no-JS path only) | — *(see §5)* | `Circle Requests` list · `register_source` |

**Source attribution** — two separate mechanisms, deliberately:
- *Where did they arrive from?* UTM parameters on inbound links (Instagram, Dispatch,
  press, QR). Read by Shopify Analytics and GA4 automatically. Klaviyo stamps its own on
  every Dispatch link.
- *Which form did they use?* `register_source` on the Klaviyo profile: `homepage_band`,
  `footer`, `product_page`, `circle_page`, `journal`.

---

## 4. Verification — do once after connecting

1. **Accept cookies**, load the homepage, one collection, one product. In GA4 →
   **Realtime**, the session appears with `page_view`, `view_item_list`, `view_item`.
2. **Exactly once each.** Browser DevTools → Network → filter `collect` — one
   `en=page_view` request per page load. Two means a second GA4 source exists somewhere
   (theme code, the Google & YouTube channel, a second pixel) and one must go.
3. **Decline cookies** in a fresh private window. Reload. **No** request to
   `googletagmanager.com` and no `collect` request at all.
4. **Test order** (the checkout test plan) → `begin_checkout` then `purchase` with the
   correct value and `transaction_id`. Same order should appear in Shopify Orders and as
   `Placed Order` in Klaviyo — that's the brief's acceptance line *"test purchases appear
   correctly in Shopify and Klaviyo."*

**Limitation, stated plainly:** the pixel runs in a sandboxed iframe, so GA4's cookie
lives in that sandbox rather than on `hartwickatelier.com`. Sessions and funnels work;
cross-domain attribution and some referral detail are less precise than a native
install. For a single-domain shop at launch volume this is an acceptable trade. It
becomes worth revisiting only if Hartwick later adopts the Google & YouTube channel for
Shopping — at which point this pixel must be **removed**, or every event doubles.

---

## 5. Not built — decision needed from Aloha

- **Registration as a GA4 event.** The Register and Circle forms post to Klaviyo from the
  theme, outside Shopify's event stream, so this pixel doesn't see them. Adding it means a
  one-line `Shopify.analytics.publish('register_submitted', …)` in
  `assets/ha-klaviyo-form.js` plus a matching subscription here. Small.
- **Homepage CTA clicks by section and destination** (brief §5). Needs a `data-` label on
  every CTA across the homepage sections plus a publish/subscribe pair. Real hours —
  confirm against the remaining budget first.

## 6. GA4 settings to change (needs a GA login — Ivan)

- Admin → Data collection and modification → **Data retention** → **14 months**. The
  default is 2 and it is not retroactive.
- Admin → **Key events** → mark `purchase`. (It is usually marked automatically — confirm.)
- Admin → Data streams → the web stream → **Enhanced measurement**: turn **off**
  *Page changes based on browser history events*. The pixel sends every page view itself.
