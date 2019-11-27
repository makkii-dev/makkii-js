"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_api_1 = require("./lib_api");
const network_1 = require("./network");
class BtcApiClient {
    constructor(config) {
        this.getNetwork = () => this.config.network;
        this.setNetwork = (config) => {
            this.config = Object.assign(Object.assign({}, this.config), config);
            this.api = lib_api_1.default(this.config);
        };
        this.getBlockByNumber = (blockNumber) => {
            throw new Error(`[${this.config.network}] getBlockByNumber not implemented.`);
        };
        this.getBlockNumber = () => {
            throw new Error(`[${this.config.network}] getBlockNumber not implemented.`);
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
            return this.api.getTransactionsByAddress(address, page, size, timestamp);
        };
        this.validateBalanceSufficiency = (account, amount, extraParams) => {
            return this.api.validateBalanceSufficiency(account, amount, extraParams);
        };
        this.sendTransaction = (account, to, value, extraParams, data, shouldBroadCast) => {
            return this.api.sendTransaction(account, to, value, extraParams, shouldBroadCast);
        };
        this.sameAddress = (address1, address2) => {
            return this.api.sameAddress(address1, address2);
        };
        this.sendAll = (address, byte_fee) => {
            return this.api.sendAll(address, byte_fee);
        };
        let restSet;
        ['network', 'insight_api'].forEach(f => {
            if (!(f in config)) {
                throw new Error(`config miss field ${f}`);
            }
        });
        if (config.network === 'BTC') {
            restSet = network_1.default.BTC;
        }
        else if (config.network === 'BTCTEST') {
            restSet = network_1.default.BTCTEST;
        }
        else if (config.network === 'LTC') {
            restSet = network_1.default.LTC;
        }
        else if (config.network === 'LTCTEST') {
            restSet = network_1.default.LTCTEST;
        }
        else {
            throw new Error(`BtcApiClient Unsupport nework: ${config.network}`);
        }
        this.config = Object.assign(Object.assign({}, restSet), config);
        this.api = lib_api_1.default(this.config);
    }
}
exports.default = BtcApiClient;
//# sourceMappingURL=api_client.js.map