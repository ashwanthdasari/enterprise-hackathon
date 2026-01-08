/**
 * Environment Configuration
 * Centralized configuration for environment variables
 */

export const env = {
  api: {
    baseUrl: '/api', // Force using proxy to avoid localhost:8000 issues
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  },
  auth: {
    tokenKey: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'app_auth_token',
    refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'app_refresh_token',
    tokenExpiryBuffer: Number(import.meta.env.VITE_TOKEN_EXPIRY_BUFFER) || 300000,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Enterprise Platform',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  features: {
    enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  },
} as const;
