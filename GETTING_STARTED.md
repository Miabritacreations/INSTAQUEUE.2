# Getting Started Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
Make sure you have installed:
- Node.js 18+ (https://nodejs.org)
- MariaDB or MySQL 8.0+ 
- Redis 6.0+

### Step 1: Set Up Database

**macOS:**
```bash
# Install MariaDB
brew install mariadb
brew services start mariadb

# Create database
mysql -u root -e "CREATE DATABASE instaqueue;"
mysql -u root instaqueue < INSTA_QUEUE/database/instaqueue.sql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mariadb-server redis-server
sudo systemctl start mariadb redis-server

mysql -u root -e "CREATE DATABASE instaqueue;"
mysql -u root instaqueue < INSTA_QUEUE/database/instaqueue.sql
```

**Windows:**
- Download MariaDB from https://downloads.mariadb.org/
- Install and run MariaDB
- Use MariaDB Command Line Client to import database

### Step 2: Start Redis

**macOS:**
```bash
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo systemctl start redis-server
```

**Windows:**
- Download from https://github.com/microsoftarchive/redis/releases
- Run redis-server.exe

### Step 3: Install & Run Backend

Open **Terminal 1:**
```bash
cd backend
npm install
npm run dev
```

Backend runs on: http://localhost:5000

### Step 4: Install & Run Frontend

Open **Terminal 2:**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

### Step 5: Seed Database

Open **Terminal 3:**
```bash
cd backend
npm run seed
```

This creates an admin account and sample departments.

## ✅ Verify Everything Works

1. Open http://localhost:3000 in your browser
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. You should see the Student Dashboard
4. Click "Admin Dashboard" to see admin features

## 📱 Project Structure

```
INSTAQUEUE.2/
├── backend/                 # Node.js + Express API
│   ├── src/                # TypeScript source
│   ├── dist/               # Compiled JavaScript
│   ├── package.json
│   └── Dockerfile
├── frontend/               # React + Vite app
│   ├── src/               # React components
│   ├── dist/              # Built static files
│   ├── package.json
│   └── Dockerfile
├── INSTA_QUEUE/           # Old database schema
│   └── database/
│       └── instaqueue.sql
├── docker-compose.yml     # Production deployment
├── README.md              # Full documentation
├── DEVELOPMENT.md         # Development guide
└── BUILD_REPORT.md        # Build verification
```

## 🐳 Production Deployment (Docker)

To deploy with Docker:

```bash
docker-compose up --build -d
```

Then seed database:
```bash
docker-compose exec backend npm run seed
```

Access at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Database: localhost:3306
- Redis: localhost:6379

## 📖 More Information

- **Local Development**: See `DEVELOPMENT.md`
- **Full Documentation**: See `README.md`
- **Build Status**: See `BUILD_REPORT.md`

## ❓ Troubleshooting

### Port already in use?
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process (replace PID)
kill -9 <PID>
```

### Database connection failed?
```bash
# Check if MySQL is running
mysql -u root

# Check if database exists
mysql -u root -e "SHOW DATABASES;"
```

### Redis connection failed?
```bash
# Check if Redis is running
redis-cli ping
# Should respond with: PONG
```

### npm dependencies error?
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

## 🎯 Next Steps

1. ✅ Follow Quick Start above
2. Test both dashboards (student & admin)
3. Create test appointments
4. Explore admin features
5. Check real-time updates with Socket.io
6. Deploy with Docker when ready

Happy coding! 🎉
