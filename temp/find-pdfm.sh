#!/bin/bash
echo "=== ALL containers ==="
docker ps --format '{{.Names}}\t{{.Image}}\t{{.Ports}}'

echo ""
echo "=== Traefik config files ==="
ls -la /etc/traefik/config/ 2>/dev/null || ls -la /opt/traefik/config/ 2>/dev/null

echo ""
echo "=== All Traefik file routes ==="
cat /opt/traefik/config/*.yml 2>/dev/null

echo ""
echo "=== Docker compose file ==="
cat /home/dorfkiste/dorfkiste/docker-compose.yml 2>/dev/null | grep -A5 "traefik\|labels\|8080\|3000\|frontend\|backend"

echo ""
echo "=== What responds on port 3000? ==="
curl -s http://localhost:3000 2>/dev/null | head -3

echo ""
echo "=== Traefik routers via API ==="
curl -s http://localhost:8080/api/http/routers 2>/dev/null | python3 -m json.tool 2>/dev/null | grep -E "rule|service|name" | head -30
