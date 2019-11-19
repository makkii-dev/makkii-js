"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_common_util_js_1 = require("lib-common-util-js");
function isIntanceOfApiClient(client) {
    var map = [
        "getBlockByNumber",
        "getBlockNumber",
        "getTransactionStatus",
        "getTransactionExplorerUrl",
        "getBalance",
        "getTransactionsByAddress",
        "validateBalanceSufficiency",
        "sendTransaction",
        "sameAddress",
        "formatAddress1Line",
    ];
    return !map.some(function (i) { return !(i in client); });
}
var ApiClient = (function () {
    function ApiClient() {
        this.coins = {};
    }
    ApiClient.prototype.addCoin = function (coinType, client) {
        if (!isIntanceOfApiClient(client)) {
            throw new Error('not a api client!');
        }
        this.coins[coinType.toLowerCase()] = client;
    };
    ApiClient.prototype.removeCoin = function (coinType) {
        if (this.coins[coinType.toLowerCase()]) {
            delete this.coins[coinType.toLowerCase()];
            return true;
        }
        return false;
    };
    ApiClient.prototype.getCoin = function (coinType) {
        var coin = this.coins[coinType.toLowerCase()];
        if (!coin) {
            throw new Error("coin: [" + coinType + "] is not init or unsupported.");
        }
        return coin;
    };
    ApiClient.prototype.getBlockByNumber = function (coinType, blockNumber) {
        var coin = this.getCoin(coinType);
        return coin.getBlockByNumber(blockNumber);
    };
    ApiClient.prototype.getBlockNumber = function (coinType) {
        var coin = this.getCoin(coinType);
        return coin.getBlockNumber();
    };
    ApiClient.prototype.getTransactionStatus = function (coinType, hash) {
        var coin = this.getCoin(coinType);
        return coin.getTransactionStatus(hash);
    };
    ApiClient.prototype.getTransactionExplorerUrl = function (coinType, hash) {
        var coin = this.getCoin(coinType);
        return coin.getTransactionExplorerUrl(hash);
    };
    ApiClient.prototype.getBalance = function (coinType, address) {
        var coin = this.getCoin(coinType);
        return coin.getBalance(address);
    };
    ApiClient.prototype.getTransactionsByAddress = function (coinType, address, page, size) {
        var coin = this.getCoin(coinType);
        return coin.getTransactionsByAddress(address, page, size);
    };
    ApiClient.prototype.validateBalanceSufficiency = function (coinType, account, symbol, amount, extraParams) {
        var coin = this.getCoin(coinType);
        return coin.validateBalanceSufficiency(account, symbol, amount, extraParams);
    };
    ApiClient.prototype.sendTransaction = function (coinType, account, symbol, to, value, extraParams, data, shouldBroadCast) {
        var coin = this.getCoin(coinType);
        return coin.sendTransaction(account, symbol, to, value, extraParams, data, shouldBroadCast);
    };
    ApiClient.prototype.sameAddress = function (coinType, address1, address2) {
        var coin = this.getCoin(coinType);
        return coin.sameAddress(address1, address2);
    };
    ApiClient.prototype.formatAddress1Line = function (coinType, address) {
        var coin = this.getCoin(coinType);
        return coin.formatAddress1Line(address);
    };
    ApiClient.prototype.getTokenIconUrl = function (coinType, tokenSymbol, contractAddress) {
        var coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getTokenIconUrl(tokenSymbol, contractAddress);
        }
        throw new Error("[" + coinType + "] getTokenIconUrl is not implemented.");
    };
    ApiClient.prototype.fetchTokenDetail = function (coinType, contractAddress, network) {
        var coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.fetchTokenDetail(contractAddress, network);
        }
        throw new Error("[" + coinType + "] fetchTokenDetail is not implemented.");
    };
    ApiClient.prototype.fetchAccountTokenTransferHistory = function (coinType, address, symbolAddress, network, page, size, timestamp) {
        var coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.fetchAccountTokenTransferHistory(address, symbolAddress, network, page, size, timestamp);
        }
        throw new Error("[" + coinType + "] fetchAccountTokenTransferHistory is not implemented.");
    };
    ApiClient.prototype.fetchAccountTokens = function (coinType, address, network) {
        var coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.fetchAccountTokens(address, network);
        }
        throw new Error("[" + coinType + "] fetchAccountTokens is not implemented.");
    };
    ApiClient.prototype.fetchAccountTokenBalance = function (coinType, contractAddress, address, network) {
        var coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.fetchAccountTokenBalance(contractAddress, address, network);
        }
        throw new Error("[" + coinType + "] fetchAccountTokenBalance is not implemented.");
    };
    ApiClient.prototype.getTopTokens = function (coinType, topN) {
        var coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getTopTokens(topN);
        }
        throw new Error("[" + coinType + "] getTopTokens is not implemented.");
    };
    ApiClient.prototype.searchTokens = function (coinType, keyword) {
        var coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.searchTokens(keyword);
        }
        throw new Error("[" + coinType + "] searchTokens is not implemented.");
    };
    ApiClient.prototype.getCoinPrices = function (currency) {
        var cryptos = Object.keys(this.coins).join(',');
        var url = "https://www.chaion.net/makkii/market/prices?cryptos=" + cryptos + "&fiat=" + currency;
        return lib_common_util_js_1.HttpClient.get(url, false);
    };
    return ApiClient;
}());
exports.default = ApiClient;
//# sourceMappingURL=apiClient.js.map