"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const network_1 = require("./network");
class AionApiClient {
    constructor(isTestNet) {
        this.tokenSupport = true;
        this.remoteApi = 'prod';
        this.setRemoteApi = (api) => {
            this.remoteApi = api;
        };
        this.coverNetWorkConfig = (network, remoteApi) => {
            if (network.toString() === "[object Object]") {
                network_1.customNetwork(network);
            }
            if (remoteApi.toString() === "[object Object]") {
                network_1.customRemote(remoteApi);
            }
        };
        this.getNetwork = () => {
            return this.isTestNet ? 'mastery' : 'mainnet';
        };
        this.getBlockByNumber = (blockNumber) => {
            const network = this.getNetwork();
            return api_1.default.getBlockByNumber(blockNumber, false, network);
        };
        this.getBlockNumber = () => {
            const network = this.getNetwork();
            return api_1.default.blockNumber(network);
        };
        this.getTransactionStatus = (hash) => {
            const network = this.getNetwork();
            return api_1.default.getTransactionStatus(hash, network);
        };
        this.getTransactionExplorerUrl = (hash) => {
            const network = this.getNetwork();
            return api_1.default.getTransactionUrlInExplorer(hash, network);
        };
        this.getBalance = (address) => {
            const network = this.getNetwork();
            return api_1.default.getBalance(address, network);
        };
        this.getTransactionsByAddress = (address, page, size) => {
            const network = this.getNetwork();
            return api_1.default.getTransactionsByAddress(address, page, size, network);
        };
        this.validateBalanceSufficiency = (account, symbol, amount, extraParams) => {
            return api_1.default.validateBalanceSufficiency(account, symbol, amount, extraParams);
        };
        this.sendTransaction = (account, symbol, to, value, extraParams, data, shouldBroadCast) => {
            const network = this.getNetwork();
            return api_1.default.sendTransaction(account, symbol, to, value, extraParams, data, network, shouldBroadCast);
        };
        this.sameAddress = (address1, address2) => {
            return api_1.default.sameAddress(address1, address2);
        };
        this.formatAddress1Line = (address) => {
            return api_1.default.formatAddress1Line(address);
        };
        this.getTokenIconUrl = (tokenSymbol, contractAddress) => {
            throw new Error('Method getTokenIconUrl not implemented.');
        };
        this.fetchTokenDetail = (contractAddress, network) => {
            const network_ = this.getNetwork();
            return api_1.default.fetchTokenDetail(contractAddress, network || network_);
        };
        this.fetchAccountTokenTransferHistory = (address, symbolAddress, network, page, size, timestamp) => {
            const network_ = this.getNetwork();
            return api_1.default.fetchAccountTokenTransferHistory(address, symbolAddress, network || network_, page, size);
        };
        this.fetchAccountTokens = (address, network) => {
            const network_ = this.getNetwork();
            return api_1.default.fetchAccountTokens(address, network || network_);
        };
        this.fetchAccountTokenBalance = (contractAddress, address, network) => {
            const network_ = this.getNetwork();
            return api_1.default.fetchAccountTokenBalance(contractAddress, address, network || network_);
        };
        this.getTopTokens = (topN) => {
            return api_1.default.getTopTokens(topN, this.remoteApi);
        };
        this.searchTokens = (keyword) => {
            return api_1.default.searchTokens(keyword, this.remoteApi);
        };
        this.isTestNet = isTestNet;
    }
}
exports.default = AionApiClient;
//# sourceMappingURL=apiClient.js.map