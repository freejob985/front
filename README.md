# Frontend Configuration

## Environment Configuration

تم إنشاء ملف `src/config/api.ts` يحتوي على إعدادات API والروابط:

### API Configuration
- **Base URL**: `http://localhost:8000`
- **API Prefix**: `api/v1`
- **Admin URL**: `http://localhost:8000/admin`

### Frontend Routes
- **Categories**: `/categories`
- **Products**: `/products`
- **Cart**: `/cart`
- **Profile**: `/profile`

### API Endpoints
- **Categories**: `/api/v1/categories`
- **Subcategories**: `/api/v1/subcategories`
- **Products**: `/api/v1/products`
- **Governorates**: `/api/v1/governorates`
- **Cities**: `/api/v1/cities`
- **Vendors**: `/api/v1/vendors`

## Footer Component

تم إنشاء مكون `Footer` منفصل يحتوي على:

### الأقسام الرئيسية
- جميع الأقسام
- البقالة
- المنتجات الطازجة
- اللحوم والدواجن
- الألبان والأجبان

### أقسام السوبر ماركت
- السوبر ماركت
- مستلزمات المنزل
- العناية الشخصية
- مستلزمات الأطفال
- مواد التنظيف

### الروابط السريعة
- الرئيسية
- من نحن
- اتصل بنا
- التوصيل
- العروض
- المنتجات الطازجة

## Usage

```typescript
import { API_CONFIG, getApiUrl, getAdminUrl, getFrontendUrl } from './config/api';

// Get API URL
const categoriesUrl = getApiUrl('/api/v1/categories');

// Get Admin URL
const adminUrl = getAdminUrl('/categories');

// Get Frontend URL
const frontendUrl = getFrontendUrl('/categories');
```

## Environment Variables

تم إنشاء ملف `.env` في مجلد `Front` مع جميع الإعدادات المطلوبة:

### ملف .env
```env
# Frontend Environment Configuration
VITE_APP_NAME="Engeb"
VITE_APP_URL=http://localhost:5173

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PREFIX=api/v1
VITE_API_URL=http://localhost:8000/api/v1

# Admin Panel Configuration
VITE_ADMIN_URL=http://localhost:8000/admin
VITE_ADMIN_PREFIX=admin

# Frontend Routes
VITE_CATEGORIES_URL=http://localhost:5173/categories
VITE_PRODUCTS_URL=http://localhost:5173/products
VITE_CART_URL=http://localhost:5173/cart
VITE_PROFILE_URL=http://localhost:5173/profile

# API Endpoints
VITE_API_CATEGORIES_ENDPOINT=/api/v1/categories
VITE_API_SUBCATEGORIES_ENDPOINT=/api/v1/subcategories
VITE_API_PRODUCTS_ENDPOINT=/api/v1/products
VITE_API_GOVERNORATES_ENDPOINT=/api/v1/governorates
VITE_API_CITIES_ENDPOINT=/api/v1/cities
VITE_API_VENDORS_ENDPOINT=/api/v1/vendors

# Development Configuration
VITE_APP_ENV=development
VITE_DEBUG=true
```

### ملف .env.example
تم إنشاء ملف `.env.example` كقالب يمكن نسخه وتخصيصه.
