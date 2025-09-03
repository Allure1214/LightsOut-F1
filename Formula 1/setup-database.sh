#!/bin/bash

echo "========================================"
echo "Formula 1 Website - Database Setup"
echo "========================================"
echo

echo "Step 1: Checking if .env.local exists..."
if [ ! -f ".env.local" ]; then
    echo "ERROR: .env.local file not found!"
    echo "Please create .env.local with your DATABASE_URL"
    echo "Example: DATABASE_URL=\"postgresql://postgres:password@localhost:5432/formula1_db\""
    exit 1
fi

echo "Step 2: Generating Prisma client..."
npx prisma generate

echo "Step 3: Pushing database schema..."
npx prisma db push

echo "Step 4: Opening Prisma Studio (optional)..."
echo "You can now view your database at: http://localhost:5555"
echo "Press Ctrl+C to stop Prisma Studio when done"
npx prisma studio

echo
echo "Database setup complete!"
