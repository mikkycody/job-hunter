#!/bin/sh

set -e

host="$1"
shift

until PGPASSWORD="pass123" psql -h "172.17.0.2" -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
