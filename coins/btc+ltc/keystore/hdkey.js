import * as bip39 from "bip39";
import hdKey from "hdkey";
import {keyPair} from "./keypair";

export async function getKeyFromMnemonic(mnemonic, index, options){
    try {
        const {network} = options;
        const coinType = network.startsWith('BTC') ? 0 : 2;
        const path = `m/49'/${coinType}'/0'/0/${index}`;
        /*
            purpose 44: for legacy, prefix: 1
            purpose 49: for p2sh, prefix: 3
            purpose 84: for bench32, prefix: bc1
         */
        const seed = await bip39.mnemonicToSeed(mnemonic);
        let node = hdKey.fromMasterSeed(seed);
        let keyPairBIP44 = node.derive(path);
        const key = keyPair(keyPairBIP44.privateKey, options);
        return {private_key: key.privateKey, public_key: key.publicKey, address:key.address, index: index};
    }catch (e) {
        throw Error(`get Key ${options.network} failed: ${e}`)
    }
}
