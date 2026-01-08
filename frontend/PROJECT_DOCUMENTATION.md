# Enterprise Platform - Full-Stack Frontend Application

## Overview

This is a production-ready enterprise frontend application built with React, TypeScript, Redux Toolkit, and Material UI. It demonstrates advanced patterns for building scalable, maintainable, and performant web applications.

## Features

### 1. Authentication & Authorization
- ✅ JWT token-based authentication
- ✅ Secure token storage and management
- ✅ Automatic token refresh on expiry
- ✅ Four role-based user types: Admin, Manager, Reviewer, Viewer
- ✅ Role-based menu rendering and page access
- ✅ Protected routes with permission checks

### 2. Dashboard System
- ✅ Role-specific dashboards
- ✅ Dynamic widget loading
- ✅ KPI cards with trend indicators
- ✅ Multiple chart types (Line, Bar, Area)
- ✅ Real-time data visualization using Recharts

### 3. Workflow Management Module
- ✅ Complete CRUD operations
- ✅ Server-side pagination (handles 10,000+ records)
- ✅ Advanced sorting and filtering
- ✅ Virtualized tables for performance
- ✅ Multi-step workflow states: Draft → Submit → Review → Approve → Reject → Reopen
- ✅ Role-based action buttons
- ✅ Workflow history tracking
- ✅ Status-driven UI behavior

### 4. State Management
- ✅ Redux Toolkit for global state
- ✅ RTK Query for API data fetching and caching
- ✅ Normalized state structure
- ✅ Optimistic UI updates
- ✅ Error rollback mechanisms
- ✅ Local state for UI-specific data

### 5. Forms & Validation
- ✅ React Hook Form for performant forms
- ✅ Zod schema validation
- ✅ Field-level error handling
- ✅ Type-safe form data

### 6. Performance Optimizations
- ✅ Code splitting with React.lazy
- ✅ Route-based lazy loading
- ✅ Virtualized lists for large datasets
- ✅ Memoized selectors and components
- ✅ Optimized re-renders

### 7. UI/UX Features
- ✅ Material UI components
- ✅ Light/Dark theme toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Persistent sidebar navigation
- ✅ Notification system (Snackbar alerts)
- ✅ Loading states and skeletons
- ✅ Error boundaries for graceful error handling

### 8. Error Handling
- ✅ Global error boundary
- ✅ API error handling
- ✅ Network failure detection
- ✅ User-friendly error messages
- ✅ Retry mechanisms

### 9. Accessibility
- ✅ Keyboard navigation support
- ✅ ARIA labels and roles
- ✅ Screen reader compatible
- ✅ Focus management
- ✅ High contrast mode support

### 10. Code Quality
- ✅ TypeScript strict mode
- ✅ ESLint configuration
- ✅ Prettier code formatting
- ✅ Clean code architecture
- ✅ Meaningful naming conventions
- ✅ Comprehensive type definitions

## Tech Stack

### Core
- React 19.2.0
- TypeScript 5.9.3 (strict mode)
- Vite 7.2.4

### State Management
- Redux Toolkit 2.11.2
- RTK Query
- React Redux 9.2.0

### UI Framework
- Material UI 7.3.6
- Emotion (for styling)
- Material Icons

### Routing
- React Router DOM 7.11.0

### Forms & Validation
- React Hook Form 7.70.0
- Zod 4.3.5

### Data Visualization
- Recharts 3.6.0

### Performance
- @tanstack/react-virtual 3.13.17

### Code Quality
- ESLint 9.39.1
- Prettier 3.7.4
- TypeScript ESLint 8.46.4

## Project Structure

```
enterprise-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (ErrorBoundary, VirtualizedTable)
│   │   ├── layout/          # Layout components (AppBar, Sidebar, MainLayout)
│   │   ├── routing/         # Routing components (ProtectedRoute)
│   │   └── widgets/         # Dashboard widgets (KPICard, ChartWidget)
│   ├── features/            # Feature-based modules
│   │   ├── auth/            # Authentication (Login)
│   │   ├── dashboard/       # Dashboard page
│   │   └── workflows/       # Workflow management
│   ├── store/               # Redux store configuration
│   │   ├── api/             # RTK Query API slices
│   │   ├── slices/          # Redux slices (auth, ui)
│   │   ├── hooks.ts         # Typed Redux hooks
│   │   └── store.ts         # Store configuration
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── common.types.ts
│   │   ├── dashboard.types.ts
│   │   └── workflow.types.ts
│   ├── utils/               # Utility functions
│   │   ├── mockApi.ts       # Mock API for development
│   │   ├── rolePermissions.ts
│   │   └── validation.ts
│   ├── theme/               # MUI theme configuration
│   │   ├── theme.ts
│   │   └── ThemeProvider.tsx
│   ├── config/              # Application configuration
│   │   └── env.ts
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── .prettierrc              # Prettier configuration
├── eslint.config.js         # ESLint configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Project dependencies
```

## Getting Started

### Installation

```bash
cd enterprise-app
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Demo Credentials

The application is configured with mock API for demonstration:

- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **Reviewer**: reviewer@example.com / reviewer123
- **Viewer**: viewer@example.com / viewer123

### Build for Production

```bash
npm run build
```

### Linting & Formatting

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

## Key Design Patterns

### 1. Feature-Based Architecture
Each feature (auth, dashboard, workflows) is self-contained with its own components, logic, and types.

### 2. Normalized State
Redux state is normalized for optimal performance and easier updates.

### 3. API Layer Abstraction
RTK Query provides automatic caching, invalidation, and optimistic updates.

### 4. Permission-Based Rendering
UI elements and routes are conditionally rendered based on user role and permissions.

### 5. Error Boundaries
Global and feature-level error boundaries prevent app crashes.

### 6. Code Splitting
Routes are lazy-loaded to reduce initial bundle size.

## Role Permissions Matrix

| Permission | Admin | Manager | Reviewer | Viewer |
|-----------|-------|---------|----------|--------|
| View Dashboard | ✓ | ✓ | ✓ | ✓ |
| View Workflows | ✓ | ✓ | ✓ | ✓ |
| Create Workflows | ✓ | ✓ | ✓ | ✗ |
| Edit Workflows | ✓ | ✓ | ✓ | ✗ |
| Delete Workflows | ✓ | ✗ | ✗ | ✗ |
| Approve Workflows | ✓ | ✓ | ✗ | ✗ |
| Reject Workflows | ✓ | ✓ | ✗ | ✗ |
| View Users | ✓ | ✓ | ✗ | ✗ |
| Manage Users | ✓ | ✗ | ✗ | ✗ |
| View Reports | ✓ | ✓ | ✗ | ✗ |
| Manage Settings | ✓ | ✗ | ✗ | ✗ |

## Workflow State Machine

```
DRAFT → SUBMITTED → IN_REVIEW → APPROVED → COMPLETED
                              ↓
                           REJECTED → REOPENED
                              ↓
                          CANCELLED
```

## Performance Considerations

1. **Virtualized Tables**: Only renders visible rows from datasets with 10,000+ items
2. **Lazy Loading**: Routes are split into separate bundles
3. **Memoization**: Expensive calculations are cached
4. **Optimized Re-renders**: Components only re-render when necessary
5. **Code Splitting**: Reduces initial load time

## Environment Variables

All configuration is environment-based. See `.env.example` for available options:

- `VITE_API_BASE_URL`: Backend API URL
- `VITE_ENABLE_MOCK_API`: Toggle mock API mode
- `VITE_ENABLE_DEBUG`: Enable debug logging

## Future Enhancements

- [ ] User Management CRUD interface
- [ ] Advanced reporting dashboard
- [ ] Real-time notifications (WebSocket)
- [ ] File upload functionality
- [ ] Audit log viewer
- [ ] Settings page
- [ ] Multi-language support (i18n)
- [ ] Unit and integration tests
- [ ] E2E tests with Playwright
- [ ] PWA support
- [ ] Offline mode

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

Built as a comprehensive enterprise frontend application demonstrating best practices and production-ready patterns.
