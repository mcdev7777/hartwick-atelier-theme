#!/usr/bin/env bash
# Hartwick Atelier — go-live readiness verification.
#
#   source ~/.hartwick-shopify.env && ./scripts/launch-check.sh
#
# Read-only. Answers the questions Aloha's Phase 1 list raises, and states
# plainly which ones the Admin API CANNOT answer so they can be chased in Admin.
set -euo pipefail

STORE="${SHOPIFY_STORE:?set SHOPIFY_STORE}"
TOKEN="${SHOPIFY_ADMIN_TOKEN:?set SHOPIFY_ADMIN_TOKEN}"
VER="${SHOPIFY_API_VERSION:-2025-07}"
EP="https://$STORE/admin/api/$VER/graphql.json"
SNAP="$(cd "$(dirname "$0")/.." && pwd)/store-snapshot"

gql() {
  jq -nc --arg q "$1" '{query:$q}' \
  | curl -sS "$EP" -H "X-Shopify-Access-Token: $TOKEN" \
         -H "Content-Type: application/json" --data @-
}
# ok <label> <graphql> <jq-filter>   — prints result or the reason it failed
ok() {
  local label=$1 r
  r=$(gql "$2")
  if echo "$r" | jq -e '.errors' >/dev/null 2>&1; then
    printf '  %-34s ⚠  %s\n' "$label" "$(echo "$r" | jq -r '[.errors[].message]|join("; ")' | cut -c1-90)"
  else
    printf '  %-34s %s\n' "$label" "$(echo "$r" | jq -r "$3" 2>/dev/null | tr '\n' ' ' | cut -c1-120)"
  fi
}

echo "=============================================="
echo " HARTWICK — LAUNCH READINESS   $(date '+%Y-%m-%d %H:%M')"
echo " Store: $STORE   API: $VER"
echo "=============================================="

echo
echo "── STOREFRONT IDENTITY ─────────────────────────"
ok "Shop name"        'query{shop{name}}'                          '.data.shop.name'
ok "Primary domain"   'query{shop{primaryDomain{url sslEnabled}}}' '.data.shop.primaryDomain|"\(.url)  ssl=\(.sslEnabled)"'
ok "Currency"         'query{shop{currencyCode}}'                  '.data.shop.currencyCode'
ok "Business country" 'query{shop{billingAddress{country}}}'       '.data.shop.billingAddress.country'
ok "Timezone"         'query{shop{ianaTimezone}}'                  '.data.shop.ianaTimezone'
ok "Plan"             'query{shop{plan{displayName}}}'             '.data.shop.plan.displayName'

echo
echo "── LEGAL / POLICY PAGES ────────────────────────"
ok "Privacy policy"   'query{shop{privacyPolicy{body}}}'      '.data.shop.privacyPolicy.body|if .==null or .=="" then "❌ EMPTY" else "✅ \(.|length) chars" end'
ok "Refund policy"    'query{shop{refundPolicy{body}}}'       '.data.shop.refundPolicy.body|if .==null or .=="" then "❌ EMPTY" else "✅ \(.|length) chars" end'
ok "Shipping policy"  'query{shop{shippingPolicy{body}}}'     '.data.shop.shippingPolicy.body|if .==null or .=="" then "❌ EMPTY" else "✅ \(.|length) chars" end'
ok "Terms of service" 'query{shop{termsOfService{body}}}'     '.data.shop.termsOfService.body|if .==null or .=="" then "❌ EMPTY" else "✅ \(.|length) chars" end'

echo
echo "── SHIPPING (read_shipping) ────────────────────"
gql 'query{deliveryProfiles(first:10){nodes{name default
  profileLocationGroups{locationGroupZones(first:25){nodes{
    zone{name countries{code{countryCode}}}
    methodDefinitions(first:15){nodes{name active}}}}}}}}' \
| jq -r 'if .errors then "  ⚠  \(.errors[0].message)"
   else (.data.deliveryProfiles.nodes[]? |
     "  Profile: \(.name)\(if .default then " (default)" else "" end)",
     (.profileLocationGroups[]?.locationGroupZones.nodes[]? |
       "    Zone: \(.zone.name)  [\(.zone.countries|map(.code.countryCode//"REST")|join(","))]",
       (.methodDefinitions.nodes[]? | "      rate: \(.name)  active=\(.active)")))
   end' 2>/dev/null || echo "  ⚠  could not read delivery profiles"
echo "  → A zone with NO active rate = checkout fails with 'no shipping rates available'."

echo
echo "── MARKETS / LOCALES ───────────────────────────"
ok "Markets"  'query{markets(first:20){nodes{name handle status}}}' '[.data.markets.nodes[]?|"\(.name)(\(.status))"]|join(", ")'
ok "Locales"  'query{shopLocales{locale primary published}}'        '[.data.shopLocales[]?|"\(.locale)\(if .primary then "*" else "" end)"]|join(", ")'

echo
echo "── THEMES ──────────────────────────────────────"
gql 'query{themes(first:25){nodes{name role updatedAt}}}' \
| jq -r 'if .errors then "  ⚠  \(.errors[0].message)"
   else (.data.themes.nodes[]?|select(.role=="MAIN" or .role=="UNPUBLISHED")|
     "  \(.role|ascii_downcase|(.+"            ")[0:12]) \(.name)") end' 2>/dev/null | head -12

echo
echo "── PRODUCT READINESS ───────────────────────────"
if [ -f "$SNAP/products.json" ]; then
  jq -r '
    length as $n |
    "  Total products            : \($n)",
    "  Active                    : \([.[]|select(.status=="ACTIVE")]|length)",
    "  Draft                     : \([.[]|select(.status=="DRAFT")]|length)",
    "  ❌ No image                : \([.[]|select(.featuredMedia==null)]|length)",
    "  ❌ No SKU on some variant  : \([.[]|select([.variants.nodes[]?|select(.sku==null or .sku=="")]|length>0)]|length)",
    "  ❌ Price 0.00              : \([.[]|select([.variants.nodes[]?|select((.price|tonumber)==0)]|length>0)]|length)",
    "  ⚠  No hartwick.* metafield : \([.[]|select([.metafields.nodes[]?|select(.namespace=="hartwick")]|length==0)]|length)"
  ' "$SNAP/products.json"
else
  echo "  (run ./scripts/store-audit.sh first — needs store-snapshot/products.json)"
fi

echo
echo "── CONTENT MODEL ───────────────────────────────"
if [ -f "$SNAP/metaobject-definitions.json" ]; then
  echo "  Metaobject types defined on store:"
  jq -r '.[]? | "    \(.type)  (\(.metaobjectsCount) instances, \(.fieldDefinitions|length) fields)"' \
    "$SNAP/metaobject-definitions.json" 2>/dev/null || echo "    (none)"
fi
echo "  Types the THEME expects:"
grep -rhoE "metaobjects\.[a-z_]+" --include="*.liquid" . 2>/dev/null | sed 's/metaobjects\./    /' | sort -u
echo "  hartwick.* keys the THEME reads:"
grep -rhoE "hartwick\.[a-zA-Z_0-9]+" --include="*.liquid" . 2>/dev/null \
  | sed 's/hartwick\.//' | sort -u | tr '\n' ' ' | fold -sw 76 | sed 's/^/    /'

cat <<'NOTE'

══════════════════════════════════════════════════
 CANNOT BE VERIFIED VIA ADMIN API — CHECK IN ADMIN
══════════════════════════════════════════════════
  1. Payment gateway live?      Settings → Payments
     (`paymentSettings` is Storefront API, not Admin. No Admin scope
      exposes gateway config or payout/bank status.)
  2. Payouts / bank connected?  Settings → Payments → manage
  3. Tax registration / VAT     Settings → Taxes and duties
  4. Cookie-consent banner on?  Settings → Customer privacy
  5. Checkout branding          Settings → Checkout → Customize
  6. Order/shipping emails      Settings → Notifications
  7. Storefront password on?    Online Store → Preferences
  8. DNS / domain connected     Settings → Domains
  9. Installed apps + pixels    Apps  (needs read_apps, not requested)

  Ask Angela for a screenshot of each. That closes the remaining third.
NOTE
