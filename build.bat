@echo off
setlocal

where py >nul 2>nul
if %errorlevel%==0 (
    py build.py
) else (
    python build.py
)

endlocal
