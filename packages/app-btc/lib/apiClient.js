"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
var network_1 = require("./network");
var BtcApiClient = (function () {
    function BtcApiClient(isTestNet, coin) {
        if (coin === void 0) { coin = 'btc'; }
        this.tokenSupport = true;
        this.isTestNet = isTestNet;
        this.coin = coin;
    }
    BtcApiClient.prototype.coverNetWorkConfig = function (network, remote) {
        if (network.toString() === "[object Object]") {
            network_1.customNetwork(network);
        }
    };
    BtcApiClient.prototype.getCurrentNetwork = function () {
        var coin_ = this.coin.toUpperCase();
        var suffix = this.isTestNet ? 'TEST' : '';
        return coin_ + suffix;
    };
    BtcApiClient.prototype.getBlockByNumber = function (blockNumber) {
        throw new Error("[" + this.coin + "] getBlockByNumber not implemented.");
    };
    BtcApiClient.prototype.getBlockNumber = function () {
        throw new Error("[" + this.coin + "] getBlockNumber not implemented.");
    };
    BtcApiClient.prototype.getTransactionStatus = function (hash) {
        var network = this.getCurrentNetwork();
        return api_1.default.getTransactionStatus(hash, network);
    };
    BtcApiClient.prototype.getTransactionExplorerUrl = function (hash) {
        var network = this.getCurrentNetwork();
        return api_1.default.getTransactionUrlInExplorer(hash, network);
    };
    BtcApiClient.prototype.getBalance = function (address) {
        var network = this.getCurrentNetwork();
        return api_1.default.getBalance(address, network);
    };
    BtcApiClient.prototype.getTransactionsByAddress = function (address, page, size, timestamp) {
        var network = this.getCurrentNetwork();
        return api_1.default.getTransactionsByAddress(address, page, size, timestamp, network);
    };
    BtcApiClient.prototype.validateBalanceSufficiency = function (account, symbol, amount, extraParams) {
        var network = this.getCurrentNetwork();
        return api_1.default.validateBalanceSufficiency(account, symbol, amount, extraParams);
    };
    BtcApiClient.prototype.sendTransaction = function (account, symbol, to, value, extraParams, data, shouldBroadCast) {
        var network = this.getCurrentNetwork();
        return api_1.default.sendTransaction(account, symbol, to, value, extraParams, network, shouldBroadCast);
    };
    BtcApiClient.prototype.sameAddress = function (address1, address2) {
        return api_1.default.sameAddress(address1, address2);
    };
    BtcApiClient.prototype.formatAddress1Line = function (address) {
        return api_1.default.formatAddress1Line(address);
    };
    return BtcApiClient;
}());
exports.default = BtcApiClient;
//# sourceMappingURL=apiClient.js.map