#!/bin/bash
# Post-Reboot Health Check für Docker-Services
# Prüft Docker-Netzwerke und MongoDB Replica Set nach Neustart
# Erstellt: 21.03.2026

LOG="/var/log/post-reboot-check.log"
echo "$(date) - Post-Reboot Health Check gestartet" >> "$LOG"

# 1. Docker-Netzwerke prüfen & reparieren
check_network() {
    local container=$1
    local network=$2
    if ! docker inspect "$container" --format "{{json .NetworkSettings.Networks}}" 2>/dev/null | grep -q "$network"; then
        echo "$(date) - WARN: $container nicht in $network - verbinde..." >> "$LOG"
        docker network connect "$network" "$container" 2>> "$LOG" && \
            echo "$(date) - OK: $container mit $network verbunden" >> "$LOG" || \
            echo "$(date) - ERROR: Konnte $container nicht mit $network verbinden" >> "$LOG"
    else
        echo "$(date) - OK: $container bereits in $network" >> "$LOG"
    fi
}

# Warte bis Docker bereit ist
sleep 10

# hub-mongo muss in hub-internal sein
check_network "hub-mongo" "hub-internal"

# minicon-website-service muss in hub-internal + web sein
check_network "minicon-website-service" "hub-internal"
check_network "minicon-website-service" "web"

# preview-website-service muss in hub-internal + web sein
check_network "preview-website-service" "hub-internal"
check_network "preview-website-service" "web"

# kundenportal muss in web sein
check_network "minicon-kundenportal" "web"

# 2. MongoDB Replica Set Member-Hostname prüfen
sleep 5
RS_HOST=$(docker exec hub-mongo mongosh --eval "rs.conf().members[0].host" --quiet 2>/dev/null)
if [ "$RS_HOST" = "localhost:27017" ]; then
    echo "$(date) - WARN: RS Member ist localhost:27017 - korrigiere auf hub-mongo:27017..." >> "$LOG"
    docker exec hub-mongo mongosh --eval 'var c = rs.conf(); c.members[0].host = "hub-mongo:27017"; rs.reconfig(c);' --quiet >> "$LOG" 2>&1
    echo "$(date) - RS Member auf hub-mongo:27017 umkonfiguriert" >> "$LOG"

    # Services neu starten damit sie die neue RS-Config bekommen
    docker restart minicon-website-service >> "$LOG" 2>&1
    docker restart preview-website-service >> "$LOG" 2>&1
    echo "$(date) - Services neugestartet nach RS-Fix" >> "$LOG"
else
    echo "$(date) - OK: RS Member ist $RS_HOST" >> "$LOG"
fi

# 3. Health Check nach 30 Sekunden
sleep 30
WS_STATUS=$(docker inspect minicon-website-service --format "{{.State.Health.Status}}" 2>/dev/null)
echo "$(date) - website-service health: $WS_STATUS" >> "$LOG"

if [ "$WS_STATUS" != "healthy" ]; then
    echo "$(date) - WARN: website-service nicht healthy - Neustart..." >> "$LOG"
    docker restart minicon-website-service >> "$LOG" 2>&1
fi

echo "$(date) - Post-Reboot Health Check abgeschlossen" >> "$LOG"
