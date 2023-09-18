#!/bin/bash

source ../.env
echo "Deploying CryptoZombie Game to Goerli testnet"
echo "============================"
echo "GOERLI_RPC_URL: $GOERLI_RPC_URL\n"
cd ../code

# Deploy game
forge create \
  src/zombieownership.sol:ZombieOwnership \
  --constructor-args $TOKEN_ADDRESS \
  --rpc-url=$GOERLI_RPC_URL \
  --private-key=$PRIVATE_KEY \
  --etherscan-api-key=$ETHERSCAN_API_KEY \
  --verify \
  | tee tmp_log_deploy_game.txt

gameAddress=$(grep -oP '(?<=Deployed to: )\S+' tmp_log_deploy_game.txt)
echo "Deployed ZombieOwnership at address: $gameAddress"

echo "Updating .env file with the new GAME_ADDRESS"
sed -i.bak "s/GAME_ADDRESS=.*/GAME_ADDRESS=$gameAddress/" ../.env

rm tmp_log_deploy_game.txt