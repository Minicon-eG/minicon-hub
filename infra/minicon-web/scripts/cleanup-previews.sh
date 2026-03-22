#!/bin/bash
NOW=$(date +%s)
for dir in /opt/sites/*-preview; do
    [ -d "$dir" ] || continue
    [ -f "$dir/.expires" ] || continue
    EXPIRES=$(cat "$dir/.expires")
    if [ "$NOW" -gt "$EXPIRES" ]; then
        SITE=$(basename "$dir" | sed 's/-preview$//')
        logger "Preview fuer $SITE abgelaufen, loesche $dir"
        rm -rf "$dir"
    fi
done
