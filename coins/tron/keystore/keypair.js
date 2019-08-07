import {toHex} from '../../../utils';
import {keccak256,sha256} from 'ethereumjs-util';
import bs58 from 'bs58'
const ec = require('elliptic').ec('secp256k1');

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

const computeAddress =function (publicKey) {
    if (publicKey.length === 65) {
        publicKey = publicKey.slice(1);
    }
    let hash = keccak256(publicKey).toString('hex');
    let addressHex = hash.substring(24);
    addressHex = prefix + addressHex;
    return addressHex
};

const getBase58checkAddress = function(address){
    let hash0 = sha256(new Buffer(address,'hex'));
    let hash1 = sha256(hash0);
    let checkSum = hash1.slice(0,4);
    let addressBytes = new Buffer(address,'hex');
    return bs58.encode(Buffer.concat([addressBytes, checkSum]));
};

export const keyPair = function(priKey) {
    if (typeof priKey == 'string') {
        if (priKey.startsWith('0x')){
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, 'hex');
    }
    const key = ec.keyFromPrivate(priKey);
    const bip32pubKey = key.getPublic().toJSON();
    const publicKey = Buffer.concat([padTo32(new Buffer(bip32pubKey[0].toArray())), padTo32(new Buffer(bip32pubKey[1].toArray()))]);
    let address = computeAddress(publicKey);
    address = getBase58checkAddress(address);
    return {privateKey: key.getPrivate('hex'), publicKey: publicKey.toString('hex'), address, sign: key.sign}

};