import BigNumber from 'bignumber.js';

export interface IApiClient {
    getBlockByNumber(coinType: string, blockNumber: Number): Promise<any>

    getBlockNumber(coinType: string): Promise<any>

    getTransactionStatus(coinType: string, hash: string): Promise<any>

    getTransactionExplorerUrl(coinType: string, hash: any): string

    getBalance(coinType: string, address: string): Promise<any>

    getTransactionsByAddress(coinType: string, address: string, page: number, size: number): Promise<any>

    validateBalanceSufficiency(coinType: string, account: any, symbol: string, amount: number | BigNumber, extraParams?: any): Promise<any>

    sendTransaction(coinType: string, account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean): Promise<any>

    sameAddress(coinType: string, address1: string, address2: string): boolean

    formatAddress1Line(coinType: string, address: string): string

    getTokenIconUrl(coinType: string, tokenSymbol: string, contractAddress: string): string

    fetchTokenDetail(coinType: string, contractAddress: string, network?: string): Promise<any>

    fetchAccountTokenTransferHistory(coinType: string, address: string, symbolAddress: string, network?: string, page?: number, size?: number, timestamp?: number): Promise<any>

    fetchAccountTokens(coinType: string, address: string, network?: string): Promise<any>

    fetchAccountTokenBalance(coinType: string, contractAddress: string, address: string, network?: string): Promise<any>

    getTopTokens(coinType: string, topN?: number): Promise<any>

    searchTokens(coinType: string, keyword: string): Promise<any>

    coverNetWorkConfig(config: any): void;

    setRemoteApi(api: string): void
}

export interface IsingleApiClient {
   
    coverNetWorkConfig(network: any, remote?: any): void;
   
    getBlockByNumber(blockNumber: Number): Promise<any>

    getBlockNumber(): Promise<any>

    getTransactionStatus(hash: string): Promise<any>

    getTransactionExplorerUrl(hash: any): string

    getBalance(address: string): Promise<any>

    getTransactionsByAddress(address: string, page: number, size: number): Promise<any>

    validateBalanceSufficiency(account: any, symbol: string, amount: number | BigNumber, extraParams?: any): Promise<any>

    sendTransaction(account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean): Promise<any>

    sameAddress(address1: string, address2: string): boolean

    formatAddress1Line(address: string): string
};

export interface IsingleApiTokenClient {

    tokenSupport: boolean

    setRemoteApi(api: string): void

    getTokenIconUrl(tokenSymbol: string, contractAddress: string): string

    fetchTokenDetail(contractAddress: string, network?: string): Promise<any>

    fetchAccountTokenTransferHistory(address: string, symbolAddress: string, network?: string, page?: number, size?: number, timestamp?: number): Promise<any>

    fetchAccountTokens(address: string, network?: string): Promise<any>

    fetchAccountTokenBalance(contractAddress: string, address: string, network?: string): Promise<any>

    getTopTokens(topN?: number): Promise<any>

    searchTokens(keyword: string): Promise<any>
}

export interface IsingleApiFullClient extends IsingleApiClient, IsingleApiTokenClient {};