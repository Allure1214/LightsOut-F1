# Cloud Database Setup Options

## 🚀 **Recommended Cloud Providers**

### **1. Railway (Easiest Setup)**
- **Website**: https://railway.app
- **Free Tier**: 500MB storage, 1GB RAM
- **Setup Steps**:
  1. Sign up at Railway.app
  2. Create new project
  3. Add PostgreSQL database
  4. Copy connection string
  5. Add to your `.env.local` file

### **2. Supabase (Full-featured)**
- **Website**: https://supabase.com
- **Free Tier**: 500MB storage, 2GB bandwidth
- **Features**: Built-in auth, real-time subscriptions, dashboard
- **Setup Steps**:
  1. Sign up at Supabase.com
  2. Create new project
  3. Go to Settings > Database
  4. Copy connection string
  5. Add to your `.env.local` file

### **3. PlanetScale (MySQL Alternative)**
- **Website**: https://planetscale.com
- **Free Tier**: 1GB storage, 1 billion reads/month
- **Note**: Uses MySQL, requires schema changes

### **4. Neon (Serverless PostgreSQL)**
- **Website**: https://neon.tech
- **Free Tier**: 3GB storage, 10GB transfer
- **Features**: Serverless, branching, autoscaling

## 🔧 **Connection String Format**

```
DATABASE_URL="postgresql://username:password@host:port/database_name"
```

### **Example Connection Strings**:

**Local PostgreSQL**:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/formula1_db"
```

**Railway**:
```
DATABASE_URL="postgresql://postgres:password@containers-us-west-xyz.railway.app:5432/railway"
```

**Supabase**:
```
DATABASE_URL="postgresql://postgres:password@db.xyz.supabase.co:5432/postgres"
```

## 📋 **Quick Setup Checklist**

- [ ] Choose database provider (local or cloud)
- [ ] Create database
- [ ] Get connection string
- [ ] Add to `.env.local` file
- [ ] Run Prisma migrations
- [ ] Test connection
