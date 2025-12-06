/**
 * Security and Configuration Settings
 * 
 * This file contains all settings related to security and connection
 * with external API servers
 */

// Determine if the application is in development mode
const isDevelopment = import.meta.env.DEV;

/**
 * Determine API URL based on environment variables
 * 
 * This function determines the correct API URL based on:
 * 1. VITE_API_URL variable (primary source)
 * 2. VITE_API_MODE variable (proxy or direct)
 * 3. Application environment (development or production)
 * 
 * @returns {string} Correct API URL
 */
let cachedApiUrl: string | null = null;
const getApiUrl = () => {
  // Return cached value if available
  if (cachedApiUrl !== null) {
    return cachedApiUrl;
  }
  
  // Read API URL from environment variables (ALWAYS prioritize VITE_API_URL)
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api/v1';
  
  // Read API mode from environment variables (default: 'proxy')
  const apiMode = import.meta.env.VITE_API_MODE || 'proxy';
  
  // Check if we're running on localhost (development)
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0'
  );
  
  // Debug logs (only once)
  console.log('🔍 Security Config - VITE_API_URL:', apiUrl);
  console.log('🔍 Security Config - VITE_API_BASE_URL:', apiBaseUrl);
  console.log('🔍 Security Config - VITE_API_PREFIX:', apiPrefix);
  console.log('🔍 Security Config - VITE_API_MODE:', apiMode);
  console.log('🔍 Security Config - Is Development:', import.meta.env.DEV);
  console.log('🔍 Security Config - Is Localhost:', isLocalhost);
  console.log('🔍 Security Config - Current Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');
  
  // If VITE_API_URL is explicitly set, ALWAYS use it (highest priority)
  if (apiUrl) {
    // Check if we should use proxy path in production (if API mode is 'proxy' and we're in production)
    // This allows using a relative path like '/api/v1' which can be proxied by a reverse proxy
    if (apiMode === 'proxy' && !isLocalhost && typeof window !== 'undefined') {
      // In production with proxy mode, use relative path if API URL is absolute
      // This assumes a reverse proxy is configured on the server
      const urlObj = new URL(apiUrl);
      const relativePath = urlObj.pathname;
      console.log('✅ Security Config - Using proxy path in production:', relativePath);
      cachedApiUrl = relativePath;
      return cachedApiUrl;
    }
    console.log('✅ Security Config - Using VITE_API_URL from environment:', apiUrl);
    cachedApiUrl = apiUrl;
    return cachedApiUrl;
  }
  
  // If VITE_API_BASE_URL is set, construct the full URL
  if (apiBaseUrl) {
    const fullUrl = `${apiBaseUrl}${apiPrefix}`;
    // Check if we should use proxy path
    if (apiMode === 'proxy' && !isLocalhost && typeof window !== 'undefined') {
      console.log('✅ Security Config - Using proxy path from VITE_API_BASE_URL:', apiPrefix);
      cachedApiUrl = apiPrefix;
      return cachedApiUrl;
    }
    console.log('✅ Security Config - Constructed from VITE_API_BASE_URL:', fullUrl);
    cachedApiUrl = fullUrl;
    return cachedApiUrl;
  }
  
  // Fallback to default production URL if no environment variables are set
  const fallbackUrl = 'https://adminxd.eliteonegrocery.com/api/v1';
  console.log('⚠️ Security Config - No environment variables set, using fallback:', fallbackUrl);
  console.warn('⚠️ WARNING: Using fallback API URL. Please set VITE_API_URL in your .env file.');
  cachedApiUrl = fallbackUrl;
  return cachedApiUrl;
};

// Get base URL from API URL
const getBaseUrl = () => {
  const apiUrl = getApiUrl();
  // Extract base URL from API URL (remove /api/v1)
  return apiUrl.replace('/api/v1', '');
};

// Get admin URL from base URL
const getAdminUrl = () => {
  return `${getBaseUrl()}/admin`;
};

// Environment-specific API URLs - now derived from VITE_API_URL
const API_URLS = {
  get base() {
    return getBaseUrl();
  },
  get admin() {
    return getAdminUrl();
  },
  get api() {
    return getApiUrl();
  }
};

// Get current environment URLs - memoized to avoid repeated calculations
let cachedUrls: typeof API_URLS | null = null;
const getCurrentEnvUrls = () => {
  if (!cachedUrls) {
    cachedUrls = API_URLS;
  }
  return cachedUrls;
};

export const SECURITY_CONFIG = {
  // API Security
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'), // 30 seconds
  MAX_RETRIES: parseInt(import.meta.env.VITE_MAX_RETRIES || '3'),
  RATE_LIMIT_DELAY: 1000, // 1 second between requests
  
  // CORS Settings
  CORS_CREDENTIALS: 'include',
  CORS_MODE: 'cors' as RequestMode,
  
  // Content Security
  ALLOWED_ORIGINS: [
    // Production URLs
    'http://engeb.com',
    'https://engeb.com',
    'https://www.engeb.com',
    'http://admin.engeb.com',
    'https://admin.engeb.com',
    'http://api.engeb.com',
    'https://api.engeb.com',
    // Development URLs
    'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:8000',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8000'
  ],
  
  // Development vs Production
  IS_DEVELOPMENT: isDevelopment,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.PROD,
};

// Secure API Configuration with environment-specific URLs
export const SECURE_API_CONFIG = {
  get BASE_URL() {
    return getCurrentEnvUrls().base;
  },
  get API_URL() {
    return getCurrentEnvUrls().api;
  },
  get ADMIN_URL() {
    return getCurrentEnvUrls().admin;
  },
  API_PREFIX: '/api/v1',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  MAX_RETRIES: parseInt(import.meta.env.VITE_MAX_RETRIES || '3'),
  
  // Headers for security
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
  
  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  }
};

// Environment-specific settings with dynamic URLs
export const getEnvironmentConfig = () => {
  const urls = getCurrentEnvUrls();
  
  return {
    isDevelopment,
    isProduction: import.meta.env.PROD,
    apiUrl: urls.api,
    adminUrl: urls.admin,
    frontendUrl: urls.base,
    enableDebug: isDevelopment,
    enableAnalytics: import.meta.env.PROD,
  };
};