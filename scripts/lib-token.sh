#!/usr/bin/env bash
# Shared credential handling. Source this; it sets HA_TOKEN and HA_ENDPOINT.
#
# Reads SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET (client credentials grant,
# 24h token, minted per run so nothing long-lived sits on disk), or falls back
# to a static SHOPIFY_ADMIN_TOKEN if one is set.
: "${SHOPIFY_STORE:=9c8a52-dc.myshopify.com}"
HA_API_VERSION="${SHOPIFY_API_VERSION:-2025-07}"
HA_ENDPOINT="https://$SHOPIFY_STORE/admin/api/$HA_API_VERSION/graphql.json"

if [ -n "${SHOPIFY_ADMIN_TOKEN:-}" ]; then
  HA_TOKEN="$SHOPIFY_ADMIN_TOKEN"
else
  : "${SHOPIFY_CLIENT_ID:?set SHOPIFY_CLIENT_ID (or SHOPIFY_ADMIN_TOKEN)}"
  : "${SHOPIFY_CLIENT_SECRET:?set SHOPIFY_CLIENT_SECRET}"
  HA_TOKEN=$(curl -sS -X POST "https://$SHOPIFY_STORE/admin/oauth/access_token" \
    --data-urlencode "client_id=$SHOPIFY_CLIENT_ID" \
    --data-urlencode "client_secret=$SHOPIFY_CLIENT_SECRET" \
    --data-urlencode "grant_type=client_credentials" \
    | jq -r '.access_token // empty')
  [ -n "$HA_TOKEN" ] || { echo "✗ token exchange failed — run ./scripts/token-check.sh"; exit 1; }
fi

# ha_gql <query> [variables-json] -> the .data object
ha_gql() {
  local raw
  raw=$(jq -nc --arg q "$1" --argjson v "${2:-null}" '{query:$q, variables:$v}' \
        | curl -sS "$HA_ENDPOINT" -H "X-Shopify-Access-Token: $HA_TOKEN" \
               -H "Content-Type: application/json" --data @-)
  if echo "$raw" | jq -e '.errors' >/dev/null 2>&1; then
    echo "  ! $(echo "$raw" | jq -r '[.errors[].message]|join("; ")' | cut -c1-100)" >&2
  fi
  echo "$raw" | jq '.data // {}'
}
