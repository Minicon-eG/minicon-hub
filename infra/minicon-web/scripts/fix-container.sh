#!/bin/bash
SITE=$1
DOMAIN=$2

# Preview symlinks
if [[ "$SITE" == preview-* ]]; then
  SITE_NAME="${SITE#preview-}"
  SYMLINK="/opt/sites/${SITE_NAME}-preview"
  TARGET="/opt/sites/${SITE}"
  if [ ! -L "$SYMLINK" ] || [ "$(readlink -f "$SYMLINK")" != "$(readlink -f "$TARGET")" ]; then
    rm -rf "$SYMLINK"
    ln -s "$TARGET" "$SYMLINK"
    echo "Symlink erstellt: ${SITE_NAME}-preview -> ${SITE}"
  else
    echo "Symlink OK: ${SITE_NAME}-preview -> ${SITE}"
  fi
fi

# Check if ANY running container already mounts this site's directory
SITE_PATH="/opt/sites/${SITE}"
EXISTING=$(docker ps --format '{{.Names}}' | while read NAME; do
  MOUNT=$(docker inspect "$NAME" --format '{{range .Mounts}}{{.Source}} {{end}}' 2>/dev/null)
  if echo "$MOUNT" | grep -q "$SITE_PATH"; then
    echo "$NAME"
    break
  fi
done)

if [ -n "$EXISTING" ]; then
  echo "✅ Existing container '$EXISTING' already serves $SITE_PATH — restarting"
  docker restart "$EXISTING"
  exit 0
fi

# No existing container — check the standard name
CONTAINER="static-sites-${SITE}-1"
MOUNT=$(docker inspect "$CONTAINER" --format '{{range .Mounts}}{{.Source}}{{end}}' 2>/dev/null)
if [ -n "$MOUNT" ]; then
  echo "✅ Container $CONTAINER exists — restarting"
  docker restart "$CONTAINER"
else
  echo "📦 Creating new container $CONTAINER for $SITE"
  docker stop "$CONTAINER" 2>/dev/null
  docker rm "$CONTAINER" 2>/dev/null
  docker run -d --name "$CONTAINER" --network web --restart unless-stopped \
    -v /opt/sites/${SITE}:/usr/share/nginx/html:ro \
    -l "traefik.enable=true" \
    -l "traefik.http.routers.${SITE}.rule=Host(\`${DOMAIN}\`)" \
    -l "traefik.http.routers.${SITE}.entrypoints=websecure" \
    -l "traefik.http.routers.${SITE}.tls.certresolver=cloudflare" \
    -l "traefik.http.services.${SITE}.loadbalancer.server.port=80" \
    nginx:alpine
fi
