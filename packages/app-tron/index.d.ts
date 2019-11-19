import BigNumber from 'bignumber.js';
import { ApiClient } from './src/interfaces/apiClient';


import { keystoreClient } from './src/interfaces/keystoreClient';

export class TronApiClient implements ApiClient {
    tokenSupport: boolean;

    isTestNet: boolean;

    constructor(isTestNet: boolean);

    coverNetWorkConfig: (network: any, remote?: any) => void;

    getNetwork: () => "shasta" | "mainnet";

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

export class TronKeystoreClient implements keystoreClient {
    mnemonic: string;

    constructor();

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
}
