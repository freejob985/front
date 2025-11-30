# حل مشكلة CORS للإنتاج - Engeb

## المشكلة الحالية
التطبيق يعمل على `https://eliteonegrocery.com` (الإنتاج) ويحاول الوصول إلى `http://localhost:5174/api/v1` (الـ proxy المحلي) مما يسبب أخطاء CORS.

## الحلول المتاحة

### الحل الأول: تغيير VITE_API_MODE للإنتاج

#### 1. إنشاء ملف .env للإنتاج
```env
# Production Environment Variables
VITE_APP_NAME="Engeb"
VITE_APP_URL=https://eliteonegrocery.com

# Backend API Settings
VITE_API_BASE_URL=https://adminxd.eliteonegrocery.com
VITE_API_PREFIX=/api/v1
VITE_API_URL=https://adminxd.eliteonegrocery.com/api/v1

# Admin Panel Settings
VITE_ADMIN_URL=https://adminxd.eliteonegrocery.com/admin

# API Mode Control - CRITICAL
VITE_API_MODE=direct

# Development Settings
VITE_DEBUG=false
VITE_APP_ENV=production
```

#### 2. إعادة بناء التطبيق
```bash
npm run build
```

### الحل الثاني: إعداد CORS على الخادم الخلفي

#### 1. إضافة رؤوس CORS على الخادم
يجب على فريق Backend إضافة الرؤوس التالية:

```php
// في Laravel (app/Http/Middleware/Cors.php)
public function handle($request, Closure $next)
{
    return $next($request)
        ->header('Access-Control-Allow-Origin', 'https://eliteonegrocery.com')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
        ->header('Access-Control-Allow-Credentials', 'true');
}
```

#### 2. تسجيل الـ Middleware
```php
// في app/Http/Kernel.php
protected $middleware = [
    // ...
    \App\Http\Middleware\Cors::class,
];
```

### الحل الثالث: استخدام Proxy Server

#### 1. إعداد Nginx Proxy
```nginx
server {
    listen 443 ssl;
    server_name eliteonegrocery.com;
    
    location /api/ {
        proxy_pass https://adminxd.eliteonegrocery.com/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://eliteonegrocery.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://eliteonegrocery.com' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
```

## التوصية

**الحل الأول** هو الأسرع والأسهل:
1. إنشاء ملف `.env` مع `VITE_API_MODE=direct`
2. إعادة بناء التطبيق
3. رفع الملفات الجديدة

## التحقق من الحل

بعد تطبيق الحل، يجب أن ترى في الكونسول:
```
🔍 Environment VITE_API_URL: https://adminxd.eliteonegrocery.com/api/v1
🔍 Environment VITE_API_MODE: direct
🔍 Is Development: false
🔍 Is Localhost: false
🔍 Current Hostname: eliteonegrocery.com
✅ Using direct API URL: https://adminxd.eliteonegrocery.com/api/v1
```

## ملاحظات مهمة

1. **في التطوير**: استخدم `VITE_API_MODE=proxy` مع localhost
2. **في الإنتاج**: استخدم `VITE_API_MODE=direct` مع URL مباشر
3. **تأكد من CORS**: الخادم الخلفي يجب أن يدعم `https://eliteonegrocery.com`
4. **إعادة البناء**: بعد تغيير متغيرات البيئة، يجب إعادة بناء التطبيق
