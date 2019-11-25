"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_api_1 = require("./lib_api");
const network_1 = require("./network");
class TronApiClient {
    constructor(networkConfig) {
        this.setNetwork = (networkConfig) => {
            this.networkConfig = Object.assign(Object.assign({}, this.networkConfig), networkConfig);
            this.api = lib_api_1.default(this.networkConfig);
        };
        this.getBlockByNumber = (blockNumber) => {
            throw new Error("[tron] getBlockByNumber not implemented.");
        };
        this.getBlockNumber = () => {
            throw new Error("[tron] getBlockNumber not implemented.");
        };
        this.getTransactionStatus = (hash) => {
            return this.api.getTransactionStatus(hash);
        };
        this.getTransactionExplorerUrl = (hash) => {
            return this.api.getTransactionUrlInExplorer(hash);
        };
        this.getBalance = (address) => {
            return this.api.getBalance(address);
        };
        this.getTransactionsByAddress = (address, page, size, timestamp) => {
            return this.api.getTransactionsByAddress(address, page, size);
        };
        this.validateBalanceSufficiency = (account, symbol, amount) => {
            return this.api.validateBalanceSufficiency(account, symbol, amount);
        };
        this.sendTransaction = (account, symbol, to, value, extraParams, data, shouldBroadCast) => {
            return this.api.sendTransaction(account, symbol, to, value, shouldBroadCast);
        };
        this.sameAddress = (address1, address2) => {
            return this.api.sameAddress(address1, address2);
        };
        let restSet;
        ['network', 'trongrid_api'].forEach(f => {
            if (!(f in networkConfig)) {
                throw new Error(`networkConfig miss field ${f}`);
            }
        });
        if (networkConfig.network === 'mainnet') {
            restSet = network_1.default.mainnet;
        }
        else {
            restSet = network_1.default.shasta;
        }
        this.networkConfig = Object.assign(Object.assign({}, restSet), networkConfig);
        this.api = lib_api_1.default(this.networkConfig);
    }
}
exports.default = TronApiClient;
//# sourceMappingURL=apiClient.js.map