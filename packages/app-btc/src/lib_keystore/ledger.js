import Btc from '@ledgerhq/hw-app-btc';
import { payments } from 'bitcoinjs-lib';
import { networks } from './network';

// eslint-disable-next-line import/no-mutable-exports
let wallet = {};

const initWallet = (transport) => {
  wallet = new Btc(transport);
};

const getWalletStatus = async () =>{
  try{
    await getAccountByLedger(0, 'BTC');
    return true;
  }catch(e) {
    return false;
  }
} ;

const getAccountByLedger = async (index, network) => {
  /*
        purpose 44: for legacy, prefix: 1
        purpose 49: for p2sh, prefix: 3
        purpose 84: for bench32, prefix: bc1
    */
  const coinType = network.startsWith('BTC') ? 0 : 2;
  const network_ = networks[network];
  const path = `m/49'/${coinType}'/0'/0/${index}`;
  let { publicKey } = await wallet.getWalletPublicKey(path);
  publicKey = getCompressPublicKey(publicKey);
  const { address } = payments.p2pkh({ pubkey: Buffer.from(publicKey, 'hex'), network: network_ });
  return { address, index, publicKey };
};


function getCompressPublicKey(publicKey) {
  let compressedKeyIndex;
  if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
    compressedKeyIndex = '03';
  } else {
    compressedKeyIndex = '02';
  }
  return compressedKeyIndex + publicKey.substring(2, 66);
}
const signByLedger = async (index, sender, msg, network) => {
  msg = Buffer.isBuffer(msg) ? msg : Buffer.from(msg);
  const ret = await getAccountByLedger(index, network);
  if (ret.address !== sender) { throw new Error('error.wrong_device'); }
  const coinType = network.startsWith('BTC') ? 0 : 2;
  const path = `m/49'/${coinType}'/0'/0/${index}`;
  const result = await wallet.signMessageNew(path, msg.toString('hex'));
  return { signature: result.r + result.s };
};


export {
  wallet,
  initWallet,
  getAccountByLedger,
  signByLedger,
  getWalletStatus,
};
