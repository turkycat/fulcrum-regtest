# fulcrum-regtest

## steps so far

`--expose` should be unnecessary, `docker inspect` shows all 8 of the RPC/P2P ports exposed

`docker run --rm --name btc1 --network regtest --network-alias btc1 --expose 18443 -it ruimarinho/bitcoin-core:23 -regtest -printtoconsole -rpcuser=turkycat -rpcpassword=hunter1 -txindex -listen -rpcallowip=172.0.0.0/8`


`docker run --rm --name btc2 --network regtest --network-alias btc2 --expose 18443 -it ruimarinho/bitcoin-core:23 -regtest -printtoconsole -rpcuser=turkycat -rpcpassword=hunter1 -txindex -listen -connect=btc1 -rpcallowip=172.0.0.0/8`

before the commands below `bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 getblockchaininfo` will say `initialblockdownload: true`, but `false` after.

```bash
bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 createwallet turkywallet
bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 -rpcwallet=turkywallet getnewaddress
bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 -rpcwallet=turkywallet generatetoaddress 101 bcrt1q26gnvpw6mqhuaewdtur4hhefzhz4ec69dmkkdj
```

or 

```bash
bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 createwallet turkywallet3 && bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 -rpcwallet=turkywallet3 generatetoaddress 101 $(bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 -rpcwallet=turkywallet3 getnewaddress)
```

FULCRUM STILL WON'T CONNECT!!

`docker run --rm --network regtest -it cculianu/fulcrum Fulcrum -b btc3:18443 -u turkycat -p hunter1 -d`

or from inside the container:
`Fulcrum -b btc3:18443 -u turkycat -p hunter1 -D /data -d`

FINALLY, THE MAGIC

RPC is binding to 127.0.0.1 -- if you're going to allow IPs from a certain network you have to also bind to that network, not just the loopback

docker run --rm --name btc3 --network regtest --network-alias btc3 --expose 18443 -it ruimarinho/bitcoin-core:23 -regtest -printtoconsole -rpcuser=turkycat -rpcpassword=hunter1 -txindex -listen -connect=btc1 -rpcallowip=172.0.0.0/0 -rpcbind=btc3

## RPC auth

```bash
~/scratch/bitcoin/share/rpcauth$ python3 rpcauth.py turkycat
String to be appended to bitcoin.conf:
rpcauth=turkycat:db569a500cb8a053136a0cae6ae88511$06fcec65f738ff0446ab06f44915b7214f30d685f9ce0743683ac32de01b7d01
Your password:
U9BRts4Zqda9a5DMjW5raH_qSs9Zk22brsUp8B8Ubno
```

note '$' character, need to change to "$$" in docker-compose to prevent interpolation