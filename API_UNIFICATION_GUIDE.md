# دليل توحيد رابط API

## نظرة عامة
تم توحيد جميع روابط API في المشروع لاستخدام متغير البيئة `VITE_API_URL` كمصدر واحد للحقيقة.

## الملفات المحدثة

### 1. ملفات الإعدادات الأساسية
- `src/config/security.ts` - الملف الرئيسي لإعدادات API
- `src/config/api.ts` - يستخدم `SECURE_API_CONFIG` من security.ts
- `src/lib/api.ts` - يستخدم `import.meta.env.VITE_API_URL`
- `src/services/api.js` - يستخدم `import.meta.env.VITE_API_URL`

### 2. ملفات الصفحات والمكونات
- `src/pages/VendorSignup.tsx`
- `src/pages/CategoryProducts.tsx`
- `src/components/DirectSessionTest.jsx`
- `src/components/ApiTest.jsx`

### 3. ملفات الإعدادات
- `vite.config.ts` - تم تحديث القيم الافتراضية
- `env.example` - تم تحديث التوثيق
- `debug-login.html`
- `test-env.html`

## كيفية الاستخدام

### 1. إعداد متغير البيئة
أنشئ ملف `.env` في مجلد المشروع:

```env
# VITE_API_URL هو المصدر الوحيد لجميع روابط API
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PREFIX=/api/v1
VITE_ADMIN_URL=http://localhost:8000/admin
VITE_APP_URL=http://localhost:5174
VITE_APP_NAME=Engeb
```

### 2. تغيير البيئة
لتغيير البيئة من التطوير إلى الإنتاج، قم بتعديل `VITE_API_URL` فقط:

```env
# للإنتاج
VITE_API_URL=http://engeb.com/api/v1
```

### 3. استخدام API في الكود
```typescript
// الطريقة المفضلة - استخدام SECURE_API_CONFIG
import { SECURE_API_CONFIG } from '../config/security';
const apiUrl = SECURE_API_CONFIG.API_URL;

// أو استخدام متغير البيئة مباشرة
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
```

## المزايا

1. **مصدر واحد للحقيقة**: `VITE_API_URL` هو المصدر الوحيد لجميع روابط API
2. **سهولة التبديل**: تغيير البيئة يتطلب تعديل متغير واحد فقط
3. **المرونة**: يمكن تخصيص كل بيئة بسهولة
4. **الأمان**: استخدام متغيرات البيئة بدلاً من الروابط المباشرة
5. **الصيانة**: تحديث رابط واحد يؤثر على جميع الملفات

## ملاحظات مهمة

1. **إعادة تشغيل الخادم**: بعد تعديل ملف `.env`، يجب إعادة تشغيل خادم التطوير
2. **متغيرات Vite**: متغيرات البيئة يجب أن تبدأ بـ `VITE_` لتعمل مع Vite
3. **الترتيب**: `import.meta.env.VITE_API_URL` يأخذ الأولوية على القيمة الافتراضية
4. **التحقق**: استخدم `test-env.html` للتحقق من صحة إعدادات البيئة

## اختبار الإعدادات

افتح `test-env.html` في المتصفح للتحقق من:
- صحة متغيرات البيئة
- صحة رابط API المستخدم
- حالة الاتصال بالخادم

## استكشاف الأخطاء

إذا واجهت مشاكل:
1. تأكد من وجود ملف `.env` في مجلد المشروع
2. تأكد من إعادة تشغيل خادم التطوير
3. تحقق من console.log في المتصفح
4. استخدم `test-env.html` لاختبار الإعدادات
