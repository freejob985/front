# دليل التحكم في وضع API

## نظرة عامة

تم إضافة متغير بيئة جديد `VITE_API_MODE` للتحكم في كيفية تعامل التطبيق مع طلبات API. هذا يوفر مرونة أكبر في التطوير والاختبار.

## متغيرات البيئة

### `VITE_API_MODE`

**القيم المتاحة:**
- `proxy` (افتراضي): استخدام الـ proxy المحلي لتجنب مشاكل CORS
- `direct`: استخدام الاتصال المباشر مع API

## الأوضاع المختلفة

### 1. وضع Proxy (افتراضي للتطوير)

```env
VITE_API_MODE=proxy
```

**كيف يعمل:**
- التطبيق يرسل الطلبات إلى `http://localhost:5174/api/v1`
- Vite proxy يعيد توجيهها إلى `https://adminxd.eliteonegrocery.com/api/v1`
- **لا توجد مشاكل CORS!**

**متى تستخدم:**
- التطوير المحلي
- الاختبار بدون إعداد CORS على الخادم
- تجنب مشاكل CORS

### 2. وضع Direct (للإنتاج)

```env
VITE_API_MODE=direct
```

**كيف يعمل:**
- التطبيق يرسل الطلبات مباشرة إلى `https://adminxd.eliteonegrocery.com/api/v1`
- **يتطلب إعداد CORS على الخادم**

**متى تستخدم:**
- الإنتاج
- الاختبار مع إعداد CORS صحيح
- اختبار الاتصال المباشر

## أمثلة التكوين

### للتطوير مع Proxy (افتراضي)

```env
# Frontend Environment Configuration
VITE_APP_NAME="Engeb"
VITE_APP_URL=https://eliteonegrocery.com

# Backend API Configuration
VITE_API_BASE_URL=https://adminxd.eliteonegrocery.com
VITE_API_PREFIX=/api/v1
VITE_API_URL=https://adminxd.eliteonegrocery.com/api/v1

# API Mode Control
VITE_API_MODE=proxy

# Development Configuration
VITE_DEBUG=true
VITE_APP_ENV=development
```

### للتطوير مع Direct (للاختبار)

```env
# Frontend Environment Configuration
VITE_APP_NAME="Engeb"
VITE_APP_URL=https://eliteonegrocery.com

# Backend API Configuration
VITE_API_BASE_URL=https://adminxd.eliteonegrocery.com
VITE_API_PREFIX=/api/v1
VITE_API_URL=https://adminxd.eliteonegrocery.com/api/v1

# API Mode Control
VITE_API_MODE=direct

# Development Configuration
VITE_DEBUG=true
VITE_APP_ENV=development
```

### للإنتاج

```env
# Frontend Environment Configuration
VITE_APP_NAME="Engeb"
VITE_APP_URL=https://eliteonegrocery.com

# Backend API Configuration
VITE_API_BASE_URL=https://adminxd.eliteonegrocery.com
VITE_API_PREFIX=/api/v1
VITE_API_URL=https://adminxd.eliteonegrocery.com/api/v1

# API Mode Control
VITE_API_MODE=direct

# Production Configuration
VITE_DEBUG=false
VITE_APP_ENV=production
```

## كيفية التبديل بين الأوضاع

### 1. تغيير ملف `.env`

```bash
# للتبديل إلى وضع Direct
VITE_API_MODE=direct

# للتبديل إلى وضع Proxy
VITE_API_MODE=proxy
```

### 2. إعادة تشغيل الخادم

```bash
npm run dev
```

## السجلات والتشخيص

عند تشغيل التطبيق، ستظهر السجلات التالية:

### وضع Proxy:
```
🔍 Environment VITE_API_MODE: proxy
✅ Development mode with proxy: Using local proxy
🔍 Final API_BASE: http://localhost:5174/api/v1
```

### وضع Direct:
```
🔍 Environment VITE_API_MODE: direct
✅ Using direct API URL: https://adminxd.eliteonegrocery.com/api/v1
🔍 Final API_BASE: https://adminxd.eliteonegrocery.com/api/v1
```

## استكشاف الأخطاء

### مشكلة CORS في وضع Direct

**الخطأ:**
```
Access to fetch at 'https://adminxd.eliteonegrocery.com/api/v1/...' from origin 'https://eliteonegrocery.com' has been blocked by CORS policy
```

**الحل:**
1. تأكد من إعداد CORS على الخادم
2. أو استخدم وضع Proxy: `VITE_API_MODE=proxy`

### مشكلة الاتصال في وضع Proxy

**الخطأ:**
```
Request failed: 404 Not Found
```

**الحل:**
1. تأكد من أن الخادم يعمل على المنفذ 5174
2. تأكد من إعداد الـ proxy في `vite.config.ts`

## أفضل الممارسات

1. **للتطوير**: استخدم `VITE_API_MODE=proxy` (افتراضي)
2. **للاختبار**: استخدم `VITE_API_MODE=direct` لاختبار الاتصال المباشر
3. **للإنتاج**: استخدم `VITE_API_MODE=direct` مع إعداد CORS صحيح
4. **للتطوير الجماعي**: استخدم `VITE_API_MODE=proxy` لتجنب مشاكل CORS

## ملاحظات مهمة

- المتغير `VITE_API_MODE` يؤثر فقط على التطوير (`import.meta.env.DEV`)
- في الإنتاج، سيتم استخدام الرابط المباشر دائماً
- تأكد من إعداد CORS على الخادم عند استخدام وضع Direct
- يمكن تغيير الوضع في أي وقت دون تعديل الكود
