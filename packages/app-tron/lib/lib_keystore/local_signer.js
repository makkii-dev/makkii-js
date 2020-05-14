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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var ethereumjs_util_1 = require("ethereumjs-util");
var makkii_utils_1 = require("@makkii/makkii-utils");
var utils_1 = require("../utils");
var buildTransferTransaction = require("@tronscan/client/src/utils/transactionBuilder").buildTransferTransaction;
var TronSignTransaction = require("@tronscan/client/src/utils/crypto")
    .signTransaction;
var TronLocalSigner = (function () {
    function TronLocalSigner() {
        var _this = this;
        this.signTransaction = function (unsignedTx, params) { return __awaiter(_this, void 0, void 0, function () {
            var expiration, timestamp, to, owner, amount, latest_block, private_key, tx, latestBlockHash, latestBlockNum, numBytes, hashBytes, generateBlockId, rawData, signed, txID, signature, ref_block_bytes, ref_block_hash, signedTx;
            return __generator(this, function (_a) {
                expiration = unsignedTx.expiration, timestamp = unsignedTx.timestamp, to = unsignedTx.to, owner = unsignedTx.owner, amount = unsignedTx.amount, latest_block = unsignedTx.latest_block;
                private_key = params.private_key;
                tx = buildTransferTransaction("_", owner, to, amount * Math.pow(10, 6));
                latestBlockHash = latest_block.hash;
                latestBlockNum = latest_block.number;
                numBytes = utils_1.longToByteArray(latestBlockNum);
                numBytes.reverse();
                hashBytes = makkii_utils_1.hexutil.hexString2Array(latestBlockHash);
                generateBlockId = __spreadArrays(numBytes.slice(0, 8), hashBytes.slice(8, hashBytes.length - 1));
                rawData = tx.getRawData();
                rawData.setRefBlockHash(Uint8Array.from(generateBlockId.slice(8, 16)));
                rawData.setRefBlockBytes(Uint8Array.from(numBytes.slice(6, 8)));
                rawData.setExpiration(expiration);
                rawData.setTimestamp(timestamp);
                tx.setRawData(rawData);
                signed = TronSignTransaction(makkii_utils_1.hexutil.removeLeadingZeroX(private_key), tx);
                txID = ethereumjs_util_1.sha256(Buffer.from(rawData.serializeBinary())).toString("hex");
                signature = signed.transaction
                    .getSignatureList()
                    .map(function (e) { return Buffer.from(e).toString("hex"); });
                ref_block_bytes = Buffer.from(Uint8Array.from(numBytes.slice(6, 8))).toString("hex");
                ref_block_hash = Buffer.from(Uint8Array.from(generateBlockId.slice(8, 16))).toString("hex");
                signedTx = {
                    signature: signature,
                    txID: txID,
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
                        ref_block_bytes: ref_block_bytes,
                        ref_block_hash: ref_block_hash,
                        expiration: unsignedTx.expiration,
                        timestamp: unsignedTx.timestamp
                    }
                };
                return [2, signedTx];
            });
        }); };
    }
    return TronLocalSigner;
}());
exports["default"] = TronLocalSigner;
