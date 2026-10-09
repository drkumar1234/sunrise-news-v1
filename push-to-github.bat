@echo off
title Push Sunrise News to GitHub
cd /d "%~dp0"
echo ========================================================
echo  Pushing Sunrise News to https://github.com/drkumar1234/sunrise-news-v1.git
echo ========================================================
echo.
git push -u origin main
echo.
pause
