import BigNumber from "bignumber.js";
import { Transaction, CoinPrice } from "../type";
import { IkeystoreSigner } from "./keystore_client";
export interface IApiClient {
    addCoin(coinType: string, client: IsingleApiClient | IsingleApiFullClient): void;
    removeCoin(coinType: string): boolean;
    getBlockByNumber(coinType: string, blockNumber: string): Promise<any>;
    getBlockNumber(coinType: string): Promise<any>;
    getBalance(coinType: string, address: string): Promise<any>;
    getTransactionStatus(coinType: string, hash: string): Promise<any>;
    getTransactionExplorerUrl(coinType: string, hash: any): string;
    getTransactionsByAddress(coinType: string, address: string, page: number, size: number, timestamp?: number): Promise<any>;
    buildTransaction(coinType: string, from: string, to: string, value: BigNumber, options: any): Promise<any>;
    sendTransaction<T extends IkeystoreSigner>(coinType: string, unsignedTx: any, signer: T, signerParams: any): Promise<any>;
    sameAddress(coinType: string, address1: string, address2: string): boolean;
    getTokenIconUrl(coinType: string, tokenSymbol: string, contractAddress: string): string;
    getTokenDetail(coinType: string, contractAddress: string): Promise<any>;
    getAccountTokenTransferHistory(coinType: string, address: string, symbolAddress: string, page?: number, size?: number, timestamp?: number): Promise<any>;
    getAccountTokens(coinType: string, address: string): Promise<any>;
    getAccountTokenBalance(coinType: string, contractAddress: string, address: string): Promise<any>;
    getTopTokens(coinType: string, topN?: number): Promise<any>;
    searchTokens(coinType: string, keyword: string): Promise<any>;
    getCoinPrices(currency: string): Promise<Array<CoinPrice>>;
}
export interface IsingleApiClient {
    config: any;
    readonly symbol: string;
    updateConfiguration(config: any): void;
    getNetwork(): string;
    getBlockByNumber(blockNumber: string): Promise<any>;
    getBlockNumber(): Promise<any>;
    getTransactionStatus(hash: string): Promise<any>;
    getTransactionExplorerUrl(hash: any): string;
    getBalance(address: string): Promise<any>;
    getTransactionsByAddress(address: string, page: number, size: number, timestamp?: number): Promise<any>;
    buildTransaction(from: string, to: string, value: BigNumber, options: any): Promise<Transaction>;
    sendTransaction<T extends IkeystoreSigner>(unsignedTx: any, signer: T, signerParams: any): Promise<any>;
    sameAddress(address1: string, address2: string): boolean;
}
export interface IsingleApiTokenClient {
    tokenSupport: boolean;
    getTokenIconUrl(tokenSymbol: string, contractAddress: string): string;
    getTokenDetail(contractAddress: string): Promise<any>;
    getAccountTokenTransferHistory(address: string, cointractAddress: string, page?: number, size?: number, timestamp?: number): Promise<any>;
    getAccountTokens(address: string): Promise<any>;
    getAccountTokenBalance(contractAddress: string, address: string): Promise<any>;
    getTopTokens(topN?: number): Promise<any>;
    searchTokens(keyword: string): Promise<any>;
}
export interface IsingleApiFullClient extends IsingleApiClient, IsingleApiTokenClient {
}
