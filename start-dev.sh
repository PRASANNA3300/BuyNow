#!/bin/bash

echo "Starting BuyNow E-commerce Application..."
echo

echo "Starting .NET API..."
cd API
dotnet run &
API_PID=$!

echo "Waiting for API to start..."
sleep 5

echo "Starting React Frontend..."
cd ../UI
npm run dev &
UI_PID=$!

echo
echo "Both services are starting..."
echo "API will be available at: http://localhost:5000"
echo "Frontend will be available at: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
trap "kill $API_PID $UI_PID; exit" INT
wait
