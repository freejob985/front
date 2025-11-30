# Vendor Login Debugging Guide - دليل تشخيص تسجيل دخول المورد

## المشاكل التي تم حلها

### 1. عدم ظهور رسائل خطأ واضحة
**المشكلة**: عند فشل تسجيل الدخول، لا تظهر رسائل خطأ واضحة للمستخدم.

**الحل**:
- إضافة رسائل console مفصلة في كل خطوة
- إضافة رسائل toast للمستخدم
- تحسين معالجة الأخطاء في `vendorAuthService.login()`

### 2. عدم وضوح سبب فشل تسجيل الدخول
**المشكلة**: المستخدم لا يعرف سبب فشل تسجيل الدخول.

**الحل**:
- إضافة تفاصيل مفصلة في console
- عرض رسائل خطأ واضحة
- تسجيل جميع الخطوات في logger

## التحسينات المضافة

### 1. تحسين `vendorAuthService.login()`
```typescript
public async login(data: VendorLoginData): Promise<{ success: boolean; message?: string; vendor?: any }> {
  try {
    console.log('🔐 Attempting vendor login for:', data.email);
    const response = await apiService.vendorLogin(data.email, data.password);
    console.log('📡 Vendor login response:', response);
    
    if (response?.success && response?.vendor) {
      // Store vendor data
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(response.vendor));
      this.cachedProfile = response.vendor;
      this.lastProfileFetch = Date.now();
      
      // Store token if available
      if (response.token) {
        this.setToken(response.token);
      }
      
      console.log('✅ Vendor login successful:', response.vendor);
      return { success: true, vendor: response.vendor };
    } else {
      const errorMessage = response?.message || 'فشل في تسجيل الدخول. تحقق من البيانات المدخلة.';
      console.error('❌ Login failed - Invalid response:', response);
      return { success: false, message: errorMessage };
    }
  } catch (error: any) {
    console.error('❌ Login failed with error:', error);
    const errorMessage = error?.message || error?.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
    return { success: false, message: errorMessage };
  }
}
```

### 2. تحسين `apiService.vendorLogin()`
```javascript
async vendorLogin(email, password) {
  logger.info('بدء تسجيل دخول المورد', { email });
  try {
    console.log('🔐 Sending vendor login request to:', `${this.baseURL}/vendor/auth/login`);
    console.log('📤 Login payload:', { email, password: '***' });
    
    const response = await this.post('/vendor/auth/login', { email, password });
    
    console.log('📥 Vendor login response:', response);
    logger.info('تم تسجيل دخول المورد بنجاح', { email, response });
    
    return response;
  } catch (error) {
    console.error('❌ Vendor login API error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.status,
      response: error.response
    });
    
    logger.error('فشل في تسجيل دخول المورد', { email, error: error.message });
    throw error;
  }
}
```

### 3. تحسين `VendorLogin.tsx`
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    logger.info('بدء عملية تسجيل دخول المورد', { email: formData.email });
    const result = await vendorAuthService.login(formData);
    
    if (result.success) {
      logger.info('تم تسجيل دخول المورد بنجاح', { email: formData.email, vendor: result.vendor });
      console.log('✅ Login successful, redirecting to dashboard...');
      
      // عرض رسالة نجاح
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${result.vendor?.name || 'بالمورد'}`,
        variant: "default",
      });
      
      // عند نجاح تسجيل الدخول، يتم التوجيه إلى لوحة التحكم
      navigate('/vendor/dashboard');
    } else {
      logger.error('فشل في تسجيل دخول المورد', { email: formData.email, message: result.message });
      console.error('❌ Login failed:', result.message);
      const errorMessage = result.message || 'فشل في تسجيل الدخول';
      
      // عرض رسالة خطأ
      toast({
        title: "فشل في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
      });
      
      setError(errorMessage);
    }
  } catch (error: any) {
    logger.error('فشل في تسجيل دخول المورد', { email: formData.email, error: error.message });
    console.error('❌ Login error:', error);
    const errorMessage = error.message || 'حدث خطأ أثناء تسجيل الدخول';
    
    // عرض رسالة خطأ
    toast({
      title: "خطأ في تسجيل الدخول",
      description: errorMessage,
      variant: "destructive",
    });
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
```

## كيفية التشخيص

### 1. فتح Developer Tools
- اضغط F12 أو Ctrl+Shift+I
- انتقل إلى تبويب Console

### 2. مراقبة الرسائل
عند محاولة تسجيل الدخول، ستظهر الرسائل التالية:

**عند بدء العملية:**
```
🔐 Attempting vendor login for: user@example.com
🔐 Sending vendor login request to: http://engeb.com/api/v1/vendor/auth/login
📤 Login payload: { email: "user@example.com", password: "***" }
```

**عند نجاح العملية:**
```
📥 Vendor login response: { success: true, vendor: {...} }
✅ Vendor login successful: {...}
✅ Login successful, redirecting to dashboard...
```

**عند فشل العملية:**
```
❌ Vendor login API error: Error: ...
❌ Error details: { message: "...", status: 401, response: {...} }
❌ Login failed: Invalid credentials
```

### 3. فحص Network Tab
- انتقل إلى تبويب Network
- حاول تسجيل الدخول
- ابحث عن طلب `/vendor/auth/login`
- تحقق من:
  - Status Code (200, 401, 422, 500)
  - Request Headers
  - Response Body

### 4. فحص Local Storage
- انتقل إلى تبويب Application
- ابحث عن `vendor_profile` و `vendor_auth_token`
- تحقق من وجود البيانات بعد تسجيل الدخول

## الأخطاء الشائعة وحلولها

### 1. خطأ 401 (Unauthorized)
**السبب**: بيانات الدخول غير صحيحة
**الحل**: تحقق من صحة البريد الإلكتروني وكلمة المرور

### 2. خطأ 422 (Unprocessable Entity)
**السبب**: بيانات غير صحيحة (مثل بريد إلكتروني غير صالح)
**الحل**: تحقق من صحة البيانات المدخلة

### 3. خطأ 500 (Internal Server Error)
**السبب**: خطأ في الخادم
**الحل**: تحقق من حالة الخادم أو اتصل بالدعم الفني

### 4. خطأ CORS
**السبب**: مشكلة في إعدادات CORS
**الحل**: تحقق من إعدادات الخادم

### 5. خطأ Network
**السبب**: مشكلة في الاتصال بالخادم
**الحل**: تحقق من اتصال الإنترنت أو عنوان الخادم

## نصائح للتطوير

1. **استخدم Console.log**: أضف رسائل console في كل خطوة مهمة
2. **راقب Network**: تحقق من الطلبات والاستجابات
3. **اختبر البيانات**: تأكد من صحة البيانات المرسلة
4. **تحقق من Headers**: تأكد من وجود headers المطلوبة
5. **اختبر مختلف السيناريوهات**: نجاح، فشل، أخطاء مختلفة

## الملفات المعدلة

- `Front/src/services/vendorAuth.ts` - تحسين دالة login
- `Front/src/services/api.js` - تحسين vendorLogin
- `Front/src/pages/VendorLogin.tsx` - إضافة toast وتحسين معالجة الأخطاء
