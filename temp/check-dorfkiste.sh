#!/bin/bash
echo "=== Container IPs ==="
for c in dorfkiste-nginx dorfkiste-frontend dorfkiste-backend traefik; do
  IP=$(docker inspect $c --format '{{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' 2>/dev/null)
  echo "$c: $IP"
done

echo ""
echo "=== Was serviert 172.18.0.3:80? ==="
curl -s http://172.18.0.3:80 | head -5

echo ""
echo "=== Traefik default cert/catchall? ==="
curl -sk https://localhost -H "Host: dorfkiste.org" | head -20

echo ""
echo "=== Frontend auf Port 3000 ==="
curl -s http://dorfkiste-frontend:3000 | head -5
