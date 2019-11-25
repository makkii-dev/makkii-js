"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const lib_common_util_js_1 = require("../lib_api/node_modules/lib-common-util-js");
const ec = require('elliptic').ec('secp256k1');
const padTo32 = (msg) => {
    while (msg.length < 32) {
        msg = Buffer.concat([Buffer.from([0]), msg]);
    }
    if (msg.length !== 32) {
        throw new Error(`invalid key length: ${msg.length}`);
    }
    return msg;
};
exports.keyPair = function (priKey) {
    if (typeof priKey === 'string') {
        if (priKey.startsWith('0x')) {
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, 'hex');
    }
    if (priKey.length !== 32) {
        throw new Error(`private key length is ${priKey.length} , expected keystore 32 bytes`);
    }
    const key = ec.keyFromPrivate(priKey);
    const bip32pubKey = key.getPublic().toJSON();
    const publicKey = Buffer.concat([padTo32(Buffer.from(bip32pubKey[0].toArray())), padTo32(Buffer.from(bip32pubKey[1].toArray()))]);
    console.log('get keystore public');
    let address = `0x${ethereumjs_util_1.pubToAddress(publicKey).toString('hex')}`;
    address = ethereumjs_util_1.toChecksumAddress(address);
    console.log('get keystore address');
    return { privateKey: key.getPrivate('hex'), publicKey: lib_common_util_js_1.hexutil.toHex(publicKey), address, sign: (hash) => key.sign(hash) };
};
//# sourceMappingURL=keypair.js.map