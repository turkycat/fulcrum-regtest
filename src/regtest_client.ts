import Client from "bitcoin-core";
// import type { RpcError } from "bitcoin-core";

const defaultClientParameters = {
  agentOptions: undefined,
  network: "regtest",
  password: "hunter1",
  port: 18442,
  username: "turkycat",
  version: "0.23.0",
  wallet: undefined,
};

const defaultWallet = "turkywallet";

/*
 * This component extends and simplifies the Client component from the bitcoin-core NPM package.
 * to use, create a new instance of RegtestClient and call initialize() on it.
 * 
 * you may optionally specify a wallet name which will be created for you if it does not exist.
 * 
 * initialize will perform the necessary steps to ensure that the client connection is established
 * and the wallet is funded.
 */
export default class RegtestClient extends Client {
  constructor({ wallet = defaultWallet } = {}) {
    super({ ...defaultClientParameters, wallet });
  }

  async initialize(): Promise<void> {
    let shouldCreateWallet = true;
    try {
      const walletInfo = await this.getWalletInfo();
      shouldCreateWallet = false;
      console.log("using existing wallet:", walletInfo.walletname);
    } catch (e: any) {
      if (
        /^Requested wallet does not exist or is not loaded$/.test(e.message)
      ) {
        // do nothing
      } else {
        throw e;
      }
    }

    if (shouldCreateWallet) {
      console.log("wallet does not exist, creating:", this.wallet);
      await this.createWallet({
        wallet_name: this.wallet,
        avoid_reuse: true,
        descriptors: true,
        load_on_startup: true,
      });
    }

    const descriptorInfo = await this.listDescriptors();
    this.wpkh_recv = descriptorInfo.descriptors.find((d: any) => {
      return /^wpkh.*/.test(d.desc);
    });
    console.log("using receive descriptor:", this.wpkh_recv.desc);

    this.wpkh_change = descriptorInfo.descriptors.findLast((d: any) => {
      return /^wpkh.*/.test(d.desc);
    });
    console.log("using change descriptor:", this.wpkh_change.desc);

    let balance = await this.getBalance();
    console.log("wallet balance:", balance);

    if (balance === 0) {
      const address = await this.getNewAddress({ address_type: "bech32" });
      console.log(
        "wallet needs funds for spending. generating 101 blocks to wallet address:",
        address
      );
      await this.generateToAddress({
        nblocks: 101,
        address,
      });
      balance = await this.getBalance();
      console.log(
        `new wallet balance: ${balance}. more funds will be available with each new block mined.`
      );
    }
  };
}
