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
var makkii_utils_1 = require("@makkii/makkii-utils");
var bignumber_js_1 = require("bignumber.js");
var jsonrpc_1 = require("./jsonrpc");
exports["default"] = (function (config) {
    var _a = jsonrpc_1["default"](config), getTransactionById = _a.getTransactionById, getTransactionInfoById = _a.getTransactionInfoById, getLatestBlock = _a.getLatestBlock, broadcastTransaction = _a.broadcastTransaction;
    function sendTransaction(unsignedTx, signer, signerParams) {
        return __awaiter(this, void 0, void 0, function () {
            var signedTx, broadcastRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, signer.signTransaction(unsignedTx, signerParams)];
                    case 1:
                        signedTx = _a.sent();
                        return [4, broadcastTransaction(signedTx)];
                    case 2:
                        broadcastRes = _a.sent();
                        if (broadcastRes.result) {
                            return [2, {
                                    hash: "" + signedTx.txID,
                                    timestamp: unsignedTx.timestamp,
                                    from: unsignedTx.owner,
                                    to: unsignedTx.to,
                                    value: unsignedTx.amount,
                                    status: "PENDING"
                                }];
                        }
                        throw new Error("broadcast tx failed");
                }
            });
        });
    }
    function buildTransaction(from, to, value) {
        return __awaiter(this, void 0, void 0, function () {
            var block, latest_block, now, expire, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        value = bignumber_js_1["default"].isBigNumber(value) ? value : new bignumber_js_1["default"](value);
                        return [4, getLatestBlock()];
                    case 1:
                        block = _a.sent();
                        latest_block = {
                            hash: block.blockID,
                            number: block.block_header.raw_data.number
                        };
                        now = new Date().getTime();
                        expire = now + 10 * 60 * 60 * 1000;
                        tx = {
                            to: to,
                            owner: from,
                            amount: value.toNumber(),
                            timestamp: now,
                            expiration: expire,
                            latest_block: latest_block
                        };
                        return [2, tx];
                }
            });
        });
    }
    function getTransactionStatus(txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var res, blockNumber, tx, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, getTransactionInfoById(txHash)];
                    case 1:
                        res = _a.sent();
                        blockNumber = res.blockNumber;
                        return [4, getTransactionById(txHash)];
                    case 2:
                        tx = _a.sent();
                        if (tx.ret !== undefined &&
                            tx.ret instanceof Array &&
                            tx.ret.length > 0 &&
                            tx.ret[0].contractRet !== undefined) {
                            return [2, {
                                    blockNumber: blockNumber,
                                    status: tx.ret[0].contractRet === "SUCCESS"
                                }];
                        }
                        return [2, null];
                    case 3:
                        e_1 = _a.sent();
                        return [2, null];
                    case 4: return [2];
                }
            });
        });
    }
    function getTransactionsByAddress(address, page, size) {
        if (page === void 0) { page = 0; }
        if (size === void 0) { size = 25; }
        return __awaiter(this, void 0, void 0, function () {
            var url, res, data, txs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = config.explorer_api + "/transfer?sort=-timestamp&limit=" + size + "&start=" + page *
                            size + "&address=" + address;
                        console.log("[TRON req] getTransactionsByAddress: " + url);
                        return [4, makkii_utils_1.HttpClient.get(url, false)];
                    case 1:
                        res = _a.sent();
                        console.log("[TRON resp] getTransactionsByAddress:", res.data);
                        data = res.data.data;
                        txs = {};
                        data.forEach(function (t) {
                            if (t.tokenName === "_") {
                                var tx = {};
                                tx.hash = "" + t.transactionHash;
                                tx.timestamp = t.timestamp;
                                tx.from = t.transferFromAddress;
                                tx.to = t.transferToAddress;
                                tx.value = new bignumber_js_1["default"](t.amount, 10).shiftedBy(-6).toNumber();
                                tx.blockNumber = t.block;
                                tx.status = t.confirmed ? "CONFIRMED" : "FAILED";
                                txs[tx.hash] = tx;
                            }
                        });
                        return [2, txs];
                }
            });
        });
    }
    function getTransactionUrlInExplorer(txHash) {
        txHash = txHash.startsWith("0x") ? txHash.slice(2) : txHash;
        return config.explorer + "/" + txHash;
    }
    return {
        sendTransaction: sendTransaction,
        getTransactionStatus: getTransactionStatus,
        getTransactionUrlInExplorer: getTransactionUrlInExplorer,
        getTransactionsByAddress: getTransactionsByAddress,
        buildTransaction: buildTransaction
    };
});
