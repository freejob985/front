# PowerShell script to clear cache and restart development server

Write-Host "Clearing Vite cache and restarting development server..." -ForegroundColor Green

# Stop any running Node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear Vite cache
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "Cleared Vite cache" -ForegroundColor Yellow
}

# Clear dist folder
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "Cleared dist folder" -ForegroundColor Yellow
}

# Clear browser cache (Chrome)
Write-Host "Opening Chrome with cleared cache..." -ForegroundColor Blue
Start-Process "chrome" -ArgumentList "--new-window", "--disable-web-security", "--disable-features=VizDisplayCompositor", "--user-data-dir=$env:TEMP\chrome_dev_session"

# Restart development server
Write-Host "Starting development server..." -ForegroundColor Green
npm run dev
