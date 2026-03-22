#!/bin/bash
# Minicon Site Health Monitor
# Checks all sites for correct routing (marker or title) and HTTP status
# Usage: bash /opt/scripts/check-sites.sh [--alert]

ALERT_MODE="${1:-}"
ERRORS=0
WARNINGS=0

check_site() {
  local NAME="$1"
  local URL="$2"
  local MARKER="minicon:${NAME}"

  HTTP_CODE=$(curl -s -o /tmp/site-check.html -w "%{http_code}" --max-time 10 "$URL" 2>/dev/null)

  if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ $NAME ($URL) — HTTP $HTTP_CODE"
    ERRORS=$((ERRORS + 1))
    return
  fi

  if grep -q "Welcome to nginx" /tmp/site-check.html; then
    echo "❌ $NAME ($URL) — ROUTING ERROR: nginx default page"
    ERRORS=$((ERRORS + 1))
    return
  fi

  if grep -q "$MARKER" /tmp/site-check.html; then
    echo "✅ $NAME ($URL) — OK (marker verified)"
  else
    echo "⚠️  $NAME ($URL) — OK (no marker yet)"
    WARNINGS=$((WARNINGS + 1))
  fi
}

echo "=== Minicon Site Health Check === $(date -Iseconds)"
echo ""

# Skip list: old dirs, internal, non-routed
SKIP="minicon-eu|minicon|minicon-preview|hub|dokukiste|dorfkiste|dorfkiste-staging|previews|krankenhaus_new"
# Old naming convention (site-preview instead of preview-site)
SKIP="$SKIP|dachdecker-schwarz-preview|dahner-huette-preview|df-antiaging-preview|tv-dahn-preview"

# Production sites
echo "--- Production ---"
for DIR in /opt/sites/*/; do
  SITE=$(basename "$DIR")
  [[ "$SITE" == preview-* ]] && continue
  echo "$SITE" | grep -qE "^($SKIP)$" && continue
  check_site "$SITE" "https://${SITE}.minicon.eu"
done

echo ""
echo "--- Preview ---"
for DIR in /opt/sites/preview-*/; do
  SITE=$(basename "$DIR")
  check_site "$SITE" "https://${SITE}.minicon.eu"
done

echo ""
echo "=== Summary: $ERRORS errors, $WARNINGS warnings ==="

if [ "$ALERT_MODE" = "--alert" ] && [ "$ERRORS" -gt 0 ]; then
  # Send Telegram alert
  BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
  CHAT_ID="${TELEGRAM_CHAT_ID:-521366093}"
  if [ -n "$BOT_TOKEN" ]; then
    MSG="🚨 Site Monitor: $ERRORS Fehler gefunden!%0A$(date -Iseconds)"
    curl -s "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${MSG}" > /dev/null
  fi
fi

exit $ERRORS
