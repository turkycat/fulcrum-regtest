#!/bin/bash

AUTH="--user turkycat:hunter1"

# create a wallet
curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "createwallet", "params": {"wallet_name":"turkywallet","avoid_reuse":true,"descriptors":true,"load_on_startup":true}}' -H 'content-type: text/plain;' http://127.0.0.1:18442/ 2>/dev/null

for ((i=0; i < 101; i++))
do
  response=`curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "getnewaddress", "params": []}' -H 'content-type: text/plain;' http://127.0.0.1:18442/ 2>/dev/null`
  address=`echo $response | jq .result`
  curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "generatetoaddress", "params": [1,'${address}']}' -H 'content-type: text/plain;' http://127.0.0.1:18442/ 2>/dev/null
done

if [ ! -e "descriptors" ]
then
  mkdir descriptors
fi

descriptor_filename=descriptors/desc-`date +%Y%m%d-%H%M%S`
curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "listdescriptors", "params": []}' -H 'content-type: text/plain;' http://127.0.0.1:18442/ | jq > ${descriptor_filename} 2>/dev/null
curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "listdescriptors", "params": [true]}' -H 'content-type: text/plain;' http://127.0.0.1:18442/ | jq > ${descriptor_filename}_private 2>/dev/null