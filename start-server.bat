@echo off
echo ========================================
echo Atelia Built - Local Development Server
echo ========================================
echo.
echo Starting server on http://localhost:8000
echo.
echo Main Page: http://localhost:8000/index.html
echo Admin Panel: http://localhost:8000/admin.html
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
python -m http.server 8000

