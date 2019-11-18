"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const network_1 = require("./network");
class TronApiClient {
    constructor(isTestNet) {
        this.tokenSupport = false;
        this.isTestNet = isTestNet;
    }
    coverNetWorkConfig(network, remote) {
        if (network.toString() === "[object Object]") {
            network_1.customNetwork(network);
        }
    }
    getNetwork() {
        return this.isTestNet ? 'shasta' : 'mainnet';
    }
    getBlockByNumber(blockNumber) {
        throw new Error("[tron] getBlockByNumber not implemented.");
    }
    getBlockNumber() {
        throw new Error("[tron] getBlockNumber not implemented.");
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
        return api_1.default.validateBalanceSufficiency(account, symbol, amount);
    }
    sendTransaction(account, symbol, to, value, extraParams, data, shouldBroadCast) {
        const network = this.getNetwork();
        return api_1.default.sendTransaction(account, symbol, to, value, network, shouldBroadCast);
    }
    sameAddress(address1, address2) {
        return api_1.default.sameAddress(address1, address2);
    }
    formatAddress1Line(address) {
        return api_1.default.formatAddress1Line(address);
    }
}
exports.default = TronApiClient;
//# sourceMappingURL=apiClient.js.map