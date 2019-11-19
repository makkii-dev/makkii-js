"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
var network_1 = require("./network");
var AionApiClient = (function () {
    function AionApiClient(isTestNet) {
        this.tokenSupport = true;
        this.remoteApi = 'prod';
        this.isTestNet = isTestNet;
    }
    AionApiClient.prototype.setRemoteApi = function (api) {
        this.remoteApi = api;
    };
    AionApiClient.prototype.coverNetWorkConfig = function (network, remoteApi) {
        if (network.toString() === "[object Object]") {
            network_1.customNetwork(network);
        }
        if (remoteApi.toString() === "[object Object]") {
            network_1.customRemote(remoteApi);
        }
    };
    AionApiClient.prototype.getNetwork = function () {
        return this.isTestNet ? 'mastery' : 'mainnet';
    };
    AionApiClient.prototype.getBlockByNumber = function (blockNumber) {
        var network = this.getNetwork();
        return api_1.default.getBlockByNumber(blockNumber, false, network);
    };
    AionApiClient.prototype.getBlockNumber = function () {
        var network = this.getNetwork();
        return api_1.default.blockNumber(network);
    };
    AionApiClient.prototype.getTransactionStatus = function (hash) {
        var network = this.getNetwork();
        return api_1.default.getTransactionStatus(hash, network);
    };
    AionApiClient.prototype.getTransactionExplorerUrl = function (hash) {
        var network = this.getNetwork();
        return api_1.default.getTransactionUrlInExplorer(hash, network);
    };
    AionApiClient.prototype.getBalance = function (address) {
        var network = this.getNetwork();
        return api_1.default.getBalance(address, network);
    };
    AionApiClient.prototype.getTransactionsByAddress = function (address, page, size) {
        var network = this.getNetwork();
        return api_1.default.getTransactionsByAddress(address, page, size, network);
    };
    AionApiClient.prototype.validateBalanceSufficiency = function (account, symbol, amount, extraParams) {
        return api_1.default.validateBalanceSufficiency(account, symbol, amount, extraParams);
    };
    AionApiClient.prototype.sendTransaction = function (account, symbol, to, value, extraParams, data, shouldBroadCast) {
        var network = this.getNetwork();
        return api_1.default.sendTransaction(account, symbol, to, value, extraParams, data, network, shouldBroadCast);
    };
    AionApiClient.prototype.sameAddress = function (address1, address2) {
        return api_1.default.sameAddress(address1, address2);
    };
    AionApiClient.prototype.formatAddress1Line = function (address) {
        return api_1.default.formatAddress1Line(address);
    };
    AionApiClient.prototype.getTokenIconUrl = function (tokenSymbol, contractAddress) {
        throw new Error('Method getTokenIconUrl not implemented.');
    };
    AionApiClient.prototype.fetchTokenDetail = function (contractAddress, network) {
        var network_ = this.getNetwork();
        return api_1.default.fetchTokenDetail(contractAddress, network || network_);
    };
    AionApiClient.prototype.fetchAccountTokenTransferHistory = function (address, symbolAddress, network, page, size, timestamp) {
        var network_ = this.getNetwork();
        return api_1.default.fetchAccountTokenTransferHistory(address, symbolAddress, network || network_, page, size);
    };
    AionApiClient.prototype.fetchAccountTokens = function (address, network) {
        var network_ = this.getNetwork();
        return api_1.default.fetchAccountTokens(address, network || network_);
    };
    AionApiClient.prototype.fetchAccountTokenBalance = function (contractAddress, address, network) {
        var network_ = this.getNetwork();
        return api_1.default.fetchAccountTokenBalance(contractAddress, address, network || network_);
    };
    AionApiClient.prototype.getTopTokens = function (topN) {
        return api_1.default.getTopTokens(topN, this.remoteApi);
    };
    AionApiClient.prototype.searchTokens = function (keyword) {
        return api_1.default.searchTokens(keyword, this.remoteApi);
    };
    return AionApiClient;
}());
exports.default = AionApiClient;
//# sourceMappingURL=apiClient.js.map