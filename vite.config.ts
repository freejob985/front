import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Vite Configuration for the Application
 * 
 * This file contains all Vite settings including:
 * - Local server settings
 * - Proxy settings for request forwarding
 * - Build and optimization settings
 */
export default defineConfig(({ mode }) => {
  // Load environment variables from .env file
  const env = loadEnv(mode, process.cwd(), '')

  // Set API target from environment variables
  const apiTarget = env.VITE_API_TARGET || 'https://adminxd.eliteonegrocery.com'
  
  // Set admin target from environment variables
  const adminTarget = env.VITE_ADMIN_TARGET || 'https://adminxd.eliteonegrocery.com'

  // Debug logs - show configuration settings
  console.log('🔧 Vite Config - API Target:', apiTarget)
  console.log('🔧 Vite Config - Admin Target:', adminTarget)
  console.log('🔧 Vite Config - VITE_API_URL:', env.VITE_API_URL)
  console.log('🔧 Vite Config - VITE_API_MODE:', env.VITE_API_MODE)
  console.log('🔧 Vite Config - All env vars:', env)

  return {
  plugins: [
    react({
      include: "**/*.{jsx,tsx}",
      fastRefresh: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Local server settings
    port: 5174,                    // Port the server runs on
    host: 'localhost',             // Server address
    strictPort: true,              // Force using specified port (don't try other ports)
    
    // Hot Module Replacement (HMR) settings
    hmr: {
      port: 5175                   // Separate port for HMR
    },
    
    // Proxy settings for request forwarding
    proxy: {
      // Forward API requests
      '/api': {
        target: apiTarget,         // Target: real API server
        changeOrigin: true,        // Change Origin header to avoid CORS issues
        secure: true,              // Use HTTPS
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Rewrite path
        configure: (proxy, options) => {
          // Proxy error handler
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
          // Log outgoing requests
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url, '→', apiTarget);
          });
          // Log incoming responses
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url, '←', apiTarget);
          });
        },
      },
      
      // Forward admin requests
      '/admin': {
        target: adminTarget,       // Target: real admin server
        changeOrigin: true,        // Change Origin header to avoid CORS issues
        secure: true,              // Use HTTPS
        rewrite: (path) => path.replace(/^\/admin/, '/admin'), // Rewrite path
        configure: (proxy, options) => {
          // Admin proxy error handler
          proxy.on('error', (err, req, res) => {
            console.error('Admin proxy error:', err);
          });
          // Log outgoing admin requests
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Admin Request to the Target:', req.method, req.url, '→', adminTarget);
          });
          // Log incoming admin responses
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Admin Response from the Target:', proxyRes.statusCode, req.url, '←', adminTarget);
          });
        },
      }
    }
  },
  // Environment variables are loaded automatically from .env files
  // No need to define them manually in define section
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query']
        }
      }
    }
  }
  }
})