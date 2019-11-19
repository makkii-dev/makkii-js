"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
var network_1 = require("./network");
var TronApiClient = (function () {
    function TronApiClient(isTestNet) {
        this.tokenSupport = false;
        this.isTestNet = isTestNet;
    }
    TronApiClient.prototype.coverNetWorkConfig = function (network, remote) {
        if (network.toString() === "[object Object]") {
            network_1.customNetwork(network);
        }
    };
    TronApiClient.prototype.getNetwork = function () {
        return this.isTestNet ? 'shasta' : 'mainnet';
    };
    TronApiClient.prototype.getBlockByNumber = function (blockNumber) {
        throw new Error("[tron] getBlockByNumber not implemented.");
    };
    TronApiClient.prototype.getBlockNumber = function () {
        throw new Error("[tron] getBlockNumber not implemented.");
    };
    TronApiClient.prototype.getTransactionStatus = function (hash) {
        var network = this.getNetwork();
        return api_1.default.getTransactionStatus(hash, network);
    };
    TronApiClient.prototype.getTransactionExplorerUrl = function (hash) {
        var network = this.getNetwork();
        return api_1.default.getTransactionUrlInExplorer(hash, network);
    };
    TronApiClient.prototype.getBalance = function (address) {
        var network = this.getNetwork();
        return api_1.default.getBalance(address, network);
    };
    TronApiClient.prototype.getTransactionsByAddress = function (address, page, size, timestamp) {
        var network = this.getNetwork();
        return api_1.default.getTransactionsByAddress(address, page, size, timestamp, network);
    };
    TronApiClient.prototype.validateBalanceSufficiency = function (account, symbol, amount, extraParams) {
        return api_1.default.validateBalanceSufficiency(account, symbol, amount);
    };
    TronApiClient.prototype.sendTransaction = function (account, symbol, to, value, extraParams, data, shouldBroadCast) {
        var network = this.getNetwork();
        return api_1.default.sendTransaction(account, symbol, to, value, network, shouldBroadCast);
    };
    TronApiClient.prototype.sameAddress = function (address1, address2) {
        return api_1.default.sameAddress(address1, address2);
    };
    TronApiClient.prototype.formatAddress1Line = function (address) {
        return api_1.default.formatAddress1Line(address);
    };
    return TronApiClient;
}());
exports.default = TronApiClient;
//# sourceMappingURL=apiClient.js.map