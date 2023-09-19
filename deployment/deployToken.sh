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
  --constructor-args $TOKEN_NAME $TOKEN_SYMBOL \
  --etherscan-api-key=$ETHERSCAN_API_KEY \
  --verify \
  --delay 10 \
  | tee tmp_log_deploy_token.txt

tokenAddress=$(grep -oP '(?<=Deployed to: )\S+' tmp_log_deploy_token.txt)
echo "Deployed FTCZ token contract at address: $tokenAddress"

echo "Updating .env file with the new TOKEN_ADDRESS"
sed -i.bak "s/TOKEN_ADDRESS=.*/TOKEN_ADDRESS=$tokenAddress/" ../.env

rm tmp_log_deploy_token.txt