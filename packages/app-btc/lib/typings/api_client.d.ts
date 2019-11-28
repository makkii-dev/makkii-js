import BigNumber from 'bignumber.js';
import { IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client';
import { IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import { BtcUnsignedTx } from './type';
export interface IConfig {
    network: 'BTC' | 'BTCTEST' | 'LTC' | 'LTCTEST';
    insight_api: string;
    broadcast?: string;
    explorer?: string;
}
export default class BtcApiClient implements IsingleApiClient {
    private api;
    config: IConfig;
    constructor(config: IConfig);
    getNetwork: () => "BTC" | "BTCTEST" | "LTC" | "LTCTEST";
    setNetwork: (config: IConfig) => void;
    getBlockByNumber: (blockNumber: string) => never;
    getBlockNumber: () => never;
    getTransactionStatus: (hash: string) => Promise<{
        status: boolean;
        blockNumber: any;
        timestamp: any;
    }>;
    getTransactionExplorerUrl: (hash: any) => string;
    getBalance: (address: string) => Promise<BigNumber>;
    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => Promise<{}>;
    validateBalanceSufficiency: (account: any, amount: number | BigNumber, extraParams?: any) => Promise<unknown>;
    sendTransaction: (unsignedTx: BtcUnsignedTx, signer: IkeystoreSigner, signerParams: any) => Promise<{
        hash: any;
        status: string;
        from: {
            addr: any;
            value: any;
        }[];
        to: {
            addr: any;
            value: number;
        }[];
        fee: number;
    }>;
    sameAddress: (address1: string, address2: string) => boolean;
    sendAll: (address: string, byte_fee: number) => Promise<number>;
    buildTransaction: (from: string, to: string, value: BigNumber, options: {
        byte_fee: number;
    }) => Promise<BtcUnsignedTx>;
}
