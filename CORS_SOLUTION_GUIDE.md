# دليل حل مشكلة CORS - Engeb Frontend

## المشكلة المحددة
كان التطبيق يحاول الوصول مباشرة إلى `https://adminxd.eliteonegrocery.com` بدلاً من استخدام الـ proxy المحلي، مما يسبب أخطاء CORS.

## الحل المطبق

### 1. إصلاح منطق تحديد API URL
تم تحديث الملفات التالية لضمان استخدام الـ proxy المحلي:

#### `src/lib/api.ts`
- إضافة منطق للتحقق من `VITE_API_MODE` 
- استخدام الـ proxy المحلي (`http://localhost:5174/api/v1`) عندما يكون `VITE_API_MODE=proxy`
- إضافة cache لتجنب إعادة الحساب

#### `src/config/security.ts`
- نفس الإصلاحات المطبقة على `src/lib/api.ts`
- تحسين الأداء بتجنب التكرار في طباعة رسائل التصحيح

### 2. تكوين Vite Proxy
الـ proxy مُعد بشكل صحيح في `vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'https://adminxd.eliteonegrocery.com',
    changeOrigin: true,
    secure: true,
    // ... إعدادات أخرى
  }
}
```

## كيفية التشغيل

### 1. إنشاء ملف .env
أنشئ ملف `.env` في المجلد الجذر مع المحتوى التالي:

```env
# ===========================================
# Environment Variables for Development
# ===========================================

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

# API Mode Control - CRITICAL FOR CORS FIX
VITE_API_MODE=proxy

# Additional Settings
VITE_API_TIMEOUT=30000
VITE_MAX_RETRIES=3
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

### 2. تشغيل التطبيق
```bash
npm run dev
```

## التحقق من الحل

### 1. فحص الكونسول
يجب أن ترى الرسائل التالية في الكونسول:
```
🔍 Environment VITE_API_URL: https://adminxd.eliteonegrocery.com/api/v1
🔍 Environment VITE_API_MODE: proxy
🔍 Is Development: true
✅ Development mode with proxy: Using local proxy
🔍 Final API_BASE: http://localhost:5174/api/v1
```

### 2. فحص طلبات الشبكة
في Developer Tools > Network:
- يجب أن ترى الطلبات تذهب إلى `http://localhost:5174/api/v1/...`
- يجب أن ترى استجابات ناجحة (200 OK) بدلاً من أخطاء CORS

### 3. اختبار الوظائف
- تحميل الصفحة الرئيسية
- عرض المنتجات
- عرض الفئات
- عرض عدد عناصر سلة التسوق

## استكشاف الأخطاء

### إذا استمرت مشكلة CORS:
1. تأكد من أن `VITE_API_MODE=proxy` في ملف `.env`
2. تأكد من أن التطبيق يعمل على `http://localhost:5174`
3. تحقق من أن Vite proxy يعمل بشكل صحيح
4. امسح cache المتصفح وأعد تحميل الصفحة

### إذا لم تعمل الطلبات:
1. تحقق من أن الخادم الخلفي `https://adminxd.eliteonegrocery.com` يعمل
2. تحقق من إعدادات الـ proxy في `vite.config.ts`
3. تحقق من رسائل الخطأ في الكونسول

## الانتقال للإنتاج

عند النشر للإنتاج، قم بتغيير:
```env
VITE_API_MODE=direct
```

هذا سيسمح للتطبيق بالوصول مباشرة إلى API دون الحاجة للـ proxy.

## الملفات المحدثة

1. `src/lib/api.ts` - إصلاح منطق تحديد API URL
2. `src/config/security.ts` - إصلاح منطق تحديد API URL وتحسين الأداء
3. `CORS_SOLUTION_GUIDE.md` - هذا الدليل

## ملاحظات مهمة

- الـ proxy يعمل فقط في وضع التطوير
- في الإنتاج، يجب تكوين CORS على الخادم الخلفي
- تأكد من أن جميع متغيرات البيئة محددة بشكل صحيح
- استخدم `VITE_API_MODE=proxy` لتجنب مشاكل CORS في التطوير
