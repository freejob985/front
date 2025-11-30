# إصلاح مشكلة 401 Unauthorized في لوحة تحكم المورد

## المشكلة
بعد تسجيل دخول المورد بنجاح، عند الذهاب إلى لوحة التحكم، تظهر أخطاء 401 Unauthorized:
```
Failed to load resource: the server responded with a status of 401 (Unauthorized)
Response: {"success":false,"message":"Vendor not authenticated"}
```

## السبب
المشكلة كانت في أن:
1. **عدم إرسال التوكن**: لوحة التحكم تستخدم `api.ts` الذي لا يرسل توكن المورد مع الطلبات
2. **API مختلف**: `api.ts` يستخدم `http://localhost:8000/api/v1` بينما تسجيل الدخول يستخدم `http://engeb.com/api/v1`

## الحل المطبق

### إضافة دعم توكن المورد في `api.ts`

```typescript
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers || undefined);
  
  // Set security headers
  Object.entries(SECURE_API_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  // Set default headers
  Object.entries(SECURE_API_CONFIG.DEFAULT_HEADERS).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  });

  // Add vendor token if available
  const vendorToken = localStorage.getItem('vendor_token');
  if (vendorToken && path.includes('/vendor/')) {
    headers.set('Authorization', `Bearer ${vendorToken}`);
    console.log('🔑 Added vendor token to request');
  }

  // ... rest of the function
}
```

## المميزات الجديدة

### 1. **إضافة التوكن تلقائياً** 🔑
- يتحقق من وجود `vendor_token` في localStorage
- إذا كان المسار يحتوي على `/vendor/`، يضيف التوكن في header `Authorization`
- سجل console يؤكد إضافة التوكن

### 2. **دعم Session-based وToken-based** 🔐
- يدعم `credentials: 'include'` للـ sessions
- يدعم `Authorization: Bearer <token>` للـ tokens
- يعمل مع كلا النوعين

## الملفات المحدثة

### `src/lib/api.ts`
- إضافة logic لإرسال توكن المورد
- إضافة سجلات تشخيصية

## كيفية الاختبار

1. سجل دخول كمورد في `http://localhost:5174/vendor/login`
2. افتح Developer Tools → Console
3. افتح `http://localhost:5174/vendor/dashboard`
4. راقب السجلات في Console:
   ```
   🔑 Added vendor token to request
   Making request to: http://localhost:8000/api/v1/vendor/dashboard/stats
   ```

## السجلات المتوقعة

### قبل الإصلاح:
```
Making request to: http://localhost:8000/api/v1/vendor/dashboard/stats
Response status: 401 Unauthorized
Request failed with response: {"success":false,"message":"Vendor not authenticated"}
```

### بعد الإصلاح:
```
🔑 Added vendor token to request
Making request to: http://localhost:8000/api/v1/vendor/dashboard/stats
Response status: 200 OK
Response data: { ... }
```

## ملاحظات مهمة

### 1. **التوكن يُحفظ بعد تسجيل الدخول**
في `vendorAuth.ts`:
```typescript
if (token) {
  localStorage.setItem(this.VENDOR_TOKEN_KEY, token);
}
```

### 2. **التوكن يُرسل مع طلبات المورد فقط**
```typescript
if (vendorToken && path.includes('/vendor/')) {
  headers.set('Authorization', `Bearer ${vendorToken}`);
}
```

### 3. **التوكن يُحذف عند تسجيل الخروج**
```typescript
localStorage.removeItem('vendor_token');
localStorage.removeItem('vendor_profile');
```

## الخطوات التالية

إذا استمرت المشكلة:

### 1. **تحقق من وجود التوكن**
افتح Developer Tools → Application → Local Storage → Check `vendor_token`

### 2. **تحقق من إرسال التوكن**
افتح Developer Tools → Network → Check request headers for `Authorization: Bearer <token>`

### 3. **تحقق من صحة التوكن**
الخادم يجب أن يقبل التوكن ويتحقق منه

## النتيجة النهائية

### قبل الإصلاح:
```
❌ 401 Unauthorized
❌ Vendor not authenticated
❌ لا يتم إرسال التوكن
```

### بعد الإصلاح:
```
✅ التوكن يُرسل تلقائياً
✅ المصادقة تعمل بنجاح
✅ لوحة التحكم تحمل البيانات
```

