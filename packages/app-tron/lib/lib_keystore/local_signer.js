"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const lib_common_util_js_1 = require("lib-common-util-js");
const utils_1 = require("../utils");
const { buildTransferTransaction } = require("@tronscan/client/src/utils/transactionBuilder");
const TronSignTransaction = require("@tronscan/client/src/utils/crypto")
    .signTransaction;
class TronLocalSigner {
    constructor() {
        this.signTransaction = (unsignedTx, params) => __awaiter(this, void 0, void 0, function* () {
            const { expiration, timestamp, to, owner, amount, latest_block } = unsignedTx;
            const { private_key } = params;
            const tx = buildTransferTransaction("_", owner, to, amount * Math.pow(10, 6));
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
            const signedTx = {
                signature,
                txID,
                raw_data: {
                    contract: [
                        {
                            parameter: {
                                value: {
                                    amount: unsignedTx.amount * Math.pow(10, 6),
                                    owner_address: utils_1.base58check2HexString(unsignedTx.owner),
                                    to_address: utils_1.base58check2HexString(unsignedTx.to)
                                },
                                type_url: "type.googleapis.com/protocol.TransferContract"
                            },
                            type: "TransferContract"
                        }
                    ],
                    ref_block_bytes,
                    ref_block_hash,
                    expiration: unsignedTx.expiration,
                    timestamp: unsignedTx.timestamp
                }
            };
            return signedTx;
        });
    }
}
exports.default = TronLocalSigner;
//# sourceMappingURL=local_signer.js.map