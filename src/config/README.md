# API Configuration

## Overview
This file contains all API configuration and utility functions for the frontend application.

## Exports

### Configuration
- `API_CONFIG` - Main configuration object with all URLs
- `API_ENDPOINTS` - Object containing all API endpoints

### Utility Functions
- `getImageUrl(imagePath)` - Converts image paths to full URLs
- `getProductImageUrl(product)` - Gets product image URL with fallbacks
- `getCategoryImageUrl(category)` - Gets category image URL with fallbacks

## Usage Examples

### Basic Image URL
```typescript
import { getImageUrl } from '@/config/api';

const imageUrl = getImageUrl('storage/products/image.jpg');
// Result: http://localhost:8000/storage/products/image.jpg
```

### Product Image with Fallbacks
```typescript
import { getProductImageUrl } from '@/config/api';

const product = {
  image_url: 'storage/products/1.jpg',
  image: 'products/1.jpg',
  featured_image: null
};

const imageUrl = getProductImageUrl(product);
// Result: http://localhost:8000/storage/products/1.jpg
```

### Category Image
```typescript
import { getCategoryImageUrl } from '@/config/api';

const category = {
  image: 'categories/food.jpg',
  banner_image: 'categories/food-banner.jpg'
};

const imageUrl = getCategoryImageUrl(category);
// Result: http://localhost:8000/categories/food.jpg
```

## Image Path Handling

The `getImageUrl` function handles different types of image paths:

1. **Full URLs** - Returns as-is
   - `https://example.com/image.jpg` → `https://example.com/image.jpg`

2. **Storage paths** - Prepends base URL
   - `storage/products/image.jpg` → `http://localhost:8000/storage/products/image.jpg`
   - `about-pages/hero.jpg` → `http://localhost:8000/storage/about-pages/hero.jpg`

3. **Absolute paths** - Prepends base URL
   - `/images/logo.png` → `http://localhost:8000/images/logo.png`

4. **Relative paths** - Prepends base URL
   - `images/logo.png` → `http://localhost:8000/images/logo.png`

5. **Null/undefined** - Returns placeholder
   - `null` → `/placeholder.svg`

## Environment Variables

The configuration uses these environment variables:

- `VITE_API_URL` - Full API URL (e.g., `http://localhost:8000/api/v1`)
- `VITE_API_BASE_URL` - Base server URL (e.g., `http://localhost:8000`)
- `VITE_API_PREFIX` - API prefix (e.g., `/api/v1`)
- `VITE_ADMIN_URL` - Admin panel URL (e.g., `http://localhost:8000/admin`)
- `VITE_APP_URL` - Frontend app URL (e.g., `http://localhost:5174`)
- `VITE_APP_NAME` - Application name (e.g., `Engeb`)

## API Endpoints

### About Page
- `API_ENDPOINTS.ABOUT.ALL` - All about page content
- `API_ENDPOINTS.ABOUT.HERO` - Hero section
- `API_ENDPOINTS.ABOUT.STORY` - Story section
- `API_ENDPOINTS.ABOUT.VALUES` - Values section
- `API_ENDPOINTS.ABOUT.STATISTICS` - Statistics section
- `API_ENDPOINTS.ABOUT.TEAM` - Team section
- `API_ENDPOINTS.ABOUT.MISSION` - Mission section
- `API_ENDPOINTS.ABOUT.SECTION(section)` - Specific section

### Products
- `API_ENDPOINTS.PRODUCTS.FEATURED` - Featured products
- `API_ENDPOINTS.PRODUCTS.FRESH` - Fresh products
- `API_ENDPOINTS.PRODUCTS.OFFERS` - Products on offer
- `API_ENDPOINTS.PRODUCTS.DETAIL(id)` - Product details

### Categories
- `API_ENDPOINTS.CATEGORIES.ALL` - All categories
- `API_ENDPOINTS.CATEGORIES.DETAIL(id)` - Category details
- `API_ENDPOINTS.CATEGORIES.PRODUCTS(id)` - Category products

### Cart
- `API_ENDPOINTS.CART.ALL` - Cart contents
- `API_ENDPOINTS.CART.COUNT` - Cart item count
- `API_ENDPOINTS.CART.ADD` - Add to cart
- `API_ENDPOINTS.CART.UPDATE(productId)` - Update cart item
- `API_ENDPOINTS.CART.REMOVE(productId)` - Remove from cart
- `API_ENDPOINTS.CART.CLEAR` - Clear cart
