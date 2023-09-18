#!/bin/bash

source ../.env
echo "Deploying CryptoZombie App"
echo "============================"

cd ../app

touch .env
echo "VITE_TOKEN_ADDRESS=$TOKEN_ADDRESS" >> .env
echo "VITE_GAME_ADDRESS=$GAME_ADDRESS" >> .env

npm run dev