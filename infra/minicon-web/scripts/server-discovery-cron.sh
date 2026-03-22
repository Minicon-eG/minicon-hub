#!/bin/bash
# Discovery Cron - läuft täglich auf dem Server
# Findet neue Restaurants via Overpass API und fügt sie zur DB hinzu

set -e

echo "[$(date)] Starting Discovery..."

# Discovery ausführen (im minicon-hub Container)
docker exec minicon-hub node run-discovery.js

echo "[$(date)] Discovery complete!"
