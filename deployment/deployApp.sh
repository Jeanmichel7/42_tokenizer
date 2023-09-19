#!/bin/bash

source ../.env
echo "Deploying CryptoZombie App"
echo "============================"

cd ../app

touch .env
echo "Updating .env file with addresses"
sed -i.bak "s/VITE_TOKEN_ADDRESS=.*/VITE_TOKEN_ADDRESS=$TOKEN_ADDRESS/" .env
sed -i.bak "s/VITE_GAME_ADDRESS=.*/VITE_GAME_ADDRESS=$GAME_ADDRESS/" .env

# echo "VITE_TOKEN_ADDRESS=$TOKEN_ADDRESS" >> .env
# echo "VITE_GAME_ADDRESS=$GAME_ADDRESS" >> .env

npm run dev