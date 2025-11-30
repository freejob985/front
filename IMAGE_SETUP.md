# إعداد مسارات الصور

## المشكلة
الصور لا تظهر بشكل صحيح لأنها تحتاج إلى مسار الإدارة (admin path) في الإنتاج.

## الحل المطبق

### 1. دالة `getImageUrl` المحدثة
تم تحديث دالة `getImageUrl` في `src/config/api.ts` لتتعامل مع مسارات الإدارة:

```typescript
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, add the backend URL with admin path
  const backendUrl = isDevelopment 
    ? 'http://localhost:8000'  // Laravel backend URL in development
    : (import.meta.env?.VITE_BACKEND_URL || 'http://engeb.com');
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // For production, add admin path if not already present
  if (!isDevelopment && !cleanPath.startsWith('admin/')) {
    return `${backendUrl}/admin/${cleanPath}`;
  }
  
  return `${backendUrl}/${cleanPath}`;
};
```

### 2. كيفية العمل

#### في التطوير (Development):
- صورة: `products/image.jpg`
- النتيجة: `http://localhost:8000/products/image.jpg`

#### في الإنتاج (Production):
- صورة: `products/image.jpg`
- النتيجة: `http://engeb.com/admin/products/image.jpg`

### 3. المكونات المحدثة
تم تحديث جميع المكونات التالية لاستخدام `getImageUrl`:
- ✅ `Cart.tsx` - السلة
- ✅ `OrderConfirmation.tsx` - تأكيد الطلب
- ✅ `ProductDetails.tsx` - تفاصيل المنتج
- ✅ `Index.tsx` - الصفحة الرئيسية
- ✅ `UserAccount.tsx` - صفحة الحساب

### 4. إعداد متغيرات البيئة (اختياري)

يمكنك إنشاء ملف `.env` في مجلد `Front/` مع المحتوى التالي:

```env
# Backend Configuration
VITE_BACKEND_URL=http://engeb.com

# API Configuration
VITE_API_BASE_URL=http://engeb.com
VITE_API_PREFIX=/api/v1

# Frontend Configuration
VITE_APP_URL=http://engeb.com
VITE_APP_NAME=Engeb
```

## النتيجة
الآن جميع الصور ستظهر بشكل صحيح مع مسار الإدارة المطلوب في الإنتاج! 🎉
