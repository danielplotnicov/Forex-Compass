# ForexCompass

## Overview
ForexCompass is a web application for creating and managing trading strategies. This guide will help you set up the project and run the server to open the website.

## Prerequisites
- Windows OS
- Node.js and dependencies installed (the setup script will install it if it's not already installed)
- Internet connection for downloading Node.js (if not installed)

## Getting Started

### Step 1: Download the Project
1. Clone the repository or download the project files.
   ```sh
   git clone https://github.com/yourusername/ForexCompass.git
   ```
   
   Or download the ZIP file and extract it to your desired location.
 
### Step 2: Run the Setup Script
1. Navigate to the project directory where start-app.bat is located.
2. Double-click start-app.bat to run the setup script.

## What the Setup Script Does
1. Checks if Node.js is installed on your system. If not, it downloads and installs Node.js.
2. Checks if the necessary npm dependencies are installed. If not, it installs them.
3. Starts the server in a new command prompt window.
4. Waits 5 secondsfor the server to start and then opens the website in your default web browser.

##Project Structure
- server.js: The main server file.
- public/: Contains the public-facing files, including HTML, CSS, and client-side JavaScript.
- node_modules/: Contains all npm dependencies (created after running npm install).
- mydatabase.db: SQLite database file.

##Additional Information
- The server listens on port 3000 by default. If you need to change the port, update the port variable in server.js.

##Troubleshooting
- If the website does not open, ensure that the server is running and that there are no errors in the command prompt window where the server is running.
- If Node.js is not installing, check your internet connection and ensure that you have administrative privileges to install software on your machine.