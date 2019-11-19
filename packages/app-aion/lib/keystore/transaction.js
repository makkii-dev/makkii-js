"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_common_util_js_1 = require("lib-common-util-js");
var bignumber_js_1 = require("bignumber.js");
var ledger_1 = require("./ledger");
var address_1 = require("./address");
var keyPair_1 = require("./keyPair");
var blake2b = require('blake2b');
var nacl = require('tweetnacl');
var rlp = require('aion-rlp');
var BN = require('bn.js');
exports.signTransaction = function (transaction) { return new Promise(function (resolve, reject) {
    var private_key = transaction.private_key, extra_param = transaction.extra_param;
    var tx;
    try {
        tx = txInputFormatter(transaction);
    }
    catch (e) {
        reject(e);
    }
    var unsignedTransaction = {
        nonce: tx.nonce,
        to: tx.to || '0x',
        data: tx.data,
        amount: numberToHex(tx.amount) || '0x',
        timestamp: tx.timestamp || Math.floor(new Date().getTime() * 1000),
        type: tx.type || 1,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
    };
    var rlpEncoded = rlp.encode([
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
        ledger_1.signByLedger(extra_param.derivationIndex, extra_param.sender, Object.values(rlpEncoded)).then(function (_a) {
            var signature = _a.signature, publicKey = _a.publicKey;
            console.log('signByLedger res=>', { signature: signature, publicKey: publicKey });
            var fullSignature = Buffer.concat([Buffer.from(lib_common_util_js_1.hexutil.stripZeroXHexString(publicKey), 'hex'),
                Buffer.from(lib_common_util_js_1.hexutil.stripZeroXHexString(signature), 'hex')]);
            var rawTx = rlp.decode(rlpEncoded).concat(fullSignature);
            var rawTransaction = rlp.encode(rawTx);
            resolve({ encoded: rawTransaction.toString('hex'), signature: Buffer.from(signature).toString('hex') });
        }).catch(function (e) {
            reject(e);
        });
    }
    else {
        var ecKey = void 0;
        try {
            ecKey = keyPair_1.keyPair(private_key);
        }
        catch (e) {
            reject(new Error('invalid private key'));
        }
        var rawHash = blake2b(32).update(rlpEncoded).digest();
        var signature = ecKey.sign(rawHash);
        if (nacl.sign.detached.verify(rawHash, signature, Buffer.from(lib_common_util_js_1.hexutil.hexString2Array(ecKey.publicKey))) === false) {
            throw new Error('Could not verify signature.');
        }
        var fullSignature = Buffer.concat([Buffer.from(lib_common_util_js_1.hexutil.hexString2Array(ecKey.publicKey)), signature]);
        var rawTx = rlp.decode(rlpEncoded).concat(fullSignature);
        var rawTransaction = rlp.encode(rawTx);
        resolve({ encoded: rawTransaction.toString('hex'), signature: lib_common_util_js_1.hexutil.toHex(signature) });
    }
}); };
var txInputFormatter = function (options) {
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
    ['gasPrice', 'gasLimit', 'nonce'].filter(function (key) { return options[key] !== undefined; }).forEach(function (key) {
        options[key] = numberToHex(options[key]);
    });
    return options;
};
var toAionLong = function (val) {
    var num;
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
var numberToHex = function (value) {
    value = bignumber_js_1.default.isBigNumber(value) ? value : bignumber_js_1.default(value);
    return "0x" + value.toString(16);
};
//# sourceMappingURL=transaction.js.map