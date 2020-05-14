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
    var getAccountTokenBalance = function (contractAddress, address) {
        return new Promise(function (resolve, reject) {
            var requestData = jsonrpc_1.processRequest("eth_call", [
                {
                    to: contractAddress,
                    data: contract_1.ethContract.balanceOf(address)
                },
                "latest"
            ]);
            console.log("[ETH req]  get token balance:", address);
            makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true)
                .then(function (res) {
                console.log("[ETH resp] get token balance:", res.data);
                if (res.data.result) {
                    resolve(new bignumber_js_1["default"](contract_1.AbiCoder.decode(res.data.result, ["uint256"])[0]));
                }
                else {
                    reject(new Error("[ETH error] get account Balance failed:" + res.data.error));
                }
            })["catch"](function (e) {
                reject(new Error("[ETH error] get account Balance failed:" + e));
            });
        });
    };
    var getTokenDetail = function (contractAddress) { return __awaiter(void 0, void 0, void 0, function () {
        var requestGetSymbol, requestGetName, requestGetDecimals, url, promiseSymbol, promiseName, promiseDecimals, _a, symbolRet, nameRet, decimalsRet, symbol, name_1, decimals;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    requestGetSymbol = jsonrpc_1.processRequest("eth_call", [
                        {
                            to: contractAddress,
                            data: contract_1.ethContract.symbol()
                        },
                        "latest"
                    ]);
                    requestGetName = jsonrpc_1.processRequest("eth_call", [
                        { to: contractAddress, data: contract_1.ethContract.name() },
                        "latest"
                    ]);
                    requestGetDecimals = jsonrpc_1.processRequest("eth_call", [
                        {
                            to: contractAddress,
                            data: contract_1.ethContract.decimals()
                        },
                        "latest"
                    ]);
                    url = config.jsonrpc;
                    promiseSymbol = makkii_utils_1.HttpClient.post(url, requestGetSymbol, true);
                    promiseName = makkii_utils_1.HttpClient.post(url, requestGetName, true);
                    promiseDecimals = makkii_utils_1.HttpClient.post(url, requestGetDecimals, true);
                    console.log("[ETH req] get token detail:", config.jsonrpc);
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
                        console.log("[ETH resp] get token symobl:", symbolRet.data);
                        console.log("[ETH resp] get token name:", nameRet.data);
                        console.log("[ETH resp] get token decimals", decimalsRet.data);
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
                    throw new Error("get token detail failed");
            }
        });
    }); };
    var getAccountTokenTransferHistory = function (address, symbolAddress, page, size, timestamp) {
        if (page === void 0) { page = 0; }
        if (size === void 0) { size = 25; }
        return __awaiter(void 0, void 0, void 0, function () {
            var explorer_api, url_1, res_1, data, transfers_1, _a, txs_1, url, res, transfers, _b, txs;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        explorer_api = config.explorer_api;
                        if (!(explorer_api.provider === "etherscan")) return [3, 2];
                        url_1 = explorer_api.url + "?module=account&action=tokentx&contractaddress=" + symbolAddress + "&address=" + address + "&page=" + page + "&offset=" + size + "&sort=asc&apikey=" + explorer_api.key;
                        console.log("[ETH req] get token history by address: " + url_1);
                        return [4, makkii_utils_1.HttpClient.get(url_1)];
                    case 1:
                        res_1 = _c.sent();
                        data = res_1.data;
                        if (data.status === "1") {
                            transfers_1 = {};
                            _a = data.result, txs_1 = _a === void 0 ? [] : _a;
                            txs_1.forEach(function (t) {
                                var tx = {};
                                tx.hash = t.hash;
                                tx.timestamp = parseInt(t.timeStamp) * 1000;
                                tx.from = t.from;
                                tx.to = t.to;
                                tx.value = new bignumber_js_1["default"](t.value)
                                    .shiftedBy(-t.tokenDecimal)
                                    .toNumber();
                                tx.status = "CONFIRMED";
                                tx.blockNumber = t.blockNumber;
                                transfers_1[tx.hash] = tx;
                            });
                            return [2, transfers_1];
                        }
                        return [2, {}];
                    case 2:
                        url = explorer_api.url + "/getAddressHistory/" + address + "?apiKey=" + explorer_api.key + "&token=" + symbolAddress + "&type=transfer&limit=" + size + "&timestamp=" + (timestamp /
                            1000 -
                            1);
                        console.log("[ETH req] get token history by address: " + url);
                        return [4, makkii_utils_1.HttpClient.get(url)];
                    case 3:
                        res = _c.sent();
                        transfers = {};
                        _b = res.data.operations, txs = _b === void 0 ? [] : _b;
                        txs.forEach(function (t) {
                            var tx = {};
                            tx.hash = t.transactionHash;
                            tx.timestamp = t.timestamp * 1000;
                            tx.from = t.from;
                            tx.to = t.to;
                            tx.value = new bignumber_js_1["default"](t.value, 10)
                                .shiftedBy(-parseInt(t.tokenInfo.decimals))
                                .toNumber();
                            tx.status = "CONFIRMED";
                            transfers[tx.hash] = tx;
                        });
                        return [2, transfers];
                }
            });
        });
    };
    var getAccountTokens = function () { return Promise.resolve({}); };
    function getTopTokens(topN) {
        if (topN === void 0) { topN = 20; }
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = config.remote_api + "/token/eth/popular";
                        console.log("[ETH req] get top eth tokens: " + url);
                        return [4, makkii_utils_1.HttpClient.get(url, false)];
                    case 1:
                        res = _a.sent();
                        return [2, res.data];
                }
            });
        });
    }
    function searchTokens(keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = config.remote_api + "/token/eth/search?offset=0&size=20&keyword=" + keyword;
                        console.log("[ETH req] search eth token: " + url);
                        return [4, makkii_utils_1.HttpClient.get(url, false)];
                    case 1:
                        res = _a.sent();
                        return [2, res.data];
                }
            });
        });
    }
    function getTokenIconUrl(tokenSymbol, contractAddress) {
        return config.remote_api + "/token/eth/img?contractAddress=" + contractAddress;
    }
    return {
        getTokenDetail: getTokenDetail,
        getAccountTokenBalance: getAccountTokenBalance,
        getAccountTokens: getAccountTokens,
        getAccountTokenTransferHistory: getAccountTokenTransferHistory,
        getTopTokens: getTopTokens,
        getTokenIconUrl: getTokenIconUrl,
        searchTokens: searchTokens
    };
});
