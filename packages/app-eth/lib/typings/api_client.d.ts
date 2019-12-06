import BigNumber from "bignumber.js";
import { IsingleApiFullClient } from "@makkii/makkii-core/src/interfaces/api_client";
import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { Token } from "@makkii/makkii-core/src/type";
import { EthUnsignedTx, EthPendingTx } from "./type";
export interface IEthConfig {
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
    remote_api?: string;
}
export default class EthApiClient implements IsingleApiFullClient {
    symbol: string;
    tokenSupport: boolean;
    config: IEthConfig;
    private api;
    constructor(config: IEthConfig);
    getNetwork: () => "mainnet" | "ropsten";
    updateConfiguration: (config: IEthConfig) => void;
    getBlockByNumber: (blockNumber: string) => any;
    getBlockNumber: () => any;
    getTransactionStatus: (hash: string) => Promise<any>;
    getTransactionExplorerUrl: (hash: any) => any;
    getBalance: (address: string) => any;
    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => any;
    sendTransaction: <T extends IkeystoreSigner>(unsignedTx: EthUnsignedTx, signer: T, signerParams: any) => Promise<EthPendingTx>;
    sameAddress: (address1: string, address2: string) => boolean;
    buildTransaction: (from: string, to: string, value: BigNumber, options: {
        gasLimit: number;
        gasPrice: number;
        isTokenTransfer: boolean;
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
