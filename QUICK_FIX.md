# إصلاح سريع لمشكلة API

## المشكلة
خطأ في الاتصال بـ API: `Failed to load resource: net::ERR_FAILED`

## الحل السريع

### 1. إنشاء ملف .env.local
أنشئ ملف `.env.local` في مجلد `Front/` مع هذا المحتوى:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PREFIX=/api/v1
VITE_ADMIN_URL=http://localhost:8000/admin
VITE_APP_URL=http://localhost:5174
VITE_APP_NAME=Engeb
```

### 2. إعادة تشغيل الخوادم
```bash
# إيقاف Vite (Ctrl+C)
# ثم إعادة تشغيل
npm run dev
```

### 3. التحقق من Laravel
تأكد من أن Laravel يعمل:
```bash
php artisan serve
```

## اختبار API
افتح هذا الرابط في المتصفح:
http://localhost:8000/api/v1/about

يجب أن ترى JSON response مع بيانات صفحة "من نحن".
