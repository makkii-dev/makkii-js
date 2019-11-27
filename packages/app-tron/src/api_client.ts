import BigNumber from 'bignumber.js';
import { IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client'
import API from './lib_api';
import network from './network';

export interface IConfig {
    network: 'mainnet' | 'shasta'
    trongrid_api: string,
    explorer_api?: string,
    explorer?: string,
}
export default class TronApiClient implements IsingleApiClient {

    isTestNet: boolean;


    config: IConfig;

    api: any;

    constructor(config: IConfig) {
        let restSet: {
            explorer_api?: string,
            explorer?: string,
        };
        // check
        ['network', 'trongrid_api'].forEach(f => {
            if (!(f in config)) {
                throw new Error(`config miss field ${f}`)
            }
        })

        if (config.network === 'mainnet') {
            restSet = network.mainnet
        } else {
            restSet = network.shasta
        }
        this.config = {
            ...restSet,
            ...config,
        }
        this.api = API(this.config);
    }

    getNetwork = () => this.config.network;

    setNetwork = (config: IConfig) => {
        this.config = { ...this.config, ...config };
        this.api = API(this.config);
    }

    getBlockByNumber = (blockNumber: string) => {
        throw new Error("[tron] getBlockByNumber not implemented.");
    }

    getBlockNumber = () => {
        throw new Error("[tron] getBlockNumber not implemented.");
    }

    getTransactionStatus = (hash: string) => {
        return this.api.getTransactionStatus(hash);
    }

    getTransactionExplorerUrl = (hash: any) => {
        return this.api.getTransactionUrlInExplorer(hash);
    }

    getBalance = (address: string) => {
        return this.api.getBalance(address);
    }

    getTransactionsByAddress = (address: string, page: number, size: number, timestamp?: number) => {
        return this.api.getTransactionsByAddress(address, page, size);
    }

    validateBalanceSufficiency = (account: any, amount: number | BigNumber) => {
        return this.api.validateBalanceSufficiency(account, amount);
    }

    sendTransaction = (account: any, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean) => {
        return this.api.sendTransaction(account, to, value, shouldBroadCast);
    }

    sameAddress = (address1: string, address2: string) => {
        return this.api.sameAddress(address1, address2);
    }

}