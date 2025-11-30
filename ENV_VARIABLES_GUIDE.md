# دليل متغيرات البيئة (Environment Variables Guide)

## نظرة عامة

تم تحديث التطبيق بالكامل ليستخدم **متغيرات البيئة** بدلاً من المسارات الثابتة (hardcoded URLs). هذا يتيح لك التحكم الكامل في مسارات API من ملف `.env` فقط.

## 🔧 الإعدادات الأساسية

### ملف `.env`

يجب عليك إنشاء ملف `.env` في جذر المشروع بالمتغيرات التالية:

```env
# ===========================================
# متغيرات API الأساسية
# ===========================================

# المسار الكامل لـ API (الطريقة المفضلة)
VITE_API_URL=http://localhost:8000/api/v1

# أو استخدم المسار الأساسي + البادئة
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PREFIX=/api/v1

# ===========================================
# وضع الاتصال بـ API
# ===========================================

# direct: اتصال مباشر بـ API (يتطلب CORS على الخادم)
# proxy: استخدام proxy محلي لتجنب مشاكل CORS
VITE_API_MODE=direct
```

## 📝 أمثلة الإعدادات

### 1. للتطوير المحلي (Local Development)

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_MODE=direct
VITE_DEBUG=true
VITE_APP_ENV=development
```

### 2. للإنتاج (Production)

```env
VITE_API_URL=https://adminxd.eliteonegrocery.com/api/v1
VITE_API_MODE=direct
VITE_DEBUG=false
VITE_APP_ENV=production
```

### 3. استخدام Proxy للتطوير

```env
VITE_API_URL=http://localhost:5174/api/v1
VITE_API_MODE=proxy
VITE_API_TARGET=http://localhost:8000
```

## 🔍 كيف يعمل النظام

### أولوية المتغيرات

يتبع النظام الأولوية التالية عند تحديد مسار API:

1. **`VITE_API_URL`** - إذا كان محدداً، يتم استخدامه مباشرة (الأولوية القصوى)
2. **`VITE_API_BASE_URL + VITE_API_PREFIX`** - إذا لم يكن `VITE_API_URL` محدداً
3. **القيمة الافتراضية** - `https://adminxd.eliteonegrocery.com/api/v1`

### الملفات المحدثة

تم تحديث الملفات التالية لاستخدام متغيرات البيئة:

1. ✅ `src/config/security.ts` - الإعداد المركزي الآمن
2. ✅ `src/config/api.ts` - نقاط النهاية (endpoints)
3. ✅ `src/config/environment.ts` - إعدادات البيئة
4. ✅ `src/lib/api.ts` - وظائف API الأساسية
5. ✅ `src/services/api.js` - خدمات API
6. ✅ `src/pages/VendorSignup.tsx` - صفحة تسجيل المورد

### مثال على كيفية الاستخدام في الكود

```typescript
// ❌ طريقة خاطئة (لا تستخدم):
const apiUrl = 'http://localhost:8000/api/v1';

// ✅ طريقة صحيحة:
import { SECURE_API_CONFIG } from '../config/security';
const apiUrl = SECURE_API_CONFIG.API_URL;
```

## 🚀 خطوات البدء السريع

### 1. إنشاء ملف `.env`

```bash
# في Windows
copy env.local .env

# في Linux/Mac
cp env.local .env
```

### 2. تحديث المتغيرات

افتح ملف `.env` وقم بتحديث المتغيرات حسب احتياجك:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_MODE=direct
```

### 3. إعادة تشغيل خادم التطوير

```bash
npm run dev
```

## 🔍 التحقق من الإعدادات

بعد تشغيل التطبيق، افتح Console في المتصفح وستجد رسائل تأكيد:

```
🔍 Security Config - VITE_API_URL: http://localhost:8000/api/v1
🔍 Security Config - VITE_API_BASE_URL: http://localhost:8000
🔍 Security Config - VITE_API_PREFIX: /api/v1
🔍 Security Config - VITE_API_MODE: direct
✅ Security Config - Using VITE_API_URL from environment: http://localhost:8000/api/v1
```

## ⚙️ المتغيرات المتاحة

### متغيرات API الأساسية

| المتغير | الوصف | مثال |
|---------|-------|------|
| `VITE_API_URL` | المسار الكامل لـ API | `http://localhost:8000/api/v1` |
| `VITE_API_BASE_URL` | المسار الأساسي للخادم | `http://localhost:8000` |
| `VITE_API_PREFIX` | البادئة المضافة للمسارات | `/api/v1` |
| `VITE_API_MODE` | وضع الاتصال (direct/proxy) | `direct` |

### متغيرات التطبيق

| المتغير | الوصف | مثال |
|---------|-------|------|
| `VITE_APP_NAME` | اسم التطبيق | `Engeb` |
| `VITE_APP_URL` | رابط الموقع الرئيسي | `http://localhost:5174` |
| `VITE_DEBUG` | تفعيل وضع التصحيح | `true` |
| `VITE_APP_ENV` | بيئة التشغيل | `development` |

### متغيرات الأداء

| المتغير | الوصف | القيمة الافتراضية |
|---------|-------|-------------------|
| `VITE_API_TIMEOUT` | مهلة الطلبات (بالميلي ثانية) | `30000` (30 ثانية) |
| `VITE_MAX_RETRIES` | عدد محاولات إعادة الطلب | `3` |

## ❗ حل المشاكل الشائعة

### 1. خطأ `ERR_CONNECTION_REFUSED`

**السبب:** الخادم الخلفي (Backend) غير قيد التشغيل أو على منفذ مختلف.

**الحل:**
- تأكد من تشغيل خادم Laravel:
  ```bash
  php artisan serve --port=8000
  ```
- تحقق من أن `VITE_API_URL` في ملف `.env` يطابق المنفذ الفعلي

### 2. المتغيرات لا تعمل

**السبب:** Vite لا يقرأ التغييرات في ملف `.env` تلقائياً.

**الحل:**
- أوقف خادم التطوير (Ctrl+C)
- أعد تشغيله:
  ```bash
  npm run dev
  ```

### 3. أخطاء CORS

**السبب:** الخادم الخلفي لا يسمح بطلبات من المنفذ الخاص بك.

**الحل:**
- إما استخدم وضع `proxy`:
  ```env
  VITE_API_MODE=proxy
  ```
- أو تأكد من إعدادات CORS على الخادم الخلفي

### 4. القيم القديمة لا تزال تظهر

**السبب:** cache المتصفح أو build cache.

**الحل:**
```bash
# امسح cache ونظف build
npm run clean
rm -rf node_modules/.vite
npm run dev
```

## 📚 ملفات مرجعية

- `env.example` - مثال على متغيرات البيئة
- `env.local` - إعدادات التطوير المحلي
- `.env` - ملفك الخاص (يجب إنشاؤه)

## 🔐 ملاحظات أمنية

1. **لا تضف ملف `.env` إلى Git** - يحتوي على معلومات حساسة
2. استخدم `env.example` كقالب للفريق
3. في الإنتاج، استخدم متغيرات البيئة الخاصة بالخادم

## ✨ الفوائد

✅ **مرونة كاملة** - غيّر مسار API من مكان واحد  
✅ **أمان أفضل** - لا مسارات ثابتة في الكود  
✅ **سهولة النشر** - إعدادات مختلفة لكل بيئة  
✅ **تصحيح أسهل** - رسائل واضحة في Console  
✅ **توافق أفضل** - يعمل مع جميع البيئات

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من رسائل Console في المتصفح
2. راجع ملف `.env` للتأكد من صحة القيم
3. تأكد من تشغيل الخادم الخلفي
4. جرب مسح cache وإعادة التشغيل






