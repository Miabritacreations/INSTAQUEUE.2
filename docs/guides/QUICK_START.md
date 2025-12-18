# Quick Start Guide

Get InstaQueue running locally in 5 minutes! ⚡

## Prerequisites

- Node.js 18+
- MariaDB or MySQL 8.0+
- Redis 6.0+

## 5-Minute Setup

### 1️⃣ Start Services (Choose One)

**Option A: Using Homebrew (macOS)**
```bash
brew install mariadb redis
brew services start mariadb redis
```

**Option B: Docker (All platforms)**
```bash
docker run --name instaqueue-db -e MYSQL_ROOT_PASSWORD=rootpassword -p 3306:3306 mariadb:11
docker run --name instaqueue-redis -p 6379:6379 redis:7-alpine
```

**Option C: Windows**
- Download MariaDB from https://downloads.mariadb.org/
- Download Redis from https://github.com/microsoftarchive/redis/releases
- Install both and start

### 2️⃣ Setup Database

```bash
# Create database
mysql -u root -e "CREATE DATABASE instaqueue;"

# Import schema
mysql -u root instaqueue < INSTA_QUEUE/database/instaqueue.sql
```

### 3️⃣ Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on: **http://localhost:5000**

### 4️⃣ Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:3000**

### 5️⃣ Seed Database (New Terminal)

```bash
cd backend
npm run seed
```

## ✅ Verify

1. Open http://localhost:3000
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. You're done! 🎉

## 📖 Next Steps

- Explore [Student Dashboard](../guides/LOCAL_DEVELOPMENT.md) - Create appointments
- Visit Admin panel - Manage queues
- Check [API Reference](../api/API_REFERENCE.md) - Integrate with backend
- Read [Architecture](../architecture/ARCHITECTURE.md) - Understand the system

## ❓ Issues?

| Problem | Solution |
|---------|----------|
| Port 3000/5000 in use | Kill process: `lsof -i :3000` then `kill -9 <PID>` |
| Database connection failed | Check MySQL: `mysql -u root` |
| Redis connection failed | Check Redis: `redis-cli ping` |
| Dependencies missing | Run `npm install` again |

## 🚀 Production Deployment

For Docker deployment:
```bash
docker-compose up --build -d
```

See [Docker Deployment](../deployment/DOCKER.md) for details.

---

**Done!** You're ready to start developing. Check out [Local Development Guide](./LOCAL_DEVELOPMENT.md) for more details.
