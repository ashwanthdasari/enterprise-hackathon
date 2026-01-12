# Enterprise Workflow Management Platform

A full-stack enterprise workflow management system built for efficient business process automation with role-based access control, real-time analytics, and comprehensive audit trails.

🌐 **Live Demo**: [http://3.150.62.32:3000](http://3.150.62.32:3000)  
📂 **Repository**: [https://github.com/ashwanthdasari/enterprise-hackathon](https://github.com/ashwanthdasari/enterprise-hackathon.git)

---

## 🎯 Project Overview

This platform enables organizations to digitize and automate their approval workflows with multi-level review processes, role-based permissions, and comprehensive reporting capabilities.

### Key Capabilities
- **Workflow Automation**: Create, submit, review, approve/reject workflows
- **Role-Based Access Control**: Admin, Manager, Reviewer, and Viewer roles with granular permissions
- **Real-Time Dashboard**: KPIs, analytics, and workflow tracking
- **Audit Trails**: Complete workflow history and user activity logging
- **Power BI Integration**: Analytics-ready data exports for business intelligence

---

## ✨ Features

### User Management
- Role-based authentication (Admin, Manager, Reviewer, Viewer)
- User creation, editing, and activation/deactivation
- Department-based organization

### Workflow Management
- Create workflows with title, description, priority, and category
- Multi-stage approval process (Draft → Submitted → In Review → Approved/Rejected)
- Workflow assignment and reassignment
- Priority levels (Low, Medium, High, Urgent)
- Category-based classification (Finance, HR, IT, Operations)

### Dashboard & Analytics
- Real-time KPIs and metrics
- Workflow status distribution
- Department-wise analytics
- Trend analysis and reporting

### Settings & Configuration
- User profile management
- Password change functionality
- Theme customization (Light/Dark mode)
- Notification preferences

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **API Integration**: RTK Query
- **Build Tool**: Vite
- **Routing**: React Router v6

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Database**: MySQL 8.0
- **ORM**: Hibernate/JPA
- **Security**: JWT Authentication
- **API Documentation**: Swagger/OpenAPI

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (for frontend)
- **Database**: MySQL 8.0 in Docker
- **CI/CD**: GitHub + Docker deployment

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Node.js 20+ (for local development)
- Java 21 (for local development)
- MySQL 8+ (for local development)

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/ashwanthdasari/enterprise-hackathon.git
cd enterprise-hackathon

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

### Local Development Setup

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
./mvnw spring-boot:run
# OR
mvn spring-boot:run
```

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Manager | manager@example.com | manager123 |
| Reviewer | reviewer@example.com | reviewer123 |
| Viewer | viewer@example.com | viewer123 |

---

## 📊 Power BI Integration

The platform provides analytics-ready data views for Power BI dashboards:

**Database Connection:**
- Host: `3.150.62.32:3306`
- Database: `project_db`
- Username: `root`
- Password: `rootpassword123`

**Available Views:**
- `fact_workflows` - Main workflow fact table
- `fact_workflow_events` - Workflow history/audit trail
- `dim_users` - User dimension table

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Power BI setup instructions.

---

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│   MySQL DB  │
│  (React)    │      │ (Spring Boot)│      │             │
│  Port: 3000 │      │  Port: 8081 │      │  Port: 3306 │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  Power BI   │
                     │ Dashboards  │
                     └─────────────┘
```

---

## 📁 Project Structure

```
enterprise-hackathon/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Feature-based modules
│   │   ├── store/         # Redux store configuration
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── Dockerfile
│   └── nginx.conf
├── backend/               # Spring Boot backend API
│   ├── src/main/java/
│   │   └── com/company/platform/
│   │       ├── auth/      # Authentication
│   │       ├── users/     # User management
│   │       ├── workflow/  # Workflow engine
│   │       ├── dashboard/ # Analytics
│   │       ├── reports/   # Reports & exports
│   │       └── security/  # Security configuration
│   ├── Dockerfile
│   └── pom.xml
├── docker-compose.yml     # Multi-container setup
├── DEPLOYMENT.md          # Deployment guide
└── README.md             # This file
```

---

## 🔒 Security Features

- JWT-based authentication
- Password encryption (BCrypt)
- Role-based access control (RBAC)
- CORS configuration for production
- SQL injection protection
- XSS prevention

---

## 🐛 Troubleshooting

### Frontend won't connect to backend
- Check CORS configuration in `SecurityConfig.java`
- Verify backend is running on port 8081
- Check browser console for error details

### Database connection failed
- Ensure MySQL is running
- Verify connection details in `application.yml`
- Check Docker MySQL container status: `docker-compose ps`

### Build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Maven cache: `mvn clean install`

---

## 📝 API Documentation

Once the backend is running, access interactive API documentation:
- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8081/v3/api-docs

---

## 🤝 Contributing

This is a hackathon project. For contributions or improvements:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is created for hackathon purposes.

---

## 👨‍💻 Developer

**Ashwanth Dasari**
- GitHub: [@ashwanthdasari](https://github.com/ashwanthdasari)
- Repository: [enterprise-hackathon](https://github.com/ashwanthdasari/enterprise-hackathon)

---

## 🙏 Acknowledgments

- DevOps team for deployment support
- Power BI team for analytics integration
- All hackathon participants

---

**Built with ❤️ for Enterprise Workflow Automation**
