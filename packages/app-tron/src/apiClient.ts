import BigNumber from 'bignumber.js';
import { ApiClient } from './interfaces/apiClient';
import API from './api';
import { customNetwork } from './network';

export default class TronApiClient implements ApiClient {
    tokenSupport: boolean = false;

    isTestNet: boolean;

    constructor(isTestNet: boolean) {
        this.isTestNet = isTestNet;
    }

    coverNetWorkConfig = (network: any, remote?: any) => {
        if (network.toString() === "[object Object]") {
            customNetwork(network);
        }
    }

    getNetwork = () => {
        return this.isTestNet ? 'shasta' : 'mainnet';
    }

    getBlockByNumber = (blockNumber: Number) => {
        throw new Error("[tron] getBlockByNumber not implemented.");
    }

    getBlockNumber = () => {
        throw new Error("[tron] getBlockNumber not implemented.");
    }

    getTransactionStatus = (hash: string) => {
        const network = this.getNetwork();
        return API.getTransactionStatus(hash, network);
    }

    getTransactionExplorerUrl = (hash: any) => {
        const network = this.getNetwork();
        return API.getTransactionUrlInExplorer(hash, network);
    }

    getBalance = (address: string) => {
        const network = this.getNetwork();
        return API.getBalance(address, network);
    }

    getTransactionsByAddress = (address: string, page: number, size: number, timestamp?: number) => {
        const network = this.getNetwork();
        return API.getTransactionsByAddress(address, page, size, timestamp, network);
    }

    validateBalanceSufficiency = (account: any, symbol: string, amount: number | BigNumber, extraParams?: any) => {
        return API.validateBalanceSufficiency(account, symbol, amount);
    }

    sendTransaction = (account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean) => {
        const network = this.getNetwork();
        return API.sendTransaction(account, symbol, to, value, network, shouldBroadCast);
    }

    sameAddress = (address1: string, address2: string) => {
        return API.sameAddress(address1, address2);
    }

    formatAddress1Line = (address: string) => {
        return API.formatAddress1Line(address);
    }


}