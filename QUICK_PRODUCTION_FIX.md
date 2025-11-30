# إصلاح سريع لمشكلة CORS في الإنتاج

## المشكلة
التطبيق يعمل على `https://eliteonegrocery.com` ويحاول الوصول إلى `http://localhost:5174/api/v1` مما يسبب أخطاء CORS.

## الحل السريع

### 1. إنشاء ملف .env في المجلد الجذر
```env
VITE_API_MODE=direct
VITE_API_URL=https://adminxd.eliteonegrocery.com/api/v1
VITE_APP_NAME="Engeb"
VITE_DEBUG=false
```

### 2. إعادة بناء التطبيق
```bash
npm run build
```

### 3. رفع الملفات الجديدة
ارفع مجلد `dist` الجديد إلى الخادم.

## التحقق من الحل
بعد التطبيق، يجب أن ترى في الكونسول:
```
✅ Using direct API URL: https://adminxd.eliteonegrocery.com/api/v1
```

## ملاحظة مهمة
هذا الحل يتطلب أن يكون الخادم الخلفي (`https://adminxd.eliteonegrocery.com`) مُعد لدعم CORS من `https://eliteonegrocery.com`.

إذا استمرت المشكلة، يجب على فريق Backend إضافة رؤوس CORS المناسبة.
