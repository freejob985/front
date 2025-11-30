# Authentication Fixes - إصلاحات المصادقة

## المشاكل التي تم حلها

### 1. مشكلة عدم تطابق عنوان API الأساسي
**المشكلة**: كان هناك عدم تطابق بين عنوان API المستخدم في `api.js` (`http://localhost:8000/api/v1`) والعنوان الفعلي من `settingsService.ts` (`http://engeb.com/api/v1`).

**الحل**:
- تم تعديل `api.js` لاستخدام `SettingsService` بشكل صحيح
- إضافة دالة `initializeApiUrl()` لتحميل عنوان API من الإعدادات
- إضافة دالة `getApiBaseUrl()` للحصول على عنوان API الحالي

### 2. مشكلة أخطاء المصادقة (401 Unauthorized)
**المشكلة**: فشل في جلب بيانات لوحة تحكم البائع بسبب عدم المصادقة أو انتهاء صلاحية الجلسة.

**الحل**:
- إضافة معالجة خاصة لأخطاء 401 في `api.js`
- إنشاء `AuthErrorHandler` مركزي لمعالجة أخطاء المصادقة
- تحسين `vendorAuth.ts` لفحص حالة تسجيل الدخول قبل جلب البيانات
- إضافة دالة `checkLoginStatus()` للتحقق من صحة البيانات مع الخادم

### 3. مشكلة استخدام الملف الشخصي المخزن
**المشكلة**: رسائل `API failed, using stored profile` تشير إلى فشل في جلب معلومات البائع الحالية.

**الحل**:
- تحسين معالجة الأخطاء في `getCurrentVendor()`
- إضافة فحص حالة تسجيل الدخول قبل محاولة جلب البيانات
- معالجة خاصة لأخطاء المصادقة مع مسح البيانات المحلية

## الملفات المعدلة

### 1. `Front/src/services/api.js`
```javascript
// إضافة استيراد SettingsService
import SettingsService from './settingsService';

// إضافة دالة تهيئة عنوان API
async initializeApiUrl() {
  try {
    await settingsService.initialize();
    this.baseURL = settingsService.getApiUrl();
  } catch (error) {
    console.warn('⚠️ Failed to initialize API URL from settings, using fallback:', this.baseURL);
  }
}

// معالجة خاصة لأخطاء 401
if (response.status === 401) {
  const authError = new Error(errorMessage);
  authError.status = 401;
  authError.isAuthError = true;
  throw authError;
}
```

### 2. `Front/src/services/vendorAuth.ts`
```typescript
// إضافة فحص حالة تسجيل الدخول
async checkLoginStatus(): Promise<boolean> {
  try {
    if (!this.isLoggedIn()) {
      return false;
    }
    
    const isValid = await this.validateToken();
    if (!isValid) {
      this.logout();
      return false;
    }
    
    return true;
  } catch (error) {
    return this.isLoggedIn();
  }
}

// تحسين getCurrentVendor
async getCurrentVendor(): Promise<VendorProfile | null> {
  try {
    // فحص حالة تسجيل الدخول أولاً
    if (!this.isLoggedIn()) {
      console.warn('⚠️ Vendor not logged in, cannot fetch current vendor info');
      return null;
    }
    
    // ... باقي الكود
  } catch (error) {
    // معالجة أخطاء المصادقة
    if (AuthErrorHandler.isAuthError(error)) {
      AuthErrorHandler.handleAuthError(error as AuthError);
      return null;
    }
    
    return this.getStoredProfile();
  }
}
```

### 3. `Front/src/services/authErrorHandler.ts` (جديد)
```typescript
export class AuthErrorHandler {
  // معالجة أخطاء المصادقة
  static handleAuthError(error: AuthError): void {
    if (error.isAuthError || error.status === 401) {
      vendorAuthService.logout();
      this.showAuthErrorMessage();
      // إعادة توجيه إلى صفحة تسجيل الدخول
    }
  }
  
  // فحص ما إذا كان الخطأ متعلق بالمصادقة
  static isAuthError(error: any): boolean {
    return error?.isAuthError === true || error?.status === 401;
  }
  
  // تغليف استدعاءات API مع معالجة أخطاء المصادقة
  static async withAuthErrorHandling<T>(
    apiCall: () => Promise<T>,
    fallback?: () => T
  ): Promise<T | null> {
    try {
      return await apiCall();
    } catch (error) {
      if (this.isAuthError(error)) {
        this.handleAuthError(error as AuthError);
        return fallback ? fallback() : null;
      }
      throw error;
    }
  }
}
```

### 4. `Front/src/examples/VendorDashboardExample.tsx` (جديد)
مثال كامل لكيفية استخدام الفحص المحسن لحالة تسجيل الدخول في لوحة تحكم البائع:

```typescript
const initializeDashboard = async () => {
  try {
    // فحص حالة تسجيل الدخول مع التحقق من الخادم
    const loginStatus = await vendorAuthService.checkLoginStatus();
    
    if (!loginStatus) {
      setError('يرجى تسجيل الدخول للوصول إلى لوحة التحكم');
      return;
    }
    
    // جلب البيانات مع معالجة أخطاء المصادقة
    const [stats, recentOrders, topProducts, notifications] = await Promise.all([
      AuthErrorHandler.withAuthErrorHandling(
        () => apiService.get('/vendor/dashboard/stats'),
        () => ({ total_orders: 0, total_revenue: 0, pending_orders: 0 })
      ),
      // ... باقي الطلبات
    ]);
    
    setDashboardData({ stats, recentOrders, topProducts, notifications });
  } catch (error) {
    setError('حدث خطأ أثناء تحميل بيانات لوحة التحكم');
  }
};
```

## كيفية الاستخدام

### 1. فحص حالة تسجيل الدخول
```typescript
// فحص بسيط
const isLoggedIn = vendorAuthService.isLoggedIn();

// فحص مع التحقق من الخادم
const isValidLogin = await vendorAuthService.checkLoginStatus();
```

### 2. جلب بيانات المورد
```typescript
// جلب آمن مع معالجة الأخطاء
const vendor = await vendorAuthService.getCurrentVendor();
if (!vendor) {
  // إعادة توجيه إلى صفحة تسجيل الدخول
}
```

### 3. استخدام معالج أخطاء المصادقة
```typescript
// معالجة آمنة لاستدعاءات API
const data = await AuthErrorHandler.withAuthErrorHandling(
  () => apiService.get('/vendor/data'),
  () => ({ fallback: 'data' })
);
```

## الفوائد

1. **أمان محسن**: فحص حالة تسجيل الدخول قبل كل طلب API
2. **معالجة أخطاء أفضل**: معالجة مركزية لأخطاء المصادقة
3. **تجربة مستخدم أفضل**: رسائل خطأ واضحة وإعادة توجيه تلقائية
4. **كود أكثر تنظيماً**: فصل معالجة الأخطاء عن منطق العمل
5. **سهولة الصيانة**: معالج مركزي يمكن تحديثه بسهولة

## ملاحظات مهمة

1. تأكد من تهيئة `SettingsService` قبل استخدام `ApiService`
2. استخدم `checkLoginStatus()` بدلاً من `isLoggedIn()` للفحص الدقيق
3. استخدم `AuthErrorHandler.withAuthErrorHandling()` للطلبات الحساسة
4. تأكد من إعداد إعادة التوجيه في `AuthErrorHandler.handleAuthError()`
