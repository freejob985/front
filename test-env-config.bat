@echo off
echo ========================================
echo   اختبار تكوين متغيرات البيئة
echo ========================================
echo.

echo [1/4] التحقق من وجود ملف .env...
if exist .env (
    echo ✅ ملف .env موجود
) else (
    echo ❌ ملف .env غير موجود
    echo 📝 إنشاء ملف .env من env.local...
    copy env.local .env
    if errorlevel 1 (
        echo ❌ فشل في إنشاء ملف .env
        exit /b 1
    )
    echo ✅ تم إنشاء ملف .env بنجاح
)
echo.

echo [2/4] عرض متغيرات API من ملف .env...
echo.
findstr "VITE_API" .env
echo.

echo [3/4] التحقق من المتغيرات المطلوبة...
findstr "VITE_API_URL" .env >nul
if errorlevel 1 (
    echo ❌ VITE_API_URL غير موجود في ملف .env
    exit /b 1
) else (
    echo ✅ VITE_API_URL موجود
)

findstr "VITE_API_MODE" .env >nul
if errorlevel 1 (
    echo ⚠️  VITE_API_MODE غير موجود في ملف .env
) else (
    echo ✅ VITE_API_MODE موجود
)
echo.

echo [4/4] ملخص التكوين:
echo ========================================
for /f "tokens=1,* delims==" %%a in ('findstr "VITE_API_URL" .env') do (
    echo API URL: %%b
)
for /f "tokens=1,* delims==" %%a in ('findstr "VITE_API_MODE" .env') do (
    echo API Mode: %%b
)
echo ========================================
echo.

echo ✅ اختبار التكوين اكتمل بنجاح!
echo.
echo 📝 الخطوات التالية:
echo    1. تأكد من تشغيل خادم Laravel على المنفذ المحدد
echo    2. قم بتشغيل: npm run dev
echo    3. افتح Console في المتصفح (F12)
echo    4. ابحث عن "Security Config" للتحقق من القيم
echo.
pause






