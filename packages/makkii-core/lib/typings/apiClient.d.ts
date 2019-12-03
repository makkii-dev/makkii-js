import BigNumber from "bignumber.js";
import { IApiClient, IsingleApiClient, IsingleApiFullClient } from "./interfaces/api_client";
import { IkeystoreSigner } from "./interfaces/keystore_client";
export default class ApiClient implements IApiClient {
    coins: {
        [coin: string]: IsingleApiClient | IsingleApiFullClient;
    };
    addCoin: (coinType: string, client: IsingleApiClient | IsingleApiFullClient) => void;
    removeCoin: (coinType: string) => boolean;
    getCoin: (coinType: string) => IsingleApiClient | IsingleApiFullClient;
    getBlockByNumber: (coinType: string, blockNumber: string) => Promise<any>;
    getBlockNumber: (coinType: string) => Promise<any>;
    getTransactionStatus: (coinType: string, hash: string) => Promise<any>;
    getTransactionExplorerUrl: (coinType: string, hash: any) => string;
    getBalance: (coinType: string, address: string) => Promise<any>;
    getTransactionsByAddress: (coinType: string, address: string, page: number, size: number) => Promise<any>;
    buildTransaction: (coinType: string, from: string, to: string, value: BigNumber, options: any) => Promise<any>;
    sendTransaction: (coinType: string, unsignedTx: any, signer: IkeystoreSigner, signerParams: any) => Promise<any>;
    sameAddress: (coinType: string, address1: string, address2: string) => boolean;
    getTokenIconUrl: (coinType: string, tokenSymbol: string, contractAddress: string) => string;
    getTokenDetail: (coinType: string, contractAddress: string) => Promise<any>;
    getAccountTokenTransferHistory: (coinType: string, address: string, symbolAddress: string, page?: number, size?: number, timestamp?: number) => Promise<any>;
    getAccountTokens: (coinType: string, address: string) => Promise<any>;
    getAccountTokenBalance: (coinType: string, contractAddress: string, address: string) => Promise<any>;
    getTopTokens: (coinType: string, topN?: number) => Promise<any>;
    searchTokens: (coinType: string, keyword: string) => Promise<any>;
    getCoinPrices: (currency: string) => Promise<any>;
}
