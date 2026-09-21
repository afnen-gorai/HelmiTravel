#!/usr/bin/env bash
set -euo pipefail

: "${DB_HOST:?DB_HOST manquant}"
: "${DB_NAME:?DB_NAME manquant}"
: "${DB_USER:?DB_USER manquant}"
: "${DB_PASSWORD:?DB_PASSWORD manquant}"

backup_dir="${BACKUP_DIR:-./backups}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$backup_dir"
target="$backup_dir/helmi_travel_${timestamp}.sql.gz"

export MYSQL_PWD="$DB_PASSWORD"
mysqldump --host="$DB_HOST" --port="${DB_PORT:-3306}" --user="$DB_USER" --single-transaction --quick --routines --triggers --events --default-character-set=utf8mb4 "$DB_NAME" | gzip -9 > "$target"
unset MYSQL_PWD
sha256sum "$target" > "$target.sha256"
echo "Sauvegarde créée : $target"
