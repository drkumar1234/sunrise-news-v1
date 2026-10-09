@echo off
title Sunrise News Live Server
echo ===================================================
echo   SUNRISE NEWS - Live Development Server
echo   Running at: http://localhost:3000
echo   Admin CMS:  http://localhost:3000/admin/login
echo ===================================================
echo.
cd /d "%~dp0"
call npm.cmd run dev
pause
