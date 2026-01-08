import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
// Force Rebuild 4
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from './theme/ThemeProvider';
import { store } from './store/store';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { NotificationSnackbar } from './components/common/NotificationSnackbar';
import { UserRole } from './types/auth.types';

const Login = lazy(() =>
  import('./features/auth/Login').then((module) => ({ default: module.Login }))
);
const Dashboard = lazy(() =>
  import('./features/dashboard/Dashboard').then((module) => ({ default: module.Dashboard }))
);
const Workflows = lazy(() =>
  import('./features/workflows/Workflows').then((module) => ({ default: module.Workflows }))
);
const UsersPage = lazy(() =>
  import('./features/users/UsersPage').then((module) => ({ default: module.UsersPage }))
);
const ReportsPage = lazy(() =>
  import('./features/reports/ReportsPage').then((module) => ({ default: module.ReportsPage }))
);
const SettingsPage = lazy(() =>
  import('./features/settings/SettingsPage').then((module) => ({ default: module.SettingsPage }))
);

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <NotificationSnackbar />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/workflows"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Workflows />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                      <MainLayout>
                        <UsersPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.REVIEWER]}>
                      <MainLayout>
                        <ReportsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.REVIEWER, UserRole.VIEWER]}>
                      <MainLayout>
                        <SettingsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
