import * as bip39 from "bip39";
import hdKey from "hdkey";
import {keyPair} from "./keypair";


export async function getKeyFromMnemonic(mnemonic, index){
    try {
        const path = `m/44'/195'/0/0/${index}`;
        const seed = await bip39.mnemonicToSeed(mnemonic);
        let node = hdKey.fromMasterSeed(seed);
        let keyPairBIP44 = node.derive(path);
        const keyPair = keyPair(keyPairBIP44.privateKey);
        return {private_key: keyPair.privateKey, public_key: keyPair.publicKey, address:keyPair.address, index: index};
    }catch (e) {
        throw Error(`get Key ETH failed: ${e}`)
    }
}