#!/bin/bash

# Check if the number of parameters is correct
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <number_of_blocks>"
  exit 1
fi

number_of_blocks="$1"

echo "Mining $number_of_blocks blocks"

AUTH="--user turkycat:hunter1"

for ((i=0; i < $number_of_blocks; i++))
do
  response=`curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "getnewaddress", "params": []}' -H 'content-type: text/plain;' http://127.0.0.1:18442/ 2>/dev/null`
  address=`echo $response | jq .result`
  curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "generatetoaddress", "params": [1,'${address}']}' -H 'content-type: text/plain;' http://127.0.0.1:18442/ 2>/dev/null
done