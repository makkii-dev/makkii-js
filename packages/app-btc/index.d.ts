import BigNumber from 'bignumber.js';
import { ApiClient } from './src/interfaces/apiClient';


import { keystoreClient, keystoreLedgerClient } from './src/interfaces/keystoreClient';

export class BtcApiClient implements ApiClient {
    tokenSupport: boolean;

    isTestNet: boolean;

    coin: string;

    constructor(isTestNet: boolean, coin?: string);
    
    coverNetWorkConfig: (network: any, remote?: any) => void;

    getCurrentNetwork: () => string;

    getBlockByNumber: (blockNumber: Number) => Promise<any>;

    getBlockNumber: () => Promise<any>;

    getTransactionStatus: (hash: string) => Promise<any>;

    getTransactionExplorerUrl: (hash: any) => string;

    getBalance: (address: string) => Promise<any>;

    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => Promise<any>;

    validateBalanceSufficiency: (account: any, symbol: string, amount: number | BigNumber, extraParams?: any) => Promise<any>;

    sendTransaction: (account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean) => Promise<any>;

    sameAddress: (address1: string, address2: string) => boolean;

    formatAddress1Line: (address: string) => string;
}

export class BtcKeystoreClient implements keystoreClient, keystoreLedgerClient {
    ledgerSupport: boolean;

    mnemonic: string;

    readonly coin: string;

    readonly isTestNet: boolean;

    constructor(isTestNet?: boolean, coin?: string,);

    getCurrentNetwork: () => string;

    checkLedgerSupport: () => boolean;

    signTransaction: (tx: any) => Promise<any>;

    getKey: (address_index: number) => Promise<any>;

    setMnemonic: (mnemonic: string, passphrase?: string) => void;

    generateMnemonic: () => string;

    recoverKeyPairByPrivateKey: (priKey: string, options?: any) => Promise<any>;

    recoverKeyPairByWIF: (WIF: string, options?: any) => Promise<any>;

    recoverKeyPairBykeyFile: (file: string, password: string) => Promise<any>;

    validatePrivateKey: (privateKey: string | Buffer) => boolean;

    validateAddress: (address: string) => Promise<any>;

    getKeyFromMnemonic: (address_index: number, mnemonic: string) => Promise<any>;

    getKeyByLedger: (index: number) => Promise<any>;

    signByLedger: (index: number, sender: string, msg: Buffer) => Promise<any>;

    setLedgerTransport: (transport: any) => void;

    getLedgerStatus: () => Promise<boolean>;
}
