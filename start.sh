#!/bin/bash

# --- DineFlow Master Launcher ---
# This script runs both Backend and Frontend simultaneously.

# ANSI Color Codes for pretty logs
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting DineFlow Ecosystem...${NC}"

# Function to kill all processes on exit
cleanup() {
    echo -e "\n${BLUE}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap Ctrl+C (SIGINT) and run the cleanup function
trap cleanup SIGINT

# 1. Start Backend
echo -e "${GREEN}📡 Waking up Backend Server...${NC}"
cd server
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to initialize
sleep 2

# 2. Start Frontend
echo -e "${GREEN}💻 Launching Frontend Dashboard...${NC}"
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "${BLUE}✨ Everything is live! Press Ctrl+C to stop all servers.${NC}"

# Keep the script running to catch the trap
wait
