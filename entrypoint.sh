#!/bin/sh

echo "Wait for PostgreSQL..."
sleep 5

echo "Applying Prisma migrations..."
npx prisma migrate dev --name init

echo "Generating Prisma client..."
npx prisma generate

echo "Running ROOT init script..."
node dist/initRoot.js || echo "Root init skipped."

echo "Starting NestJS..."
node dist/main.js