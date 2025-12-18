# InstaQueue - Modern Stack

## Overview
Smart Campus Queue & Appointment Management System built with:
- **Frontend**: React + TypeScript
- **Backend**: Node.js/Express + TypeScript
- **Database**: MariaDB
- **Cache**: Redis
- **Real-time**: Socket.io

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build -d

# Seed admin user (run inside backend container)
docker-compose exec backend npm run seed

# Access the app
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
MariaDB: localhost:3306
Redis: localhost:6379
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm run dev  # Runs on http://localhost:5000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

#### Database Setup
```bash
# Create database and import schema
mysql -u root -p < INSTA_QUEUE/database/instaqueue.sql

# Seed initial data
node backend/dist/seed.js
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Redis config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth & error middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript interfaces
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── INSTA_QUEUE/
│   ├── database/
│   │   └── instaqueue.sql   # Database schema
│   └── (old PHP files)
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/mine` - Get user's appointments
- `GET /api/appointments/queue?department_id=X` - Get today's queue
- `GET /api/appointments/next?department_id=X` - Get next pending
- `PUT /api/appointments/status` - Update appointment status (Admin)
- `PUT /api/appointments/cancel` - Cancel appointment

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
DB_HOST=mariadb
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=instaqueue
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Features

✅ **User Authentication** - JWT-based auth with bcryptjs password hashing
✅ **Real-time Queue Updates** - Socket.io for live notifications
✅ **Caching** - Redis for performance optimization
✅ **Role-based Access** - Student & Admin roles
✅ **Responsive UI** - Mobile-friendly React interface
✅ **TypeScript** - Full type safety
✅ **Docker** - Easy deployment & scaling

## Default Credentials

After seeding:
- **Email**: admin@example.com
- **Password**: admin123

## Development Commands

### Backend
```bash
npm run dev      # Start dev server with auto-reload
npm run build    # Compile TypeScript
npm run typecheck # Type checking only
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## License
MIT
