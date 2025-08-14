@echo off
echo Starting BuyNow E-commerce Application...
echo.

echo Starting .NET API...
start "BuyNow API" cmd /k "cd API && dotnet run"

echo Waiting for API to start...
timeout /t 5 /nobreak > nul

echo Starting React Frontend...
start "BuyNow UI" cmd /k "cd UI && npm run dev"

echo.
echo Both services are starting...
echo API will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
