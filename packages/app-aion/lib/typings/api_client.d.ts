import BigNumber from "bignumber.js";
import { IsingleApiFullClient } from "@makkii/makkii-core/src/interfaces/api_client";
import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { Token } from "@makkii/makkii-core/src/type";
import { AionUnsignedTx, AionPendingTx } from "./type";
export interface IAionConfig {
    network: "mainnet" | "amity";
    jsonrpc: string;
    explorer_api?: string;
    explorer?: string;
    remoteApi?: string;
}
export default class AionApiClient implements IsingleApiFullClient {
    symbol: string;
    tokenSupport: boolean;
    config: IAionConfig;
    private api;
    constructor(config: IAionConfig);
    getNetwork: () => "mainnet" | "amity";
    updateConfiguration: (config: IAionConfig) => void;
    getBlockByNumber: (blockNumber: string) => any;
    getBlockNumber: () => any;
    getTransactionStatus: (hash: string) => any;
    getTransactionExplorerUrl: (hash: any) => string;
    getBalance: (address: string) => Promise<BigNumber>;
    getTransactionsByAddress: (address: string, page: number, size: number) => any;
    sendTransaction: (unsignedTx: AionUnsignedTx, signer: IkeystoreSigner, signerParams: any) => Promise<AionPendingTx>;
    sameAddress: (address1: string, address2: string) => boolean;
    getTokenIconUrl: (tokenSymbol: string, contractAddress: string) => never;
    getTokenDetail: (contractAddress: string) => Promise<Token>;
    getAccountTokenTransferHistory: (address: string, symbolAddress: string, page?: number, size?: number) => any;
    getAccountTokens: (address: string) => Promise<{
        [symbol: string]: Token;
    }>;
    getAccountTokenBalance: (contractAddress: string, address: string) => Promise<BigNumber>;
    getTopTokens: (topN?: number) => Promise<Token[]>;
    searchTokens: (keyword: string) => Promise<Token[]>;
    buildTransaction: (from: string, to: string, value: BigNumber, options: {
        gasLimit: number;
        gasPrice: number;
        isTokenTransfer: boolean;
        data?: any;
        contractAddr?: string;
        tokenDecimal?: number;
    }) => Promise<AionUnsignedTx>;
}
