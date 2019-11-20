

import BigNumber from 'bignumber.js';
import { IApiClient, IsingleApiClient, IsingleApiFullClient } from './src/interfaces/apiclient';
import { IkeystoreClient, IsingleKeystoreClient, IsingleKeystoreFullClient } from './src/interfaces/keystoreClient';

declare class ApiClient implements IApiClient {
    
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

    validateBalanceSufficiency: (coinType: string, account: any, symbol: string, amount: number | BigNumber, extraParams?: any) => Promise<any>;

    sendTransaction: (coinType: string, account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean) => Promise<any>;

    sameAddress: (coinType: string, address1: string, address2: string) => boolean;

    formatAddress1Line: (coinType: string, address: string) => string;

    getTokenIconUrl: (coinType: string, tokenSymbol: string, contractAddress: string) => string;

    fetchTokenDetail: (coinType: string, contractAddress: string, network?: string) => Promise<any>;

    fetchAccountTokenTransferHistory: (coinType: string, address: string, symbolAddress: string, network?: string, page?: number, size?: number, timestamp?: number) => Promise<any>;

    fetchAccountTokens: (coinType: string, address: string, network?: string) => Promise<any>;

    fetchAccountTokenBalance: (coinType: string, contractAddress: string, address: string, network?: string) => Promise<any>;

    getTopTokens: (coinType: string, topN?: number) => Promise<any>;

    searchTokens: (coinType: string, keyword: string) => Promise<any>;

    getCoinPrices: (currency: string) => Promise<any>;
}

declare class KeystoreClient implements IkeystoreClient {
    

    coins: {
        [coin: string]: IsingleKeystoreClient | IsingleKeystoreFullClient;
    };

    addCoin: (coinType: string, client: IsingleKeystoreClient | IsingleKeystoreFullClient) => void;

    removeCoin: (coinType: string) => boolean;
    
    getCoin: (coinType: string) => IsingleKeystoreClient | IsingleKeystoreFullClient;

    signTransaction: (coinType: string, tx: any) => Promise<any>;

    getKey: (coinType: string, address_index: number) => Promise<any>;

    setMnemonic: (coinType: string, mnemonic: string, passphrase?: string) => void;

    generateMnemonic: (coinType: string) => string;

    recoverKeyPairByPrivateKey: (coinType: string, priKey: string, options?: any) => Promise<any>;

    recoverKeyPairByWIF: (coinType: string, WIF: string, options?: any) => Promise<any>;

    recoverKeyPairBykeyFile: (coinType: string, file: string, password: string) => Promise<any>;

    validatePrivateKey: (coinType: string, privateKey: string | Buffer) => boolean;

    validateAddress: (coinType: string, address: string) => Promise<any>;

    getKeyFromMnemonic: (coinType: string, ddress_index: number, mnemonic: string) => Promise<any>;

    getKeyByLedger: (coinType: string, index: number) => Promise<any>;

    signByLedger: (coinType: string, index: number, sender: string, msg: Buffer) => Promise<any>;

    setLedgerTransport: (coinType: string, transport: any) => void;

    getLedgerStatus: (coinType: string) => Promise<boolean>;
}

declare const apiClient: (support_coin_lists: any, isTestNet: any) => ApiClient;
declare const keystoreClient: (support_coin_lists: any, isTestNet: any) => KeystoreClient;
export { apiClient, keystoreClient, };
