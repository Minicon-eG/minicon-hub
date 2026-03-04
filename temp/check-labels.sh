#!/bin/bash
echo "=== dorfkiste-frontend labels ==="
docker inspect dorfkiste-frontend --format '{{range $k, $v := .Config.Labels}}{{println $k $v}}{{end}}'
echo ""
echo "=== dorfkiste-nginx labels ==="
docker inspect dorfkiste-nginx --format '{{range $k, $v := .Config.Labels}}{{println $k $v}}{{end}}'
echo ""
echo "=== dorfkiste-nginx networks ==="
docker inspect dorfkiste-nginx --format '{{range $k, $v := .NetworkSettings.Networks}}{{println $k $v}}{{end}}'
echo ""
echo "=== Test: curl HTTP dorfkiste.org ==="
curl -sI http://localhost -H "Host: dorfkiste.org" | head -10
echo ""
echo "=== Test: curl HTTPS dorfkiste.org ==="
curl -skI https://localhost -H "Host: dorfkiste.org" | head -10
