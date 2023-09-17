#!/bin/bash

source ../.env
echo "Deploying Token to Goerli testnet"
echo "============================"
echo "GOERLI_RPC_URL: $GOERLI_RPC_URL"

cd ../code

forge create \
  src/Token42.sol:Token42 \
  --rpc-url=$GOERLI_RPC_URL \
  --private-key=$PRIVATE_KEY \
  --constructor-args CryptoZombie42 FTCZ \
  --etherscan-api-key=$ETHERSCAN_API_KEY \
  --verify \
