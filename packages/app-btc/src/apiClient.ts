import BigNumber from 'bignumber.js';
import API from './api';
import {ApiClient} from './interfaces/apiClient';
import { customNetwork } from './network';

export default class BtcApiClient implements ApiClient{
    tokenSupport: boolean = true;

    isTestNet: boolean;

    coin: string;

    constructor(isTestNet: boolean, coin: string = 'btc') {
        this.isTestNet = isTestNet;
        this.coin = coin;
    }

    coverNetWorkConfig(network: any, remote?: any): void {
        if(network.toString() === "[object Object]") {
          customNetwork(network);
        }
    }
    
    getCurrentNetwork(): string {
        const coin_ = this.coin.toUpperCase();
        const suffix = this.isTestNet ? 'TEST' : '';
        return coin_ + suffix
    }

    getBlockByNumber(blockNumber: Number): Promise<any> {
        throw new Error(`[${this.coin}] getBlockByNumber not implemented.`);
    }

    getBlockNumber(): Promise<any> {
        throw new Error(`[${this.coin}] getBlockNumber not implemented.`);
    }

    getTransactionStatus(hash: string): Promise<any> {
        const network = this.getCurrentNetwork();
        return API.getTransactionStatus(hash, network);
    }

    getTransactionExplorerUrl(hash: any): string {
        const network = this.getCurrentNetwork();
        return API.getTransactionUrlInExplorer(hash, network);
    }

    getBalance(address: string): Promise<any> {
        const network = this.getCurrentNetwork();
        return API.getBalance(address, network);
    }

    getTransactionsByAddress(address: string, page: number, size: number, timestamp?: number): Promise<any> {
        const network = this.getCurrentNetwork();
        return API.getTransactionsByAddress(address, page, size, timestamp, network);
    }

    validateBalanceSufficiency(account: any, symbol: string, amount: number | BigNumber, extraParams?: any): Promise<any> {
        const network = this.getCurrentNetwork();
        return API.validateBalanceSufficiency(account, symbol, amount, extraParams);
    }

    sendTransaction(account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean): Promise<any> {
        const network = this.getCurrentNetwork();
        return API.sendTransaction(account, symbol, to, value, extraParams, network, shouldBroadCast);
    }

    sameAddress(address1: string, address2: string): boolean {
        return API.sameAddress(address1, address2);
    }

    formatAddress1Line(address: string): string {
        return API.formatAddress1Line(address);
    }
}
