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
- `POST /api/auth/logout` - Logout user (requires auth)
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Appointments
- `POST /api/appointments` - Create appointment (requires auth)
- `GET /api/appointments/mine` - Get user's appointments (requires auth)
- `GET /api/appointments/stats` - Get user's appointment statistics (requires auth)
- `GET /api/appointments/queue?department_id=X` - Get today's queue (requires auth)
- `GET /api/appointments/next?department_id=X` - Get next pending (requires auth)
- `PUT /api/appointments/status` - Update appointment status (Admin only)
- `PUT /api/appointments/cancel` - Cancel appointment (requires auth)

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID

### Feedback
- `POST /api/feedback` - Submit feedback (requires auth)
- `GET /api/feedback/mine` - Get user's feedback history (requires auth)
- `GET /api/feedback/all` - Get all feedback (Admin only)
- `GET /api/feedback/stats/:department_id` - Get department feedback stats (Admin only)

### Notifications
- `GET /api/notifications` - Get user's notifications (requires auth)
- `GET /api/notifications/unread-count` - Get unread notification count (requires auth)
- `PUT /api/notifications/:id/read` - Mark notification as read (requires auth)
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read (requires auth)
- `POST /api/notifications` - Create notification (requires auth)
- `DELETE /api/notifications/:id` - Delete notification (requires auth)

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

### Core Features
✅ **User Authentication** - JWT-based auth with bcryptjs password hashing, secure login/logout
✅ **Real-time Queue Updates** - Live appointment queue management with status tracking
✅ **Role-based Access** - Student & Admin roles with different permissions
✅ **Department Management** - Browse and filter by departments
✅ **Appointment Scheduling** - Book appointments with preferred dates and times
✅ **Notification System** - Real-time notifications with read/unread tracking and badge count
✅ **Feedback System** - Rate services with star ratings (1-5) and provide detailed feedback
✅ **Profile Management** - Update personal information, department, and year of study

### Dashboard Features
✅ **Student Dashboard** - Real-time statistics showing total, pending, confirmed, and completed appointments
✅ **Next Appointment Card** - Displays upcoming appointment with full details
✅ **Quick Actions** - Shortcuts to book appointments, view queue, and submit feedback
✅ **Recent Activity** - Timeline of last 5 appointments

### User Experience
✅ **Toast Notifications** - Loading, success, and error feedback for all actions
✅ **Real-time Badge Count** - Live notification count in navbar
✅ **Password Visibility Toggle** - Show/hide password functionality
✅ **Enhanced Date Formatting** - Human-readable dates and "time ago" displays
✅ **Responsive UI** - Mobile-friendly interface that works on all devices
✅ **Loading States** - Visual feedback during async operations

### Technical Features
✅ **TypeScript** - Full type safety across frontend and backend
✅ **Redis Caching** - Performance optimization
✅ **Docker Support** - Easy deployment & scaling
✅ **API Services** - Modular service layer for all API calls

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
