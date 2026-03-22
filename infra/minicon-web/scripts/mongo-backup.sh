#!/bin/bash
# MongoDB Backup Script - ALL databases
# Runs daily via cron at 03:00, keeps 7 days rolling

BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y-%m-%d_%H%M)
RETENTION_DAYS=7
CONTAINER="hub-mongo"
DATABASES="minicon-website-service minicon-assistant"

mkdir -p "$BACKUP_DIR"

for DB in $DATABASES; do
  echo "[backup] Starting MongoDB dump: $DB ($DATE)"
  docker exec "$CONTAINER" mongodump --db "$DB" --archive --gzip 2>/dev/null > "$BACKUP_DIR/${DB}_${DATE}.gz"

  if [ $? -eq 0 ] && [ -s "$BACKUP_DIR/${DB}_${DATE}.gz" ]; then
    SIZE=$(du -h "$BACKUP_DIR/${DB}_${DATE}.gz" | cut -f1)
    echo "[backup] Success: ${DB}_${DATE}.gz ($SIZE)"
  else
    echo "[backup] FAILED: ${DB}_${DATE}.gz"
    rm -f "$BACKUP_DIR/${DB}_${DATE}.gz"
  fi
done

# Cleanup old backups
echo "[backup] Cleaning up backups older than $RETENTION_DAYS days"
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
REMAINING=$(ls "$BACKUP_DIR"/*.gz 2>/dev/null | wc -l)
echo "[backup] Done. $REMAINING backup files remaining."
