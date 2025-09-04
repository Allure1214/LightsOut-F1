# 🗄️ Database Setup Guide for Formula 1 Website

## 🚀 **Quick Start (Recommended)**

### **Option 1: Cloud Database (Easiest)**

1. **Choose a Cloud Provider:**
   - **Railway**: https://railway.app (Free tier: 500MB)
   - **Supabase**: https://supabase.com (Free tier: 500MB)
   - **Neon**: https://neon.tech (Free tier: 3GB)

2. **Get Connection String:**
   - Create a new PostgreSQL database
   - Copy the connection string (looks like: `postgresql://user:pass@host:port/db`)

3. **Create `.env.local` file:**
   ```env
   DATABASE_URL="your-connection-string-here"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run Setup:**
   ```bash
   # Windows
   setup-database.bat
   
   # Mac/Linux
   chmod +x setup-database.sh
   ./setup-database.sh
   ```

### **Option 2: Local PostgreSQL**

1. **Install PostgreSQL:**
   - Download from: https://www.postgresql.org/download/windows/
   - Install with default settings
   - Remember the password you set for 'postgres' user

2. **Create Database:**
   - Open pgAdmin or psql
   - Run the `database-setup.sql` script
   - Or manually create database named `formula1_db`

3. **Create `.env.local` file:**
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/formula1_db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run Setup:**
   ```bash
   # Windows
   setup-database.bat
   
   # Mac/Linux
   chmod +x setup-database.sh
   ./setup-database.sh
   ```

## 📋 **Manual Setup Commands**

If you prefer to run commands manually:

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Push schema to database
npx prisma db push

# 3. Open Prisma Studio (optional)
npx prisma studio
```

## 🔍 **Verify Setup**

1. **Check Database Connection:**
   - Run `npx prisma studio`
   - Open http://localhost:5555
   - You should see your database tables

2. **Test in Your App:**
   - Start your dev server: `npm run dev`
   - Visit http://localhost:3000
   - Check browser console for any database errors

## 🗂️ **Database Schema Overview**

Your database will include these tables:

- **Users** - User accounts and authentication
- **Drivers** - F1 driver information
- **Teams** - Constructor/team data
- **Races** - Race calendar and results
- **Results** - Detailed race results
- **Articles** - News and articles
- **Comments** - User comments on articles

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"Database connection failed"**
   - Check your DATABASE_URL in `.env.local`
   - Ensure database server is running
   - Verify username/password are correct

2. **"Schema not found"**
   - Run `npx prisma db push` again
   - Check if database exists

3. **"Permission denied"**
   - Ensure user has proper permissions
   - Check database user privileges

### **Get Help:**
- Check Prisma documentation: https://www.prisma.io/docs
- Railway support: https://docs.railway.app
- Supabase support: https://supabase.com/docs

## 🎯 **Next Steps**

After database setup:
1. ✅ Database is connected
2. ✅ Schema is created
3. ✅ Prisma client is generated
4. 🔄 Start building F1 features (driver standings, race results, etc.)
5. 🔄 Add authentication system
6. 🔄 Integrate F1 data APIs
