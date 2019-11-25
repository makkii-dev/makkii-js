

import BigNumber from 'bignumber.js';
import { IApiClient, IsingleApiClient, IsingleApiFullClient } from './src/interfaces/apiclient';
import { IkeystoreClient, IsingleKeystoreClient, IsingleKeystoreFullClient } from './src/interfaces/keystoreClient';

export class ApiClient implements IApiClient {
    
    coins: {
        [coin: string]: IsingleApiClient | IsingleApiFullClient;
    };

    addCoin: (coinType: string, client: IsingleApiClient | IsingleApiFullClient) => void;

    removeCoin: (coinType: string) => boolean;
    
    coverNetWorkConfig: (config: any) => void;

    setRemoteApi: (api: string) => void;

    getCoin: (coinType: string) => IsingleApiClient | IsingleApiFullClient;

    getBlockByNumber: (coinType: string, blockNumber: Number) => Promise<any>;

    getBlockNumber: (coinType: string) => Promise<any>;

    getTransactionStatus: (coinType: string, hash: string) => Promise<any>;

    getTransactionExplorerUrl: (coinType: string, hash: any) => string;

    getBalance: (coinType: string, address: string) => Promise<any>;

    getTransactionsByAddress: (coinType: string, address: string, page: number, size: number) => Promise<any>;

    validateBalanceSufficiency: (coinType: string, account: any, amount: number | BigNumber) => Promise<any>;

    sendTransaction: (coinType: string, account: any, to: string, value: number | BigNumber, data: any, extraParams: any, shouldBroadCast: boolean) => Promise<any>;

    sameAddress: (coinType: string, address1: string, address2: string) => boolean;

    formatAddress1Line: (coinType: string, address: string) => string;

    getTokenIconUrl: (coinType: string, tokenSymbol: string, contractAddress: string) => string;

    getTokenDetail: (coinType: string, contractAddress: string) => Promise<any>;

    getAccountTokenTransferHistory: (coinType: string, address: string, symbolAddress: string, page?: number, size?: number, timestamp?: number) => Promise<any>;

    getAccountTokens: (coinType: string, address: string) => Promise<any>;

    getAccountTokenBalance: (coinType: string, contractAddress: string, address: string) => Promise<any>;

    getTopTokens: (coinType: string, topN?: number) => Promise<any>;

    searchTokens: (coinType: string, keyword: string) => Promise<any>;

    getCoinPrices: (currency: string) => Promise<any>;
}

export class KeystoreClient implements IkeystoreClient {
    

    coins: {
        [coin: string]: IsingleKeystoreClient | IsingleKeystoreFullClient;
    };

    addCoin: (coinType: string, client: IsingleKeystoreClient | IsingleKeystoreFullClient) => void;

    removeCoin: (coinType: string) => boolean;
    
    getCoin: (coinType: string) => IsingleKeystoreClient | IsingleKeystoreFullClient;

    signTransaction: (coinType: string, tx: any) => Promise<any>;

    getAccount: (coinType: string, address_index: number) => Promise<any>;

    setMnemonic: (coinType: string, mnemonic: string) => void;

    generateMnemonic: (coinType: string) => string;

    recoverKeyPairByPrivateKey: (coinType: string, priKey: string, options?: any) => Promise<any>;

    recoverKeyPairByWIF: (coinType: string, WIF: string, options?: any) => Promise<any>;

    recoverKeyPairByKeyFile: (coinType: string, file: string, password: string) => Promise<any>;

    validatePrivateKey: (coinType: string, privateKey: string | Buffer) => boolean;

    validateAddress: (coinType: string, address: string) => Promise<any>;

    getAccountFromMnemonic: (coinType: string, ddress_index: number, mnemonic: string) => Promise<any>;

    getAccountByLedger: (coinType: string, index: number) => Promise<any>;

    signByLedger: (coinType: string, index: number, sender: string, msg: Buffer) => Promise<any>;

    setLedgerTransport: (coinType: string, transport: any) => void;

    getLedgerStatus: (coinType: string) => Promise<boolean>;
}

declare const apiClient: (support_coin_lists: any, isTestNet: any) => ApiClient;
declare const keystoreClient: (support_coin_lists: any, isTestNet: any) => KeystoreClient;
export { apiClient, keystoreClient, };
