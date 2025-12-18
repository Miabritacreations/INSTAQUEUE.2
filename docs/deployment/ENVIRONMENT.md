# Environment Configuration Reference

Complete reference for all environment variables and configuration options.

## Backend Configuration (.env)

Located in `backend/.env`

### Environment & Port

```ini
# Environment mode
NODE_ENV=development        # or 'production'
PORT=5000                   # Server port
```

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | development or production |
| PORT | 5000 | Backend API port |

### Database Configuration

```ini
# Database connection
DB_HOST=localhost           # Database host
DB_PORT=3306               # MySQL/MariaDB port
DB_USER=root               # Database user
DB_PASSWORD=rootpassword   # Database password
DB_NAME=instaqueue         # Database name
```

| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | Hostname or IP of database |
| DB_PORT | 3306 | MySQL/MariaDB port |
| DB_USER | root | Database user (use non-root in production) |
| DB_PASSWORD | rootpassword | Database password |
| DB_NAME | instaqueue | Database name |

**Docker values:**
```ini
DB_HOST=mariadb             # Service name in docker-compose
DB_USER=root
DB_PASSWORD=rootpassword
```

### Redis Configuration

```ini
# Redis cache
REDIS_HOST=localhost       # Redis host
REDIS_PORT=6379           # Redis port
```

| Variable | Default | Description |
|----------|---------|-------------|
| REDIS_HOST | localhost | Redis hostname or IP |
| REDIS_PORT | 6379 | Redis port |

**Docker values:**
```ini
REDIS_HOST=redis           # Service name in docker-compose
REDIS_PORT=6379
```

### JWT Configuration

```ini
# JSON Web Token
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

| Variable | Default | Description |
|----------|---------|-------------|
| JWT_SECRET | (required) | Secret key for signing tokens (min 32 chars) |

**Security tips:**
- Generate secure secret: `openssl rand -base64 32`
- Use different secrets for dev/staging/production
- Rotate secrets periodically
- Never commit to git

### CORS Configuration

```ini
# Cross-Origin Resource Sharing
CORS_ORIGIN=http://localhost:3000
```

| Variable | Default | Description |
|----------|---------|-------------|
| CORS_ORIGIN | http://localhost:3000 | Allowed frontend origin |

**Production values:**
```ini
CORS_ORIGIN=https://yourdomain.com
# Or multiple origins (space-separated for some servers)
```

## Frontend Configuration

### Vite Config (vite.config.ts)

Frontend uses Vite with built-in proxy. No `.env` file needed.

```typescript
// Proxy configuration in vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

**For production, set the API URL in vite.config.ts:**
```typescript
const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000'

proxy: {
  '/api': {
    target: apiUrl,
    changeOrigin: true,
  },
}
```

## Docker Compose Configuration

In `docker-compose.yml`:

### Backend Service

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  ports:
    - "5000:5000"
  environment:
    # All .env variables are passed here
    - NODE_ENV=production
    - DB_HOST=mariadb
    - REDIS_HOST=redis
  depends_on:
    - mariadb
    - redis
```

### Frontend Service

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  ports:
    - "3000:3000"
```

### Database Service

```yaml
mariadb:
  image: mariadb:11-alpine
  environment:
    MYSQL_ROOT_PASSWORD: rootpassword
    MYSQL_DATABASE: instaqueue
  volumes:
    - mariadb_data:/var/lib/mysql
    - ./INSTA_QUEUE/database/instaqueue.sql:/docker-entrypoint-initdb.d/instaqueue.sql:ro
  ports:
    - "3306:3306"
```

### Redis Service

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
```

## Example .env Files

### Development

```ini
# development.env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=instaqueue

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=dev-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

### Production

```ini
# production.env
NODE_ENV=production
PORT=5000

DB_HOST=db.example.com
DB_PORT=3306
DB_USER=instaqueue_user
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_NAME=instaqueue

REDIS_HOST=redis.example.com
REDIS_PORT=6379

JWT_SECRET=STRONG_RANDOM_SECRET_32_CHARS_OR_MORE
CORS_ORIGIN=https://instaqueue.example.com
```

### Docker Production

```ini
# docker.env
NODE_ENV=production
PORT=5000

DB_HOST=mariadb
DB_PORT=3306
DB_USER=root
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_NAME=instaqueue

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=STRONG_RANDOM_SECRET_32_CHARS_OR_MORE
CORS_ORIGIN=https://instaqueue.example.com
```

## Generate Secure Secrets

### JWT Secret

```bash
# Generate 32-character random string
openssl rand -base64 32

# Output: A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0==
```

Use this in `JWT_SECRET`.

### Database Password

```bash
# Generate password with uppercase, lowercase, numbers, symbols
openssl rand -base64 16

# Output: aB1cD2eF3gH4iJ5kL6m7==
```

Use this in `DB_PASSWORD`.

## Configuration by Environment

### Development
- Local machine
- Default ports (3000, 5000, 3306, 6379)
- Debug logging enabled
- Relaxed CORS

### Staging
- Pre-production environment
- Staging domain
- Production-like settings
- Testing authentication

### Production
- Live environment
- Custom domain with SSL
- Strong security settings
- Optimized performance

## Advanced Configuration

### Database Connection Pooling

The mysql2 package uses connection pooling by default:

```typescript
// In backend/src/config/database.ts
const pool = mysql.createPool({
  connectionLimit: 10,      // Max connections
  queueLimit: 0,           // Unlimited queue
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});
```

Adjust `connectionLimit` based on expected concurrency.

### Redis Memory Management

```bash
# Set max memory and eviction policy
redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

Options:
- `allkeys-lru` - Remove any key using LRU
- `volatile-lru` - Remove keys with expiry using LRU
- `allkeys-random` - Remove random keys
- `volatile-random` - Remove random keys with expiry

### Socket.io Configuration

For scaling with multiple backend instances:

```typescript
// backend/src/index.ts
const io = new SocketIOServer(httpServer, {
  adapter: require('socket.io-redis')({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }),
});
```

## Monitoring & Logging

### Application Logs

Backend logs to console by default. For production, use:

```bash
# Redirect to file
node dist/index.js > app.log 2>&1

# Or with Docker
docker-compose logs -f backend > app.log
```

### Database Logs

```bash
# MariaDB logs in Docker
docker-compose logs mariadb

# Or check file directly
docker exec instaqueue_mariadb tail -f /var/log/mysql/error.log
```

### Redis Logs

```bash
# Redis logs
docker-compose logs redis

# Or Redis client
docker-compose exec redis redis-cli INFO
```

## SSL/TLS Configuration

For production HTTPS:

1. **Obtain Certificate** (Let's Encrypt)
   ```bash
   certbot certonly --standalone -d instaqueue.example.com
   ```

2. **Configure Reverse Proxy** (nginx)
   ```nginx
   server {
     listen 443 ssl;
     server_name instaqueue.example.com;
     
     ssl_certificate /etc/letsencrypt/live/instaqueue.example.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/instaqueue.example.com/privkey.pem;
     
     location / {
       proxy_pass http://localhost:3000;
     }
     
     location /api {
       proxy_pass http://localhost:5000;
     }
   }
   ```

3. **Update CORS_ORIGIN**
   ```ini
   CORS_ORIGIN=https://instaqueue.example.com
   ```

## Checklist

- [ ] Database credentials changed from defaults
- [ ] JWT_SECRET is a strong random string (32+ chars)
- [ ] CORS_ORIGIN set to your domain
- [ ] NODE_ENV set to 'production' in production
- [ ] Database backups configured
- [ ] Redis persistence configured
- [ ] SSL/TLS certificates installed
- [ ] Environment variables secured (not in git)
- [ ] All services health checks passing
- [ ] Monitoring and alerting configured

---

**Next:** See [Docker Deployment](./DOCKER.md) for deployment instructions.
