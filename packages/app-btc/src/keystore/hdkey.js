import * as bip39 from 'bip39';
import { keyPair } from './keypair';

const hdKey = require('hdkey');

// eslint-disable-next-line import/prefer-default-export
export async function getKeyFromMnemonic(mnemonic, index, options) {
  try {
    const { network } = options;
    const coinType = network.startsWith('BTC') ? 0 : 2;
    const path = `m/49'/${coinType}'/0'/0/${index}`;
    /*
            purpose 44: for legacy, prefix: 1
            purpose 49: for p2sh, prefix: 3
            purpose 84: for bench32, prefix: bc1
         */
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const node = hdKey.fromMasterSeed(seed);
    const keyPairBIP44 = node.derive(path);
    const key = keyPair(keyPairBIP44.privateKey, options);
    return {
      private_key: key.privateKey, public_key: key.publicKey, address: key.address, index,
    };
  } catch (e) {
    throw Error(`get Key ${options.network} failed: ${e}`);
  }
}
