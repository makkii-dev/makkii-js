"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib_common_util_js_1 = require("lib-common-util-js");
var ethereumjs_util_1 = require("ethereumjs-util");
var utils_1 = require("../utils");
var buildTransferTransaction = require('@tronscan/client/src/utils/transactionBuilder').buildTransferTransaction;
var TronSignTransaction = require("@tronscan/client/src/utils/crypto").signTransaction;
exports.signTransaction = function (transaction) { return new Promise(function (resolve, reject) {
    try {
        var private_key = transaction.private_key, expiration = transaction.expiration, timestamp = transaction.timestamp, to_address = transaction.to_address, owner_address = transaction.owner_address, amount = transaction.amount, latest_block = transaction.latest_block;
        var tx = buildTransferTransaction('_', owner_address, to_address, amount);
        console.log('add block ref');
        var latestBlockHash = latest_block.hash;
        var latestBlockNum = latest_block.number;
        var numBytes = utils_1.longToByteArray(latestBlockNum);
        numBytes.reverse();
        var hashBytes = lib_common_util_js_1.hexutil.hexString2Array(latestBlockHash);
        var generateBlockId = __spreadArrays(numBytes.slice(0, 8), hashBytes.slice(8, hashBytes.length - 1));
        var rawData = tx.getRawData();
        rawData.setRefBlockHash(Uint8Array.from(generateBlockId.slice(8, 16)));
        rawData.setRefBlockBytes(Uint8Array.from(numBytes.slice(6, 8)));
        rawData.setExpiration(expiration);
        rawData.setTimestamp(timestamp);
        tx.setRawData(rawData);
        var signed = TronSignTransaction(lib_common_util_js_1.hexutil.removeLeadingZeroX(private_key), tx);
        var txID = ethereumjs_util_1.sha256(Buffer.from(rawData.serializeBinary())).toString('hex');
        var signature = signed.transaction.getSignatureList().map(function (e) { return Buffer.from(e).toString('hex'); });
        var ref_block_bytes = Buffer.from(Uint8Array.from(numBytes.slice(6, 8))).toString('hex');
        var ref_block_hash = Buffer.from(Uint8Array.from(generateBlockId.slice(8, 16))).toString('hex');
        resolve({ signature: signature, txID: txID, ref_block_bytes: ref_block_bytes, ref_block_hash: ref_block_hash });
    }
    catch (e) {
        reject(new Error("keystore sign transaction failed: " + e));
    }
}); };
//# sourceMappingURL=transaction.js.map