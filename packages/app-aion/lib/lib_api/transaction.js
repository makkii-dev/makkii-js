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
exports.__esModule = true;
var bignumber_js_1 = require("bignumber.js");
var makkii_utils_1 = require("@makkii/makkii-utils");
var jsonrpc_1 = require("./jsonrpc");
var contract_1 = require("./contract");
exports["default"] = (function (config) {
    var _a = jsonrpc_1["default"](config), getTransactionReceipt = _a.getTransactionReceipt, getTransactionCount = _a.getTransactionCount, sendSignedTransaction = _a.sendSignedTransaction;
    function sendTransaction(unsignedTx, signer, signerParams) {
        return __awaiter(this, void 0, void 0, function () {
            var signedTx, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, signer.signTransaction(unsignedTx, signerParams)];
                    case 1:
                        signedTx = _a.sent();
                        return [4, sendSignedTransaction(signedTx)];
                    case 2:
                        hash = _a.sent();
                        return [2, {
                                hash: hash,
                                status: "PENDING",
                                to: unsignedTx.to,
                                from: unsignedTx.from,
                                value: unsignedTx.value,
                                tknTo: unsignedTx.tknTo,
                                tknValue: unsignedTx.tknValue,
                                timestamp: unsignedTx.timestamp,
                                gasLimit: unsignedTx.gasLimit,
                                gasPrice: unsignedTx.gasPrice
                            }];
                }
            });
        });
    }
    function buildTransaction(from, to, value, options) {
        return __awaiter(this, void 0, void 0, function () {
            var data_, gasLimit, gasPrice, contractAddr, isTokenTransfer, tokenDecimal, nonce, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data_ = options.data, gasLimit = options.gasLimit, gasPrice = options.gasPrice, contractAddr = options.contractAddr, isTokenTransfer = options.isTokenTransfer, tokenDecimal = options.tokenDecimal;
                        return [4, getTransactionCount(from, "pending")];
                    case 1:
                        nonce = _a.sent();
                        data = data_;
                        if (isTokenTransfer) {
                            data = contract_1.aionfvmContract.send(to, value
                                .shiftedBy(tokenDecimal - 0)
                                .toFixed(0)
                                .toString(), "");
                        }
                        return [2, {
                                to: isTokenTransfer ? contractAddr : to,
                                from: from,
                                nonce: nonce,
                                value: isTokenTransfer ? new bignumber_js_1["default"](0) : new bignumber_js_1["default"](value),
                                gasPrice: gasPrice,
                                gasLimit: gasLimit,
                                timestamp: Date.now(),
                                data: data,
                                type: 1,
                                tknTo: isTokenTransfer ? to : "",
                                tknValue: isTokenTransfer ? new bignumber_js_1["default"](value) : new bignumber_js_1["default"](0)
                            }];
                }
            });
        });
    }
    function getTransactionsByAddress(address, page, size) {
        if (page === void 0) { page = 0; }
        if (size === void 0) { size = 25; }
        return __awaiter(this, void 0, void 0, function () {
            var url, res, content, txs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = config.explorer_api + "/aion/dashboard/getTransactionsByAddress?accountAddress=" + address.toLowerCase() + "&page=" + page + "&size=" + size;
                        console.log("[AION req] get aion transactions by address: " + url);
                        return [4, makkii_utils_1.HttpClient.get(url, false)];
                    case 1:
                        res = _a.sent();
                        console.log("[AION resp] get aion transactions by address:", res.data);
                        content = res.data.content;
                        txs = {};
                        content.forEach(function (t) {
                            var tx = {};
                            var timestamp_ = "" + t.transactionTimestamp;
                            tx.hash = "0x" + t.transactionHash;
                            tx.timestamp =
                                timestamp_.length === 16
                                    ? parseInt(timestamp_) / 1000
                                    : timestamp_.length === 13
                                        ? parseInt(timestamp_) * 1
                                        : timestamp_.length === 10
                                            ? parseInt(timestamp_) * 1000
                                            : null;
                            tx.from = "0x" + t.fromAddr;
                            tx.to = "0x" + t.toAddr;
                            tx.value = new bignumber_js_1["default"](t.value, 10).toNumber();
                            tx.status = t.txError === "" ? "CONFIRMED" : "FAILED";
                            tx.blockNumber = t.blockNumber;
                            tx.fee = t.nrgConsumed * t.nrgPrice * Math.pow(10, -18);
                            txs[tx.hash] = tx;
                        });
                        return [2, txs];
                }
            });
        });
    }
    function getTransactionUrlInExplorer(txHash) {
        return config.explorer + "/" + txHash;
    }
    function getTransactionStatus(txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, getTransactionReceipt(txHash)];
                    case 1:
                        receipt = _a.sent();
                        return [2, {
                                status: parseInt(receipt.status, 16) === 1,
                                blockNumber: parseInt(receipt.blockNumber, 16),
                                gasUsed: parseInt(receipt.gasUsed, 16)
                            }];
                    case 2:
                        e_1 = _a.sent();
                        return [2, null];
                    case 3: return [2];
                }
            });
        });
    }
    return {
        sendTransaction: sendTransaction,
        getTransactionsByAddress: getTransactionsByAddress,
        getTransactionUrlInExplorer: getTransactionUrlInExplorer,
        getTransactionStatus: getTransactionStatus,
        buildTransaction: buildTransaction
    };
});
