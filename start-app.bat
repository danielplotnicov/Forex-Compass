@echo off

:: Check if Node.js is installed
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Installing Node.js...

    :: Download Node.js installer (LTS version)
    powershell -Command "Start-Process 'https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi' -Wait"

    :: Install Node.js (you may need to adjust the installer path)
    msiexec /i node-v14.17.0-x64.msi /quiet /norestart

    :: Clean up installer
    del node-v14.17.0-x64.msi

    echo Node.js installation completed.
) ELSE (
    echo Node.js is already installed.
)

:: Check if npm dependencies are installed
if not exist node_modules (
    echo Installing npm dependencies...
    npm install
) ELSE  (
    echo Node.js dependencies are already installed.
)

:: Start the server in a new command prompt window
start cmd /k "node server.js"

:: Wait for a few seconds to ensure the server is running
timeout /t 5 /nobreak

:: Open the website in the default web browser
start http://localhost:3000