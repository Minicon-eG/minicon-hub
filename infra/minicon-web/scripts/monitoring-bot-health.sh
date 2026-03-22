#!/bin/bash
LOG_FILE="/var/log/monitoring-bot.log"

log() {
    echo "[$(date  ' +%Y-%m-%d %H:%M:%S ' )] $1" >> $LOG_FILE
}

# Check Uptime Kuma
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/status 2>/dev/null)
if [ "$response" != "200" ]; then
    log "ERROR: Uptime Kuma not responding (HTTP $response)"
else
    log "OK: Uptime Kuma responding"
fi

# Check status.minicon.eu (follow redirect)
response=$(curl -sL -o /dev/null -w "%{http_code}" https://status.minicon.eu 2>/dev/null)
if [ "$response" != "200" ]; then
    log "ERROR: status.minicon.eu not responding (HTTP $response)"
else
    log "OK: status.minicon.eu responding"
fi

# Check Docker containers
failed=$(docker ps --filter "health=unhealthy" --format "{{.Names}}" 2>/dev/null)
if [ -n "$failed" ]; then
    log "ERROR: Unhealthy containers: $failed"
else
    log "OK: All containers healthy"
fi

# Check Disk
usage=$(df -h / | tail -1 | awk  ' {print $5} '  | sed  ' s/%// ' )
if [ "$usage" -gt 85 ]; then
    log "ERROR: Disk usage at ${usage}%"
else
    log "OK: Disk at ${usage}%"
fi
