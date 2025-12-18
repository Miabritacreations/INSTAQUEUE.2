# Local Development Setup Guide

Complete guide for setting up InstaQueue for local development with hot-reload and debugging.

## System Requirements

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| MariaDB/MySQL | 8.0+ | https://mariadb.org or https://mysql.com |
| Redis | 6.0+ | https://redis.io |
| npm | 9+ | Included with Node.js |

## Installation by Platform

### macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install node mariadb redis

# Start services
brew services start mariadb
brew services start redis

# Verify installation
node --version
mysql --version
redis-cli ping  # Should output: PONG
```

### Ubuntu/Debian

```bash
# Update package manager
sudo apt-get update

# Install dependencies
sudo apt-get install -y nodejs npm mariadb-server redis-server

# Start services
sudo systemctl start mariadb
sudo systemctl start redis-server

# Enable on boot
sudo systemctl enable mariadb redis-server

# Verify installation
node --version
mysql --version
redis-cli ping  # Should output: PONG
```

### Windows

1. **Install Node.js**
   - Download from https://nodejs.org
   - Run installer with defaults
   - Verify: `node --version` in cmd

2. **Install MariaDB**
   - Download from https://downloads.mariadb.org/
   - Run installer, choose default options
   - Note the root password you set

3. **Install Redis**
   - Download from https://github.com/microsoftarchive/redis/releases
   - Extract and run `redis-server.exe`

## Database Setup

### Initialize Database

```bash
# Create database
mysql -u root -p << EOF
CREATE DATABASE instaqueue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

# Import schema
mysql -u root -p instaqueue < INSTA_QUEUE/database/instaqueue.sql

# Verify (should show instaqueue tables)
mysql -u root -p instaqueue -e "SHOW TABLES;"
```

### Create Database User (Optional)

For security, create a dedicated user instead of using root:

```bash
mysql -u root -p << EOF
CREATE USER 'instaqueue'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON instaqueue.* TO 'instaqueue'@'localhost';
FLUSH PRIVILEGES;
EOF
```

Then update `.env`:
```
DB_USER=instaqueue
DB_PASSWORD=password123
```

## Backend Setup

### Install & Configure

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
nano .env  # or use your preferred editor
```

### .env Configuration

```ini
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=instaqueue

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Start Backend

```bash
npm run dev
```

**Output:**
```
🚀 Server running on port 5000
Redis Client Connected
```

Backend is now available at: **http://localhost:5000**

### Backend Commands

```bash
npm run dev        # Start with hot-reload (ts-node)
npm run build      # Compile TypeScript to dist/
npm run typecheck  # Check types without emitting
npm run seed       # Seed database with admin user
npm start          # Run compiled version
```

## Frontend Setup

### Install & Configure

```bash
cd frontend

# Install dependencies
npm install

# No .env needed - uses vite.config.ts proxy
```

### Start Frontend

```bash
npm run dev
```

**Output:**
```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

Frontend is now available at: **http://localhost:3000**

### Frontend Commands

```bash
npm run dev        # Start dev server with HMR
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Lint code
```

## Seed Database

After services are running:

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- 8 sample departments

## Verify Everything Works

### Step 1: Check Services

```bash
# Check Node.js
node --version

# Check MySQL
mysql -u root -e "SELECT 1;"

# Check Redis
redis-cli ping  # Should output: PONG
```

### Step 2: Start All Services

**Terminal 1 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

**Terminal 3 - Database (optional, if not running as service):**
```bash
redis-cli
# Or: mysql -u root
```

### Step 3: Test Application

1. Open http://localhost:3000
2. Click "Login"
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
4. You should see the Student Dashboard

### Step 4: Test Admin Features

1. As admin user, navigate to `/admin`
2. You should see today's queue display
3. Queues show real-time updates via Socket.io

## Development Features

### Hot Module Replacement (HMR)

Frontend changes reload automatically in browser:
```bash
# Edit src/App.tsx
# Browser automatically refreshes
```

### TypeScript Hot Reload (Backend)

Backend code changes auto-compile and restart:
```bash
# Edit src/index.ts
# ts-node automatically recompiles
# Restart needed for some changes
```

### Socket.io Development

Real-time updates work in dev mode:
- Backend broadcasts to `/queue-{departmentId}` rooms
- Frontend subscribes to updates automatically

## API Testing

### Using curl

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Get profile (replace TOKEN with response from login)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import API endpoints as collection
2. Set `Authorization` header to `Bearer YOUR_TOKEN`
3. Test endpoints under `/api/*`

## Debugging

### Backend Debugging

#### Using VS Code

1. Add `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "InstaQueue Backend",
      "program": "${workspaceFolder}/backend/node_modules/.bin/ts-node",
      "args": ["src/index.ts"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal"
    }
  ]
}
```

2. Set breakpoints and press F5

#### Using Console Logs

```typescript
// In backend code
console.log('Debug info:', variable);
console.error('Error info:', error);
```

### Frontend Debugging

1. Open browser DevTools (F12)
2. Go to "Sources" tab
3. Set breakpoints in React code
4. Use "Console" tab for logging

### Database Debugging

```bash
# Check database contents
mysql -u root instaqueue

# Show users
SELECT id, name, email, role FROM users;

# Show today's appointments
SELECT * FROM appointments WHERE date = CURDATE();

# Monitor Redis
redis-cli MONITOR  # Live command stream
redis-cli  # Interactive mode
> KEYS *  # Show all keys
> GET key_name  # Get value
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process (replace PID)
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Database Connection Failed

```bash
# Check if MySQL is running
mysql -u root

# If not running:
brew services start mariadb  # macOS
sudo systemctl start mariadb  # Ubuntu
```

### Redis Connection Failed

```bash
# Check if Redis is running
redis-cli ping

# If not running:
brew services start redis  # macOS
sudo systemctl start redis-server  # Ubuntu
```

### npm Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# If still issues:
npm cache clean --force
npm install
```

### TypeScript Compilation Errors

```bash
# Check types
npm run typecheck

# Rebuild from scratch
rm -rf dist
npm run build
```

## Performance Tips

1. **Use Redis** - Caches queue lookups
2. **Optimize queries** - Indexed by (department_id, date)
3. **Session management** - JWT tokens (24h expiry)
4. **Socket.io rooms** - Joins `/queue-{departmentId}` for targeted updates

## Next Steps

1. ✅ Setup complete!
2. Explore the application
3. Read [Architecture Guide](../architecture/ARCHITECTURE.md)
4. Check [API Reference](../api/API_REFERENCE.md)
5. Try [Docker Deployment](../deployment/DOCKER.md)

## Additional Resources

- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Socket.io Docs](https://socket.io/docs/)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Docs](https://www.typescriptlang.org)

---

**Happy coding!** If you run into issues, check the troubleshooting section above or see [Local Development Setup](./INSTALLATION.md).
