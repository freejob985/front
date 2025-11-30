# دليل إعداد متغيرات البيئة - Engeb Frontend

## نظرة عامة

تم تحديث النظام لاستخدام متغيرات البيئة (Environment Variables) بدلاً من القيم الثابتة في الكود. هذا يجعل التطبيق أكثر مرونة ويمكن تخصيصه لبيئات مختلفة.

## الملفات المحدثة

### 1. `src/services/api.js`
```javascript
// قبل التحديث
const API_BASE_URL = 'http://engeb.com/api/v1';

// بعد التحديث
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://engeb.com/api/v1';
```

### 2. `vite.config.ts`
يحتوي على تعريف المتغيرات البيئية مع القيم الافتراضية:
```typescript
define: {
  'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://engeb.com/api/v1'),
  'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://engeb.com'),
  // ... المزيد
}
```

### 3. `src/config/api.ts`
يستخدم متغيرات البيئة مع منطق التطوير:
```typescript
export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? ''  // Use proxy in development
    : (import.meta.env?.VITE_API_BASE_URL || 'http://engeb.com'),
  API_URL: isDevelopment
    ? '/api/v1'  // Use proxy in development
    : (import.meta.env?.VITE_API_URL || 'http://engeb.com/api/v1'),
  // ... المزيد
};
```

## كيفية الاستخدام

### 1. إنشاء ملف البيئة

قم بإنشاء ملف `.env` في مجلد `Front/`:

```bash
# Front/.env
VITE_API_URL=http://engeb.com/api/v1
VITE_API_BASE_URL=http://engeb.com
VITE_ADMIN_URL=http://engeb.com/admin
VITE_APP_URL=http://engeb.com
VITE_APP_NAME=Engeb
```

### 2. للبيئة المحلية

```bash
# Front/.env.local
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000
VITE_ADMIN_URL=http://localhost:8000/admin
VITE_APP_URL=http://localhost:5174
```

### 3. إعادة تشغيل الخادم

```bash
npm run dev
# أو
yarn dev
```

## المتغيرات المتاحة

| المتغير | الوصف | القيمة الافتراضية |
|---------|--------|------------------|
| `VITE_API_URL` | رابط API الكامل | `http://engeb.com/api/v1` |
| `VITE_API_BASE_URL` | رابط الخادم الأساسي | `http://engeb.com` |
| `VITE_API_PREFIX` | بادئة API | `/api/v1` |
| `VITE_ADMIN_URL` | رابط لوحة الإدارة | `http://engeb.com/admin` |
| `VITE_APP_URL` | رابط التطبيق | `http://engeb.com` |
| `VITE_APP_NAME` | اسم التطبيق | `Engeb` |

## أمثلة الاستخدام

### للبيئة الإنتاجية
```bash
# .env.production
VITE_API_URL=https://api.engeb.com/api/v1
VITE_API_BASE_URL=https://api.engeb.com
VITE_APP_URL=https://engeb.com
```

### للبيئة المحلية
```bash
# .env.local
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_URL=http://localhost:5174
```

### للاختبار
```bash
# .env.test
VITE_API_URL=http://test.engeb.com/api/v1
VITE_API_BASE_URL=http://test.engeb.com
VITE_APP_URL=http://test.engeb.com
```

## ملاحظات مهمة

1. **يجب أن تبدأ متغيرات Vite بـ `VITE_`** حتى تكون متاحة في الكود
2. **ملف `.env` يجب أن يكون في مجلد `Front/`** (جذر مشروع React)
3. **لا تضع ملف `.env` في Git** - أضفه إلى `.gitignore`
4. **استخدم `.env.example`** لتوثيق المتغيرات المطلوبة
5. **أعد تشغيل الخادم** بعد تغيير متغيرات البيئة

## استكشاف الأخطاء

### المشكلة: المتغيرات لا تعمل
**الحل**: تأكد من:
- أن المتغير يبدأ بـ `VITE_`
- أن الملف `.env` في المجلد الصحيح
- إعادة تشغيل الخادم

### المشكلة: القيم الافتراضية تظهر
**الحل**: تأكد من:
- صحة كتابة اسم المتغير
- عدم وجود مسافات إضافية
- أن الملف `.env` يتم تحميله

## الملفات المرجعية

- `env.example` - مثال على ملف البيئة
- `ENV_SETUP.md` - دليل مفصل لإعداد البيئة
- `vite.config.ts` - إعدادات Vite مع المتغيرات
- `src/config/api.ts` - إعدادات API
- `src/services/api.js` - خدمة API
