import BigNumber from 'bignumber.js';

export interface ApiClient {
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
}
