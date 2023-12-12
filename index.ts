// import Client from "bitcoin-core";
const Client = require("bitcoin-core");

const defaultClientParameters = {
  agentOptions: undefined,
  network: "regtest",
  password: "hunter1",
  port: 18442,
  username: "turkycat",
  version: "0.23.0",
  wallet: undefined,
};

const walletName = "turkywallet";

const getOrCreateWallet = async () => {
  const client = new Client(defaultClientParameters);

  try {
    await client.createWallet({
      wallet_name: walletName,
      avoid_reuse: false,
      descriptors: true,
      load_on_startup: true,
    });
  } catch (e) {
    if (
      /.*Failed to create database path .* Database already exists./.test(
        e.message
      )
    ) {
      // do nothing
    } else {
      throw e;
    }
  }

  return new Client({
    ...defaultClientParameters,
    wallet: walletName,
  });
};

(async function () {
  const wallet = await getOrCreateWallet();
  if (wallet) {
    console.log("wallet created");
  }

  const walletInfo = await wallet.getWalletInfo();
  console.log("walletInfo:", walletInfo);

  const descriptorInfo = await wallet.listDescriptors();
  // console.log("descriptorInfo:", descriptorInfo);

  // the receive descriptor is first
  const wpkh_recv = descriptorInfo.descriptors.find((d) => {
    return /^wpkh.*/.test(d.desc);
  });
  console.log("using receive descriptor:", wpkh_recv.desc);

  const wpkh_change = descriptorInfo.descriptors.findLast((d) => {
    return /^wpkh.*/.test(d.desc);
  });
  console.log("using change descriptor:", wpkh_change.desc);

  let balance = await wallet.getBalance();
  console.log("balance:", balance);

  if (balance === 0) {
    const address = await wallet.getNewAddress({ address_type: "bech32" });
    console.log("generating 101 blocks to wallet address:", address);
    await wallet.generateToAddress({
      nblocks: 101,
      address,
    });
    balance = await wallet.getBalance();
    console.log("new balance:", balance);
  }
})();
