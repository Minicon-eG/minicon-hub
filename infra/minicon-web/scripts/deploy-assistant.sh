#!/bin/bash
set -e

REPO_DIR="/opt/build/minicon-assistant-service"

# Clone if doesn't exist
if [ ! -d "$REPO_DIR/.git" ]; then
    echo "Cloning repo..."
    rm -rf "$REPO_DIR"
    git clone https://github.com/Minicon-eG/minicon-assistant-service.git "$REPO_DIR"
fi

cd "$REPO_DIR"
git fetch origin main 2>&1 | grep -v "^$" || true
CURRENT=$(git rev-parse HEAD)
LATEST=$(git rev-parse origin/main)

if [ "$CURRENT" != "$LATEST" ]; then
    echo "Deploying: $CURRENT -> $LATEST"
    git reset --hard origin/main
    docker build -t assistant-service:latest .
    docker stop assistant-service 2>/dev/null || true
    docker rm assistant-service 2>/dev/null || true
    docker run -d --name assistant-service --network web --restart unless-stopped --env-file /opt/config/assistant-service/.env assistant-service:latest
    sleep 3
    echo "Deploy SUCCESS"
else
    echo "No changes"
fi
