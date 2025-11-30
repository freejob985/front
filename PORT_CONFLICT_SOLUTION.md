# حل مشكلة تعارض المنافذ - Engeb

## المشكلة
```
Error: Port 5174 is already in use
WebSocket server error: Port is already in use
```

## الحلول

### الحل الأول: إنهاء العملية التي تستخدم المنفذ

#### 1. فحص العمليات التي تستخدم المنفذ
```cmd
netstat -ano | findstr :5174
```

#### 2. فحص العملية بالتفصيل
```cmd
tasklist /FI "PID eq [PID_NUMBER]"
```

#### 3. إنهاء العملية
```cmd
taskkill /PID [PID_NUMBER] /F
```

### الحل الثاني: استخدام منفذ مختلف

#### 1. تشغيل Vite على منفذ مختلف
```cmd
npm run dev -- --port 5175
```

#### 2. أو تعديل vite.config.ts
```typescript
export default defineConfig({
  server: {
    port: 5175, // تغيير المنفذ هنا
    // ... باقي الإعدادات
  }
})
```

### الحل الثالث: إعادة تشغيل النظام
إذا لم تعمل الحلول السابقة، أعد تشغيل الكمبيوتر.

## التحقق من الحل

بعد تطبيق الحل، يجب أن ترى:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## منع المشكلة مستقبلاً

### 1. إنهاء خادم التطوير بشكل صحيح
- استخدم `Ctrl + C` لإنهاء الخادم
- لا تغلق نافذة Terminal مباشرة

### 2. فحص العمليات قبل التشغيل
```cmd
netstat -ano | findstr :5174
```

### 3. استخدام سكريبت إعادة التشغيل
```json
// في package.json
{
  "scripts": {
    "dev:clean": "taskkill /F /IM node.exe 2>nul & npm run dev"
  }
}
```

## ملاحظات مهمة

1. **PID**: Process ID - معرف العملية
2. **F**: Force - إجبار إنهاء العملية
3. **5174**: المنفذ الافتراضي لـ Vite
4. **node.exe**: عملية Node.js التي تشغل الخادم

## استكشاف الأخطاء

### إذا لم يعمل taskkill:
```cmd
# جرب مع /T لإجبار إنهاء العملية وكل العمليات الفرعية
taskkill /PID [PID_NUMBER] /T /F
```

### إذا استمرت المشكلة:
```cmd
# فحص جميع العمليات التي تستخدم Node.js
tasklist | findstr node
```
