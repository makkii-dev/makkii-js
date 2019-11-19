"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
var network_1 = require("./network");
var EthApiClient = (function () {
    function EthApiClient(isTetNet) {
        this.tokenSupport = true;
        this.remoteApi = 'prod';
        this.isTetNet = isTetNet;
    }
    EthApiClient.prototype.coverNetWorkConfig = function (network, remoteApi) {
        if (network.toString() === "[object Object]") {
            network_1.customNetwork(network);
        }
        if (remoteApi.toString() === "[object Object]") {
            network_1.customRemote(remoteApi);
        }
    };
    EthApiClient.prototype.setRemoteApi = function (api) {
        this.remoteApi = api;
    };
    EthApiClient.prototype.getNetwork = function () {
        return this.isTetNet ? 'mainnet' : 'ropsten';
    };
    EthApiClient.prototype.getBlockByNumber = function (blockNumber) {
        var network = this.getNetwork();
        return api_1.default.getBlockByNumber(blockNumber, false, network);
    };
    EthApiClient.prototype.getBlockNumber = function () {
        var network = this.getNetwork();
        return api_1.default.blockNumber(network);
    };
    EthApiClient.prototype.getTransactionStatus = function (hash) {
        var network = this.getNetwork();
        return api_1.default.getTransactionStatus(hash, network);
    };
    EthApiClient.prototype.getTransactionExplorerUrl = function (hash) {
        var network = this.getNetwork();
        return api_1.default.getTransactionUrlInExplorer(hash, network);
    };
    EthApiClient.prototype.getBalance = function (address) {
        var network = this.getNetwork();
        return api_1.default.getBalance(address, network);
    };
    EthApiClient.prototype.getTransactionsByAddress = function (address, page, size, timestamp) {
        var network = this.getNetwork();
        return api_1.default.getTransactionsByAddress(address, page, size, timestamp, network);
    };
    EthApiClient.prototype.validateBalanceSufficiency = function (account, symbol, amount, extraParams) {
        return api_1.default.validateBalanceSufficiency(account, symbol, amount, extraParams);
    };
    EthApiClient.prototype.sendTransaction = function (account, symbol, to, value, extraParams, data, shouldBroadCast) {
        var network = this.getNetwork();
        return api_1.default.sendTransaction(account, symbol, to, value, extraParams, data, network, shouldBroadCast);
    };
    EthApiClient.prototype.sameAddress = function (address1, address2) {
        return api_1.default.sameAddress(address1, address2);
    };
    EthApiClient.prototype.formatAddress1Line = function (address) {
        return api_1.default.formatAddress1Line(address);
    };
    EthApiClient.prototype.getTokenIconUrl = function (tokenSymbol, contractAddress) {
        var network = this.getNetwork();
        return api_1.default.getTokenIconUrl(tokenSymbol, contractAddress, network);
    };
    EthApiClient.prototype.fetchTokenDetail = function (contractAddress, network) {
        var network_ = this.getNetwork();
        return api_1.default.fetchTokenDetail(contractAddress, network || network_);
    };
    EthApiClient.prototype.fetchAccountTokenTransferHistory = function (address, symbolAddress, network, page, size, timestamp) {
        var network_ = this.getNetwork();
        return api_1.default.fetchAccountTokenTransferHistory(address, symbolAddress, network || network_, page, size, timestamp);
    };
    EthApiClient.prototype.fetchAccountTokens = function (address, network) {
        throw new Error("[ETH] fetchAccountTokens not implemented.");
    };
    EthApiClient.prototype.fetchAccountTokenBalance = function (contractAddress, address, network) {
        var network_ = this.getNetwork();
        return api_1.default.fetchAccountTokenBalance(contractAddress, address, network || network_);
    };
    EthApiClient.prototype.getTopTokens = function (topN) {
        return api_1.default.getTopTokens(topN, this.remoteApi);
    };
    EthApiClient.prototype.searchTokens = function (keyword) {
        return api_1.default.searchTokens(keyword, this.remoteApi);
    };
    return EthApiClient;
}());
exports.default = EthApiClient;
//# sourceMappingURL=apiClient.js.map