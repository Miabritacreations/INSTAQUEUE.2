# InstaQueue - Local Development Setup

This guide is for **local development only**. Docker is used for production deployment.

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+
- **MariaDB/MySQL** 8.0+
- **Redis** 6.0+

## Installation & Setup

### 1. Database Setup

#### Option A: Using MariaDB (Recommended for development)
```bash
# Install MariaDB (macOS)
brew install mariadb
brew services start mariadb

# Install MariaDB (Ubuntu/Debian)
sudo apt-get install mariadb-server
sudo systemctl start mariadb

# Install MariaDB (Windows)
# Download from https://downloads.mariadb.org/
```

#### Option B: Using MySQL
```bash
# Install MySQL (similar process as MariaDB)
# Then create database and user:
mysql -u root -p << EOF
CREATE DATABASE instaqueue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'instaqueue'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON instaqueue.* TO 'instaqueue'@'localhost';
FLUSH PRIVILEGES;
EOF

# Import schema
mysql -u root -p instaqueue < INSTA_QUEUE/database/instaqueue.sql
```

### 2. Redis Setup

```bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server
sudo systemctl start redis-server

# Verify Redis is running
redis-cli ping  # Should respond with PONG
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials:
# DB_HOST=localhost
# DB_USER=root (or your MySQL user)
# DB_PASSWORD=your_password
# DB_NAME=instaqueue
# REDIS_HOST=localhost
# REDIS_PORT=6379
nano .env

# Start development server (auto-reload with ts-node)
npm run dev
# Server runs on http://localhost:5000
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:3000

# In another terminal, build for production preview
npm run build
npm run preview
```

## Seeding Initial Data

After database is created and running:

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Sample departments (Registrar, Finance, ICT, etc.)

## Development Commands

### Backend
```bash
npm run dev        # Start with auto-reload
npm run build      # Compile TypeScript
npm run typecheck  # Type checking only
npm start          # Run compiled version
npm run seed       # Seed database
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code
```

## Testing the Application

1. **Open frontend**: http://localhost:3000
2. **Register** a new account or use admin credentials
3. **Login** with your credentials
4. **Student Dashboard**: View and manage appointments
5. **Admin Dashboard**: http://localhost:3000/admin (for admin users)

## API Testing

### Using curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get profile (use token from login response)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
1. Import the API endpoints from backend routes
2. Set Authorization header to `Bearer YOUR_TOKEN`
3. Test endpoints under `/api/auth` and `/api/appointments`

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill process if needed: kill -9 <PID>

# Check database connection
mysql -u root -p -h localhost instaqueue

# Check Redis connection
redis-cli ping
```

### Frontend won't build
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run build
```

### Database errors
```bash
# Check if MariaDB is running
mysql -u root -p

# Reimport schema if corrupted
mysql -u root -p instaqueue < INSTA_QUEUE/database/instaqueue.sql
```

### Redis connection issues
```bash
# Check if Redis is running
redis-cli ping

# Check Redis logs
redis-cli MONITOR  # View real-time commands
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=instaqueue
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local or vite.config.ts)
Already configured in `vite.config.ts` with proxy to backend

## Production Deployment

For production, use Docker:
```bash
docker-compose up --build -d
```

See root README.md for Docker setup.

## Hot Reload Development

### Backend
- Uses `ts-node` for automatic TypeScript compilation
- Changes to `src/` are reflected immediately with `npm run dev`

### Frontend
- Uses Vite's HMR (Hot Module Replacement)
- Changes to `src/` are reflected instantly in browser

## Performance Tips

1. **Redis caching** is enabled for queue lookups
2. **Socket.io** handles real-time updates efficiently
3. **JWT tokens** have 24-hour expiration
4. **Database indices** optimized for queue queries

## Next Steps

1. Configure your `.env` files
2. Start Redis and Database
3. Run `npm run seed` to initialize data
4. Start backend: `npm run dev`
5. Start frontend: `npm run dev`
6. Visit http://localhost:3000
