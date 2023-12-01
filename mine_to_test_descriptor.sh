#!/bin/bash

AUTH="--user turkycat:hunter1"
curl $AUTH --data-binary '{"jsonrpc": "1.0", "id": "0", "method": "generatetoaddress", "params": [1,"bcrt1q8vw3juyk7gm7elt8rut87mghe50sxc32njs7zn9fqv6ynsxr52xq4h2uu0"]}' -H 'content-type: text/plain;' http://127.0.0.1:18442/ 2>/dev/null
