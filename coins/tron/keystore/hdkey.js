import * as bip39 from "bip39";
import hdKey from "hdkey";
import {keyPair} from "./keypair";


export async function getKeyFromMnemonic(mnemonic, index){
    try {
        const path = `m/44'/195'/0'/0/${index}`;
        const seed = await bip39.mnemonicToSeed(mnemonic);
        let node = hdKey.fromMasterSeed(seed);
        let keyPairBIP44 = node.derive(path);
        const key = keyPair(keyPairBIP44.privateKey);
        return {private_key: key.privateKey, public_key: key.publicKey, address:key.address, index: index};
    }catch (e) {
        throw Error(`get Key TRON failed: ${e}`)
    }
}