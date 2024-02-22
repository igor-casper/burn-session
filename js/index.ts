import { Contracts, CasperClient, Keys, RuntimeArgs, DeployUtil, CasperServiceByJsonRPC, PurseIdentifier } from 'casper-js-sdk';

import * as fs from 'fs';

const ARG_PURSES = "purses";
const CHAIN_NAME = 'casper-net-1';
const RPC_URL = 'http://localhost:11101/rpc';

// Note: Please provide private keys in hex format
const onePrivKey = '';
const twoPrivKey = '';

const runOne = async () => {
    const paymentAmount = 39112000;

    const keyPair = Keys.getKeysFromHexPrivKey(onePrivKey, Keys.SignatureAlgorithm.Ed25519);

    console.log(`* Using publicKey: ${keyPair.publicKey.toHex()}`);

    const cc = new CasperClient(RPC_URL);
    const rpcService = new CasperServiceByJsonRPC(RPC_URL);

    const contractClient = new Contracts.Contract(cc);

    const wasm = await fs.readFileSync('../target/wasm32-unknown-unknown/release/session.wasm');

    const args = RuntimeArgs.fromMap({});

    const balanceBeforeBurn = await rpcService.queryBalance(PurseIdentifier.MainPurseUnderPublicKey, keyPair.publicKey.toHex(false));
    console.log(`* balanceBeforeBurn * ${balanceBeforeBurn}`);

    const deploy = await contractClient.install(wasm, args, `${paymentAmount}`, keyPair.publicKey, 'casper-net-1', [keyPair]);

    const deployHash = await cc.putDeploy(deploy);
    console.log(`* deployHash * ${deployHash}`);

    const result = await rpcService.waitForDeploy(deploy);

    const balanceAfterBurn = await rpcService.queryBalance(PurseIdentifier.MainPurseUnderPublicKey, keyPair.publicKey.toHex(false));
    console.log(`* balanceAfterBurn * ${balanceAfterBurn}`);
}

const runTwo = async () => {
    const paymentAmount = 1_000_000_000; 

    const keyPair = Keys.getKeysFromHexPrivKey(twoPrivKey, Keys.SignatureAlgorithm.Ed25519);

    console.log(`* Using publicKey: ${keyPair.publicKey.toHex()}`);

    const cc = new CasperClient(RPC_URL);
    const rpcService = new CasperServiceByJsonRPC(RPC_URL);

    const contractClient = new Contracts.Contract(cc);

    const wasm = await fs.readFileSync('../target/wasm32-unknown-unknown/release/session.wasm');

    const args = RuntimeArgs.fromMap({});

    const balanceBeforeBurn = await rpcService.queryBalance(PurseIdentifier.MainPurseUnderPublicKey, keyPair.publicKey.toHex(false));
    console.log(`* balanceBeforeBurn * ${balanceBeforeBurn}`);

    const deploy = await contractClient.install(
      wasm, 
      args, 
      `${paymentAmount}`, 
      keyPair.publicKey, 
      'casper-net-1', 
      [keyPair]
    );

    const deployHash = await cc.putDeploy(deploy);
    console.log(`* deployHash * ${deployHash}`);

    const result = await rpcService.waitForDeploy(deploy);

    const realCost = result.execution_results[0].result!.Success!.cost;

    const balanceAfterBurn = await rpcService.queryBalance(PurseIdentifier.MainPurseUnderPublicKey, keyPair.publicKey.toHex(false));

    console.log(`* balanceAfterBurn * ${balanceAfterBurn}`);
    console.log(`* overcharge ${paymentAmount - Number(realCost)}`);
}


// runOne();
// runTwo();
