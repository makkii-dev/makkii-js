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
var checkBlockTag = function (blockTag) {
    if (blockTag == null) {
        return "latest";
    }
    if (blockTag === "earliest") {
        return "0x0";
    }
    if (blockTag === "latest" || blockTag === "pending") {
        return blockTag;
    }
    if (typeof blockTag === "number") {
        return "0x" + new bignumber_js_1["default"](blockTag).toString(16);
    }
    throw new Error("invalid blockTag");
};
exports.processRequest = function (methodName, params) {
    var requestData = {
        method: methodName,
        params: params,
        id: 42,
        jsonrpc: "2.0"
    };
    return JSON.stringify(requestData);
};
exports["default"] = (function (config) {
    var getBlockByNumber = function (blockNumber, fullTxs) {
        if (fullTxs === void 0) { fullTxs = false; }
        return __awaiter(void 0, void 0, void 0, function () {
            var requestData, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestData = exports.processRequest("eth_getBlockByNumber", [
                            blockNumber,
                            fullTxs
                        ]);
                        console.log("[ETH req] get block by number req:", requestData);
                        return [4, makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
                                "Content-Type": "application/json"
                            })];
                    case 1:
                        res = _a.sent();
                        console.log("[ETH resp] get block by number resp:", res.data);
                        if (res.data.error)
                            throw new Error(res.data.error.message);
                        else
                            return [2, res.data.result];
                        return [2];
                }
            });
        });
    };
    var blockNumber = function () { return __awaiter(void 0, void 0, void 0, function () {
        var requestData, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestData = exports.processRequest("eth_blockNumber", []);
                    console.log("[ETH req] get blockNumber:", requestData);
                    return [4, makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
                            "Content-Type": "application/json"
                        })];
                case 1:
                    res = _a.sent();
                    console.log("[ETH resp] get blockNUmber:", res.data);
                    if (res.data.error)
                        throw new Error(res.data.error.message);
                    else
                        return [2, res.data.result];
                    return [2];
            }
        });
    }); };
    var getBalance = function (address) { return __awaiter(void 0, void 0, void 0, function () {
        var params, requestData, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = [address.toLowerCase(), "latest"];
                    requestData = exports.processRequest("eth_getBalance", params);
                    console.log("[ETH req] get balance:", requestData);
                    return [4, makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
                            "Content-Type": "application/json"
                        })];
                case 1:
                    res = _a.sent();
                    console.log("[ETH resp] get blockNUmber:", res.data);
                    if (res.data.error)
                        throw new Error(res.data.error.message);
                    else
                        return [2, new bignumber_js_1["default"](res.data.result).shiftedBy(-18)];
                    return [2];
            }
        });
    }); };
    var getTransactionCount = function (address, blockTag) { return __awaiter(void 0, void 0, void 0, function () {
        var params, requestData, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = [address.toLowerCase(), checkBlockTag(blockTag)];
                    requestData = exports.processRequest("eth_getTransactionCount", params);
                    console.log("[ETH req] get nonce:", requestData);
                    return [4, makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
                            "Content-Type": "application/json"
                        })];
                case 1:
                    res = _a.sent();
                    console.log("[ETH resp] get nonce", res.data);
                    if (res.data.error)
                        throw new Error(res.data.error.message);
                    else
                        return [2, res.data.result];
                    return [2];
            }
        });
    }); };
    var sendSignedTransaction = function (signedTx) { return __awaiter(void 0, void 0, void 0, function () {
        var params, requestData, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = [signedTx];
                    requestData = exports.processRequest("eth_sendRawTransaction", params);
                    console.log("[ETH req] broadcast:", requestData);
                    return [4, makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
                            "Content-Type": "application/json"
                        })];
                case 1:
                    res = _a.sent();
                    console.log("[ETH resp] broadcast:", res.data);
                    if (res.data.error)
                        throw new Error(res.data.error.message);
                    else
                        return [2, res.data.result];
                    return [2];
            }
        });
    }); };
    var getTransactionReceipt = function (hash) { return __awaiter(void 0, void 0, void 0, function () {
        var params, requestData, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = [hash];
                    requestData = exports.processRequest("eth_getTransactionReceipt", params);
                    console.log("[ETH req] get transaction receipt:", requestData);
                    return [4, makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
                            "Content-Type": "application/json"
                        })];
                case 1:
                    res = _a.sent();
                    console.log("[ETH resp] get transaction receipt", res.data);
                    if (res.data.error)
                        throw new Error(res.data.error.message);
                    else
                        return [2, res.data.result];
                    return [2];
            }
        });
    }); };
    return {
        blockNumber: blockNumber,
        getBalance: getBalance,
        getBlockByNumber: getBlockByNumber,
        getTransactionReceipt: getTransactionReceipt,
        getTransactionCount: getTransactionCount,
        sendSignedTransaction: sendSignedTransaction
    };
});
