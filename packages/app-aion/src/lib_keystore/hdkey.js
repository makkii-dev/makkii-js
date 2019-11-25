/* eslint-disable no-bitwise */
/* eslint-disable import/prefer-default-export */
import * as bip39 from 'bip39';
import { hmacSha512 } from '../utils';
import { keyPair } from './keyPair';

const ED25519_CURVE = 'ed25519 seed';
const HARDENED_KEY_MULTIPLIER = 0x80000000;

const getHardenedNumber = (nr) => Buffer.from(((HARDENED_KEY_MULTIPLIER | nr) >>> 0).toString(16), 'hex');

const getMasterKeyFromSeed = (seed) => hmacSha512(ED25519_CURVE, seed);

const replaceDerive = (val) => val.replace("'", '');

const pathRegex = new RegExp("^m(/\\d+'?){3}/[0,1]/\\d+'?$");

const isValidPath = (path) => {
  if (!pathRegex.test(path)) {
    return false;
  }
  return !path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    // eslint-disable-next-line no-restricted-globals
    .some((n) => isNaN(n));
};


const CKDPriv = (key, index) => {
  const parentPrivateKey = key.slice(0, 32);
  const parentChainCode = key.slice(32, 64);
  const offset = getHardenedNumber(index);

  const parentPaddedKey = new Uint8Array(1 + parentPrivateKey.length + 4);
  parentPaddedKey.set(parentPrivateKey, 1);
  parentPaddedKey.set(offset, parentPrivateKey.length + 1);
  return hmacSha512(parentChainCode, parentPaddedKey);
};
const derivePath = (path, seed) => {
  if (!isValidPath(path)) {
    throw new Error('Invalid derivation path');
  }
  const key = getMasterKeyFromSeed(seed);
  const segments = path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    .map((el) => parseInt(el, 10));
  const ret = segments.reduce((parentKey, el) => CKDPriv(parentKey, el), key);
  return keyPair(ret.slice(0, 32));
};


export async function getAccountFromMnemonic(mnemonic, index) {
  try {
    const path = `m/44'/425'/0'/0/${index}`;
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const keyPair_ = derivePath(path, seed);
    return {
      private_key: keyPair_.privateKey, public_key: keyPair_.publicKey, address: keyPair_.address, index,
    };
  } catch (e) {
    throw Error(`get Key AION failed: ${e}`);
  }
}
