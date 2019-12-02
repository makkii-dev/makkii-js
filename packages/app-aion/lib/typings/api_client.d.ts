import BigNumber from 'bignumber.js';
import { IsingleApiFullClient } from '@makkii/makkii-core/src/interfaces/api_client';
import { AionTx, AionTxStatus } from '@makkii/makkii-type/src/aion';
import { Token } from '@makkii/makkii-type';
import { IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import { AionUnsignedTx, AionPendingTx } from './type';
export interface IConfig {
    network: 'mainnet' | 'amity';
    jsonrpc: string;
    explorer_api?: string;
    explorer?: string;
    remoteApi?: string;
}
export default class AionApiClient implements IsingleApiFullClient {
    tokenSupport: boolean;
    config: IConfig;
    private api;
    constructor(config: IConfig);
    getNetwork: () => "mainnet" | "amity";
    updateConfiguration: (config: IConfig) => void;
    getBlockByNumber: (blockNumber: string) => any;
    getBlockNumber: () => any;
    getTransactionStatus: (hash: string) => Promise<AionTxStatus>;
    getTransactionExplorerUrl: (hash: any) => string;
    getBalance: (address: string) => Promise<BigNumber>;
    getTransactionsByAddress: (address: string, page: number, size: number) => Promise<Map<string, AionTx>>;
    sendTransaction: (unsignedTx: AionUnsignedTx, signer: IkeystoreSigner, signerParams: any) => Promise<AionPendingTx>;
    sameAddress: (address1: string, address2: string) => boolean;
    getTokenIconUrl: (tokenSymbol: string, contractAddress: string) => never;
    getTokenDetail: (contractAddress: string) => Promise<Token>;
    getAccountTokenTransferHistory: (address: string, symbolAddress: string, page?: number, size?: number) => Promise<{
        [hash: string]: AionTx;
    }>;
    getAccountTokens: (address: string) => Promise<{
        [symbol: string]: Token;
    }>;
    getAccountTokenBalance: (contractAddress: string, address: string) => Promise<BigNumber>;
    getTopTokens: (topN?: number) => Promise<Token[]>;
    searchTokens: (keyword: string) => Promise<Token[]>;
    buildTransaction: (from: string, to: string, value: BigNumber, options: {
        gasLimit: number;
        gasPrice: number;
        isTransfer: boolean;
        data?: any;
        contractAddr?: string;
        tokenDecimal?: number;
    }) => Promise<AionUnsignedTx>;
}
