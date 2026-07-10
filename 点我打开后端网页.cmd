@echo off
setlocal
title Open bilingual-host-ai backend

set "BACKEND_DIR=%~dp0backend"
set "PYTHON_EXE=%BACKEND_DIR%\.venv312\Scripts\python.exe"
set "BACKEND_URL=http://127.0.0.1:8000"
set "DOCS_URL=http://localhost:8000/docs"

if not exist "%PYTHON_EXE%" (
  echo Backend Python environment was not found:
  echo %PYTHON_EXE%
  echo.
  echo Please ask Codex to recreate backend\.venv312.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "try { Invoke-RestMethod -Uri '%BACKEND_URL%/api/health' -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"

if errorlevel 1 (
  echo Starting backend service...
  start "bilingual-host-ai backend" /D "%BACKEND_DIR%" cmd /k ""%PYTHON_EXE%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

  echo Waiting for backend to become ready...
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ok=$false; for($i=0;$i -lt 30;$i++){ try { Invoke-RestMethod -Uri '%BACKEND_URL%/api/health' -TimeoutSec 2 | Out-Null; $ok=$true; break } catch { Start-Sleep -Seconds 1 } }; if(-not $ok){ exit 1 }"

  if errorlevel 1 (
    echo Backend did not become ready.
    echo Please check the backend window for error messages.
    pause
    exit /b 1
  )
) else (
  echo Backend is already running.
)

echo Opening %DOCS_URL%
start "" "%DOCS_URL%"
exit /b 0
