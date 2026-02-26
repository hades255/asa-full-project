#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
until pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" 2>/dev/null; do
  sleep 2
done
echo "PostgreSQL is ready."

echo "Running db:setup (prisma generate, db push, seed)..."
npm run db:setup

echo "Starting Intent Layer backend on port ${PORT:-20001}..."
exec npm start
