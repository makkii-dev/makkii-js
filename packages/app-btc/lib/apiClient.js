"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const network_1 = require("./network");
class BtcApiClient {
    constructor(isTestNet, coin = 'btc') {
        this.tokenSupport = true;
        this.coverNetWorkConfig = (network, remote) => {
            if (network.toString() === "[object Object]") {
                network_1.customNetwork(network);
            }
        };
        this.getCurrentNetwork = () => {
            const coin_ = this.coin.toUpperCase();
            const suffix = this.isTestNet ? 'TEST' : '';
            return coin_ + suffix;
        };
        this.getBlockByNumber = (blockNumber) => {
            throw new Error(`[${this.coin}] getBlockByNumber not implemented.`);
        };
        this.getBlockNumber = () => {
            throw new Error(`[${this.coin}] getBlockNumber not implemented.`);
        };
        this.getTransactionStatus = (hash) => {
            const network = this.getCurrentNetwork();
            return api_1.default.getTransactionStatus(hash, network);
        };
        this.getTransactionExplorerUrl = (hash) => {
            const network = this.getCurrentNetwork();
            return api_1.default.getTransactionUrlInExplorer(hash, network);
        };
        this.getBalance = (address) => {
            const network = this.getCurrentNetwork();
            return api_1.default.getBalance(address, network);
        };
        this.getTransactionsByAddress = (address, page, size, timestamp) => {
            const network = this.getCurrentNetwork();
            return api_1.default.getTransactionsByAddress(address, page, size, timestamp, network);
        };
        this.validateBalanceSufficiency = (account, symbol, amount, extraParams) => {
            const network = this.getCurrentNetwork();
            return api_1.default.validateBalanceSufficiency(account, symbol, amount, extraParams);
        };
        this.sendTransaction = (account, symbol, to, value, extraParams, data, shouldBroadCast) => {
            const network = this.getCurrentNetwork();
            return api_1.default.sendTransaction(account, symbol, to, value, extraParams, network, shouldBroadCast);
        };
        this.sameAddress = (address1, address2) => {
            return api_1.default.sameAddress(address1, address2);
        };
        this.formatAddress1Line = (address) => {
            return api_1.default.formatAddress1Line(address);
        };
        this.isTestNet = isTestNet;
        this.coin = coin;
    }
}
exports.default = BtcApiClient;
//# sourceMappingURL=apiClient.js.map