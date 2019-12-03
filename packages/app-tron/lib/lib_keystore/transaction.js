"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const lib_common_util_js_1 = require("lib-common-util-js");
const utils_1 = require("../utils");
const { buildTransferTransaction } = require("@tronscan/client/src/utils/transactionBuilder");
const TronSignTransaction = require("@tronscan/client/src/utils/crypto")
    .signTransaction;
exports.signTransaction = transaction => new Promise((resolve, reject) => {
    try {
        const { private_key, expiration, timestamp, to_address, owner_address, amount, latest_block } = transaction;
        const tx = buildTransferTransaction("_", owner_address, to_address, amount);
        console.log("add block ref");
        const latestBlockHash = latest_block.hash;
        const latestBlockNum = latest_block.number;
        const numBytes = utils_1.longToByteArray(latestBlockNum);
        numBytes.reverse();
        const hashBytes = lib_common_util_js_1.hexutil.hexString2Array(latestBlockHash);
        const generateBlockId = [
            ...numBytes.slice(0, 8),
            ...hashBytes.slice(8, hashBytes.length - 1)
        ];
        const rawData = tx.getRawData();
        rawData.setRefBlockHash(Uint8Array.from(generateBlockId.slice(8, 16)));
        rawData.setRefBlockBytes(Uint8Array.from(numBytes.slice(6, 8)));
        rawData.setExpiration(expiration);
        rawData.setTimestamp(timestamp);
        tx.setRawData(rawData);
        const signed = TronSignTransaction(lib_common_util_js_1.hexutil.removeLeadingZeroX(private_key), tx);
        const txID = ethereumjs_util_1.sha256(Buffer.from(rawData.serializeBinary())).toString("hex");
        const signature = signed.transaction
            .getSignatureList()
            .map(e => Buffer.from(e).toString("hex"));
        const ref_block_bytes = Buffer.from(Uint8Array.from(numBytes.slice(6, 8))).toString("hex");
        const ref_block_hash = Buffer.from(Uint8Array.from(generateBlockId.slice(8, 16))).toString("hex");
        resolve({ signature, txID, ref_block_bytes, ref_block_hash });
    }
    catch (e) {
        reject(new Error(`keystore sign transaction failed: ${e}`));
    }
});
//# sourceMappingURL=transaction.js.map