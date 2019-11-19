"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const network_1 = require("./network");
class TronApiClient {
    constructor(isTestNet) {
        this.tokenSupport = false;
        this.coverNetWorkConfig = (network, remote) => {
            if (network.toString() === "[object Object]") {
                network_1.customNetwork(network);
            }
        };
        this.getNetwork = () => {
            return this.isTestNet ? 'shasta' : 'mainnet';
        };
        this.getBlockByNumber = (blockNumber) => {
            throw new Error("[tron] getBlockByNumber not implemented.");
        };
        this.getBlockNumber = () => {
            throw new Error("[tron] getBlockNumber not implemented.");
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
        this.getTransactionsByAddress = (address, page, size, timestamp) => {
            const network = this.getNetwork();
            return api_1.default.getTransactionsByAddress(address, page, size, timestamp, network);
        };
        this.validateBalanceSufficiency = (account, symbol, amount, extraParams) => {
            return api_1.default.validateBalanceSufficiency(account, symbol, amount);
        };
        this.sendTransaction = (account, symbol, to, value, extraParams, data, shouldBroadCast) => {
            const network = this.getNetwork();
            return api_1.default.sendTransaction(account, symbol, to, value, network, shouldBroadCast);
        };
        this.sameAddress = (address1, address2) => {
            return api_1.default.sameAddress(address1, address2);
        };
        this.formatAddress1Line = (address) => {
            return api_1.default.formatAddress1Line(address);
        };
        this.isTestNet = isTestNet;
    }
}
exports.default = TronApiClient;
//# sourceMappingURL=apiClient.js.map