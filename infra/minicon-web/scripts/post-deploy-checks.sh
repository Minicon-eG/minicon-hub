#!/bin/bash
# Post-Deployment Checks für minicon-web
# Wird nach jedem Deployment ausgeführt
# Usage: ssh root@server "bash /opt/scripts/post-deploy-checks.sh <site-name> <domain>"

SITE="$1"
DOMAIN="$2"
ERRORS=0

if [ -z "$SITE" ] || [ -z "$DOMAIN" ]; then
  echo "Usage: $0 <site-name> <domain>"
  echo "Example: $0 schdubb schdubb.minicon.eu"
  exit 1
fi

echo "=== Post-Deploy Checks: $SITE ($DOMAIN) ==="
echo ""

# 1. Permissions fix
echo "[1/6] Fixing permissions..."
if [ -d "/opt/sites/$SITE" ]; then
  chmod -R 755 /opt/sites/$SITE/
  echo "  ✅ /opt/sites/$SITE/ → 755"
else
  echo "  ⚠️  /opt/sites/$SITE/ nicht gefunden"
fi

# 2. Container running?
echo "[2/6] Container Status..."
CONTAINER=$(docker ps --filter "name=$SITE" --format "{{.Names}} {{.Status}}" 2>/dev/null | head -1)
if [ -n "$CONTAINER" ]; then
  echo "  ✅ $CONTAINER"
else
  echo "  ❌ Kein Container mit Name '$SITE' läuft!"
  ERRORS=$((ERRORS+1))
fi

# 3. HTTP Status Check
echo "[3/6] HTTP Check https://$DOMAIN ..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$DOMAIN" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ HTTP $HTTP_CODE"
else
  echo "  ❌ HTTP $HTTP_CODE (erwartet 200)"
  ERRORS=$((ERRORS+1))
fi

# 4. Static Assets erreichbar? (JS/CSS)
echo "[4/6] Static Assets Check..."
ASSET_PATH=$(find /opt/sites/$SITE/_next/static -name "*.js" 2>/dev/null | head -1)
if [ -n "$ASSET_PATH" ]; then
  PERMS=$(stat -c "%a" "$ASSET_PATH" 2>/dev/null)
  if [ "$PERMS" = "755" ] || [ "$PERMS" = "644" ]; then
    echo "  ✅ Assets lesbar (perms: $PERMS)"
  else
    echo "  ❌ Assets nicht lesbar (perms: $PERMS) → fixing..."
    chmod -R 755 /opt/sites/$SITE/_next/
    ERRORS=$((ERRORS+1))
  fi
else
  # Might be a Docker-served app without static files
  echo "  ⏭️  Keine static files (Docker-App?)"
fi

# 5. Disk Space
echo "[5/6] Disk Space..."
DISK_USAGE=$(df / --output=pcent | tail -1 | tr -d ' %')
if [ "$DISK_USAGE" -lt 85 ]; then
  echo "  ✅ ${DISK_USAGE}% belegt"
else
  echo "  ⚠️  ${DISK_USAGE}% belegt - aufräumen!"
  ERRORS=$((ERRORS+1))
fi

# 6. Nginx/Container Error Log (letzte 5 min)
echo "[6/6] Recent Errors (5 min)..."
RECENT_ERRORS=$(docker logs "$( docker ps --filter "name=$SITE" --format "{{.Names}}" | head -1)" --since 5m 2>&1 | grep -c "error" 2>/dev/null)
if [ "$RECENT_ERRORS" -gt 0 ]; then
  echo "  ⚠️  $RECENT_ERRORS Fehler in den letzten 5 Minuten"
else
  echo "  ✅ Keine Fehler"
fi

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "=== ❌ $ERRORS Problem(e) gefunden! ==="
  exit 1
else
  echo "=== ✅ Alle Checks bestanden ==="
  exit 0
fi
