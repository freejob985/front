@echo off
echo ========================================
echo    Engeb Frontend Development Server
echo ========================================
echo.
echo Environment Configuration:
echo   - App Name: Engeb
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://localhost:8000/api/v1
echo   - Admin Panel: http://localhost:8000/admin
echo   - Categories: http://localhost:5173/categories
echo.
echo Environment Variables:
echo   - VITE_APP_NAME: Engeb
echo   - VITE_API_BASE_URL: http://localhost:8000
echo   - VITE_ADMIN_URL: http://localhost:8000/admin
echo.
echo Make sure the Laravel backend is running on port 8000
echo.
echo Starting Frontend Development Server...
echo.
npm run dev
