#!/bin/bash

AUTH="--user turkycat:hunter1"

# create a wallet
curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "createwallet", "params": {"wallet_name":"turkywallet","avoid_reuse":true,"descriptors":true,"load_on_startup":true}}' -H 'content-type: text/plain;' http://127.0.0.1:18442/

for ((i=0; i < 101; i++))
do
  response=`curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "getnewaddress", "params": []}' -H 'content-type: text/plain;' http://127.0.0.1:18442/`
  address=`echo $response | jq .result`
  curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "generatetoaddress", "params": [1,'${address}']}' -H 'content-type: text/plain;' http://127.0.0.1:18442/
done
