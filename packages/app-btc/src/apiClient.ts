import BigNumber from 'bignumber.js';
import API from './api';
import { ApiClient } from './interfaces/apiClient';
import { customNetwork } from './network';

export default class BtcApiClient implements ApiClient {
    tokenSupport: boolean = true;

    isTestNet: boolean;

    coin: string;

    constructor(isTestNet: boolean, coin: string = 'btc') {
        this.isTestNet = isTestNet;
        this.coin = coin;
    }

    coverNetWorkConfig = (network: any, remote?: any) => {
        if (network.toString() === "[object Object]") {
            customNetwork(network);
        }
    }

    getCurrentNetwork = () => {
        const coin_ = this.coin.toUpperCase();
        const suffix = this.isTestNet ? 'TEST' : '';
        return coin_ + suffix
    }

    getBlockByNumber = (blockNumber: Number) => {
        throw new Error(`[${this.coin}] getBlockByNumber not implemented.`);
    }

    getBlockNumber = () => {
        throw new Error(`[${this.coin}] getBlockNumber not implemented.`);
    }

    getTransactionStatus = (hash: string) => {
        const network = this.getCurrentNetwork();
        return API.getTransactionStatus(hash, network);
    }

    getTransactionExplorerUrl = (hash: any) => {
        const network = this.getCurrentNetwork();
        return API.getTransactionUrlInExplorer(hash, network);
    }

    getBalance = (address: string) => {
        const network = this.getCurrentNetwork();
        return API.getBalance(address, network);
    }

    getTransactionsByAddress = (address: string, page: number, size: number, timestamp?: number) => {
        const network = this.getCurrentNetwork();
        return API.getTransactionsByAddress(address, page, size, timestamp, network);
    }

    validateBalanceSufficiency = (account: any, symbol: string, amount: number | BigNumber, extraParams?: any) => {
        const network = this.getCurrentNetwork();
        return API.validateBalanceSufficiency(account, symbol, amount, extraParams);
    }

    sendTransaction = (account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean) => {
        const network = this.getCurrentNetwork();
        return API.sendTransaction(account, symbol, to, value, extraParams, network, shouldBroadCast);
    }

    sameAddress = (address1: string, address2: string) => {
        return API.sameAddress(address1, address2);
    }

    formatAddress1Line = (address: string) => {
        return API.formatAddress1Line(address);
    }
}
