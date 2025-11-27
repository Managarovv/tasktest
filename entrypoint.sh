#!/bin/sh

echo "Wait for PostgreSQL..."
sleep 5

echo "Applying Prisma migrations..."
npx prisma migrate reset
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Running ROOT init script..."
node dist/initRoot.js || echo "Root init skipped."

echo "Starting NestJS..."
node dist/main.js