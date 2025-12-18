# Installation Guide

Platform-specific installation instructions for InstaQueue development.

## Table of Contents
- [macOS](#macos)
- [Ubuntu/Debian](#ubuntudebian)
- [Windows](#windows)
- [Docker](#docker-all-platforms)
- [Verification](#verification)

## macOS

### Prerequisites

Install [Homebrew](https://brew.sh) first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install Node.js

```bash
brew install node
node --version  # Should be 18+
npm --version   # Should be 9+
```

### Install MariaDB

```bash
brew install mariadb

# Start MariaDB service
brew services start mariadb

# Initial setup (optional - secure the root user)
mysql_secure_installation
```

### Install Redis

```bash
brew install redis

# Start Redis service
brew services start redis

# Verify
redis-cli ping  # Should output: PONG
```

### Verify Installation

```bash
node --version
npm --version
mysql --version
redis-cli --version
```

---

## Ubuntu/Debian

### Update System

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

node --version  # Should be 18+
npm --version   # Should be 9+
```

### Install MariaDB

```bash
sudo apt-get install -y mariadb-server

# Start service
sudo systemctl start mariadb

# Enable on boot
sudo systemctl enable mariadb

# Initial setup (optional)
sudo mysql_secure_installation
```

### Install Redis

```bash
sudo apt-get install -y redis-server

# Start service
sudo systemctl start redis-server

# Enable on boot
sudo systemctl enable redis-server

# Verify
redis-cli ping  # Should output: PONG
```

### Verify Installation

```bash
node --version
npm --version
mysql --version
redis-cli --version
```

---

## Windows

### Install Node.js

1. Download from https://nodejs.org/ (LTS version)
2. Run installer with default options
3. Restart computer
4. Verify in Command Prompt:
   ```cmd
   node --version
   npm --version
   ```

### Install MariaDB

1. Download from https://downloads.mariadb.org/
2. Run installer
3. During setup:
   - Enable "Use UTF8 Charset"
   - Set root password (remember this!)
   - Enable "Install as Windows Service"
4. Verify in Command Prompt:
   ```cmd
   mysql --version
   mysql -u root -p
   # Enter password
   # Type: exit
   ```

### Install Redis

1. Download from https://github.com/microsoftarchive/redis/releases
2. Download `Redis-x64-*.msi` file
3. Run installer with default options
4. Redis will start automatically
5. Verify in Command Prompt:
   ```cmd
   redis-cli ping
   # Should output: PONG
   ```

### Verify Installation

Open Command Prompt and run:
```cmd
node --version
npm --version
mysql --version
redis-cli --version
```

---

## Docker (All Platforms)

Use Docker for consistent development environment across all platforms.

### Install Docker

- **macOS**: Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
- **Windows**: Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- **Ubuntu/Debian**:
  ```bash
  sudo apt-get install -y docker.io docker-compose
  sudo usermod -aG docker $USER
  # Logout and login for changes to take effect
  ```

### Start Services with Docker

```bash
# MariaDB
docker run --name instaqueue-db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=instaqueue \
  -p 3306:3306 \
  -v mariadb_data:/var/lib/mysql \
  -d mariadb:11

# Redis
docker run --name instaqueue-redis \
  -p 6379:6379 \
  -v redis_data:/data \
  -d redis:7-alpine
```

### Verify Docker Services

```bash
# Check running containers
docker ps

# Test MariaDB connection
docker exec instaqueue-db mysql -u root -prootpassword -e "SELECT 1;"

# Test Redis connection
docker exec instaqueue-redis redis-cli ping
```

### Import Database Schema

```bash
docker exec -i instaqueue-db mysql -u root -prootpassword instaqueue < INSTA_QUEUE/database/instaqueue.sql
```

---

## Project Installation

### Clone Repository

```bash
git clone https://github.com/Miabritacreations/INSTAQUEUE.2.git
cd INSTAQUEUE.2
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# macOS/Linux:
nano .env
# Windows: Open .env in Notepad
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# No .env needed - proxy configured in vite.config.ts
```

---

## Verification

### Check All Services

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MySQL
mysql -u root -p -e "SELECT 1;" 
# (or docker exec instaqueue-db mysql ...)

# Check Redis
redis-cli ping
# (or docker exec instaqueue-redis redis-cli ping)
```

### Test Backend

```bash
cd backend
npm run build
npm run typecheck
```

Expected output: No errors

### Test Frontend

```bash
cd frontend
npm run build
```

Expected output: 
```
✓ built in X.XXs
```

### Quick Sanity Check

```bash
# Backend can connect to database
cd backend
npm run seed

# Frontend can build
cd frontend
npm run build
```

If no errors, you're ready to develop!

---

## Troubleshooting

### Node.js Not Found

```bash
# macOS/Linux: Make sure Node is in PATH
which node

# Windows: Restart computer after Node.js installation
node --version
```

### MySQL/MariaDB Not Starting

```bash
# macOS
brew services list | grep mariadb
brew services restart mariadb

# Ubuntu
sudo systemctl status mariadb
sudo systemctl restart mariadb

# Docker
docker start instaqueue-db
docker logs instaqueue-db
```

### Redis Not Starting

```bash
# macOS
brew services list | grep redis
brew services restart redis

# Ubuntu
sudo systemctl status redis-server
sudo systemctl restart redis-server

# Docker
docker start instaqueue-redis
docker logs instaqueue-redis
```

### npm Install Fails

```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# If still fails, check disk space
df -h  # macOS/Linux
disk usage  # Windows
```

---

## Next Steps

1. ✅ Installation complete!
2. Setup database (see [Local Development Guide](./LOCAL_DEVELOPMENT.md))
3. Start backend: `npm run dev`
4. Start frontend: `npm run dev`
5. Visit http://localhost:3000

---

**Need help?** Check [Local Development Guide](./LOCAL_DEVELOPMENT.md) for detailed setup instructions.
