#!/usr/bin/env bash
# Hartwick Atelier — read-only Admin API snapshot of 9c8a52-dc.
#
#   source ~/.hartwick-shopify.env && ./scripts/store-audit.sh
#
# Writes JSON into store-snapshot/ (gitignored). Read-only: no mutations anywhere.
set -euo pipefail

: "${SHOPIFY_STORE:?set SHOPIFY_STORE (see ~/.hartwick-shopify.env)}"
: "${SHOPIFY_ADMIN_TOKEN:?set SHOPIFY_ADMIN_TOKEN (see ~/.hartwick-shopify.env)}"

OUT="$(cd "$(dirname "$0")/.." && pwd)/store-snapshot"
mkdir -p "$OUT"

# --- pick the newest API version the store actually supports -----------------
API_VERSION="${SHOPIFY_API_VERSION:-}"
if [ -z "$API_VERSION" ]; then
  API_VERSION=$(curl -sf "https://$SHOPIFY_STORE/admin/api/api_versions.json" \
    -H "X-Shopify-Access-Token: $SHOPIFY_ADMIN_TOKEN" \
    | jq -r '[.api_versions[] | select(.handle | test("^[0-9]{4}-[0-9]{2}$")) | .handle] | sort | last') || true
fi
if [ -z "$API_VERSION" ] || [ "$API_VERSION" = "null" ]; then API_VERSION="2025-07"; fi
echo "API version: $API_VERSION"

ENDPOINT="https://$SHOPIFY_STORE/admin/api/$API_VERSION/graphql.json"

gql() { # gql <query> [variables-json]
  local resp
  resp=$(jq -nc --arg q "$1" --argjson v "${2:-null}" '{query:$q, variables:$v}' \
    | curl -sS "$ENDPOINT" \
        -H "X-Shopify-Access-Token: $SHOPIFY_ADMIN_TOKEN" \
        -H "Content-Type: application/json" --data @-)
  if echo "$resp" | jq -e '.errors' >/dev/null 2>&1; then
    echo "  ! GraphQL error: $(echo "$resp" | jq -c '.errors')" >&2
  fi
  echo "$resp"
}

# --- paginate a connection ---------------------------------------------------
paginate() { # paginate <name> <query-with-$cursor> <path-to-connection>
  local name=$1 query=$2 path=$3 cursor=null page=1 all='[]' resp chunk
  while :; do
    resp=$(gql "$query" "$(jq -nc --argjson c "$cursor" '{cursor:$c}')")
    chunk=$(echo "$resp" | jq "[.data.$path.nodes[]?]")
    all=$(jq -nc --argjson a "$all" --argjson c "$chunk" '$a + $c')
    printf '  %s: page %d (%d total)\n' "$name" "$page" "$(echo "$all" | jq 'length')"
    if [ "$(echo "$resp" | jq -r ".data.$path.pageInfo.hasNextPage // false")" = "true" ]; then
      cursor=$(echo "$resp" | jq ".data.$path.pageInfo.endCursor")
      page=$((page + 1))
    else break; fi
  done
  echo "$all" > "$OUT/$name.json"
}

echo "== shop =="
gql 'query { shop {
  name myshopifyDomain primaryDomain { url } email
  currencyCode enabledPresentmentCurrencies ianaTimezone weightUnit
  billingAddress { country }
  plan { displayName partnerDevelopment shopifyPlus }
  resourceLimits { maxProductVariants }
} }' | jq '.data.shop' > "$OUT/shop.json"

echo "== metafield definitions =="
echo '[]' > "$OUT/metafield-definitions.json"
for OWNER in PRODUCT PRODUCTVARIANT COLLECTION PAGE ARTICLE BLOG SHOP; do
  printf '  %s' "$OWNER"
  RESP=$(gql 'query($t: MetafieldOwnerType!) { metafieldDefinitions(first: 250, ownerType: $t) { nodes {
      key namespace name description type { name } ownerType
      validations { name value }
      metafieldsCount
  } } }' "$(jq -nc --arg t "$OWNER" '{t:$t}')")
  COUNT=$(echo "$RESP" | jq '[.data.metafieldDefinitions.nodes[]?] | length')
  printf ' -> %s\n' "$COUNT"
  jq -nc --argjson a "$(cat "$OUT/metafield-definitions.json")" \
         --argjson b "$(echo "$RESP" | jq '[.data.metafieldDefinitions.nodes[]?]')" \
         '$a + $b' > "$OUT/.mfd.tmp" && mv "$OUT/.mfd.tmp" "$OUT/metafield-definitions.json"
done

echo "== metaobject definitions =="
gql 'query { metaobjectDefinitions(first: 250) { nodes {
  id type name metaobjectsCount
  fieldDefinitions { key name required type { name } validations { name value } }
} } }' | jq '[.data.metaobjectDefinitions.nodes[]?]' > "$OUT/metaobject-definitions.json"

echo "== products =="
paginate products 'query($cursor: String) { products(first: 100, after: $cursor) { pageInfo { hasNextPage endCursor } nodes {
  id handle title status productType vendor tags createdAt updatedAt publishedAt
  templateSuffix descriptionHtml
  totalInventory hasOnlyDefaultVariant
  featuredMedia { ... on MediaImage { id } }
  media(first: 1) { pageInfo { hasNextPage } }
  options { name optionValues { name } }
  variants(first: 100) { nodes { id title sku price inventoryQuantity selectedOptions { name value } } }
  metafields(first: 50) { nodes { namespace key type value } }
} } }' products

echo "== collections =="
paginate collections 'query($cursor: String) { collections(first: 100, after: $cursor) { pageInfo { hasNextPage endCursor } nodes {
  id handle title templateSuffix productsCount { count } sortOrder
  metafields(first: 50) { nodes { namespace key type value } }
} } }' collections

echo "== metaobjects (instances, per definition) =="
echo '{}' > "$OUT/metaobjects.json"
for TYPE in $(jq -r '.[].type' "$OUT/metaobject-definitions.json" 2>/dev/null); do
  printf '  %s' "$TYPE"
  RESP=$(gql 'query($t: String!) { metaobjects(type: $t, first: 100) { nodes {
      id handle displayName fields { key type value }
  } } }' "$(jq -nc --arg t "$TYPE" '{t:$t}')")
  printf ' -> %s\n' "$(echo "$RESP" | jq '[.data.metaobjects.nodes[]?] | length')"
  jq -nc --argjson acc "$(cat "$OUT/metaobjects.json")" --arg t "$TYPE" \
         --argjson n "$(echo "$RESP" | jq '[.data.metaobjects.nodes[]?]')" \
         '$acc + {($t): $n}' > "$OUT/.mo.tmp" && mv "$OUT/.mo.tmp" "$OUT/metaobjects.json"
done

echo "== pages + blogs =="
paginate pages 'query($cursor: String) { pages(first: 100, after: $cursor) { pageInfo { hasNextPage endCursor } nodes {
  id handle title templateSuffix isPublished updatedAt
  metafields(first: 50) { nodes { namespace key type value } }
} } }' pages

gql 'query { blogs(first: 50) { nodes { id handle title articlesCount { count } } } }' \
  | jq '[.data.blogs.nodes[]?]' > "$OUT/blogs.json"

echo "== themes =="
gql 'query { themes(first: 50) { nodes { id name role processing themeStoreId createdAt updatedAt } } }' \
  | jq '[.data.themes.nodes[]?]' > "$OUT/themes.json"

echo "== markets / locales =="
gql 'query { shopLocales { locale primary published } }' | jq '.data.shopLocales' > "$OUT/locales.json"
gql 'query { markets(first: 50) { nodes { id name handle status } } }' \
  | jq '[.data.markets.nodes[]?]' > "$OUT/markets.json" 2>/dev/null || echo '[]' > "$OUT/markets.json"

echo
echo "=========== SUMMARY ==========="
printf 'Store            : %s (%s)\n' "$(jq -r '.name // "?"' "$OUT/shop.json")" "$(jq -r '.plan.displayName // "?"' "$OUT/shop.json")"
printf 'Currency         : %s\n' "$(jq -r '.currencyCode // "?"' "$OUT/shop.json")"
printf 'Products         : %s (active: %s, draft: %s)\n' \
  "$(jq 'length' "$OUT/products.json")" \
  "$(jq '[.[]|select(.status=="ACTIVE")]|length' "$OUT/products.json")" \
  "$(jq '[.[]|select(.status=="DRAFT")]|length' "$OUT/products.json")"
printf 'Products w/ media: %s\n' "$(jq '[.[]|select(.featuredMedia!=null)]|length' "$OUT/products.json")"
printf 'Collections      : %s\n' "$(jq 'length' "$OUT/collections.json")"
printf 'Pages            : %s\n' "$(jq 'length' "$OUT/pages.json")"
printf 'Metafield defs   : %s\n' "$(jq 'length' "$OUT/metafield-definitions.json")"
printf 'Metaobject defs  : %s\n' "$(jq 'length' "$OUT/metaobject-definitions.json")"
echo
echo "-- metafield definitions that EXIST --"
jq -r 'sort_by(.ownerType,.namespace,.key)[] | "  \(.ownerType|ascii_downcase)  \(.namespace).\(.key)  [\(.type.name)]  used by \(.metafieldsCount)"' \
  "$OUT/metafield-definitions.json"
echo
echo "-- keys the THEME references (from Liquid) --"
grep -rhoE "metafields\.[a-z_]+\.[a-zA-Z_0-9]+" --include="*.liquid" --include="*.json" \
  "$(dirname "$OUT")" 2>/dev/null | sed 's/metafields\.//' | sort -u | sed 's/^/  /'
echo
echo "Snapshot written to store-snapshot/ (gitignored)."
