#!/bin/bash

source ../.env
echo "Deploying CryptoZombie Game to Goerli testnet"
echo "============================"
echo "GOERLI_RPC_URL: $GOERLI_RPC_URL"

cd ../code

#Deploy token
# tokenAddress=$(\
# forge create \
#   src/Token42.sol:Token42 \
#   --rpc-url=$GOERLI_RPC_URL \
#   --private-key=$PRIVATE_KEY \
#   --constructor-args Token42 FTCT \
#   --etherscan-api-key=$ETHERSCAN_API_KEY \
#   --verify \
#   | grep -oP '(?<=Deployed to: )\S+')
# echo "Deployed Token42 at address: $tokenAddress"


# Deploy game
forge create \
  src/zombieownership.sol:ZombieOwnership \
  --constructor-args $TOKEN_ADDRESS \
  --rpc-url=$GOERLI_RPC_URL \
  --private-key=$PRIVATE_KEY \
  --etherscan-api-key=$ETHERSCAN_API_KEY \
  --verify \
  #option d'attente de la transaction ?
