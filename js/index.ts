import { Contracts, CasperClient, Keys, RuntimeArgs, DeployUtil, CasperServiceByJsonRPC, PurseIdentifier, CLValueBuilder } from 'casper-js-sdk';

import * as fs from 'fs';

const ARG_PURSES = "purses";
const CHAIN_NAME = 'casper-net-1';
const RPC_URL = 'http://localhost:11101/rpc';

// Note: Please provide private keys in hex format
const onePrivKey = '';
const twoPrivKey = '';

const run = async () => {
    const paymentAmount = 2569812640;

    const keyPair = Keys.getKeysFromHexPrivKey(onePrivKey, Keys.SignatureAlgorithm.Ed25519);

    console.log(`* Using publicKey: ${keyPair.publicKey.toHex()}`);

    const cc = new CasperClient(RPC_URL);
    const rpcService = new CasperServiceByJsonRPC(RPC_URL);

    const contractClient = new Contracts.Contract(cc);

    const wasm = await fs.readFileSync('../target/wasm32-unknown-unknown/release/session.wasm');

    const balanceBeforeBurn = await rpcService.queryBalance(PurseIdentifier.MainPurseUnderPublicKey, keyPair.publicKey.toHex(false));
    console.log(`* balanceBeforeBurn * ${balanceBeforeBurn}`);

    const amountToBurn = CLValueBuilder.u512(balanceBeforeBurn.div(2))
    console.log(`* amountToBurn * ${amountToBurn.value().toString()}`)

    const args = RuntimeArgs.fromMap({
      amount: amountToBurn
    });

    const deploy = await contractClient.install(wasm, args, `${paymentAmount}`, keyPair.publicKey, 'casper-net-1', [keyPair]);

    const deployHash = await cc.putDeploy(deploy);
    console.log(`* deployHash * ${deployHash}`);

    const result = await rpcService.waitForDeploy(deploy);

    if (result.execution_results[0].result.Failure) {
      const resultToLog = result.execution_results[0].result;
      console.log(JSON.stringify(resultToLog, null, 2));
      return;
    }

    console.log(`* Success *`);
    const balanceAfterBurn = await rpcService.queryBalance(PurseIdentifier.MainPurseUnderPublicKey, keyPair.publicKey.toHex(false));
    console.log(`* balanceAfterBurn * ${balanceAfterBurn}`);
}

run();
