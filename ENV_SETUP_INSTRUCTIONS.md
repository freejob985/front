# تعليمات إعداد متغيرات البيئة

## المشكلة
المشكلة أن الكود يستخدم رابط `http://engeb.com/api/v1` مباشرة في الكود، ولكن يجب أن يستخدم متغيرات البيئة.

## الحل
أنشئ ملف `.env` في مجلد `Front` مع المحتوى التالي:

```env
# API Configuration
# Production URLs
VITE_API_URL=http://engeb.com/api/v1
VITE_API_BASE_URL=http://engeb.com
VITE_API_PREFIX=/api/v1
VITE_ADMIN_URL=http://engeb.com/admin
VITE_APP_URL=http://localhost:5174
VITE_APP_NAME=Engeb
```

## الخطوات:

1. **أنشئ ملف `.env` في مجلد `Front`:**
   ```bash
   cd Front
   copy env.example .env
   ```

2. **عدل محتوى ملف `.env`:**
   - افتح ملف `.env`
   - تأكد من أن `VITE_API_URL=http://engeb.com/api/v1`
   - تأكد من أن `VITE_API_BASE_URL=http://engeb.com`

3. **أعد تشغيل الخادم:**
   ```bash
   npm run dev
   ```

## التحقق من الإعدادات:

بعد إنشاء ملف `.env`، تأكد من أن:
- `import.meta.env.VITE_API_URL` يعيد `http://engeb.com/api/v1`
- `import.meta.env.VITE_API_BASE_URL` يعيد `http://engeb.com`

## ملاحظة:
الآن الكود يستخدم متغيرات البيئة بدلاً من الرابط المباشر:
- `Front/src/lib/api.ts` يستخدم `import.meta.env.VITE_API_URL`
- `Front/src/services/api.js` يستخدم `import.meta.env.VITE_API_URL`
- `Front/src/config/api.ts` يستخدم `settingsService.getApiUrl()`
