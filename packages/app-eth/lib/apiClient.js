"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_api_1 = require("./lib_api");
const network_1 = require("./network");
class EthApiClient {
    constructor(networkConfig) {
        this.tokenSupport = true;
        this.setNetwork = (networkConfig) => {
            this.networkConfig = Object.assign(Object.assign({}, this.networkConfig), networkConfig);
            this.api = lib_api_1.default(this.networkConfig);
        };
        this.getBlockByNumber = (blockNumber) => {
            return this.api.getBlockByNumber(blockNumber, false);
        };
        this.getBlockNumber = () => {
            return this.api.blockNumber(network_1.default);
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
        this.validateBalanceSufficiency = (account, symbol, amount, extraParams) => {
            return this.api.validateBalanceSufficiency(account, symbol, amount, extraParams);
        };
        this.sendTransaction = (account, symbol, to, value, data, extraParams, shouldBroadCast) => {
            return this.api.sendTransaction(account, symbol, to, value, data, extraParams, shouldBroadCast);
        };
        this.sameAddress = (address1, address2) => {
            return this.api.sameAddress(address1, address2);
        };
        this.getTokenIconUrl = (tokenSymbol, contractAddress) => {
            return this.api.getTokenIconUrl(tokenSymbol, contractAddress);
        };
        this.getTokenDetail = (contractAddress) => {
            return this.api.getTokenDetail(contractAddress);
        };
        this.getAccountTokenTransferHistory = (address, symbolAddress, page, size, timestamp) => {
            return this.api.getAccountTokenTransferHistory(address, symbolAddress, page, size, timestamp);
        };
        this.getAccountTokens = (address) => {
            throw new Error("[ETH] getAccountTokens not implemented.");
        };
        this.getAccountTokenBalance = (contractAddress, address) => {
            return this.api.getAccountTokenBalance(contractAddress, address);
        };
        this.getTopTokens = (topN) => {
            return this.api.getTopTokens(topN);
        };
        this.searchTokens = (keyword) => {
            return this.api.searchTokens(keyword);
        };
        let restSet;
        ['network', 'jsonrpc'].forEach(f => {
            if (!(f in networkConfig)) {
                throw new Error(`networkConfig miss field ${f}`);
            }
        });
        if (networkConfig.network === 'mainnet') {
            restSet = network_1.default.mainnet;
        }
        else {
            restSet = network_1.default.ropsten;
        }
        this.networkConfig = Object.assign(Object.assign({}, restSet), networkConfig);
        this.api = lib_api_1.default(this.networkConfig);
    }
}
exports.default = EthApiClient;
//# sourceMappingURL=apiClient.js.map