#!/bin/sh
set -e

echo "Running prisma generate..."
npx prisma generate

echo "Starting Intent Layer backend on port ${PORT:-20001}..."
exec npm start
