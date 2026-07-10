@echo off
setlocal
title bilingual-host-ai backend
cd /d "%~dp0"

set "PYTHON_EXE=%CD%\.venv312\Scripts\python.exe"

if not exist "%PYTHON_EXE%" (
  echo Backend virtual environment was not found.
  echo Missing: %PYTHON_EXE%
  echo Please ask Codex to recreate backend\.venv312.
  pause
  exit /b 1
)

if not exist "%CD%\app\main.py" (
  echo Cannot find backend app entry: %CD%\app\main.py
  pause
  exit /b 1
)

echo Checking backend Python environment...
"%PYTHON_EXE%" -c "import fastapi, uvicorn, sqlalchemy, pydantic; print('Environment OK')" || (
  echo.
  echo Backend dependencies are incomplete.
  pause
  exit /b 1
)

echo.
echo Starting bilingual-host-ai backend on http://127.0.0.1:8000
echo API docs: http://127.0.0.1:8000/docs
echo Press Ctrl+C in this window to stop the backend.
echo.
"%PYTHON_EXE%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000

echo.
echo Backend stopped or failed to start.
echo If port 8000 is already in use, close the old backend window and run this file again.

pause
