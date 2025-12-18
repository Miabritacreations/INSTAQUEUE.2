# System Architecture

## High-Level Overview

InstaQueue is a modern full-stack web application designed to eliminate physical queues in university campuses through digital appointments and real-time tracking.

```
┌─────────────────────────────────────────────────────────────┐
│                    InstaQueue System                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Frontend Layer (React + TypeScript)        │  │
│  │                                                      │  │
│  │  • Student Dashboard    • Admin Dashboard           │  │
│  │  • Login/Register       • Real-time Queue View      │  │
│  │  • Appointment Booking  • Socket.io Updates         │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ▲ HTTPS                          │
│                           │                               │
│                    Socket.io & REST API                   │
│                           │                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Backend Layer (Node.js + Express)            │  │
│  │                                                      │  │
│  │  • REST API Endpoints    • JWT Authentication       │  │
│  │  • Socket.io Server      • Business Logic           │  │
│  │  • Session Management    • Email Notifications      │  │
│  └──────────────────────────────────────────────────────┘  │
│        ▲              ▲                    ▲              │
│        │              │                    │              │
│   Database       Cache Layer          Message Queue       │
│        │              │                    │              │
│  ┌──────────────┐ ┌──────────┐ ┌──────────────────┐     │
│  │   MariaDB    │ │  Redis   │ │  Socket.io Rooms │     │
│  │   (Data)     │ │ (Cache)  │ │   (Real-time)    │     │
│  └──────────────┘ └──────────┘ └──────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend (React + TypeScript)

**Location**: `frontend/src/`

#### Structure
```
src/
├── components/          # Reusable components
│   └── ProtectedRoute.tsx
├── context/            # State management
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── StudentDashboard.tsx
│   └── AdminDashboard.tsx
├── services/           # API client & Socket.io
│   └── api.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── App.tsx             # Main app component
└── main.tsx            # Vite entry point
```

#### Key Features
- **Authentication**: JWT tokens stored in localStorage
- **State Management**: React Context for user state
- **Routing**: React Router for navigation
- **Real-time**: Socket.io client for queue updates
- **API**: Axios with interceptors for JWT auth

#### Data Flow

```
User Input
   ↓
React Component
   ↓
API Service (axios + JWT)
   ↓
Backend API
   ↓
Response
   ↓
Update State/UI
```

### Backend (Node.js + Express)

**Location**: `backend/src/`

#### Structure
```
src/
├── config/             # Configuration
│   ├── database.ts     # MySQL connection pool
│   └── redis.ts        # Redis client
├── middleware/         # Express middleware
│   └── auth.ts         # JWT authentication
├── controllers/        # Request handlers
│   ├── authController.ts
│   └── appointmentController.ts
├── routes/             # API routes
│   ├── auth.ts
│   └── appointments.ts
├── services/           # Business logic
│   ├── authService.ts
│   └── appointmentService.ts
├── types/              # TypeScript interfaces
│   └── index.ts
└── index.ts            # Server entry point
```

#### Request Lifecycle

```
HTTP Request
   ↓
CORS & Helmet Middleware
   ↓
Authentication Middleware
   ↓
Route Handler (Controller)
   ↓
Business Logic (Service)
   ↓
Database Query (PDO)
   ↓
Redis Cache (if applicable)
   ↓
Response
```

#### Authentication Flow

```
1. User Registration
   └─ POST /auth/register
      └─ Validate input
      └─ Hash password with bcryptjs
      └─ Store in database
      └─ Return user object

2. User Login
   └─ POST /auth/login
      └─ Find user by email
      └─ Verify password with bcryptjs
      └─ Generate JWT token
      └─ Return token + user

3. Protected Requests
   └─ GET /api/appointments
      └─ Extract JWT from Authorization header
      └─ Verify JWT signature & expiry
      └─ Attach user to request
      └─ Proceed to route handler
```

### Database Layer

**Technology**: MariaDB 11 with MySQL2 connection pool

#### Connection Management
```typescript
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

**Features**:
- Connection pooling (max 10 connections)
- Prepared statements (SQL injection prevention)
- Automatic reconnection
- Query queueing

#### Query Optimization

```sql
-- Indexed for fast queue lookups
CREATE INDEX dept_date_idx ON appointments(department_id, date);

-- Full-text search support
ALTER TABLE feedback ADD FULLTEXT INDEX comment_ft (comment);
```

### Cache Layer

**Technology**: Redis 7 Alpine

#### Usage Patterns

```typescript
// Cache queue for 5 minutes
const cacheKey = `queue:${departmentId}:${date}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

// Query database
const queue = await getQueueFromDB();

// Store in cache
await redis.setEx(cacheKey, 300, JSON.stringify(queue));
```

**Benefits**:
- Reduces database load
- Fast queue lookups
- Real-time updates via Socket.io
- Session storage

### Real-time Communication

**Technology**: Socket.io 4

#### Architecture

```
Client                          Server
  │                              │
  ├─ WebSocket Connection ─────┤
  │                              │
  ├─ join-queue(deptId) ────────>│
  │  └─ Socket joins room: │     │
  │     `queue-deptId`     │     │
  │                        └────>│
  │                              │
  │<─── queue-updated ─────────┤
  │  (broadcast to room)         │
  │                              │
  └─ leave-queue(deptId) ──────>│
     └─ Socket leaves room       │
```

#### Room Structure

```
/                                    (default namespace)
├── queue-1                          (Registrar queue)
├── queue-2                          (Finance queue)
├── queue-3                          (ICT queue)
├── queue-4                          (Library queue)
├── queue-5                          (Health Unit queue)
├── queue-6                          (Student Affairs queue)
├── queue-7                          (Examination queue)
└── queue-8                          (Admissions queue)
```

---

## Data Flow Examples

### Appointment Booking Flow

```
1. User fills form
   ↓
2. Frontend validates input
   ↓
3. POST /api/appointments with JWT
   ↓
4. Backend validates token
   ↓
5. Query last queue number for dept/date
   ↓
6. Assign next queue number
   ↓
7. Insert appointment in database
   ↓
8. Clear Redis cache
   ↓
9. Broadcast Socket.io event
   ↓
10. Return queue number to frontend
   ↓
11. Show confirmation on UI
```

### Admin Viewing Queue

```
1. Admin opens dashboard
   ↓
2. Frontend queries: GET /api/appointments/queue?department_id=1
   ↓
3. Backend checks Redis cache
   ↓
4. If cached, return immediately
   ↓
5. If not cached, query database
   ↓
6. Join users table for names
   ↓
7. Cache result for 5 minutes
   ↓
8. Return sorted list (by queue_number)
   ↓
9. Frontend displays queue
   ↓
10. Socket.io subscribed: when queue updates, auto-refresh
```

### Real-time Queue Update

```
1. Admin clicks "Serve Next"
   ↓
2. PUT /api/appointments/status with new status
   ↓
3. Backend updates database
   ↓
4. Clear Redis cache
   ↓
5. Socket.io emits "queue-updated"
   ↓
6. All connected clients in queue-{dept} room receive event
   ↓
7. Frontend updates UI automatically
   ↓
8. Admin and all viewing students see update in real-time
```

---

## Security Architecture

### Authentication & Authorization

```
1. User provides email + password
   ↓
2. Backend hashes and compares with bcryptjs
   ↓
3. If valid, generate JWT with:
   - User ID
   - Email
   - Role (student/admin)
   - Expiry (24 hours)
   ↓
4. Client stores JWT in localStorage
   ↓
5. All requests include JWT in Authorization header
   ↓
6. Backend verifies JWT signature & expiry
   ↓
7. Attach decoded user to request object
   ↓
8. Check role-based permissions for admin endpoints
```

### Data Protection

```
├── SQL Injection
│  └─ Prevented by prepared statements
│
├── XSS (Cross-Site Scripting)
│  └─ React auto-escapes JSX
│  └─ Helmet.js security headers
│
├── CSRF (Cross-Site Request Forgery)
│  └─ JWT tokens (not cookies)
│  └─ Same-origin policy
│
├── Sensitive Data
│  └─ Passwords: bcryptjs hashing
│  └─ Tokens: Signed JWT
│  └─ Session: JWT (stateless)
│
└── Transport
   └─ HTTPS recommended (production)
   └─ Socket.io over WSS (secure WebSocket)
```

---

## Scalability Considerations

### Horizontal Scaling

For multiple backend instances:

1. **Load Balancing**: Use nginx/HAProxy
2. **Session Storage**: Redis (stateless JWT)
3. **Socket.io Adapter**: Redis for cross-instance communication
4. **Database**: Connection pooling, read replicas

### Vertical Scaling

For single server:

1. **Increase Resources**: CPU, RAM
2. **Optimize Queries**: Add indices, cache frequently accessed data
3. **Connection Pool**: Increase pool size based on load
4. **Redis Memory**: Set max memory and eviction policy

### Monitoring & Performance

```
Metrics to Monitor:
├── Request latency (p50, p95, p99)
├── Database query time
├── Redis hit rate
├── Socket.io connections
├── CPU usage
├── Memory usage
├── Disk I/O
└── Error rate
```

---

## Technology Decisions & Rationale

| Component | Choice | Why |
|-----------|--------|-----|
| Frontend | React | Large ecosystem, component reusability |
| Backend | Express | Lightweight, flexible, great for APIs |
| Language | TypeScript | Type safety, better IDE support |
| Database | MariaDB | MySQL compatible, good performance |
| Cache | Redis | Fast, supports multiple data types |
| Real-time | Socket.io | Reliable, fallbacks, easy to use |
| Build Tool | Vite | Fast development, optimized production |
| Auth | JWT | Stateless, scalable, no session storage |

---

## Deployment Architecture

### Development
```
Local Machine
├── Backend (npm run dev)  - Port 5000
├── Frontend (npm run dev) - Port 3000
├── MariaDB (localhost)    - Port 3306
└── Redis (localhost)      - Port 6379
```

### Production (Docker)
```
Docker Host
├── Backend Container      - Port 5000
├── Frontend Container     - Port 3000
├── MariaDB Container      - Port 3306 (private)
└── Redis Container        - Port 6379 (private)
```

---

## API Architecture

### REST Endpoints

```
/api/auth
├── POST   /register         - Create new user
├── POST   /login            - User login
└── GET    /profile          - Get current user

/api/appointments
├── POST   /                 - Create appointment
├── GET    /mine             - User's appointments
├── GET    /queue            - Today's queue (by dept)
├── GET    /next             - Next pending appointment
├── PUT    /status           - Update appointment status (admin)
└── PUT    /cancel           - Cancel appointment
```

### Response Format

```json
{
  "success": true,
  "data": {...},
  "error": null
}
```

---

## Future Architecture Improvements

1. **Microservices**: Split into smaller services
2. **Message Queue**: Bull/RabbitMQ for async tasks
3. **Caching Layer**: Implement multi-level caching
4. **Search**: Elasticsearch for advanced search
5. **Analytics**: Aggregate usage metrics
6. **Mobile App**: Native iOS/Android apps
7. **API Gateway**: Kong or similar for routing
8. **Event Sourcing**: Track all changes for audit trail

---

See also:
- [Database Schema](./DATABASE.md)
- [Tech Stack](./TECH_STACK.md)
- [API Reference](../api/API_REFERENCE.md)
