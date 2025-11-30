# دليل إصلاح مشكلة CORS

## المشكلة
كان التطبيق يواجه مشكلة CORS عند محاولة الوصول إلى API الخارجي `https://adminxd.eliteonegrocery.com/api/v1` مباشرة من المتصفح.

## الأخطاء التي تم حلها
1. **CORS Error**: `Access-Control-Allow-Origin` header is missing
2. **TypeError: Failed to fetch**: نتيجة مباشرة لخطأ CORS
3. **Error fetching sliders**: فشل في جلب السلايدر بسبب CORS
4. **Error fetching cart count**: فشل في جلب عدد عناصر السلة بسبب CORS

## الحل المطبق

### 1. إعداد Vite Proxy
تم تحديث `vite.config.ts` لاستخدام proxy لإعادة توجيه الطلبات:

```typescript
server: {
  port: 5174,
  host: 'localhost',
  proxy: {
    '/api': {
      target: 'https://adminxd.eliteonegrocery.com',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
      configure: (proxy, options) => {
        // إضافة logs للتشخيص
        proxy.on('error', (err, req, res) => {
          console.log('proxy error', err);
        });
        proxy.on('proxyReq', (proxyReq, req, res) => {
          console.log('Sending Request to the Target:', req.method, req.url);
        });
        proxy.on('proxyRes', (proxyRes, req, res) => {
          console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
        });
      },
    },
    '/admin': {
      target: 'https://adminxd.eliteonegrocery.com',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/admin/, '/admin')
    }
  }
}
```

### 2. تحديث متغيرات البيئة
تم تحديث ملف `.env` لاستخدام المسار المحلي:

```env
# Backend API Configuration - Using local proxy to avoid CORS
VITE_API_BASE_URL=http://localhost:5174
VITE_API_PREFIX=/api/v1
VITE_API_URL=http://localhost:5174/api/v1
VITE_ADMIN_URL=http://localhost:5174/admin
```

## كيف يعمل الحل

### قبل الإصلاح:
```
المتصفح → https://adminxd.eliteonegrocery.com/api/v1 ❌ CORS Error
```

### بعد الإصلاح:
```
المتصفح → http://localhost:5174/api/v1 → Vite Proxy → https://adminxd.eliteonegrocery.com/api/v1 ✅
```

## المزايا

1. **حل مشكلة CORS**: الطلبات تمر عبر الخادم المحلي
2. **لا حاجة لتعديل API**: لا حاجة لتغيير إعدادات الخادم
3. **سهولة التطوير**: يعمل في بيئة التطوير بدون مشاكل
4. **تشخيص أفضل**: إضافة logs لتتبع الطلبات

## كيفية الاختبار

### 1. اختبار بسيط
افتح `test-cors-fix.html` في المتصفح بعد تشغيل الخادم.

### 2. اختبار في Console
ابحث عن الرسائل التالية في Console:
```
Sending Request to the Target: GET /api/v1/settings/general
Received Response from the Target: 200 /api/v1/settings/general
```

### 3. اختبار API مباشر
```javascript
// هذا قد يفشل بسبب CORS
fetch('https://adminxd.eliteonegrocery.com/api/v1/settings/general')

// هذا يجب أن ينجح
fetch('/api/v1/settings/general')
```

## خطوات التشغيل

1. **تأكد من تحديث الملفات**:
   - `vite.config.ts` - إعدادات proxy
   - `.env` - متغيرات البيئة الجديدة

2. **أعد تشغيل خادم التطوير**:
   ```bash
   npm run dev
   # أو
   yarn dev
   ```

3. **تحقق من Console**:
   - يجب أن ترى رسائل proxy logs
   - لا يجب أن ترى أخطاء CORS

4. **اختبر التطبيق**:
   - تحقق من تحميل البيانات
   - تحقق من عمل السلة
   - تحقق من تحميل السلايدر

## ملاحظات مهمة

1. **للتطوير فقط**: هذا الحل مناسب لبيئة التطوير
2. **للإنتاج**: قد تحتاج لحل مختلف مثل إعداد CORS في الخادم
3. **الأداء**: proxy قد يضيف تأخير طفيف
4. **الأمان**: الطلبات تمر عبر خادم محلي آمن

## استكشاف الأخطاء

إذا استمرت المشاكل:

1. **تحقق من Console**: ابحث عن رسائل proxy
2. **تحقق من Network tab**: تأكد من أن الطلبات تذهب إلى localhost:5174
3. **تحقق من الخادم**: تأكد من أن API الخارجي يعمل
4. **أعد تشغيل الخادم**: بعد أي تعديل على vite.config.ts

## النتيجة المتوقعة

بعد تطبيق هذا الحل:
- ✅ لا توجد أخطاء CORS
- ✅ تحميل البيانات يعمل
- ✅ السلة تعمل
- ✅ السلايدر يعمل
- ✅ جميع API calls تعمل عبر proxy
