import BigNumber from 'bignumber.js';
import { IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client'
import { IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import API from './lib_api';
import network from './network';
import { TronUnsignedTx, TronPendingTx } from './type';

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

    updateConfiguration = (config: IConfig) => {
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

    sendTransaction = (unsignedTx: TronUnsignedTx, signer: IkeystoreSigner, signerParams: any): Promise<TronPendingTx> => {
        return this.api.sendTransaction(unsignedTx, signer, signerParams);
    }

    sameAddress = (address1: string, address2: string) => {
        return this.api.sameAddress(address1, address2);
    }

    buildTransaction = (from: string, to: string, value: BigNumber): Promise<TronUnsignedTx> => {
        return this.api.buildTransaction(from, to, value)
    }

}