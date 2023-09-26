#!/bin/bash

source ../.env
echo "Deploying CryptoZombie App"
echo "============================"

cd ../app

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Create or updating .env file with addresses"
if [ -z "$TOKEN_ADDRESS" ]; then
    echo "Please set TOKEN_ADDRESS in .env file at the project root."
    exit 1
fi

if [ -z "$GAME_ADDRESS" ]; then
    echo "Please set GAME_ADDRESS in .env file at the project root."
    exit 1
fi

touch .env

grep -q "VITE_TOKEN_ADDRESS=" .env
if [ $? -eq 0 ]; then
    sed -i "s/VITE_TOKEN_ADDRESS=.*/VITE_TOKEN_ADDRESS=$TOKEN_ADDRESS/" .env
else
    echo "VITE_TOKEN_ADDRESS=$TOKEN_ADDRESS" >> .env
fi

grep -q "VITE_GAME_ADDRESS=" .env
if [ $? -eq 0 ]; then
    sed -i "s/VITE_GAME_ADDRESS=.*/VITE_GAME_ADDRESS=$GAME_ADDRESS/" .env
else
    echo "VITE_GAME_ADDRESS=$GAME_ADDRESS" >> .env
fi

npm run dev