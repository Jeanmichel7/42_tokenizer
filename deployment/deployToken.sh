#!/bin/bash

source ../.env
echo "Deploying Token to Goerli testnet"
echo "============================"
echo "GOERLI_RPC_URL: $GOERLI_RPC_URL"

git submodule update --init --recursive
cd ../code

# Create the array of multisig owners
MULTISIG_ADDRESSES="["
COUNT=1

while true; do
    ADDR_VAR_NAME="MULTISIG_PUBLIC_ADDR_$COUNT"
    ADDR=${!ADDR_VAR_NAME}

    if [ -z "$ADDR" ]; then
        break
    fi

    if [ $COUNT -gt 1 ]; then
        MULTISIG_ADDRESSES+=","
    fi
    MULTISIG_ADDRESSES+="$ADDR"

    COUNT=$((COUNT+1))
done
COUNT=$((COUNT-1))
MULTISIG_ADDRESSES+="]"
echo "MULTISIG_ADDRESSES: $MULTISIG_ADDRESSES"
echo "COUNT: $COUNT"

# Use the array in the constructor arguments
CONSTRUCTOR_ARGS="$TOKEN_NAME $TOKEN_SYMBOL $MULTISIG_ADDRESSES $COUNT"

forge create \
  src/Token42.sol:Token42 \
  --rpc-url=$GOERLI_RPC_URL \
  --private-key=$PRIVATE_KEY \
  --constructor-args $CONSTRUCTOR_ARGS \
  --etherscan-api-key=$ETHERSCAN_API_KEY \
  --verify \
  --delay 10 \
  | tee tmp_log_deploy_token.txt

tokenAddress=$(grep -oP '(?<=Deployed to: )\S+' tmp_log_deploy_token.txt)
echo "Deployed FTCZ token contract at address: $tokenAddress"

echo "Updating .env file with the new TOKEN_ADDRESS"

touch ../.env
grep -q "TOKEN_ADDRESS=" ../.env
if [ $? -eq 0 ]; then
    sed -i "s/TOKEN_ADDRESS=.*/TOKEN_ADDRESS=$TOKEN_ADDRESS/" ../.env
else
    echo "TOKEN_ADDRESS=$TOKEN_ADDRESS" >> ../.env
fi


rm tmp_log_deploy_token.txt