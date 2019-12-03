import BigNumber from "bignumber.js";
import { IsingleApiFullClient } from "@makkii/makkii-core/src/interfaces/api_client";
import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { Token } from "@makkii/makkii-core/src/type";
import { EthUnsignedTx, EthPendingTx } from "./type";
export interface IConfig {
    network: "mainnet" | "ropsten";
    jsonrpc: string;
    explorer_api?: {
        provider: string;
        url: string;
        key: string;
    };
    explorer?: {
        provider: string;
        url: string;
    };
    remoteApi?: string;
}
export default class EthApiClient implements IsingleApiFullClient {
    tokenSupport: boolean;
    config: IConfig;
    private api;
    constructor(config: IConfig);
    getNetwork: () => "mainnet" | "ropsten";
    updateConfiguration: (config: IConfig) => void;
    getBlockByNumber: (blockNumber: string) => any;
    getBlockNumber: () => any;
    getTransactionStatus: (hash: string) => any;
    getTransactionExplorerUrl: (hash: any) => any;
    getBalance: (address: string) => any;
    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => any;
    sendTransaction: (unsignedTx: EthUnsignedTx, signer: IkeystoreSigner, signerParams: any) => Promise<EthPendingTx>;
    sameAddress: (address1: string, address2: string) => any;
    buildTransaction: (from: string, to: string, value: BigNumber, options: {
        gasLimit: number;
        gasPrice: number;
        isTransfer: boolean;
        data?: any;
        contractAddr?: string;
        tokenDecimal?: number;
    }) => Promise<EthUnsignedTx>;
    getTokenIconUrl: (tokenSymbol: string, contractAddress: string) => any;
    getTokenDetail: (contractAddress: string) => Promise<Token>;
    getAccountTokenTransferHistory: (address: string, symbolAddress: string, page?: number, size?: number, timestamp?: number) => any;
    getAccountTokens: (address: string) => never;
    getAccountTokenBalance: (contractAddress: string, address: string) => Promise<BigNumber>;
    getTopTokens: (topN?: number) => Promise<Token[]>;
    searchTokens: (keyword: string) => Promise<Token[]>;
}
