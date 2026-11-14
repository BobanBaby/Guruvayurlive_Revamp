@echo off
title Guruvayur Live - Local Redesign Demo & Admin Portal
cd /d "%~dp0"
set NODE_PATH=%~dp0..\\node_modules;%NODE_PATH%

echo ==========================================================
echo   🚩 GURUVAYUR LIVE - REDESIGN DEMO & ADMIN DASHBOARD
echo ==========================================================
echo.
echo Starting local web server...
echo.

start "" "http://localhost:3000"
start "" "http://localhost:3000/admin"

node server.js
pause
