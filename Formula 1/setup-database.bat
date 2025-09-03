@echo off
echo ========================================
echo Formula 1 Website - Database Setup
echo ========================================
echo.

echo Step 1: Checking if .env.local exists...
if not exist ".env.local" (
    echo ERROR: .env.local file not found!
    echo Please create .env.local with your DATABASE_URL
    echo Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/formula1_db"
    pause
    exit /b 1
)

echo Step 2: Generating Prisma client...
call npx prisma generate

echo Step 3: Pushing database schema...
call npx prisma db push

echo Step 4: Opening Prisma Studio (optional)...
echo You can now view your database at: http://localhost:5555
echo Press Ctrl+C to stop Prisma Studio when done
call npx prisma studio

echo.
echo Database setup complete!
pause
