import {toHex} from '../utils';
import {keccak256} from 'ethereumjs-util';
const ec = require('elliptic').ec('secp256k1');

const prefixTestNet = 'a0';
const prefix = '41';


const padTo32 = function(msg){
    while (msg.length < 32) {
        msg = Buffer.concat([new Buffer([0]), msg]);
    }
    if (msg.length !== 32) {
        throw new Error(`invalid key length: ${msg.length}`);
    }
    return msg;
};

const computeAddress =function (publicKey, isTestNet = false) {
    if (publicKey.length === 65) {
        publicKey = publicKey.slice(1);
    }
    let hash = keccak256(publicKey).toString('hex');
    let addressHex = hash.substring(24);
    addressHex = (isTestNet ? prefixTestNet : prefix) + addressHex;
    return addressHex
};

export const keyPair = function(priKey:Buffer|String, options?:any) {
    if (typeof priKey == 'string') {
        if (priKey.startsWith('0x')){
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, 'hex');
    }
    const key = ec.keyFromPrivate(priKey);
    const privateKey = key.getPrivate();
    const bip32pubKey = key.getPublic().toJSON();
    const publicKey = Buffer.concat([padTo32(new Buffer(bip32pubKey[0].toArray())), padTo32(new Buffer(key[1].toArray()))]);
    const address = computeAddress(publicKey, options.isTestNet || false);
    return {privateKey: toHex(privateKey), publicKey: toHex(publicKey), address, sign: key.sign}

};