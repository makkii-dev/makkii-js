import BigNumber from 'bignumber.js';
import { IsingleApiClient } from '@makkii/makkii-core/src/interfaces/apiclient'
import API from './lib_api';
import network from './network';

interface IConfig {
    network: 'mainnet' | 'shasta'
    trongrid_api: string,
    explorer_api?: string,
    explorer?: string,
}
export default class TronApiClient implements IsingleApiClient {

    isTestNet: boolean;


    networkConfig: IConfig;

    api: any;

    constructor(networkConfig: IConfig) {
        let restSet: {
            explorer_api?: string,
            explorer?: string,
        };
        // check
        ['network', 'trongrid_api'].forEach(f => {
            if (!(f in networkConfig)) {
                throw new Error(`networkConfig miss field ${f}`)
            }
        })

        if (networkConfig.network === 'mainnet') {
            restSet = network.mainnet
        } else {
            restSet = network.shasta
        }
        this.networkConfig = {
            ...restSet,
            ...networkConfig,
        }
        this.api = API(this.networkConfig);
    }


    setNetwork = (networkConfig: IConfig) => {
        this.networkConfig = { ...this.networkConfig, ...networkConfig };
        this.api = API(this.networkConfig);
    }

    getBlockByNumber = (blockNumber: Number) => {
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

    validateBalanceSufficiency = (account: any, symbol: string, amount: number | BigNumber) => {
        return this.api.validateBalanceSufficiency(account, symbol, amount);
    }

    sendTransaction = (account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean) => {
        return this.api.sendTransaction(account, symbol, to, value, shouldBroadCast);
    }

    sameAddress = (address1: string, address2: string) => {
        return this.api.sameAddress(address1, address2);
    }

}