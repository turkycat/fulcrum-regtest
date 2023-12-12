import RegtestClient from "./regtest_client";

(async function () {
  // you may optionally specify a wallet name which will be created for you if it does not exist
  const client = new RegtestClient({ wallet: "turkywallet1" });
  await client.initialize();
})();
