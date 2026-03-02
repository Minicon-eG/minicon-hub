#!/bin/bash
docker rm -f minicon-hub
docker run -d \
  --name minicon-hub \
  --restart unless-stopped \
  --network web \
  -e "DATABASE_URL=mongodb://control-plane-db:27017/minicon-hub?replicaSet=rs0&authSource=admin" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e HOSTNAME=0.0.0.0 \
  nitr0n/minicon-hub:latest
docker network connect control-plane_control-plane-net minicon-hub
