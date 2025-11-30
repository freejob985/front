# دليل متغيرات البيئة للـ Proxy

## نظرة عامة
تم تحديث `vite.config.ts` لاستخدام متغيرات البيئة للتحكم في أهداف Proxy، مما يجعل النظام أكثر مرونة وقابلية للتخصيص.

## المتغيرات الجديدة

### 1. متغيرات Proxy Targets
```env
# Proxy Target Configuration - Control where requests are forwarded
VITE_API_TARGET=https://adminxd.eliteonegrocery.com
VITE_ADMIN_TARGET=https://adminxd.eliteonegrocery.com
```

### 2. متغيرات API المحلية
```env
# Backend API Configuration - Using local proxy to avoid CORS
VITE_API_BASE_URL=http://localhost:5174
VITE_API_PREFIX=/api/v1
VITE_API_URL=http://localhost:5174/api/v1
VITE_ADMIN_URL=http://localhost:5174/admin
```

## كيف يعمل النظام

### 1. تدفق الطلبات
```
المتصفح → localhost:5174/api/v1 → Vite Proxy → VITE_API_TARGET/api/v1
```

### 2. التحكم في الوجهة
- **VITE_API_TARGET**: يحدد أين يتم إعادة توجيه طلبات `/api`
- **VITE_ADMIN_TARGET**: يحدد أين يتم إعادة توجيه طلبات `/admin`

### 3. المرونة
يمكن تغيير الوجهة بسهولة من خلال تعديل متغيرات البيئة فقط.

## الملفات المحدثة

### 1. `vite.config.ts`
```typescript
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')
  
  // Get API target from environment variables
  const apiTarget = env.VITE_API_TARGET || 'https://adminxd.eliteonegrocery.com'
  const adminTarget = env.VITE_ADMIN_TARGET || 'https://adminxd.eliteonegrocery.com'
  
  return {
    server: {
      proxy: {
        '/api': {
          target: apiTarget,  // يستخدم متغير البيئة
          // ... باقي الإعدادات
        },
        '/admin': {
          target: adminTarget,  // يستخدم متغير البيئة
          // ... باقي الإعدادات
        }
      }
    }
  }
})
```

### 2. `.env`
```env
# Proxy Target Configuration
VITE_API_TARGET=https://adminxd.eliteonegrocery.com
VITE_ADMIN_TARGET=https://adminxd.eliteonegrocery.com

# Local API Configuration
VITE_API_URL=http://localhost:5174/api/v1
VITE_ADMIN_URL=http://localhost:5174/admin
```

### 3. `env.example`
تم تحديث الملف ليشمل جميع المتغيرات الجديدة مع توثيق واضح.

## كيفية الاستخدام

### 1. التطوير المحلي
```env
VITE_API_TARGET=https://adminxd.eliteonegrocery.com
VITE_ADMIN_TARGET=https://adminxd.eliteonegrocery.com
```

### 2. التطوير مع API محلي
```env
VITE_API_TARGET=http://localhost:8000
VITE_ADMIN_TARGET=http://localhost:8000
```

### 3. الإنتاج
```env
VITE_API_TARGET=https://your-production-api.com
VITE_ADMIN_TARGET=https://your-production-admin.com
```

### 4. اختبار مع API مختلف
```env
VITE_API_TARGET=https://staging-api.example.com
VITE_ADMIN_TARGET=https://staging-admin.example.com
```

## المزايا

### 1. المرونة
- تغيير الوجهة بدون تعديل الكود
- سهولة التبديل بين البيئات
- دعم متعدد البيئات

### 2. الأمان
- لا حاجة لكشف روابط API في الكود
- إدارة مركزية للإعدادات
- سهولة التحديث

### 3. سهولة الصيانة
- إعدادات واضحة ومنظمة
- توثيق شامل
- اختبارات مدمجة

## الاختبار

### 1. اختبار بسيط
افتح `test-env-proxy.html` في المتصفح

### 2. اختبار متغيرات البيئة
```javascript
console.log('API Target:', import.meta.env.VITE_API_TARGET)
console.log('Admin Target:', import.meta.env.VITE_ADMIN_TARGET)
```

### 3. اختبار Proxy
```javascript
// هذا يجب أن يعمل عبر proxy
fetch('/api/v1/settings/general')
```

## استكشاف الأخطاء

### 1. تحقق من متغيرات البيئة
```bash
# في terminal
echo $VITE_API_TARGET
```

### 2. تحقق من Console
ابحث عن رسائل:
```
🔧 Vite Config - API Target: https://adminxd.eliteonegrocery.com
Sending Request to the Target: GET /api/v1/settings/general → https://adminxd.eliteonegrocery.com
```

### 3. تحقق من Network Tab
- الطلبات يجب أن تذهب إلى `localhost:5174`
- لا يجب أن ترى أخطاء CORS

## أمثلة عملية

### 1. التبديل إلى API محلي
```env
VITE_API_TARGET=http://localhost:8000
VITE_ADMIN_TARGET=http://localhost:8000
```

### 2. التبديل إلى staging
```env
VITE_API_TARGET=https://staging-api.example.com
VITE_ADMIN_TARGET=https://staging-admin.example.com
```

### 3. التبديل إلى production
```env
VITE_API_TARGET=https://api.example.com
VITE_ADMIN_TARGET=https://admin.example.com
```

## ملاحظات مهمة

1. **إعادة تشغيل الخادم**: بعد تعديل `.env`
2. **متغيرات Vite**: يجب أن تبدأ بـ `VITE_`
3. **الأمان**: لا تضع معلومات حساسة في `.env`
4. **النسخ الاحتياطي**: احتفظ بنسخة من `.env.example`

## النتيجة

الآن يمكنك التحكم في أهداف Proxy من خلال متغيرات البيئة فقط، مما يجعل النظام أكثر مرونة وسهولة في الصيانة! 🎉
