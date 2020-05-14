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
function isInstanceOfApiClient(client) {
    var map = [
        "getBlockByNumber",
        "getBlockNumber",
        "getTransactionStatus",
        "getTransactionExplorerUrl",
        "getBalance",
        "getNetwork",
        "getTransactionsByAddress",
        "buildTransaction",
        "sendTransaction",
        "sameAddress"
    ];
    return !map.some(function (i) { return !(i in client); });
}
var ApiClient = (function () {
    function ApiClient() {
        var _this = this;
        this.coins = {};
        this.addCoin = function (coinType, client) {
            if (!isInstanceOfApiClient(client)) {
                throw new Error("not a api client!");
            }
            _this.coins[coinType.toLowerCase()] = client;
        };
        this.removeCoin = function (coinType) {
            if (_this.coins[coinType.toLowerCase()]) {
                delete _this.coins[coinType.toLowerCase()];
                return true;
            }
            return false;
        };
        this.getCoin = function (coinType) {
            var coin = _this.coins[coinType.toLowerCase()];
            if (!coin) {
                throw new Error("coin: [" + coinType + "] is not init or unsupported.");
            }
            return coin;
        };
        this.getBlockByNumber = function (coinType, blockNumber) {
            var coin = _this.getCoin(coinType);
            return coin.getBlockByNumber(blockNumber);
        };
        this.getBlockNumber = function (coinType) {
            var coin = _this.getCoin(coinType);
            return coin.getBlockNumber();
        };
        this.getTransactionStatus = function (coinType, hash) {
            var coin = _this.getCoin(coinType);
            return coin.getTransactionStatus(hash);
        };
        this.getTransactionExplorerUrl = function (coinType, hash) {
            var coin = _this.getCoin(coinType);
            return coin.getTransactionExplorerUrl(hash);
        };
        this.getBalance = function (coinType, address) {
            var coin = _this.getCoin(coinType);
            return coin.getBalance(address);
        };
        this.getTransactionsByAddress = function (coinType, address, page, size, timestamp) {
            var coin = _this.getCoin(coinType);
            return coin.getTransactionsByAddress(address, page, size, timestamp);
        };
        this.buildTransaction = function (coinType, from, to, value, options) {
            var coin = _this.getCoin(coinType);
            return coin.buildTransaction(from, to, value, options);
        };
        this.sendTransaction = function (coinType, unsignedTx, signer, signerParams) {
            var coin = _this.getCoin(coinType);
            return coin.sendTransaction(unsignedTx, signer, signerParams);
        };
        this.sameAddress = function (coinType, address1, address2) {
            var coin = _this.getCoin(coinType);
            return coin.sameAddress(address1, address2);
        };
        this.getTokenIconUrl = function (coinType, tokenSymbol, contractAddress) {
            var coin = _this.getCoin(coinType);
            if ("tokenSupport" in coin && !!coin.tokenSupport) {
                return coin.getTokenIconUrl(tokenSymbol, contractAddress);
            }
            throw new Error("[" + coinType + "] getTokenIconUrl is not implemented.");
        };
        this.getTokenDetail = function (coinType, contractAddress) {
            var coin = _this.getCoin(coinType);
            if ("tokenSupport" in coin && !!coin.tokenSupport) {
                return coin.getTokenDetail(contractAddress);
            }
            throw new Error("[" + coinType + "] getTokenDetail is not implemented.");
        };
        this.getAccountTokenTransferHistory = function (coinType, address, symbolAddress, page, size, timestamp) {
            var coin = _this.getCoin(coinType);
            if ("tokenSupport" in coin && !!coin.tokenSupport) {
                return coin.getAccountTokenTransferHistory(address, symbolAddress, page, size, timestamp);
            }
            throw new Error("[" + coinType + "] getAccountTokenTransferHistory is not implemented.");
        };
        this.getAccountTokens = function (coinType, address) {
            var coin = _this.getCoin(coinType);
            if ("tokenSupport" in coin && !!coin.tokenSupport) {
                return coin.getAccountTokens(address);
            }
            throw new Error("[" + coinType + "] getAccountTokens is not implemented.");
        };
        this.getAccountTokenBalance = function (coinType, contractAddress, address) {
            var coin = _this.getCoin(coinType);
            if ("tokenSupport" in coin && !!coin.tokenSupport) {
                return coin.getAccountTokenBalance(contractAddress, address);
            }
            throw new Error("[" + coinType + "] getAccountTokenBalance is not implemented.");
        };
        this.getTopTokens = function (coinType, topN) {
            var coin = _this.getCoin(coinType);
            if ("tokenSupport" in coin && !!coin.tokenSupport) {
                return coin.getTopTokens(topN);
            }
            throw new Error("[" + coinType + "] getTopTokens is not implemented.");
        };
        this.searchTokens = function (coinType, keyword) {
            var coin = _this.getCoin(coinType);
            if ("tokenSupport" in coin && !!coin.tokenSupport) {
                return coin.searchTokens(keyword);
            }
            throw new Error("[" + coinType + "] searchTokens is not implemented.");
        };
        this.getCoinPrices = function (currency) { return __awaiter(_this, void 0, void 0, function () {
            var cryptos, url, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cryptos = Object.keys(this.coins)
                            .map(function (c) { return _this.coins[c].symbol; })
                            .join(",");
                        url = "https://www.chaion.net/makkii/market/prices?cryptos=" + cryptos + "&fiat=" + currency;
                        return [4, makkii_utils_1.HttpClient.get(url, false)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2, data];
                }
            });
        }); };
    }
    return ApiClient;
}());
exports["default"] = ApiClient;
