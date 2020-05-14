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
    function getAccountTokens(address) {
        return __awaiter(this, void 0, void 0, function () {
            var url, data, res, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = config.explorer_api + "/aion/dashboard/getAccountDetails?accountAddress=" + address.toLowerCase();
                        return [4, makkii_utils_1.HttpClient.get(url)];
                    case 1:
                        data = (_a.sent()).data;
                        res = {};
                        if (data.content.length > 0) {
                            tokens = data.content[0].tokens;
                            tokens.forEach(function (token) {
                                res[token.symbol] = {
                                    symbol: token.symbol,
                                    contractAddr: token.contractAddr,
                                    name: token.name,
                                    tokenDecimal: token.tokenDecimal
                                };
                            });
                        }
                        return [2, res];
                }
            });
        });
    }
    var getAccountTokenBalance = function (contractAddress, address) { return __awaiter(void 0, void 0, void 0, function () {
        var requestData, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestData = jsonrpc_1.processRequest("eth_call", [
                        {
                            to: contractAddress,
                            data: contract_1.aionfvmContract.balanceOf(address)
                        },
                        "latest"
                    ]);
                    console.log("[AION req] get token balance:", address);
                    return [4, makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true)];
                case 1:
                    res = _a.sent();
                    console.log("[AION resp] get token balance", res.data);
                    if (res.data.result) {
                        return [2, new bignumber_js_1["default"](contract_1.AbiCoder.decode(res.data.result, ["uint128"])[0])];
                    }
                    throw new Error("[AION error] get token failed:" + res.data.error);
            }
        });
    }); };
    var getTokenDetail = function (contractAddress) { return __awaiter(void 0, void 0, void 0, function () {
        var requestGetSymbol, requestGetName, requestGetDecimals, url, promiseSymbol, promiseName, promiseDecimals, _a, symbolRet, nameRet, decimalsRet, symbol, name_1, decimals;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    requestGetSymbol = jsonrpc_1.processRequest("eth_call", [
                        {
                            to: contractAddress,
                            data: contract_1.aionfvmContract.symbol()
                        },
                        "latest"
                    ]);
                    requestGetName = jsonrpc_1.processRequest("eth_call", [
                        { to: contractAddress, data: contract_1.aionfvmContract.name() },
                        "latest"
                    ]);
                    requestGetDecimals = jsonrpc_1.processRequest("eth_call", [
                        {
                            to: contractAddress,
                            data: contract_1.aionfvmContract.decimals()
                        },
                        "latest"
                    ]);
                    url = config.jsonrpc;
                    promiseSymbol = makkii_utils_1.HttpClient.post(url, requestGetSymbol, true);
                    promiseName = makkii_utils_1.HttpClient.post(url, requestGetName, true);
                    promiseDecimals = makkii_utils_1.HttpClient.post(url, requestGetDecimals, true);
                    console.log("[AION req] get token detail:", config.jsonrpc);
                    return [4, Promise.all([
                            promiseSymbol,
                            promiseName,
                            promiseDecimals
                        ])];
                case 1:
                    _a = _b.sent(), symbolRet = _a[0], nameRet = _a[1], decimalsRet = _a[2];
                    if (symbolRet.data.result &&
                        nameRet.data.result &&
                        decimalsRet.data.result) {
                        console.log("[AION resp] get token symobl:", symbolRet.data);
                        console.log("[AION resp] get token name", nameRet.data);
                        console.log("[AION resp] get token decimals", decimalsRet.data);
                        symbol = void 0;
                        try {
                            symbol = contract_1.AbiCoder.decode(symbolRet.data.result, ["string"])[0];
                        }
                        catch (e) {
                            symbol = makkii_utils_1.hexutil.hexToAscii(symbolRet.data.result);
                            symbol = symbol.slice(0, symbol.indexOf("\u0000"));
                        }
                        try {
                            name_1 = contract_1.AbiCoder.decode(nameRet.data.result, ["string"])[0];
                        }
                        catch (e) {
                            name_1 = makkii_utils_1.hexutil.hexToAscii(nameRet.data.result);
                            name_1 = name_1.slice(0, name_1.indexOf("\u0000"));
                        }
                        decimals = contract_1.AbiCoder.decode(decimalsRet.data.result, [
                            "uint8"
                        ])[0];
                        return [2, {
                                contractAddr: contractAddress,
                                symbol: symbol,
                                name: name_1,
                                tokenDecimal: decimals.toNumber()
                            }];
                    }
                    throw new Error("[AION error] get token detail failed");
            }
        });
    }); };
    function getAccountTokenTransferHistory(address, symbolAddress, page, size) {
        if (page === void 0) { page = 0; }
        if (size === void 0) { size = 25; }
        return __awaiter(this, void 0, void 0, function () {
            var url, res, _a, content, txs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = config.explorer_api + "/aion/dashboard/getTransactionsByAddress?accountAddress=" + address.toLowerCase() + "&tokenAddress=" + symbolAddress.toLowerCase() + "&page=" + page + "&size=" + size;
                        console.log("[AION req] get account token transactions: " + url);
                        return [4, makkii_utils_1.HttpClient.get(url)];
                    case 1:
                        res = _b.sent();
                        _a = res.data.content, content = _a === void 0 ? [] : _a;
                        txs = {};
                        content.forEach(function (t) {
                            var tx = {
                                hash: "0x" + t.transactionHash,
                                timestamp: t.transferTimestamp * 1000,
                                from: "0x" + t.fromAddr,
                                to: "0x" + t.toAddr,
                                value: new bignumber_js_1["default"](t.tknValue, 10).toNumber(),
                                status: "CONFIRMED",
                                blockNumber: t.blockNumber
                            };
                            txs[tx.hash] = tx;
                        });
                        return [2, txs];
                }
            });
        });
    }
    var getTopTokens = function (topN) {
        if (topN === void 0) { topN = 20; }
        return __awaiter(void 0, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = config.remote_api + "/token/aion?offset=0&size=" + topN;
                        console.log("[AION req] get top aion tokens: " + url);
                        return [4, makkii_utils_1.HttpClient.get(url, false)];
                    case 1:
                        res = _a.sent();
                        console.log("[AION resp] get top aion tokens:", res.data);
                        return [2, res.data];
                }
            });
        });
    };
    var searchTokens = function (keyword) { return __awaiter(void 0, void 0, void 0, function () {
        var url, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = config.remote_api + "/token/aion/search?keyword=" + keyword;
                    console.log("[AION req] search aion token: " + url);
                    return [4, makkii_utils_1.HttpClient.get(url, false)];
                case 1:
                    res = _a.sent();
                    console.log("[AION resp] search aion token:", res.data);
                    return [2, res.data];
            }
        });
    }); };
    return {
        getAccountTokens: getAccountTokens,
        getAccountTokenBalance: getAccountTokenBalance,
        getAccountTokenTransferHistory: getAccountTokenTransferHistory,
        getTokenDetail: getTokenDetail,
        getTopTokens: getTopTokens,
        searchTokens: searchTokens
    };
});
