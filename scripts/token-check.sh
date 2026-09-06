#!/usr/bin/env bash
# Hartwick — what can this credential actually reach?
#
#   export SHOPIFY_STORE=9c8a52-dc.myshopify.com
#   export SHOPIFY_CLIENT_ID=...        # 32 hex chars
#   export SHOPIFY_CLIENT_SECRET=...    # shpss_...
#   ./scripts/token-check.sh
#
# Exchanges client credentials for a short-lived token, reports the scopes the
# app was actually granted, then probes each resource READ-ONLY. Writes nothing,
# stores nothing. The token lives in this process and dies with it.
set -euo pipefail

: "${SHOPIFY_STORE:?set SHOPIFY_STORE}"
: "${SHOPIFY_CLIENT_ID:?set SHOPIFY_CLIENT_ID}"
: "${SHOPIFY_CLIENT_SECRET:?set SHOPIFY_CLIENT_SECRET}"
VER="${SHOPIFY_API_VERSION:-2025-07}"

# --- sanity-check the client id before we bother the API --------------------
if ! printf '%s' "$SHOPIFY_CLIENT_ID" | grep -qE '^[0-9a-f]{32}$'; then
  echo "✗ SHOPIFY_CLIENT_ID is not 32 lowercase hex characters."
  echo "  Got ${#SHOPIFY_CLIENT_ID} chars. A stray '€' or capital letter means it"
  echo "  was mangled in transit — ask for it again inside a code block."
  exit 1
fi

echo "── exchanging client credentials for a token ──"
# Form-encoded, not JSON: the JSON variant returns an HTML error page on failure,
# which is unparseable and hides the actual reason.
RESP=$(curl -sS -X POST "https://$SHOPIFY_STORE/admin/oauth/access_token" \
  --data-urlencode "client_id=$SHOPIFY_CLIENT_ID" \
  --data-urlencode "client_secret=$SHOPIFY_CLIENT_SECRET" \
  --data-urlencode "grant_type=client_credentials")

TOKEN=$(echo "$RESP" | jq -r '.access_token // empty' 2>/dev/null || true)
if [ -z "$TOKEN" ]; then
  # Failures come back as HTML. The useful line is the <title>.
  ERR=$(printf '%s' "$RESP" | tr -d '\n' | grep -oE '<title>[^<]*</title>' \
        | sed -e 's/<[^>]*>//g' -e 's/^[0-9]* - //' | head -1)
  [ -n "$ERR" ] || ERR=$(printf '%s' "$RESP" | jq -r '.error_description // .error // "unknown"' 2>/dev/null || echo unknown)
  echo "✗ No token. Shopify says: $ERR"
  echo
  case "$ERR" in
    *app_not_installed*)
      cat <<'HINT'
  The credentials are RECOGNISED — this is not a typo. The app exists but has
  no installation on this store, so it cannot be issued a token for it.

  Fix (Angela, in the Dev Dashboard):
    1. Open the app.
    2. Fix any scope validation errors FIRST — an app whose configuration will
       not save cannot be installed, and that is the likely root cause here.
    3. Release / Install the app to 9c8a52-dc.myshopify.com.
    4. Confirm the store is in the same organization as the app.

  Nothing needs regenerating. The same client id and secret will work once the
  install exists.
HINT
      ;;
    *invalid_client*|*unauthorized_client*)
      echo "  Client id or secret is wrong, or the secret has been rotated since it was sent." ;;
    *)
      echo "  Raw response follows:"; printf '%s' "$RESP" | head -c 400; echo ;;
  esac
  exit 1
fi
echo "✓ token acquired (expires in $(echo "$RESP" | jq -r '.expires_in // "?"')s)"

EP="https://$SHOPIFY_STORE/admin/api/$VER/graphql.json"
gql() { jq -nc --arg q "$1" '{query:$q}' \
        | curl -sS "$EP" -H "X-Shopify-Access-Token: $TOKEN" \
               -H "Content-Type: application/json" --data @-; }

echo
echo "── scopes actually granted to this app ──"
gql 'query{currentAppInstallation{accessScopes{handle}}}' \
| jq -r 'if .errors then "  ⚠ \(.errors[0].message)"
   else (.data.currentAppInstallation.accessScopes[]?.handle|"  ✓ \(.)") end' | sort

echo
echo "── can it actually read each thing? ──"
probe() { # probe <label> <query> <jq-path>
  local r; r=$(gql "$2")
  if echo "$r" | jq -e '.errors' >/dev/null 2>&1; then
    printf '  %-28s ✗  %s\n' "$1" "$(echo "$r" | jq -r '.errors[0].message' | cut -c1-72)"
  else
    printf '  %-28s ✓  %s\n' "$1" "$(echo "$r" | jq -r "$3" 2>/dev/null)"
  fi
}
probe "Products"            'query{products(first:1){nodes{id}}}'                        '"reachable"'
probe "Product metafields"  'query{products(first:1){nodes{metafields(first:1){nodes{key}}}}}' '"reachable"'
probe "Metafield defs"      'query{metafieldDefinitions(first:1,ownerType:PRODUCT){nodes{key}}}' '"reachable"'
probe "Metaobject DEFS"     'query{metaobjectDefinitions(first:1){nodes{type}}}'         '"reachable"'
probe "Metaobject ENTRIES"  'query{metaobjectDefinitions(first:1){nodes{metaobjectsCount}}}' '"reachable"'
probe "Collections"         'query{collections(first:1){nodes{id}}}'                     '"reachable"'
probe "Pages / content"     'query{pages(first:1){nodes{id}}}'                           '"reachable"'
probe "Files"               'query{files(first:1){nodes{id}}}'                           '"reachable"'
probe "Themes"              'query{themes(first:1){nodes{name}}}'                        '"reachable"'
probe "Locales"             'query{shopLocales{locale}}'                                 '"reachable"'
probe "Markets"             'query{markets(first:1){nodes{name}}}'                       '"reachable"'
probe "Shipping profiles"   'query{deliveryProfiles(first:1){nodes{name}}}'              '"reachable"'
probe "Shop policies"       'query{shop{privacyPolicy{id}}}'                             '"reachable"'

echo
echo "✗ above = that scope is missing. Fix it in the Dev Dashboard, re-save, re-run."
