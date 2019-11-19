"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_common_util_js_1 = require("lib-common-util-js");
function isIntanceOfApiClient(client) {
    const map = [
        "getBlockByNumber",
        "getBlockNumber",
        "getTransactionStatus",
        "getTransactionExplorerUrl",
        "getBalance",
        "getTransactionsByAddress",
        "validateBalanceSufficiency",
        "sendTransaction",
        "sameAddress",
        "formatAddress1Line",
    ];
    return !map.some(i => !(i in client));
}
class ApiClient {
    constructor() {
        this.coins = {};
        this.addCoin = (coinType, client) => {
            if (!isIntanceOfApiClient(client)) {
                throw new Error('not a api client!');
            }
            this.coins[coinType.toLowerCase()] = client;
        };
        this.removeCoin = (coinType) => {
            if (this.coins[coinType.toLowerCase()]) {
                delete this.coins[coinType.toLowerCase()];
                return true;
            }
            return false;
        };
        this.getCoin = (coinType) => {
            const coin = this.coins[coinType.toLowerCase()];
            if (!coin) {
                throw new Error(`coin: [${coinType}] is not init or unsupported.`);
            }
            return coin;
        };
        this.getBlockByNumber = (coinType, blockNumber) => {
            const coin = this.getCoin(coinType);
            return coin.getBlockByNumber(blockNumber);
        };
        this.getBlockNumber = (coinType) => {
            const coin = this.getCoin(coinType);
            return coin.getBlockNumber();
        };
        this.getTransactionStatus = (coinType, hash) => {
            const coin = this.getCoin(coinType);
            return coin.getTransactionStatus(hash);
        };
        this.getTransactionExplorerUrl = (coinType, hash) => {
            const coin = this.getCoin(coinType);
            return coin.getTransactionExplorerUrl(hash);
        };
        this.getBalance = (coinType, address) => {
            const coin = this.getCoin(coinType);
            return coin.getBalance(address);
        };
        this.getTransactionsByAddress = (coinType, address, page, size) => {
            const coin = this.getCoin(coinType);
            return coin.getTransactionsByAddress(address, page, size);
        };
        this.validateBalanceSufficiency = (coinType, account, symbol, amount, extraParams) => {
            const coin = this.getCoin(coinType);
            return coin.validateBalanceSufficiency(account, symbol, amount, extraParams);
        };
        this.sendTransaction = (coinType, account, symbol, to, value, extraParams, data, shouldBroadCast) => {
            const coin = this.getCoin(coinType);
            return coin.sendTransaction(account, symbol, to, value, extraParams, data, shouldBroadCast);
        };
        this.sameAddress = (coinType, address1, address2) => {
            const coin = this.getCoin(coinType);
            return coin.sameAddress(address1, address2);
        };
        this.formatAddress1Line = (coinType, address) => {
            const coin = this.getCoin(coinType);
            return coin.formatAddress1Line(address);
        };
        this.getTokenIconUrl = (coinType, tokenSymbol, contractAddress) => {
            const coin = this.getCoin(coinType);
            if ('tokenSupport' in coin && !!coin.tokenSupport) {
                return coin.getTokenIconUrl(tokenSymbol, contractAddress);
            }
            throw new Error(`[${coinType}] getTokenIconUrl is not implemented.`);
        };
        this.fetchTokenDetail = (coinType, contractAddress, network) => {
            const coin = this.getCoin(coinType);
            if ('tokenSupport' in coin && !!coin.tokenSupport) {
                return coin.fetchTokenDetail(contractAddress, network);
            }
            throw new Error(`[${coinType}] fetchTokenDetail is not implemented.`);
        };
        this.fetchAccountTokenTransferHistory = (coinType, address, symbolAddress, network, page, size, timestamp) => {
            const coin = this.getCoin(coinType);
            if ('tokenSupport' in coin && !!coin.tokenSupport) {
                return coin.fetchAccountTokenTransferHistory(address, symbolAddress, network, page, size, timestamp);
            }
            throw new Error(`[${coinType}] fetchAccountTokenTransferHistory is not implemented.`);
        };
        this.fetchAccountTokens = (coinType, address, network) => {
            const coin = this.getCoin(coinType);
            if ('tokenSupport' in coin && !!coin.tokenSupport) {
                return coin.fetchAccountTokens(address, network);
            }
            throw new Error(`[${coinType}] fetchAccountTokens is not implemented.`);
        };
        this.fetchAccountTokenBalance = (coinType, contractAddress, address, network) => {
            const coin = this.getCoin(coinType);
            if ('tokenSupport' in coin && !!coin.tokenSupport) {
                return coin.fetchAccountTokenBalance(contractAddress, address, network);
            }
            throw new Error(`[${coinType}] fetchAccountTokenBalance is not implemented.`);
        };
        this.getTopTokens = (coinType, topN) => {
            const coin = this.getCoin(coinType);
            if ('tokenSupport' in coin && !!coin.tokenSupport) {
                return coin.getTopTokens(topN);
            }
            throw new Error(`[${coinType}] getTopTokens is not implemented.`);
        };
        this.searchTokens = (coinType, keyword) => {
            const coin = this.getCoin(coinType);
            if ('tokenSupport' in coin && !!coin.tokenSupport) {
                return coin.searchTokens(keyword);
            }
            throw new Error(`[${coinType}] searchTokens is not implemented.`);
        };
        this.getCoinPrices = (currency) => {
            const cryptos = Object.keys(this.coins).map(c => c.toUpperCase()).join(',');
            const url = `https://www.chaion.net/makkii/market/prices?cryptos=${cryptos}&fiat=${currency}`;
            return lib_common_util_js_1.HttpClient.get(url, false);
        };
    }
}
exports.default = ApiClient;
//# sourceMappingURL=apiClient.js.map