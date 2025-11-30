# إصلاح مشكلة متغيرات البيئة

## المشكلة
كان الكود يستخدم رابط `http://engeb.com/api/v1` مباشرة في الكود، ولكن المستخدم يريد أن يتم استخراج الرابط من ملفات البيئة (env files).

## الحل المطبق

### 1. إنشاء ملف `.env`
تم إنشاء ملف `.env` في مجلد `Front` مع الإعدادات التالية:
```env
VITE_API_URL=http://engeb.com/api/v1
VITE_API_BASE_URL=http://engeb.com
VITE_API_PREFIX=/api/v1
VITE_ADMIN_URL=http://engeb.com/admin
VITE_APP_URL=http://localhost:5174
VITE_APP_NAME=Engeb
```

### 2. تحديث ملفات الكود

#### أ. `Front/src/lib/api.ts`
```typescript
// قبل الإصلاح
const API_BASE = 'http://engeb.com/api/v1';

// بعد الإصلاح
const API_BASE = import.meta.env.VITE_API_URL || 'http://engeb.com/api/v1';
```

#### ب. `Front/src/services/api.js`
```javascript
// قبل الإصلاح
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// بعد الإصلاح
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://engeb.com/api/v1';
```

### 3. الملفات المحدثة
- ✅ `Front/.env` - تم إنشاؤه
- ✅ `Front/src/lib/api.ts` - تم تحديثه
- ✅ `Front/src/services/api.js` - تم تحديثه
- ✅ `Front/src/config/api.ts` - كان يستخدم متغيرات البيئة بالفعل

### 4. ملفات الاختبار
- ✅ `Front/test-env.html` - لاختبار متغيرات البيئة
- ✅ `Front/ENV_SETUP_INSTRUCTIONS.md` - تعليمات الإعداد

## كيفية الاختبار

### 1. اختبار متغيرات البيئة
افتح `Front/test-env.html` في المتصفح للتحقق من أن متغيرات البيئة تعمل بشكل صحيح.

### 2. اختبار تسجيل الدخول
1. تأكد من أن ملف `.env` موجود في مجلد `Front`
2. أعد تشغيل خادم التطوير: `npm run dev`
3. اذهب إلى صفحة تسجيل الدخول
4. تأكد من أن الطلبات تُرسل إلى `http://engeb.com/api/v1`

## المزايا

### 1. مرونة في الإعدادات
- يمكن تغيير رابط API بسهولة من ملف `.env`
- لا حاجة لتعديل الكود عند تغيير البيئة

### 2. إدارة أفضل للبيئات
- بيئة التطوير: `localhost:8000`
- بيئة الإنتاج: `engeb.com`

### 3. أمان أفضل
- متغيرات البيئة لا تُرفع مع الكود
- يمكن استخدام ملفات `.env` مختلفة لكل بيئة

## التحقق من الإعدادات

### 1. في المتصفح
افتح Developer Tools واذهب إلى Console، يجب أن ترى:
```javascript
console.log(import.meta.env.VITE_API_URL); // http://engeb.com/api/v1
```

### 2. في الكود
```typescript
// يجب أن يعيد http://engeb.com/api/v1
const API_BASE = import.meta.env.VITE_API_URL || 'http://engeb.com/api/v1';
```

## ملاحظات مهمة

1. **إعادة تشغيل الخادم**: بعد تعديل ملف `.env`، يجب إعادة تشغيل خادم التطوير
2. **متغيرات Vite**: متغيرات البيئة يجب أن تبدأ بـ `VITE_` لتعمل مع Vite
3. **الترتيب**: `import.meta.env.VITE_API_URL` يأخذ الأولوية على القيمة الافتراضية

## حالة الإصلاح
✅ **مكتمل** - جميع الملفات تم تحديثها لاستخدام متغيرات البيئة
