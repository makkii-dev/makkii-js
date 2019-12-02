"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_api_1 = require("./lib_api");
const network_1 = require("./network");
class TronApiClient {
    constructor(config) {
        this.getNetwork = () => this.config.network;
        this.updateConfiguration = (config) => {
            this.config = Object.assign(Object.assign({}, this.config), config);
            this.api = lib_api_1.default(this.config);
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
        this.getTransactionsByAddress = (address, page, size) => {
            return this.api.getTransactionsByAddress(address, page, size);
        };
        this.sendTransaction = (unsignedTx, signer, signerParams) => {
            return this.api.sendTransaction(unsignedTx, signer, signerParams);
        };
        this.sameAddress = (address1, address2) => {
            return this.api.sameAddress(address1, address2);
        };
        this.buildTransaction = (from, to, value) => {
            return this.api.buildTransaction(from, to, value);
        };
        let restSet;
        ['network', 'trongrid_api'].forEach(f => {
            if (!(f in config)) {
                throw new Error(`config miss field ${f}`);
            }
        });
        if (config.network === 'mainnet') {
            restSet = network_1.default.mainnet;
        }
        else {
            restSet = network_1.default.shasta;
        }
        this.config = Object.assign(Object.assign({}, restSet), config);
        this.api = lib_api_1.default(this.config);
    }
}
exports.default = TronApiClient;
//# sourceMappingURL=api_client.js.map