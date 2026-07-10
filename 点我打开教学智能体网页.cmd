@echo off
setlocal
title Open bilingual-host-ai app

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "PYTHON_EXE=%BACKEND_DIR%\.venv312\Scripts\python.exe"
set "BACKEND_URL=http://127.0.0.1:8000"
set "APP_URL=http://localhost:5173"

if not exist "%PYTHON_EXE%" (
  echo Backend Python environment was not found:
  echo %PYTHON_EXE%
  pause
  exit /b 1
)

if not exist "%FRONTEND_DIR%\node_modules" (
  echo Frontend dependencies were not found:
  echo %FRONTEND_DIR%\node_modules
  echo.
  echo Please run npm install in the frontend folder first.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "try { Invoke-RestMethod -Uri '%BACKEND_URL%/api/health' -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"

if errorlevel 1 (
  echo Starting backend service...
  start "bilingual-host-ai backend" /D "%BACKEND_DIR%" cmd /k ""%PYTHON_EXE%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000"
) else (
  echo Backend is already running.
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "try { Invoke-WebRequest -Uri '%APP_URL%' -UseBasicParsing -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"

if errorlevel 1 (
  echo Starting frontend page...
  start "bilingual-host-ai frontend" /D "%FRONTEND_DIR%" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173"
) else (
  echo Frontend is already running.
)

echo Waiting for the teaching app page...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ok=$false; for($i=0;$i -lt 30;$i++){ try { Invoke-WebRequest -Uri '%APP_URL%' -UseBasicParsing -TimeoutSec 2 | Out-Null; $ok=$true; break } catch { Start-Sleep -Seconds 1 } }; if(-not $ok){ exit 1 }"

if errorlevel 1 (
  echo The teaching app page did not become ready.
  echo Please check the backend and frontend windows for error messages.
  pause
  exit /b 1
)

echo Opening %APP_URL%
start "" "%APP_URL%"
exit /b 0
