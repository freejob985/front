@echo off
echo Clearing Vite cache and restarting development server...

REM Stop any running processes
taskkill /f /im node.exe 2>nul

REM Clear Vite cache
if exist node_modules\.vite rmdir /s /q node_modules\.vite

REM Clear dist folder
if exist dist rmdir /s /q dist

REM Clear browser cache (Chrome)
echo Clearing browser cache...
start chrome --new-window --disable-web-security --disable-features=VizDisplayCompositor --user-data-dir="%TEMP%\chrome_dev_session"

REM Restart development server
echo Starting development server...
npm run dev

pause
