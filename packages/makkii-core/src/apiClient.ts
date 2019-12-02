import BigNumber from 'bignumber.js';
import { HttpClient } from 'lib-common-util-js';
import { IApiClient, IsingleApiClient, IsingleApiFullClient } from './interfaces/api_client';
import { IkeystoreSigner } from './interfaces/keystore_client';

function isInstanceOfApiClient(client: object) {
    const map = [
        "getBlockByNumber",
        "getBlockNumber",
        "getTransactionStatus",
        "getTransactionExplorerUrl",
        "getBalance",
        "getNetwork",
        "getTransactionsByAddress",
        "buildTransaction",
        "sendTransaction",
        "sameAddress",
    ];
    return !map.some(i => !(i in client));
}

export default class ApiClient implements IApiClient {


    coins: { [coin: string]: IsingleApiClient | IsingleApiFullClient } = {};


    addCoin = (coinType: string, client: IsingleApiClient | IsingleApiFullClient): void => {
        if (!isInstanceOfApiClient(client)) {
            throw new Error('not a api client!');
        }
        this.coins[coinType.toLowerCase()] = client;
    }


    removeCoin = (coinType: string): boolean => {
        if (this.coins[coinType.toLowerCase()]) {
            delete this.coins[coinType.toLowerCase()]
            return true;
        }
        return false;
    }


    getCoin = (coinType: string) => {
        const coin = this.coins[coinType.toLowerCase()];
        if (!coin) {
            throw new Error(`coin: [${coinType}] is not init or unsupported.`)
        }
        return coin;
    }

    getBlockByNumber = (coinType: string, blockNumber: string): Promise<any> => {
        const coin = this.getCoin(coinType);
        return coin.getBlockByNumber(blockNumber);
    }

    getBlockNumber = (coinType: string): Promise<any> => {
        const coin = this.getCoin(coinType);
        return coin.getBlockNumber();
    }

    getTransactionStatus = (coinType: string, hash: string): Promise<any> => {
        const coin = this.getCoin(coinType);
        return coin.getTransactionStatus(hash);
    }

    getTransactionExplorerUrl = (coinType: string, hash: any): string => {
        const coin = this.getCoin(coinType);
        return coin.getTransactionExplorerUrl(hash);
    }

    getBalance = (coinType: string, address: string): Promise<any> => {
        const coin = this.getCoin(coinType);
        return coin.getBalance(address);
    }

    getTransactionsByAddress = (coinType: string, address: string, page: number, size: number): Promise<any> => {
        const coin = this.getCoin(coinType);
        return coin.getTransactionsByAddress(address, page, size);
    }

    buildTransaction = (coinType: string, from: string, to: string, value: BigNumber, options: any) => {
        const coin = this.getCoin(coinType);
        return coin.buildTransaction(from, to, value, options);
    }

    sendTransaction = (coinType: string, unsignedTx: any, signer: IkeystoreSigner, signerParams: any): Promise<any> => {
        const coin = this.getCoin(coinType);
        return coin.sendTransaction(unsignedTx, signer, signerParams);
    }

    sameAddress = (coinType: string, address1: string, address2: string): boolean => {
        const coin = this.getCoin(coinType);
        return coin.sameAddress(address1, address2);
    }

    getTokenIconUrl = (coinType: string, tokenSymbol: string, contractAddress: string): string => {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getTokenIconUrl(tokenSymbol, contractAddress);
        }
        throw new Error(`[${coinType}] getTokenIconUrl is not implemented.`)

    }

    getTokenDetail = (coinType: string, contractAddress: string): Promise<any> => {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getTokenDetail(contractAddress);
        }
        throw new Error(`[${coinType}] getTokenDetail is not implemented.`)
    }

    getAccountTokenTransferHistory = (coinType: string, address: string, symbolAddress: string, page?: number, size?: number, timestamp?: number): Promise<any> => {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getAccountTokenTransferHistory(address, symbolAddress, page, size, timestamp);
        }
        throw new Error(`[${coinType}] getAccountTokenTransferHistory is not implemented.`)
    }

    getAccountTokens = (coinType: string, address: string): Promise<any> => {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getAccountTokens(address);
        }
        throw new Error(`[${coinType}] getAccountTokens is not implemented.`)
    }

    getAccountTokenBalance = (coinType: string, contractAddress: string, address: string): Promise<any> => {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getAccountTokenBalance(contractAddress, address);
        }
        throw new Error(`[${coinType}] getAccountTokenBalance is not implemented.`)
    }

    getTopTokens = (coinType: string, topN?: number): Promise<any> => {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.getTopTokens(topN);
        }
        throw new Error(`[${coinType}] getTopTokens is not implemented.`)
    }

    searchTokens = (coinType: string, keyword: string): Promise<any> => {
        const coin = this.getCoin(coinType);
        if ('tokenSupport' in coin && !!coin.tokenSupport) {
            return coin.searchTokens(keyword);
        }
        throw new Error(`[${coinType}] searchTokens is not implemented.`)
    }

    getCoinPrices = (currency: string): Promise<any> => {
        const cryptos = Object.keys(this.coins).map(c => c.toUpperCase()).join(',');
        const url = `https://www.chaion.net/makkii/market/prices?cryptos=${cryptos}&fiat=${currency}`;
        return HttpClient.get(url, false);
    }
}