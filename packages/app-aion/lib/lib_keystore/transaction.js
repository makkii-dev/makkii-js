"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const lib_common_util_js_1 = require("../lib_api/node_modules/lib-common-util-js");
const ledger_1 = require("./ledger");
const address_1 = require("./address");
const keyPair_1 = require("./keyPair");
const blake2b = require('blake2b');
const nacl = require('tweetnacl');
const rlp = require('aion-rlp');
const BN = require('bn.js');
exports.signTransaction = (transaction) => new Promise((resolve, reject) => {
    const { private_key, extra_param } = transaction;
    let tx;
    try {
        tx = txInputFormatter(transaction);
    }
    catch (e) {
        reject(e);
    }
    const unsignedTransaction = {
        nonce: tx.nonce,
        to: tx.to || '0x',
        data: tx.data,
        amount: numberToHex(tx.amount) || '0x',
        timestamp: tx.timestamp || Math.floor(new Date().getTime() * 1000),
        type: tx.type || 1,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
    };
    const rlpEncoded = rlp.encode([
        unsignedTransaction.nonce,
        unsignedTransaction.to.toLowerCase(),
        unsignedTransaction.amount,
        unsignedTransaction.data,
        unsignedTransaction.timestamp,
        toAionLong(unsignedTransaction.gasLimit),
        toAionLong(unsignedTransaction.gasPrice),
        toAionLong(unsignedTransaction.type),
    ]);
    if (extra_param && extra_param.type === '[ledger]') {
        ledger_1.signByLedger(extra_param.derivationIndex, extra_param.sender, Object.values(rlpEncoded)).then(({ signature, publicKey }) => {
            console.log('signByLedger res=>', { signature, publicKey });
            const fullSignature = Buffer.concat([Buffer.from(lib_common_util_js_1.hexutil.stripZeroXHexString(publicKey), 'hex'),
                Buffer.from(lib_common_util_js_1.hexutil.stripZeroXHexString(signature), 'hex')]);
            const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);
            const rawTransaction = rlp.encode(rawTx);
            resolve({ encoded: rawTransaction.toString('hex'), signature: Buffer.from(signature).toString('hex') });
        }).catch((e) => {
            reject(e);
        });
    }
    else {
        let ecKey;
        try {
            ecKey = keyPair_1.keyPair(private_key);
        }
        catch (e) {
            reject(new Error('invalid private key'));
        }
        const rawHash = blake2b(32).update(rlpEncoded).digest();
        const signature = ecKey.sign(rawHash);
        if (nacl.sign.detached.verify(rawHash, signature, Buffer.from(lib_common_util_js_1.hexutil.hexString2Array(ecKey.publicKey))) === false) {
            throw new Error('Could not verify signature.');
        }
        const fullSignature = Buffer.concat([Buffer.from(lib_common_util_js_1.hexutil.hexString2Array(ecKey.publicKey)), signature]);
        const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);
        const rawTransaction = rlp.encode(rawTx);
        resolve({ encoded: rawTransaction.toString('hex'), signature: lib_common_util_js_1.hexutil.toHex(signature) });
    }
});
const txInputFormatter = (options) => {
    if (options.to) {
        options.to = address_1.inputAddressFormatter(options.to);
    }
    if (options.data && options.input) {
        throw new Error('You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.');
    }
    if (!options.data && options.input) {
        options.data = options.input;
        delete options.input;
    }
    if (options.data && !lib_common_util_js_1.hexutil.isHex(options.data)) {
        throw new Error('The data field must be HEX encoded data.');
    }
    if (options.gas || options.gasLimit) {
        options.gasLimit = options.gas || options.gasLimit;
    }
    ['gasPrice', 'gasLimit', 'nonce'].filter((key) => options[key] !== undefined).forEach((key) => {
        options[key] = numberToHex(options[key]);
    });
    return options;
};
const toAionLong = (val) => {
    let num;
    if (val === undefined
        || val === null
        || val === ''
        || val === '0x') {
        return null;
    }
    if (typeof val === 'string') {
        if (lib_common_util_js_1.hexutil.isHex(val.toLowerCase())) {
            num = new BN(lib_common_util_js_1.hexutil.removeLeadingZeroX(val.toLowerCase()), 16);
        }
        else {
            num = new BN(val, 10);
        }
    }
    if (typeof val === 'number') {
        num = new BN(val);
    }
    return new rlp.AionLong(num);
};
const numberToHex = function (value) {
    value = bignumber_js_1.default.isBigNumber(value) ? value : bignumber_js_1.default(value);
    return `0x${value.toString(16)}`;
};
//# sourceMappingURL=transaction.js.map