#!/usr/bin/env bash
set -euo pipefail

file="${1:?Usage: ./scripts/restore-db.sh sauvegarde.sql.gz}"
: "${DB_HOST:?DB_HOST manquant}"
: "${DB_NAME:?DB_NAME manquant}"
: "${DB_USER:?DB_USER manquant}"
: "${DB_PASSWORD:?DB_PASSWORD manquant}"
test -f "$file"

export MYSQL_PWD="$DB_PASSWORD"
gzip -dc "$file" | mysql --host="$DB_HOST" --port="${DB_PORT:-3306}" --user="$DB_USER" --default-character-set=utf8mb4 "$DB_NAME"
unset MYSQL_PWD
echo "Restauration terminée depuis : $file"
