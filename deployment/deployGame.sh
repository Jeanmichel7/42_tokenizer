#!/bin/bash

source ../.env
echo "Deploying CryptoZombie Game to Goerli testnet"
echo "============================"
echo "GOERLI_RPC_URL: $GOERLI_RPC_URL\n"

git submodule update --init --recursive
cd ../code

# Deploy game

if [ -z "$TOKEN_ADDRESS" ]; then
    echo "Please define TOKEN_ADDRESS in the .env file at the project root."
    exit 1
fi

echo "Deploying ZombieOwnership contract..."

forge create \
  src/zombieownership.sol:ZombieOwnership \
  --constructor-args $TOKEN_ADDRESS \
  --rpc-url=$GOERLI_RPC_URL \
  --private-key=$PRIVATE_KEY \
  --etherscan-api-key=$ETHERSCAN_API_KEY \
  --verify \
  --delay 10 \
  | tee tmp_log_deploy_game.txt

gameAddress=$(grep -oP '(?<=Deployed to: )\S+' tmp_log_deploy_game.txt)
echo "Deployed ZombieOwnership at address: $gameAddress"

echo "Updating .env file with the new GAME_ADDRESS"
sed -i.bak "s/GAME_ADDRESS=.*/GAME_ADDRESS=$gameAddress/" ../.env

rm tmp_log_deploy_game.txt