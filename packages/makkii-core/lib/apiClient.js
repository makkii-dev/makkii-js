"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_aion_1 = require("@makkii/app-aion");
const app_btc_1 = require("@makkii/app-btc");
const app_eth_1 = require("@makkii/app-eth");
const app_tron_1 = require("@makkii/app-tron");
class ApiClient {
    constructor(support_coin_lists, isTestNet) {
        this.coins = {};
        support_coin_lists.forEach(c => {
            if (c.toLowerCase() === 'aion') {
                this.coins.aion = new app_aion_1.AionApiClient(isTestNet);
            }
            else if (c.toLowerCase() === 'btc') {
                this.coins.btc = new app_btc_1.BtcApiClient(isTestNet, 'btc');
            }
            else if (c.toLowerCase() === 'eth') {
                this.coins.eth = new app_eth_1.EthApiClient(isTestNet);
            }
            else if (c.toLowerCase() === 'ltc') {
                this.coins.ltc = new app_btc_1.BtcApiClient(isTestNet, 'ltc');
            }
            else if (c.toLowerCase() === 'trx') {
                this.coins.trx = new app_tron_1.TronApiClient(isTestNet);
            }
            else {
                throw new Error(`coin: [${c}] is unsupported.`);
            }
        });
    }
    coverNetWorkConfig(config) {
        const { remote: { api = {} } = {}, coins = {} } = config;
        Object.keys(this.coins).forEach(symbol => {
            if (coins[symbol]) {
                this.coins[symbol].coverNetWorkConfig(coins[symbol], api);
            }
        });
    }
    setRemoteApi(api) {
        Object.values(this.coins).forEach(coin => {
            if ('setRemoteApi' in coin) {
                coin.setRemoteApi(api);
            }
        });
    }
    getCoin(coinType) {
        const coin = this.coins[coinType.toLowerCase()];
        if (!coin) {
            throw new Error(`coin: [${coinType}] is not init or unsupported.`);
        }
        return coin;
    }
    getBlockByNumber(coinType, blockNumber) {
        const coin = this.getCoin(coinType);
        return coin.getBlockByNumber(blockNumber);
    }
    getBlockNumber(coinType) {
        const coin = this.getCoin(coinType);
        return coin.getBlockNumber();
    }
    getTransactionStatus(coinType, hash) {
        const coin = this.getCoin(coinType);
        return coin.getTransactionStatus(hash);
    }
    getTransactionExplorerUrl(coinType, hash) {
        const coin = this.getCoin(coinType);
        return coin.getTransactionExplorerUrl(hash);
    }
    getBalance(coinType, address) {
        const coin = this.getCoin(coinType);
        return coin.getBalance(address);
    }
    getTransactionsByAddress(coinType, address, page, size) {
        const coin = this.getCoin(coinType);
        return coin.getTransactionsByAddress(address, page, size);
    }
    validateBalanceSufficiency(coinType, account, symbol, amount, extraParams) {
        const coin = this.getCoin(coinType);
        return coin.validateBalanceSufficiency(account, symbol, amount, extraParams);
    }
    sendTransaction(coinType, account, symbol, to, value, extraParams, data, shouldBroadCast) {
        const coin = this.getCoin(coinType);
        return coin.sendTransaction(account, symbol, to, value, extraParams, data, shouldBroadCast);
    }
    sameAddress(coinType, address1, address2) {
        const coin = this.getCoin(coinType);
        return coin.sameAddress(address1, address2);
    }
    formatAddress1Line(coinType, address) {
        const coin = this.getCoin(coinType);
        return coin.formatAddress1Line(address);
    }
    getTokenIconUrl(coinType, tokenSymbol, contractAddress) {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getTokenIconUrl(tokenSymbol, contractAddress);
        }
        throw new Error(`[${coinType}] getTokenIconUrl is not implemented.`);
    }
    fetchTokenDetail(coinType, contractAddress, network) {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.fetchTokenDetail(contractAddress, network);
        }
        throw new Error(`[${coinType}] fetchTokenDetail is not implemented.`);
    }
    fetchAccountTokenTransferHistory(coinType, address, symbolAddress, network, page, size, timestamp) {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.fetchAccountTokenTransferHistory(address, symbolAddress, network, page, size, timestamp);
        }
        throw new Error(`[${coinType}] fetchAccountTokenTransferHistory is not implemented.`);
    }
    fetchAccountTokens(coinType, address, network) {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.fetchAccountTokens(address, network);
        }
        throw new Error(`[${coinType}] fetchAccountTokens is not implemented.`);
    }
    fetchAccountTokenBalance(coinType, contractAddress, address, network) {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.fetchAccountTokenBalance(contractAddress, address, network);
        }
        throw new Error(`[${coinType}] fetchAccountTokenBalance is not implemented.`);
    }
    getTopTokens(coinType, topN) {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getTopTokens(topN);
        }
        throw new Error(`[${coinType}] getTopTokens is not implemented.`);
    }
    searchTokens(coinType, keyword) {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.searchTokens(keyword);
        }
        throw new Error(`[${coinType}] searchTokens is not implemented.`);
    }
}
exports.default = ApiClient;
//# sourceMappingURL=apiClient.js.map