# Docker Deployment Guide

Production-ready Docker deployment with MariaDB, Redis, and Node.js services.

## Overview

This guide covers deploying InstaQueue to production using Docker Compose.

**Services:**
- Node.js Backend API (port 5000)
- React Frontend (port 3000)
- MariaDB Database (port 3306)
- Redis Cache (port 6379)

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM minimum
- 5GB disk space

### Install Docker

- **macOS/Windows**: Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Ubuntu/Debian**:
  ```bash
  sudo apt-get install -y docker.io docker-compose
  sudo usermod -aG docker $USER
  ```

## Quick Start

### 1. Clone & Navigate

```bash
git clone https://github.com/Miabritacreations/INSTAQUEUE.2.git
cd INSTAQUEUE.2
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
nano .env  # Update values if needed
```

Default `.env` is production-ready:
```ini
NODE_ENV=production
PORT=5000
DB_HOST=mariadb
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=instaqueue
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CORS_ORIGIN=http://localhost:3000
```

### 3. Build & Start Services

```bash
docker-compose up --build -d
```

**Output:**
```
Creating instaqueue_mariadb ... done
Creating instaqueue_redis ... done
Creating instaqueue_backend ... done
Creating instaqueue_frontend ... done
```

### 4. Seed Database

```bash
docker-compose exec backend npm run seed
```

Expected output:
```
🌱 Seeding database...
✅ Database seeded successfully!
Admin credentials:
  Email: admin@example.com
  Password: admin123
```

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Database**: localhost:3306
- **Redis**: localhost:6379

## Docker Compose Services

### Backend Service
```yaml
backend:
  - Image: Built from ./backend/Dockerfile
  - Port: 5000
  - Environment: All DB/Redis/JWT config
  - Depends on: mariadb, redis
  - Auto-restart: unless-stopped
```

### Frontend Service
```yaml
frontend:
  - Image: Built from ./frontend/Dockerfile
  - Port: 3000
  - Proxies API to backend
  - Auto-restart: unless-stopped
```

### MariaDB Service
```yaml
mariadb:
  - Image: mariadb:11-alpine
  - Port: 3306
  - Database: instaqueue (auto-created)
  - Volume: mariadb_data (persistent)
  - Health checks: Enabled
```

### Redis Service
```yaml
redis:
  - Image: redis:7-alpine
  - Port: 6379
  - Volume: redis_data (persistent)
  - Health checks: Enabled
```

## Common Commands

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mariadb

# Real-time logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs -f --tail=100 backend
```

### Stop Services

```bash
# Stop all services (data persists)
docker-compose stop

# Stop specific service
docker-compose stop backend

# Remove containers (data persists in volumes)
docker-compose down

# Remove containers AND volumes (WARNING: Data loss)
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Execute Commands Inside Containers

```bash
# Seed database
docker-compose exec backend npm run seed

# Access database
docker-compose exec mariadb mysql -u root -prootpassword instaqueue

# Redis CLI
docker-compose exec redis redis-cli

# Backend shell
docker-compose exec backend /bin/sh
```

### View Running Containers

```bash
docker-compose ps

# With detailed info
docker-compose ps -a
```

## Scaling & Performance

### Increase Resources

Edit `docker-compose.yml` to add resource limits:

```yaml
services:
  backend:
    # ... other config ...
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '1'
          memory: 512M
```

### Database Optimization

```sql
-- Connect to database
docker-compose exec mariadb mysql -u root -prootpassword instaqueue

-- Add index for faster queue lookups
CREATE INDEX dept_date_idx ON appointments(department_id, date);

-- Check index usage
SHOW INDEXES FROM appointments;
```

### Redis Configuration

For larger deployments, adjust Redis memory:

```yaml
redis:
  # ... other config ...
  command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

## Monitoring

### Check Container Health

```bash
# View health status
docker-compose ps

# Check specific health
docker inspect instaqueue_backend --format='{{.State.Health}}'
```

### View Resource Usage

```bash
docker stats
```

### View Database Size

```bash
docker-compose exec mariadb du -sh /var/lib/mysql
```

## Backups

### Backup Database

```bash
# Create backup
docker-compose exec mariadb mysqldump -u root -prootpassword instaqueue > backup.sql

# Restore backup
docker-compose exec -T mariadb mysql -u root -prootpassword instaqueue < backup.sql
```

### Backup Redis

```bash
# Create backup
docker-compose exec redis redis-cli BGSAVE

# Access backup
docker exec instaqueue_redis ls -la /data/dump.rdb
```

### Backup Volumes

```bash
# Backup database volume
docker run --rm -v instaqueue_mariadb_data:/data -v $(pwd):/backup alpine tar -czf /backup/db_backup.tar.gz /data

# Restore database volume
docker run --rm -v instaqueue_mariadb_data:/data -v $(pwd):/backup alpine tar -xzf /backup/db_backup.tar.gz -C /
```

## Production Checklist

- [ ] Change `JWT_SECRET` to secure random value
- [ ] Change database password in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (configure reverse proxy/nginx)
- [ ] Enable database backups
- [ ] Monitor disk space
- [ ] Set up log aggregation
- [ ] Configure auto-restart policies
- [ ] Test disaster recovery
- [ ] Document recovery procedures

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Check docker daemon
docker version

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Failed

```bash
# Check database health
docker-compose exec mariadb mysql -u root -prootpassword -e "SELECT 1;"

# Check logs
docker-compose logs mariadb

# Restart database
docker-compose restart mariadb

# Reimport schema
docker-compose exec -T mariadb mysql -u root -prootpassword instaqueue < INSTA_QUEUE/database/instaqueue.sql
```

### Frontend/Backend Connection Issues

```bash
# Check backend health
docker-compose exec backend curl http://localhost:5000/health

# Check frontend health
docker-compose exec frontend curl http://localhost:3000

# Check networking
docker network ls
docker network inspect instaqueue_instaqueue-network
```

### Redis Connection Failed

```bash
# Check Redis health
docker-compose exec redis redis-cli ping

# Check Redis logs
docker-compose logs redis

# Restart Redis
docker-compose restart redis
```

### Out of Disk Space

```bash
# Check usage
docker system df

# Clean up unused images
docker image prune -a

# Clean up unused volumes (WARNING: May lose data)
docker volume prune

# Check database size
docker-compose exec mariadb du -sh /var/lib/mysql
```

## Advanced Configuration

### SSL/TLS with Nginx

See [Environment Configuration](./ENVIRONMENT.md) for nginx setup.

### Custom Domain

1. Point domain DNS to server
2. Use reverse proxy (nginx/caddy)
3. Configure SSL certificates (Let's Encrypt)

### Database Replication

For high availability, configure MariaDB replication in production setup.

### Redis Cluster

For scaling cache, set up Redis Cluster mode.

## Next Steps

1. ✅ Application deployed!
2. Configure domain & SSL
3. Set up monitoring (Prometheus/Grafana)
4. Configure backups (cron jobs)
5. Monitor logs (ELK stack)
6. Set up CI/CD (GitHub Actions)

## Security Notes

- Change all default passwords
- Use environment variables for secrets
- Enable firewall rules
- Use private subnets for databases
- Regular security updates
- Monitor for suspicious activity

---

**Need help?** See [Environment Configuration](./ENVIRONMENT.md) or troubleshooting section above.
