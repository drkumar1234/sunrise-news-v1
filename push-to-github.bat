@echo off
title Push Sunrise News to GitHub
cd /d "%~dp0"
echo ========================================================
echo  Pushing Sunrise News to:
echo  https://github.com/drkumar1234/sunrise-news-v1.git
echo ========================================================
echo.
echo [1/2] Checking and preparing latest files...
git add .
git commit -m "Update Sunrise News project" >nul 2>&1

echo.
echo [2/2] Pushing all files to GitHub...
echo (If a GitHub login dialog appears, click "Sign in with browser")
echo.
git push -u origin main
echo.
echo ========================================================
echo Done! Check your repository:
echo https://github.com/drkumar1234/sunrise-news-v1
echo ========================================================
echo.
pause

