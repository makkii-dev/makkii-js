import BigNumber from 'bignumber.js';
import {ApiClient} from './interfaces/apiClient';
import API from './api';
import { customNetwork } from './network';

export default class TronApiClient implements ApiClient {
    tokenSupport: boolean = false;

    isTestNet: boolean;

    constructor(isTestNet: boolean){
        this.isTestNet = isTestNet;
    }

    coverNetWorkConfig(network: any, remote?: any): void {
        if (network.toString() === "[object Object]") {
            customNetwork(network);
        }
    }
    
    getNetwork(){
        return this.isTestNet? 'shasta': 'mainnet';
    }

    getBlockByNumber(blockNumber: Number): Promise<any> {
        throw new Error("[tron] getBlockByNumber not implemented.");
    }

    getBlockNumber(): Promise<any> {
        throw new Error("[tron] getBlockNumber not implemented.");
    }

    getTransactionStatus(hash: string): Promise<any> {
        const network = this.getNetwork();
        return API.getTransactionStatus(hash, network);
    }

    getTransactionExplorerUrl(hash: any): string {
        const network = this.getNetwork();
        return API.getTransactionUrlInExplorer(hash, network);
    }

    getBalance(address: string): Promise<any> {
        const network = this.getNetwork();
        return API.getBalance(address, network);
    }

    getTransactionsByAddress(address: string, page: number, size: number, timestamp?: number): Promise<any> {
        const network = this.getNetwork();
        return API.getTransactionsByAddress(address, page, size, timestamp, network);
    }

    validateBalanceSufficiency(account: any, symbol: string, amount: number | BigNumber, extraParams?: any): Promise<any> {
        return API.validateBalanceSufficiency(account, symbol, amount);
    }

    sendTransaction(account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean): Promise<any> {
        const network = this.getNetwork();
        return API.sendTransaction(account, symbol, to, value, network, shouldBroadCast);
    }

    sameAddress(address1: string, address2: string): boolean {
        return API.sameAddress(address1, address2);
    }

    formatAddress1Line(address: string): string {
        return API.formatAddress1Line(address);
    }


}