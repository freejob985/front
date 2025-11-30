# CORS Issue Fix Documentation

## Problem
The frontend application was encountering CORS (Cross-Origin Resource Sharing) errors when trying to communicate with the backend API. The errors occurred because:

1. The frontend was running on `http://localhost:5174`
2. API requests were being made to `http://engeb.com`
3. The backend server wasn't configured to allow requests from the localhost origin

## Solution Implemented

### 1. Environment Configuration (.env)
Updated the [.env](file:///d:/server/htdocs/Domain_project/engeb/Front/.env) file to properly configure development environment variables:
- Set correct localhost URLs for frontend and API
- Updated port to match the actual server port (5174)

### 2. Vite Configuration (vite.config.ts)
Added proxy settings to handle API requests:
- Configured proxy for `/api` routes to forward requests to the backend
- Configured proxy for `/admin` routes
- Set `changeOrigin: true` to handle CORS properly
- Set `secure: false` for development

### 3. API Configuration (src/config/api.ts)
Updated to properly differentiate between development and production environments:
- Use localhost URLs in development
- Use production URLs in production
- Dynamic URL construction based on environment

### 4. Security Configuration (src/config/security.ts)
Updated CORS settings:
- Added localhost origins to allowed origins in development
- Properly configured CORS credentials and mode

### 5. API Library (src/lib/api.ts)
Updated API base URL handling:
- Use environment-specific URLs
- Proper request configuration for development

## How to Test the Fix

1. Restart the development server:
   ```bash
   npm run dev
   ```

2. The application should now be able to make API requests without CORS errors

3. Verify that the frontend can:
   - Load categories
   - Load featured products
   - Load offers
   - Access user authentication endpoints
   - Access cart endpoints

## Additional Notes

- The proxy configuration in Vite handles the CORS issue by forwarding API requests through the development server
- In production, the frontend and backend should be properly configured to handle CORS headers
- If you need to test with a local backend server, update the proxy target to point to your local backend (e.g., http://localhost:8000)