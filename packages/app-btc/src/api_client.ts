import BigNumber from 'bignumber.js';
import { IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client';
import { IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import API from './lib_api';
import network from './network';
import { BtcUnsignedTx } from './type';

export interface IConfig {
    network: 'BTC' | 'BTCTEST' | 'LTC' | 'LTCTEST'
    insight_api: string,
    broadcast?: string,
    explorer?: string,
}
export default class BtcApiClient implements IsingleApiClient {

    private api = API({});

    config: IConfig;


    constructor(config: IConfig) {
        let restSet: {
            broadcast?: string,
            explorer?: string,
        };
        // check
        ['network', 'insight_api'].forEach(f => {
            if (!(f in config)) {
                throw new Error(`config miss field ${f}`)
            }
        })

        if (config.network === 'BTC') {
            restSet = network.BTC
        } else if(config.network === 'BTCTEST'){
            restSet = network.BTCTEST
        }else if(config.network === 'LTC'){
            restSet = network.LTC
        }else if(config.network === 'LTCTEST'){
            restSet = network.LTCTEST
        }else {
            throw new Error(`BtcApiClient Unsupport nework: ${config.network}`)
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
        throw new Error(`[${this.config.network}] getBlockByNumber not implemented.`);
    }

    getBlockNumber = () => {
        throw new Error(`[${this.config.network}] getBlockNumber not implemented.`);
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

    validateBalanceSufficiency = (account: any, amount: number | BigNumber, extraParams?: any) => {
        return this.api.validateBalanceSufficiency(account, amount, extraParams);
    }

    sendTransaction = (unsignedTx: BtcUnsignedTx, signer: IkeystoreSigner, signerParams: any) => {
       return this.api.sendTransaction(unsignedTx, signer, signerParams)
    }

    sameAddress = (address1: string, address2: string) => {
        return this.api.sameAddress(address1, address2);
    }

    sendAll = (address:string, byte_fee:number) => {
        return this.api.sendAll(address, byte_fee);
    }

    buildTransaction = (from: string, to: string, value:BigNumber, options:{
        byte_fee: number,
    }): Promise<BtcUnsignedTx>=>{
        return this.api.buildTransaction(from, to, value, options)
    }
}
