# fulcrum-regtest




### useful commands

send a bitcoin to the F wallet's 0th regtest address
`bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 -named sendtoaddress address="bcrt1q6g0mhnwcssfulc39as04k4xazaxt2s6eg0q6yj4uylzzcfy73n3sw8h3pw" amount=1 fee_rate=1`



import the F wallet
```
bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 -named createwallet wallet_name=f_wallet2 disable_private_keys=true blank=true descriptors=true
bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 -rpcwallet=f_wallet2 importdescriptors '[{ "desc": "wsh(multi(2,[25732241/84h/1h/0h/2h]tpubDFHnu4VcNjyj8VkUiAR5edPCRWJjrP2Mbar5BiLepxU23nEXo5mZmynzPc9h5wkqZD6bTWrsbTr1N4dryVjBMfgjYJBQUEDhzBU4NqHxQVu/0/*,[7737acb8]tpubD6NzVbkrYhZ4X3vCdevm3aFUdeSAWsbR4UhhdApbXnVUnvuwtq5NYqQ7zCkNhYG4JcPdGW4Wg4ZrVSYGpdoWsn337qmkP6CFgs7pZid12Sa/0/*,[dd7a3df3/84h/1h/0h/2h]tpubDEcxXkhzStbfzt9gPEbph3dGeR9uBMkr2rStYHcqxo9LwPDgAqbMgbYDJ8334MSesVVAwxcdYm4o7XJGjyDX6qNYEbTZov2gaMdGZjYFqXv/0/*))#00f5ljet", "timestamp": 0, "active": true }]'
```

get balances

`-rpcwallet` is not necessary if there is only one wallet

`bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 -rpcwallet=turkywallet getbalances`

`bitcoin-cli -regtest -rpcuser=turkycat -rpcpassword=hunter1 -rpcwallet=f_wallet getbalances`


## all of this is outdated -- dude... UPDATE ME

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

## test zoowhere descriptor

```bash
$ bdk-cli --network testnet repl --descriptor "wsh(multi(2,[25732241/84h/1h/0h/2h]tpubDFHnu4VcNjyj8VkUiAR5edPCRWJjrP2Mbar5BiLepxU23nEXo5mZmynzPc9h5wkqZD6bTWrsbTr1N4dryVjBMfgjYJBQUEDhzBU4NqHxQVu/0/*,[7737acb8]tpubD6NzVbkrYhZ4X3vCdevm3aFUdeSAWsbR4UhhdApbXnVUnvuwtq5NYqQ7zCkNhYG4JcPdGW4Wg4ZrVSYGpdoWsn337qmkP6CFgs7pZid12Sa/0/*,[dd7a3df3/84h/1h/0h/2h]tpubDEcxXkhzStbfzt9gPEbph3dGeR9uBMkr2rStYHcqxo9LwPDgAqbMgbYDJ8334MSesVVAwxcdYm4o7XJGjyDX6qNYEbTZov2gaMdGZjYFqXv/0/*))#00f5ljet"
>> wallet get_new_address
{
  "address": "tb1q6g0mhnwcssfulc39as04k4xazaxt2s6eg0q6yj4uylzzcfy73n3sr7ah55"
}
```

```bash
$ bdk-cli --network regtest repl --descriptor "wsh(multi(2,[25732241/84h/1h/0h/2h]tpubDFHnu4VcNjyj8VkUiAR5edPCRWJjrP2Mbar5BiLepxU23nEXo5mZmynzPc9h5wkqZD6bTWrsbTr1N4dryVjBMfgjYJBQUEDhzBU4NqHxQVu/0/*,[7737acb8]tpubD6NzVbkrYhZ4X3vCdevm3aFUdeSAWsbR4UhhdApbXnVUnvuwtq5NYqQ7zCkNhYG4JcPdGW4Wg4ZrVSYGpdoWsn337qmkP6CFgs7pZid12Sa/0/*,[dd7a3df3/84h/1h/0h/2h]tpubDEcxXkhzStbfzt9gPEbph3dGeR9uBMkr2rStYHcqxo9LwPDgAqbMgbYDJ8334MSesVVAwxcdYm4o7XJGjyDX6qNYEbTZov2gaMdGZjYFqXv/0/*))#00f5ljet"
>> wallet get_new_address
{
  "address": "bcrt1q2dxwe0mpe2yvk9ak86v8qk5seav4ez4vq5z59ywulauexapzhf8qfhwcmq"
}
```

## other wallet

```js
const keys = [ {
    'origin': '5708531c',
    'fingerprint': 'b37570e9',
    'depth': 4,
    'index': 2147483650,
    'main': {
      'xprv': 'xprvA1s9KMzNyXiek58e6QbKPeCCtwMDApvqjgppNWjVgvTWRWRKAt7E38WjyNbCoXgC57LSyEpA9UQ3YNDSiWSkNfHGP8fpxvMw2KLLkdropaz',
      'xpub': 'xpub6ErVisXGouGwxZD7CS8Kkn8wSyBhaHeh6ukRAu97FFzVJJkTiRRUavqDperj5zmuC6QKXfbqXyw4SPM2721Xjs5Ep6HQsfdWDrBhaN9vAkK'
    },
    'test': {
      'tprv': 'tprv8iY66hJiNoYjLtNAkySpZHpCD4mRQLxr5EjwEw9xAtwzD7AQAFSyYstBtYkrou4WSYsDyLRvJpyr1DmBqinhBiYrumt8dH5ywR5mCKa1pb6',
      'tpub': 'tpubDFE8F7LxXBEQEMPxed7QxhUJn6HMZg9keYLiXTCFbAkP3bRAneGZjNW44gwWcVj8yzwE9F7i55m78ZqdVsrmdJXXsh2iZCHjoon7LRAjXcu'
    }
  },
  {
    'origin': '946d4c49',
    'fingerprint': 'e6e4aefc',
    'depth': 4,
    'index': 2147483650,
    'main': {
      'xprv': 'xprvA2AKWHf5m1JJbCK3NqiNun6bSwuL9UpGZeZZkMWmsosCM7kfzYCdRManp6vzgSa9LKQgEthPdYiDQ3V7wGYMXhu4xGU956Ue7kFKYcxGkZx',
      'xpub': 'xpub6F9fuoBybNrbogPWUsFPGv3KzyjpYwY7vsVAYjvPS9QBDv5pY5Wsy9uGfR4qK295wSen2uuy3yGRDDbC36eqX2wkc4x49iJpUGcXDtHSpqu'
    },
    'test': {
      'tprv': 'tprv8iqGHcyRAH8PC1Ya3QZt5Riam5KYNzrGuCUgcmwEMnMg8iVkyuYNw6xEjH6egoxThkwTEzK9nuJ1ru2s4UtJLmAfUugSjTCh2qzjzMxxN6p',
      'tpub': 'tpubDFXJS31fJep45UaMw4EUUqNhL6qUYL3BUW5TuHyXn4A4yCkXcJMy7ba6uT9cqX6KjMBgeVRqb56TuQ5oRxW5QUQ3ffhMqEy44ECvyxhwUFk'
    }
  },
  {
    'origin': '4c69896e',
    'fingerprint': '45f38844',
    'depth': 4,
    'index': 2147483650,
    'main': {
      'xprv': 'xprv9ze6Dp2MErDKjdqvEuigDQTNkmNR9YukTxbWtNZPfpxrwfmmT4hNdMeLHzsaCf7PGbd3a3fmhMtMdWFzNWbCD8GfJhZcEqr2PQ4xZgTPH5u',
      'xpub': 'xpub6DdSdKZF5Dmcx7vPLwFgaYQ7JoCuZ1dbqBX7gky1EAVqpU6uzc1dB9xp9ERgb2M7SWjCiotv9wRfR7FJcT1Xe3QfqmqCr8p79B6oW1XZd3s'
    },
    'test': {
      'tprv': 'tprv8hK319Lge83QLT5SuUaBP45N4tndP4wkoWWdknyr9oTLjGWrSS38971nDB3ED2Vhe39pa9HXriUA6MojViw92BYFqLmuuCa5JVpP1PeJbuH',
      'tpub': 'tpubDE159ZNvnVj5Dv7Eo8EmnTjUdvJZYQ8fNp7R3K29a5FjZkmd4priKbdePGWU7XJMERG7LPQnh3Fi7Hjv1JrmXUrxuNaWXfULj8hDG7biXqh'
    }
  }
]
```

receive:
```bash
$ bdk-cli --network regtest repl --descriptor "wsh(multi(2,[5708531c/84h/1h/0h/2h]tpubDFE8F7LxXBEQEMPxed7QxhUJn6HMZg9keYLiXTCFbAkP3bRAneGZjNW44gwWcVj8yzwE9F7i55m78ZqdVsrmdJXXsh2iZCHjoon7LRAjXcu/0/*,[946d4c49/84h/1h/0h/2h]tpubDFXJS31fJep45UaMw4EUUqNhL6qUYL3BUW5TuHyXn4A4yCkXcJMy7ba6uT9cqX6KjMBgeVRqb56TuQ5oRxW5QUQ3ffhMqEy44ECvyxhwUFk/0/*,[4c69896e/84h/1h/0h/2h]tpubDE159ZNvnVj5Dv7Eo8EmnTjUdvJZYQ8fNp7R3K29a5FjZkmd4priKbdePGWU7XJMERG7LPQnh3Fi7Hjv1JrmXUrxuNaWXfULj8hDG7biXqh/0/*))"
>> wallet get_new_address
{
  "address": "bcrt1q8vw3juyk7gm7elt8rut87mghe50sxc32njs7zn9fqv6ynsxr52xq4h2uu0"
}
>> wallet get_new_address
{
  "address": "bcrt1q5gr9zytkp3pdqdsfca096t7jrj2hfn0qu5maan3ew0eauvreg8jqw624ga"
}
```

change: 
```bash
$ bdk-cli --network regtest repl --descriptor "wsh(multi(2,[5708531c/84h/1h/0h/2h]tpubDFE8F7LxXBEQEMPxed7QxhUJn6HMZg9keYLiXTCFbAkP3bRAneGZjNW44gwWcVj8yzwE9F7i55m78ZqdVsrmdJXXsh2iZCHjoon7LRAjXcu/1/*,[946d4c49/84h/1h/0h/2h]tpubDFXJS31fJep45UaMw4EUUqNhL6qUYL3BUW5TuHyXn4A4yCkXcJMy7ba6uT9cqX6KjMBgeVRqb56TuQ5oRxW5QUQ3ffhMqEy44ECvyxhwUFk/1/*,[4c69896e/84h/1h/0h/2h]tpubDE159ZNvnVj5Dv7Eo8EmnTjUdvJZYQ8fNp7R3K29a5FjZkmd4priKbdePGWU7XJMERG7LPQnh3Fi7Hjv1JrmXUrxuNaWXfULj8hDG7biXqh/1/*))"
>> wallet get_new_address
{
  "address": "bcrt1qgv2ktzfs3ez3p86ul56xww5ueuea82a3u4rs80khk9hwp0c2g79qdvvlzu"
}
>> wallet get_new_address
{
  "address": "bcrt1q6upyr744cdqz7e0t3pgl80v2wumcm7pxla8g52wv33ufm5rfnc9sgy498y"
}
```

