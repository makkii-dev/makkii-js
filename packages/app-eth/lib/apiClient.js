"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const network_1 = require("./network");
class EthApiClient {
    constructor(isTetNet) {
        this.tokenSupport = true;
        this.remoteApi = 'prod';
        this.isTetNet = isTetNet;
    }
    coverNetWorkConfig(network, remoteApi) {
        if (network.toString() === "[object Object]") {
            network_1.customNetwork(network);
        }
        if (remoteApi.toString() === "[object Object]") {
            network_1.customRemote(remoteApi);
        }
    }
    setRemoteApi(api) {
        this.remoteApi = api;
    }
    getNetwork() {
        return this.isTetNet ? 'mainnet' : 'ropsten';
    }
    getBlockByNumber(blockNumber) {
        const network = this.getNetwork();
        return api_1.default.getBlockByNumber(blockNumber, false, network);
    }
    getBlockNumber() {
        const network = this.getNetwork();
        return api_1.default.blockNumber(network);
    }
    getTransactionStatus(hash) {
        const network = this.getNetwork();
        return api_1.default.getTransactionStatus(hash, network);
    }
    getTransactionExplorerUrl(hash) {
        const network = this.getNetwork();
        return api_1.default.getTransactionUrlInExplorer(hash, network);
    }
    getBalance(address) {
        const network = this.getNetwork();
        return api_1.default.getBalance(address, network);
    }
    getTransactionsByAddress(address, page, size, timestamp) {
        const network = this.getNetwork();
        return api_1.default.getTransactionsByAddress(address, page, size, timestamp, network);
    }
    validateBalanceSufficiency(account, symbol, amount, extraParams) {
        return api_1.default.validateBalanceSufficiency(account, symbol, amount, extraParams);
    }
    sendTransaction(account, symbol, to, value, extraParams, data, shouldBroadCast) {
        const network = this.getNetwork();
        return api_1.default.sendTransaction(account, symbol, to, value, extraParams, data, network, shouldBroadCast);
    }
    sameAddress(address1, address2) {
        return api_1.default.sameAddress(address1, address2);
    }
    formatAddress1Line(address) {
        return api_1.default.formatAddress1Line(address);
    }
    getTokenIconUrl(tokenSymbol, contractAddress) {
        const network = this.getNetwork();
        return api_1.default.getTokenIconUrl(tokenSymbol, contractAddress, network);
    }
    fetchTokenDetail(contractAddress, network) {
        const network_ = this.getNetwork();
        return api_1.default.fetchTokenDetail(contractAddress, network || network_);
    }
    fetchAccountTokenTransferHistory(address, symbolAddress, network, page, size, timestamp) {
        const network_ = this.getNetwork();
        return api_1.default.fetchAccountTokenTransferHistory(address, symbolAddress, network || network_, page, size, timestamp);
    }
    fetchAccountTokens(address, network) {
        throw new Error("[ETH] fetchAccountTokens not implemented.");
    }
    fetchAccountTokenBalance(contractAddress, address, network) {
        const network_ = this.getNetwork();
        return api_1.default.fetchAccountTokenBalance(contractAddress, address, network || network_);
    }
    getTopTokens(topN) {
        return api_1.default.getTopTokens(topN, this.remoteApi);
    }
    searchTokens(keyword) {
        return api_1.default.searchTokens(keyword, this.remoteApi);
    }
}
exports.default = EthApiClient;
//# sourceMappingURL=apiClient.js.map