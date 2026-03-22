#!/bin/bash
# Server Resource Monitor - Push to Uptime Kuma + Telegram Alerts
# Runs every 5 minutes via cron

KUMA_PUSH_URL="http://localhost:3002/api/push/hetzner-srv-mmq9gwg2"
TELEGRAM_TOKEN="8325155979:AAH4X-LNV8iKFMQTBXfIn7LKxJj6cQRPrVE"
TELEGRAM_CHAT="521366093"

# Collect metrics
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print int($2+$4)}')
MEM_TOTAL=$(free -m | awk '/Mem:/{print $2}')
MEM_USED=$(free -m | awk '/Mem:/{print $3}')
MEM_PCT=$((MEM_USED * 100 / MEM_TOTAL))
DISK_PCT=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
LOAD=$(cat /proc/loadavg | awk '{print $1}')
CONTAINER_COUNT=$(docker ps -q | wc -l)
CONTAINER_DOWN=$(docker ps -a --filter "status=exited" --format '{{.Names}}' | tr '\n' ', ')

# Build message
MSG="CPU:${CPU_USAGE}% RAM:${MEM_USED}/${MEM_TOTAL}MB(${MEM_PCT}%) Disk:${DISK_PCT}% Load:${LOAD} Containers:${CONTAINER_COUNT}"

# Alert thresholds
ALERT=""
[ "$CPU_USAGE" -gt 90 ] && ALERT="${ALERT}\n⚠️ CPU: ${CPU_USAGE}%"
[ "$MEM_PCT" -gt 90 ] && ALERT="${ALERT}\n⚠️ RAM: ${MEM_PCT}%"
[ "$DISK_PCT" -gt 85 ] && ALERT="${ALERT}\n⚠️ Disk: ${DISK_PCT}%"
[ -n "$CONTAINER_DOWN" ] && ALERT="${ALERT}\n❌ Container down: ${CONTAINER_DOWN}"

# Push to Kuma
if [ -n "$KUMA_PUSH_URL" ] && [ "$KUMA_PUSH_URL" != "PLACEHOLDER" ]; then
  if [ -n "$ALERT" ]; then
    curl -s "${KUMA_PUSH_URL}?status=down&msg=$(echo -n "$MSG" | jq -sRr @uri)" > /dev/null 2>&1
  else
    curl -s "${KUMA_PUSH_URL}?status=up&msg=$(echo -n "$MSG" | jq -sRr @uri)" > /dev/null 2>&1
  fi
fi

# Telegram alert if thresholds exceeded
if [ -n "$ALERT" ]; then
  TEXT="🚨 Hetzner Server Alert:$(echo -e "$ALERT")\n\n📊 $MSG"
  curl -s "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
    -d chat_id="$TELEGRAM_CHAT" \
    -d text="$(echo -e "$TEXT")" > /dev/null 2>&1
fi

echo "[monitor] $(date +%H:%M) $MSG"
