import {hmacSha512} from '../../../utils';
import * as bip39 from "bip39";
import {keyPair} from "./keyPair";

const ED25519_CURVE = 'ed25519 seed';
const HARDENED_KEY_MULTIPLIER = 0x80000000;

const getHardenedNumber = (nr) => {
    return new Buffer(((HARDENED_KEY_MULTIPLIER | nr) >>> 0).toString(16), 'hex');
};
const derivePath = (path, seed) => {
    if (!isValidPath(path)) {
        throw new Error('Invalid derivation path');
    }
    let key = getMasterKeyFromSeed(seed);
    const segments = path
        .split('/')
        .slice(1)
        .map(replaceDerive)
        .map(el => parseInt(el, 10));
    let ret = segments.reduce((parentKey,el)=>CKDPriv(parentKey,el),key);
    return keyPair(ret.slice(0,32));

};

const getMasterKeyFromSeed = (seed) => {
    return hmacSha512(ED25519_CURVE,seed);
};

const CKDPriv = (key, index) => {
    let parentPrivateKey = key.slice(0, 32);
    let parentChainCode = key.slice(32, 64);
    let offset = getHardenedNumber(index);

    let parentPaddedKey = new Uint8Array(1 + parentPrivateKey.length + 4);
    parentPaddedKey.set(parentPrivateKey, 1);
    parentPaddedKey.set(offset, parentPrivateKey.length + 1);
    return hmacSha512(parentChainCode, parentPaddedKey);
};

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
        .some(isNaN);
};



export async function getKeyFromMnemonic(mnemonic, index, options){
    try {
        const path = `m/44'/425'/0'/0/${index}`;
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const keyPair = derivePath(path ,seed);
        return {private_key: keyPair.privateKey, public_key: keyPair.publicKey, address:keyPair.address, index: index};
    }catch (e) {
        throw Error(`get Key AION failed: ${e}`)
    }
}