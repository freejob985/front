# دليل إعداد متغيرات البيئة

## المشكلة
يظهر خطأ في الاتصال بـ API عند محاولة جلب بيانات صفحة "من نحن":
```
Failed to load resource: net::ERR_FAILED
The FetchEvent for "http://localhost:8000/api/v1/about" resulted in a network error
```

## الحل

### 1. إنشاء ملف .env.local
قم بإنشاء ملف `.env.local` في مجلد `Front/` مع المحتوى التالي:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PREFIX=/api/v1
VITE_ADMIN_URL=http://localhost:8000/admin
VITE_APP_URL=http://localhost:5174
VITE_APP_NAME=Engeb
```

### 2. التأكد من تشغيل الخادم
تأكد من أن خادم Laravel يعمل على المنفذ 8000:
```bash
php artisan serve
```

### 3. إعادة تشغيل خادم التطوير
بعد إنشاء ملف `.env.local`، أعد تشغيل خادم Vite:
```bash
npm run dev
```

## متغيرات البيئة المتاحة

| المتغير | الوصف | القيمة الافتراضية |
|---------|--------|------------------|
| `VITE_API_URL` | رابط API الرئيسي | `http://localhost:8000/api/v1` |
| `VITE_API_BASE_URL` | رابط الخادم الأساسي | `http://localhost:8000` |
| `VITE_API_PREFIX` | بادئة API | `/api/v1` |
| `VITE_ADMIN_URL` | رابط لوحة التحكم | `http://localhost:8000/admin` |
| `VITE_APP_URL` | رابط التطبيق | `http://localhost:5174` |
| `VITE_APP_NAME` | اسم التطبيق | `Engeb` |

## استكشاف الأخطاء

### 1. تحقق من تشغيل الخادم
```bash
# تحقق من أن Laravel يعمل
curl http://localhost:8000/api/v1/about

# أو افتح الرابط في المتصفح
http://localhost:8000/api/v1/about
```

### 2. تحقق من ملف .env.local
تأكد من أن الملف موجود في `Front/.env.local` وأن المحتوى صحيح.

### 3. تحقق من console
افتح Developer Tools في المتصفح وتحقق من رسائل console للخطأ.

### 4. إعادة تشغيل الخوادم
```bash
# إيقاف جميع الخوادم
# ثم إعادة تشغيل Laravel
php artisan serve

# ثم إعادة تشغيل Vite
npm run dev
```

## ملاحظات مهمة

1. **ملف .env.local** له أولوية أعلى من `.env`
2. **متغيرات VITE_** فقط متاحة في الفرونت
3. **إعادة تشغيل Vite** مطلوبة بعد تغيير متغيرات البيئة
4. **CORS** يجب أن يكون مُعد بشكل صحيح في Laravel

## إعداد CORS (إذا لزم الأمر)

في ملف `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5174'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,
```
