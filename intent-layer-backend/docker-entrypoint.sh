#!/bin/sh
set -e

echo "Running prisma generate and db push..."
npx prisma generate
npx prisma db push

echo "Starting Intent Layer backend on port ${PORT:-20001}..."
exec npm start
