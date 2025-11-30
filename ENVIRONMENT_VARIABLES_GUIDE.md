# Environment Variables Guide

## Overview

This guide explains how to use environment variables in the Engeb application. Environment variables allow you to configure the application for different environments (development, staging, production) without changing the code.

## Quick Start

1. Copy the example file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your values
3. Restart the development server:
   ```bash
   npm run dev
   ```

## Environment Variables Reference

### Basic Application Settings

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_APP_NAME` | Application name displayed in title and logo | `"Engeb"` | Yes |
| `VITE_APP_URL` | Main website URL used in links and references | `https://eliteonegrocery.com` | Yes |

### Backend API Settings

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Base API server URL (without /api/v1) | `https://adminxd.eliteonegrocery.com` | Yes |
| `VITE_API_PREFIX` | API prefix added to requests | `/api/v1` | Yes |
| `VITE_API_URL` | Complete API URL used in requests | `https://adminxd.eliteonegrocery.com/api/v1` | Yes |

### Admin Panel Settings

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_ADMIN_URL` | Admin panel URL for site management | `https://adminxd.eliteonegrocery.com/admin` | Yes |

### Proxy Settings (Request Forwarding)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_TARGET` | Target for API request forwarding | `https://adminxd.eliteonegrocery.com` | Yes |
| `VITE_ADMIN_TARGET` | Target for admin request forwarding | `https://adminxd.eliteonegrocery.com` | Yes |

### Development Settings

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_DEBUG` | Enable debug mode (shows detailed console messages) | `true` | No |
| `VITE_APP_ENV` | Application environment | `development` | No |

### API Mode Control

| Variable | Description | Values | Default |
|----------|-------------|--------|---------|
| `VITE_API_MODE` | Controls how API requests are handled | `proxy` or `direct` | `proxy` |

#### API Mode Values

- **`proxy`** (default for development):
  - Sends requests to `http://localhost:5174/api/v1`
  - Vite proxy forwards them to the real server
  - Avoids CORS issues
  - Best for local development

- **`direct`** (for production and testing):
  - Sends requests directly to `https://adminxd.eliteonegrocery.com/api/v1`
  - Requires CORS setup on the server
  - Best for production and testing

## Configuration Examples

### Development Configuration (Default)

```env
# Basic Application Settings
VITE_APP_NAME="Engeb"
VITE_APP_URL=https://eliteonegrocery.com

# Backend API Settings
VITE_API_BASE_URL=https://adminxd.eliteonegrocery.com
VITE_API_PREFIX=/api/v1
VITE_API_URL=https://adminxd.eliteonegrocery.com/api/v1

# Admin Panel Settings
VITE_ADMIN_URL=https://adminxd.eliteonegrocery.com/admin

# Proxy Settings
VITE_API_TARGET=https://adminxd.eliteonegrocery.com
VITE_ADMIN_TARGET=https://adminxd.eliteonegrocery.com

# Development Settings
VITE_DEBUG=true
VITE_APP_ENV=development

# API Mode Control
VITE_API_MODE=proxy
```

### Production Configuration

```env
# Basic Application Settings
VITE_APP_NAME="Engeb"
VITE_APP_URL=https://eliteonegrocery.com

# Backend API Settings
VITE_API_BASE_URL=https://adminxd.eliteonegrocery.com
VITE_API_PREFIX=/api/v1
VITE_API_URL=https://adminxd.eliteonegrocery.com/api/v1

# Admin Panel Settings
VITE_ADMIN_URL=https://adminxd.eliteonegrocery.com/admin

# Proxy Settings
VITE_API_TARGET=https://adminxd.eliteonegrocery.com
VITE_ADMIN_TARGET=https://adminxd.eliteonegrocery.com

# Production Settings
VITE_DEBUG=false
VITE_APP_ENV=production

# API Mode Control
VITE_API_MODE=direct
```

### Testing Configuration (Direct API)

```env
# Basic Application Settings
VITE_APP_NAME="Engeb"
VITE_APP_URL=https://eliteonegrocery.com

# Backend API Settings
VITE_API_BASE_URL=https://adminxd.eliteonegrocery.com
VITE_API_PREFIX=/api/v1
VITE_API_URL=https://adminxd.eliteonegrocery.com/api/v1

# Admin Panel Settings
VITE_ADMIN_URL=https://adminxd.eliteonegrocery.com/admin

# Proxy Settings
VITE_API_TARGET=https://adminxd.eliteonegrocery.com
VITE_ADMIN_TARGET=https://adminxd.eliteonegrocery.com

# Development Settings
VITE_DEBUG=true
VITE_APP_ENV=development

# API Mode Control - Direct connection for testing
VITE_API_MODE=direct
```

## How to Switch Between Modes

### Switch to Direct Mode (for testing)

1. Edit `.env` file:
   ```env
   VITE_API_MODE=direct
   ```

2. Restart the server:
   ```bash
   npm run dev
   ```

### Switch to Proxy Mode (for development)

1. Edit `.env` file:
   ```env
   VITE_API_MODE=proxy
   ```

2. Restart the server:
   ```bash
   npm run dev
   ```

## Debugging and Logs

When the application starts, you'll see logs like this:

### Proxy Mode:
```
🔧 Vite Config - API Target: https://adminxd.eliteonegrocery.com
🔧 Vite Config - VITE_API_MODE: proxy
🔍 Environment VITE_API_MODE: proxy
✅ Development mode with proxy: Using local proxy
🔍 Final API_BASE: http://localhost:5174/api/v1
```

### Direct Mode:
```
🔧 Vite Config - API Target: https://adminxd.eliteonegrocery.com
🔧 Vite Config - VITE_API_MODE: direct
🔍 Environment VITE_API_MODE: direct
✅ Using direct API URL: https://adminxd.eliteonegrocery.com/api/v1
🔍 Final API_BASE: https://adminxd.eliteonegrocery.com/api/v1
```

## Troubleshooting

### CORS Errors in Direct Mode

**Error:**
```
Access to fetch at 'https://adminxd.eliteonegrocery.com/api/v1/...' from origin 'https://eliteonegrocery.com' has been blocked by CORS policy
```

**Solution:**
1. Ensure CORS is properly configured on the server
2. Or switch to proxy mode: `VITE_API_MODE=proxy`

### Connection Errors in Proxy Mode

**Error:**
```
Request failed: 404 Not Found
```

**Solution:**
1. Ensure the server is running on port 5174
2. Check proxy configuration in `vite.config.ts`
3. Verify `VITE_API_TARGET` is correct

### Environment Variables Not Loading

**Problem:** Variables not being read

**Solution:**
1. Ensure variables start with `VITE_`
2. Restart the development server
3. Check for typos in variable names
4. Ensure `.env` file is in the project root

## Best Practices

1. **For Development**: Use `VITE_API_MODE=proxy` (default)
2. **For Testing**: Use `VITE_API_MODE=direct` to test direct connections
3. **For Production**: Use `VITE_API_MODE=direct` with proper CORS setup
4. **For Team Development**: Use `VITE_API_MODE=proxy` to avoid CORS issues
5. **Never commit sensitive data**: Use `.env.local` for sensitive variables
6. **Document changes**: Update this guide when adding new variables

## File Structure

```
project-root/
├── .env                    # Environment variables (not committed)
├── .env.local             # Local environment variables (not committed)
├── .env.example           # Example environment variables (committed)
├── env.example            # Alternative example file (committed)
└── ENVIRONMENT_VARIABLES_GUIDE.md  # This guide
```

## Security Notes

- Never commit `.env` files to version control
- Use `.env.example` to document required variables
- Use `.env.local` for sensitive local-only variables
- All `VITE_` variables are exposed to the client-side code
- Don't put sensitive data in `VITE_` variables

## Support

If you encounter issues with environment variables:

1. Check this guide first
2. Verify your `.env` file syntax
3. Check the console logs for debug information
4. Ensure all required variables are set
5. Try switching between `proxy` and `direct` modes
