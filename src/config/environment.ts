// Environment configuration
export const ENV_CONFIG = {
  // API Configuration - Use VITE_API_URL or construct from VITE_API_BASE_URL + VITE_API_PREFIX
  get API_URL() {
    return import.meta.env.VITE_API_URL || 
           `${import.meta.env.VITE_API_BASE_URL || 'https://adminxd.eliteonegrocery.com'}${import.meta.env.VITE_API_PREFIX || '/api/v1'}`;
  },
  API_MODE: import.meta.env.VITE_API_MODE || 'proxy',
  
  // Development Settings
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // Environment Detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isLocalhost: window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' || 
               window.location.hostname === '0.0.0.0',
  
  // API URLs for different environments (reference values, use VITE_API_URL for actual configuration)
  API_URLS: {
    development: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    staging: 'https://staging-api.eliteonegrocery.com/api/v1',
    production: 'https://adminxd.eliteonegrocery.com/api/v1'
  }
};

// Get the appropriate API URL based on environment
export const getApiUrl = (): string => {
  if (ENV_CONFIG.isLocalhost) {
    return ENV_CONFIG.API_URLS.development;
  }
  
  if (ENV_CONFIG.isProduction) {
    return ENV_CONFIG.API_URLS.production;
  }
  
  return ENV_CONFIG.API_URL || ENV_CONFIG.API_URLS.development;
};

// Log configuration for debugging
if (ENV_CONFIG.DEBUG) {
  console.log('🔧 Environment Configuration:', {
    API_URL: ENV_CONFIG.API_URL,
    API_MODE: ENV_CONFIG.API_MODE,
    DEBUG: ENV_CONFIG.DEBUG,
    LOG_LEVEL: ENV_CONFIG.LOG_LEVEL,
    isDevelopment: ENV_CONFIG.isDevelopment,
    isProduction: ENV_CONFIG.isProduction,
    isLocalhost: ENV_CONFIG.isLocalhost
  });
}
