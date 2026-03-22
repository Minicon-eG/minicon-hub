#!/bin/bash
# Health Check Script for Hetzner Prod Server
# Alerts via Telegram on failures

TELEGRAM_TOKEN="8325155979:AAH4X-LNV8iKFMQTBXfIn7LKxJj6cQRPrVE"
TELEGRAM_CHAT="521366093"
ALERT_PREFIX="🚨 Hetzner Prod Alert"

alert() {
  curl -s "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
    -d chat_id="$TELEGRAM_CHAT" \
    -d text="${ALERT_PREFIX}: $1" \
    -d parse_mode="Markdown" > /dev/null 2>&1
}

ERRORS=""

# 1. MongoDB
if ! docker exec hub-mongo mongosh --quiet --eval "db.runCommand({ping:1})" > /dev/null 2>&1; then
  ERRORS="$ERRORS\n❌ MongoDB nicht erreichbar"
fi

# 2. Website-Service Health (via docker exec, da hinter Traefik)
API_CHECK=$(docker exec website-service wget -qO- http://localhost:4000/api/sites/tv-dahn/status 2>/dev/null)
if [ -z "$API_CHECK" ]; then
  ERRORS="$ERRORS\n❌ website-service API nicht erreichbar"
fi

# 3. SMTP
if ! docker exec website-service sh -c "echo QUIT | nc -w2 localhost 2525" > /dev/null 2>&1; then
  ERRORS="$ERRORS\n❌ SMTP-Server nicht erreichbar"
fi

# 4. Disk Space (alert if >85%)
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
if [ "$DISK_USAGE" -gt 85 ]; then
  ERRORS="$ERRORS\n⚠️ Disk-Usage: ${DISK_USAGE}% (>85%)"
fi

# 5. Critical containers running
for CONTAINER in website-service hub-mongo traefik kundenportal; do
  if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    ERRORS="$ERRORS\n❌ Container $CONTAINER ist down"
  fi
done

# 6. Backup freshness (warn if last backup >26h old)
LATEST_BACKUP=$(find /backup/mongodb -name "*.gz" -type f -mmin -1560 2>/dev/null | head -1)
if [ -z "$LATEST_BACKUP" ]; then
  ERRORS="$ERRORS\n⚠️ Kein MongoDB-Backup der letzten 26h gefunden"
fi

# Send alert if errors found
if [ -n "$ERRORS" ]; then
  alert "$(echo -e "$ERRORS")"
  echo "[health] ALERT sent: $ERRORS"
  exit 1
else
  echo "[health] All checks passed"
  exit 0
fi
