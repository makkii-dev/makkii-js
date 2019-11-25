import * as bip39 from "bip39";
import {keyPair} from "./keypair";

const hdKey = require('hdkey');
// eslint-disable-next-line import/prefer-default-export
export async function getAccountFromMnemonic(mnemonic, index){
    try {
        const path = `m/44'/60'/0'/0/${index}`;
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const node = hdKey.fromMasterSeed(seed);
        const keyPairBIP44 = node.derive(path);
        const key = keyPair(keyPairBIP44.privateKey);
        return {private_key: key.privateKey, public_key: key.publicKey, address:key.address, index};
    }catch (e) {
        throw Error(`get Key ETH failed: ${e}`)
    }
}