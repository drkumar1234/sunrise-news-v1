@echo off
title Sunrise News - Live Online Share Tunnel
cd /d "%~dp0"

echo ======================================================================
echo   SUNRISE NEWS - LIVE ONLINE SHARE LAUNCHER
echo ======================================================================
echo.
echo [1/2] Checking if local web server is running on http://localhost:3000...

powershell -NoProfile -Command "(Get-NetTCPConnection -State Listen -LocalPort 3000 -ErrorAction SilentlyContinue) | Select-Object -First 1" >nul 2>&1
if errorlevel 1 (
    echo Local server is NOT running. Starting server in new window...
    start "Sunrise News Server" cmd.exe /k "npm.cmd run dev"
    echo Waiting 8 seconds for server to initialize...
    timeout /t 8 /nobreak >nul
) else (
    echo Local server is already running!
)

echo.
echo [2/2] Launching Cloudflare Public Tunnel...
echo.
echo ======================================================================
echo IMPORTANT INSTRUCTIONS:
echo  1. Look below for your LIVE link: https://xxxx.trycloudflare.com
echo  2. Copy and share that link via WhatsApp / Browser.
echo  3. KEEP THIS WINDOW OPEN as long as you want people to visit.
echo     (If you close this window, the public link will stop working!)
echo ======================================================================
echo.

cloudflared.exe tunnel --url http://localhost:3000
pause
