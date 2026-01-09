# Docker Deployment Setup

This application uses Docker Compose for easy deployment with MySQL database.

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Start all services (MySQL, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8081
- Swagger UI: http://localhost:8081/swagger-ui.html

### Environment Variables

For production deployment, create a `.env` file:

```bash
cp .env.example .env
# Edit .env with secure passwords
```

## Services

- **MySQL**: Database server on port 3306
- **Backend**: Spring Boot API on port 8081
- **Frontend**: React app served via nginx on port 3000

## Production Deployment

### Using Managed Database (AWS RDS, Google Cloud SQL, etc.)

Update environment variables in your deployment:

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/project_db
SPRING_DATASOURCE_USERNAME=your-username
SPRING_DATASOURCE_PASSWORD=your-secure-password
```

### Security Notes

⚠️ **IMPORTANT**: Change these before deploying to production:
- MySQL root password
- JWT secret key
- Database credentials

## Troubleshooting

**Backend fails to connect to database:**
- Ensure MySQL container is healthy: `docker-compose ps`
- Check MySQL logs: `docker-compose logs mysql`
- Verify network connectivity: `docker-compose exec backend ping mysql`

**Frontend can't reach backend:**
- Check backend is running: `docker-compose logs backend`
- Verify nginx configuration is correct
- Check browser console for CORS errors
