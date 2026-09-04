#!/usr/bin/env bash
# Hartwick Atelier — read-only Admin API snapshot of the store.
#
#   1. shopify store auth --store 9c8a52-dc.myshopify.com --scopes read_products,read_metaobject_definitions,read_metaobjects,read_content,read_files,read_themes,read_locales,read_markets
#   2. ./scripts/store-audit.sh
#
# Uses the Shopify CLI's own stored auth (your collaborator login). No API token
# is created, transmitted or written to disk by this script. `shopify store
# execute` refuses mutations unless --allow-mutations is passed; it never is here.
set -euo pipefail

STORE="${SHOPIFY_STORE:-9c8a52-dc.myshopify.com}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/store-snapshot"
mkdir -p "$OUT"

command -v shopify >/dev/null || { echo "Shopify CLI not found."; exit 1; }
command -v jq >/dev/null || { echo "jq not found (brew install jq)."; exit 1; }

# gql <query> [variables-json] -> prints the .data object
gql() {
  local raw
  if ! raw=$(shopify store execute -s "$STORE" -q "$1" -v "${2:-\{\}}" -j --no-color 2>&1); then
    echo "  ! CLI error: $(echo "$raw" | tail -3)" >&2
    echo '{}'; return 0
  fi
  # CLI may or may not wrap the payload in .data — normalise both shapes.
  echo "$raw" | jq 'if has("data") then .data else . end' 2>/dev/null || echo '{}'
}

# paginate <name> <query> <connection-field>
paginate() {
  local name=$1 query=$2 field=$3 cursor=null page=1 all='[]' data
  while :; do
    data=$(gql "$query" "$(jq -nc --argjson c "$cursor" '{cursor:$c}')")
    all=$(jq -nc --argjson a "$all" --argjson c "$(echo "$data" | jq "[.${field}.nodes[]?]")" '$a + $c')
    printf '  %s: page %d (%d so far)\n' "$name" "$page" "$(echo "$all" | jq 'length')"
    [ "$(echo "$data" | jq -r ".${field}.pageInfo.hasNextPage // false")" = "true" ] || break
    cursor=$(echo "$data" | jq ".${field}.pageInfo.endCursor"); page=$((page+1))
  done
  echo "$all" > "$OUT/$name.json"
}

echo "Store: $STORE"
echo "== shop =="
gql 'query { shop { name myshopifyDomain primaryDomain { url } currencyCode
  ianaTimezone weightUnit plan { displayName } } }' | jq '.shop' > "$OUT/shop.json"

echo "== metafield definitions =="
echo '[]' > "$OUT/metafield-definitions.json"
for OWNER in PRODUCT PRODUCTVARIANT COLLECTION PAGE ARTICLE BLOG SHOP; do
  printf '  %-15s' "$OWNER"
  D=$(gql 'query($t: MetafieldOwnerType!) { metafieldDefinitions(first: 250, ownerType: $t) {
        nodes { namespace key name description ownerType type { name }
                validations { name value } metafieldsCount } } }' \
      "$(jq -nc --arg t "$OWNER" '{t:$t}')")
  N=$(echo "$D" | jq '[.metafieldDefinitions.nodes[]?] | length')
  printf '%s\n' "$N"
  jq -nc --argjson a "$(cat "$OUT/metafield-definitions.json")" \
         --argjson b "$(echo "$D" | jq '[.metafieldDefinitions.nodes[]?]')" '$a + $b' \
    > "$OUT/.tmp" && mv "$OUT/.tmp" "$OUT/metafield-definitions.json"
done

echo "== metaobject definitions =="
gql 'query { metaobjectDefinitions(first: 250) { nodes { id type name metaobjectsCount
  fieldDefinitions { key name required type { name } validations { name value } } } } }' \
  | jq '[.metaobjectDefinitions.nodes[]?]' > "$OUT/metaobject-definitions.json"

echo "== products =="
paginate products 'query($cursor: String) { products(first: 100, after: $cursor) {
  pageInfo { hasNextPage endCursor }
  nodes { id handle title status productType vendor tags templateSuffix
    createdAt updatedAt publishedAt totalInventory hasOnlyDefaultVariant
    featuredMedia { ... on MediaImage { id } }
    options { name optionValues { name } }
    variants(first: 100) { nodes { id title sku price inventoryQuantity
      selectedOptions { name value } } }
    metafields(first: 50) { nodes { namespace key type value } } } } }' products

echo "== collections =="
paginate collections 'query($cursor: String) { collections(first: 100, after: $cursor) {
  pageInfo { hasNextPage endCursor }
  nodes { id handle title templateSuffix sortOrder productsCount { count }
    metafields(first: 50) { nodes { namespace key type value } } } } }' collections

echo "== metaobject instances =="
echo '{}' > "$OUT/metaobjects.json"
for T in $(jq -r '.[].type' "$OUT/metaobject-definitions.json" 2>/dev/null); do
  printf '  %-25s' "$T"
  D=$(gql 'query($t: String!) { metaobjects(type: $t, first: 100) {
        nodes { id handle displayName fields { key type value } } } }' \
      "$(jq -nc --arg t "$T" '{t:$t}')")
  printf '%s\n' "$(echo "$D" | jq '[.metaobjects.nodes[]?] | length')"
  jq -nc --argjson a "$(cat "$OUT/metaobjects.json")" --arg t "$T" \
         --argjson n "$(echo "$D" | jq '[.metaobjects.nodes[]?]')" '$a + {($t): $n}' \
    > "$OUT/.tmp" && mv "$OUT/.tmp" "$OUT/metaobjects.json"
done

echo "== pages, blogs, themes, locales =="
paginate pages 'query($cursor: String) { pages(first: 100, after: $cursor) {
  pageInfo { hasNextPage endCursor }
  nodes { id handle title templateSuffix isPublished updatedAt
    metafields(first: 50) { nodes { namespace key type value } } } } }' pages
gql 'query { blogs(first: 50) { nodes { id handle title } } }' | jq '[.blogs.nodes[]?]' > "$OUT/blogs.json"
gql 'query { themes(first: 50) { nodes { id name role updatedAt } } }' | jq '[.themes.nodes[]?]' > "$OUT/themes.json"
gql 'query { shopLocales { locale primary published } }' | jq '.shopLocales' > "$OUT/locales.json"
gql 'query { markets(first: 50) { nodes { id name handle status } } }' | jq '[.markets.nodes[]?]' > "$OUT/markets.json"

rm -f "$OUT/.tmp"

echo
echo "================= SUMMARY ================="
printf 'Store           : %s (%s)\n' "$(jq -r '.name // "?"' "$OUT/shop.json")" "$(jq -r '.plan.displayName // "?"' "$OUT/shop.json")"
printf 'Products        : %s  (active %s / draft %s / with image %s)\n' \
  "$(jq 'length' "$OUT/products.json")" \
  "$(jq '[.[]|select(.status=="ACTIVE")]|length' "$OUT/products.json")" \
  "$(jq '[.[]|select(.status=="DRAFT")]|length' "$OUT/products.json")" \
  "$(jq '[.[]|select(.featuredMedia!=null)]|length' "$OUT/products.json")"
printf 'Collections     : %s\nPages           : %s\n' "$(jq 'length' "$OUT/collections.json")" "$(jq 'length' "$OUT/pages.json")"
printf 'Metafield defs  : %s\nMetaobject defs : %s\n' "$(jq 'length' "$OUT/metafield-definitions.json")" "$(jq 'length' "$OUT/metaobject-definitions.json")"
echo
echo "-- metafield definitions that EXIST on the store --"
jq -r 'sort_by(.ownerType,.namespace,.key)[] | "  \(.ownerType|ascii_downcase|.[0:12]|.+"            "|.[0:12])  \(.namespace).\(.key)  [\(.type.name)]  used by \(.metafieldsCount)"' \
  "$OUT/metafield-definitions.json" 2>/dev/null || echo "  (none returned)"
echo
echo "-- keys the THEME references in Liquid --"
grep -rhoE "metafields\.[a-z_]+\.[a-zA-Z_0-9]+" --include="*.liquid" --include="*.json" "$(dirname "$OUT")" 2>/dev/null \
  | sed 's/metafields\.//' | sort -u | sed 's/^/  /'
echo
echo "Written to store-snapshot/ (gitignored)."
