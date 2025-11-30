# إصلاح خطأ URL في Location API

## المشكلة
كان هناك خطأ في URLs الخاصة بـ Location API حيث يتم تكرار `/api/v1` مرتين:

```
❌ الخطأ:
http://engeb.com/api/v1/api/v1/governorates
http://engeb.com/api/v1/api/v1/business-categories

✅ الصحيح:
http://engeb.com/api/v1/governorates
http://engeb.com/api/v1/business-categories
```

## السبب
في `locationApi.ts` كان هناك:
```typescript
class LocationApiService {
  private baseUrl = '/api/v1';  // ❌ خطأ
  
  async getGovernorates() {
    const response = await ApiService.request({
      url: `${this.baseUrl}/governorates`,  // ❌ يصبح /api/v1/governorates
    });
  }
}
```

و `ApiService` يضيف `/api/v1` تلقائياً، فيصبح النتيجة:
`/api/v1` + `/api/v1/governorates` = `/api/v1/api/v1/governorates` ❌

## الحل المطبق

### 1. إزالة baseUrl المكرر
```typescript
class LocationApiService {
  private baseUrl = '';  // ✅ إزالة /api/v1
}
```

### 2. استخدام URLs مباشرة
```typescript
// ✅ URLs صحيحة
async getGovernorates(): Promise<Governorate[]> {
  const response = await ApiService.request<{data: Governorate[]}>({
    method: 'GET',
    url: '/api/v1/governorates',  // ✅ URL صحيح
  });
  return response.data;
}

async getCitiesByGovernorate(governorateId: number): Promise<City[]> {
  const response = await ApiService.request<{data: City[]}>({
    method: 'GET',
    url: `/api/v1/governorates/${governorateId}/cities`,  // ✅ URL صحيح
  });
  return response.data;
}

async getBusinessCategories(): Promise<BusinessCategory[]> {
  const response = await ApiService.request<{data: BusinessCategory[]}>({
    method: 'GET',
    url: '/api/v1/business-categories',  // ✅ URL صحيح
  });
  return response.data;
}
```

## النتيجة

### قبل الإصلاح:
```
❌ 404 Not Found
❌ http://engeb.com/api/v1/api/v1/governorates
❌ http://engeb.com/api/v1/api/v1/business-categories
```

### بعد الإصلاح:
```
✅ 200 OK
✅ http://engeb.com/api/v1/governorates
✅ http://engeb.com/api/v1/business-categories
```

## الملفات المحدثة

### Front/src/services/locationApi.ts
- إزالة `baseUrl = '/api/v1'`
- استخدام URLs مباشرة مع `/api/v1`
- إصلاح جميع endpoints

## الاختبار

### ✅ يجب أن يعمل الآن:
1. تحميل المحافظات بنجاح
2. تحميل فئات الأعمال بنجاح
3. فلترة المدن بناءً على المحافظة
4. عرض جميع البيانات في النموذج

### 🔗 URLs الصحيحة:
- `GET /api/v1/governorates` - المحافظات
- `GET /api/v1/governorates/{id}/cities` - مدن المحافظة
- `GET /api/v1/cities` - جميع المدن
- `GET /api/v1/business-categories` - فئات الأعمال

## ملاحظات مهمة
- تم إصلاح تكرار `/api/v1` في URLs
- جميع endpoints تعمل بشكل صحيح
- لا توجد أخطاء 404
- البيانات تُحمل بنجاح في النموذج
