#!/bin/bash

# Check if the number of parameters is correct
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <address> <number of bitcoin>"
  exit 1
fi

# Assign the parameters to variables
address="\"$1\""
amount="$2"

# Print the variables for verification
echo "sending $amount bitcoin to address: $address"

AUTH="--user turkycat:hunter1"

curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "sendtoaddress", "params": ['${address}','${amount}']}' -H 'content-type: text/plain;' http://127.0.0.1:18442/ 2>/dev/null
