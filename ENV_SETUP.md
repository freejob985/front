# إعداد متغيرات البيئة (Environment Variables)

## المتغيرات المتاحة

يمكنك تخصيص إعدادات API من خلال متغيرات البيئة التالية:

### متغيرات البيئة الأساسية

```bash
# API Configuration
VITE_API_URL=http://engeb.com/api/v1
VITE_API_BASE_URL=http://engeb.com
VITE_API_PREFIX=/api/v1
VITE_ADMIN_URL=http://engeb.com/admin
VITE_APP_URL=http://engeb.com
VITE_APP_NAME=Engeb
```

### للبيئة المحلية (Local Development)

```bash
# Development URLs
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PREFIX=/api/v1
VITE_ADMIN_URL=http://localhost:8000/admin
VITE_APP_URL=http://localhost:5174
```

## كيفية الاستخدام

### 1. إنشاء ملف .env

قم بإنشاء ملف `.env` في مجلد `Front/` وأضف المتغيرات المطلوبة:

```bash
# Front/.env
VITE_API_URL=http://engeb.com/api/v1
VITE_API_BASE_URL=http://engeb.com
VITE_APP_NAME=Engeb
```

### 2. استخدام المتغيرات في الكود

```javascript
// في ملف api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://engeb.com/api/v1';

// في ملف config/api.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://engeb.com',
  API_PREFIX: import.meta.env.VITE_API_PREFIX || '/api/v1',
  // ...
};
```

### 3. إعادة تشغيل الخادم

بعد إضافة أو تعديل متغيرات البيئة، قم بإعادة تشغيل خادم التطوير:

```bash
npm run dev
# أو
yarn dev
```

## القيم الافتراضية

إذا لم يتم تعريف متغيرات البيئة، سيتم استخدام القيم الافتراضية التالية:

- `VITE_API_URL`: `http://engeb.com/api/v1`
- `VITE_API_BASE_URL`: `http://engeb.com`
- `VITE_API_PREFIX`: `/api/v1`
- `VITE_ADMIN_URL`: `http://engeb.com/admin`
- `VITE_APP_URL`: `http://engeb.com`
- `VITE_APP_NAME`: `Engeb`

## ملاحظات مهمة

1. **يجب أن تبدأ متغيرات Vite بـ `VITE_`** حتى تكون متاحة في الكود
2. **ملف `.env` يجب أن يكون في مجلد `Front/`** (جذر مشروع React)
3. **لا تضع ملف `.env` في Git** - أضفه إلى `.gitignore`
4. **استخدم `.env.example`** لتوثيق المتغيرات المطلوبة

## مثال كامل

```bash
# Front/.env
# Production URLs
VITE_API_URL=http://engeb.com/api/v1
VITE_API_BASE_URL=http://engeb.com
VITE_ADMIN_URL=http://engeb.com/admin
VITE_APP_URL=http://engeb.com
VITE_APP_NAME=Engeb

# Development URLs (uncomment when needed)
# VITE_API_URL=http://localhost:8000/api/v1
# VITE_API_BASE_URL=http://localhost:8000
# VITE_ADMIN_URL=http://localhost:8000/admin
# VITE_APP_URL=http://localhost:5174
```