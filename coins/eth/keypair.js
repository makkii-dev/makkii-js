import { pubToAddress ,toChecksumAddress} from 'ethereumjs-util';
import {toHex} from '../utils';
const ec = require('elliptic').ec('secp256k1');

const padTo32 = function(msg){
    while (msg.length < 32) {
        msg = Buffer.concat([new Buffer([0]), msg]);
    }
    if (msg.length !== 32) {
        throw new Error(`invalid key length: ${msg.length}`);
    }
    return msg;
};


export const keyPair = function(priKey:Buffer|String, options?:any) {
    if (typeof priKey == 'string') {
        if (priKey.startsWith('0x')){
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, 'hex');
    }
    if (priKey.length !== 32) {
        throw 'private key length is ' + priKey.length + " , expected eth 32 bytes";
    }
    const key = ec.keyFromPrivate(priKey);
    const bip32pubKey = key.getPublic().toJSON();
    const publicKey = Buffer.concat([padTo32(new Buffer(bip32pubKey[0].toArray())), padTo32(new Buffer(bip32pubKey[1].toArray()))]);
    console.log('get eth public');
    let address = '0x'+pubToAddress(publicKey).toString('hex');
    address = toChecksumAddress(address);
    console.log('get eth address');
    return {privateKey: key.getPrivate('hex'), publicKey: toHex(publicKey), address, sign: key.sign}

};
