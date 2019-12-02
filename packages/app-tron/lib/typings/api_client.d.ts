import BigNumber from 'bignumber.js';
import { IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client';
import { IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import { TronUnsignedTx, TronPendingTx } from './type';
export interface IConfig {
    network: 'mainnet' | 'shasta';
    trongrid_api: string;
    explorer_api?: string;
    explorer?: string;
}
export default class TronApiClient implements IsingleApiClient {
    isTestNet: boolean;
    config: IConfig;
    api: any;
    constructor(config: IConfig);
    getNetwork: () => "mainnet" | "shasta";
    updateConfiguration: (config: IConfig) => void;
    getBlockByNumber: (blockNumber: string) => never;
    getBlockNumber: () => never;
    getTransactionStatus: (hash: string) => any;
    getTransactionExplorerUrl: (hash: any) => any;
    getBalance: (address: string) => any;
    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => any;
    validateBalanceSufficiency: (account: any, amount: number | BigNumber) => any;
    sendTransaction: (unsignedTx: TronUnsignedTx, signer: IkeystoreSigner, signerParams: any) => Promise<TronPendingTx>;
    sameAddress: (address1: string, address2: string) => any;
    buildTransaction: (from: string, to: string, value: BigNumber) => Promise<TronUnsignedTx>;
}
