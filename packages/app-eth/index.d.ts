import BigNumber from 'bignumber.js';
import { ApiClient, ApiTokenClient } from './src/interfaces/apiClient';


import { keystoreClient, keystoreLedgerClient } from './src/interfaces/keystoreClient';

export class EthApiClient implements ApiClient, ApiTokenClient {
    tokenSupport: boolean;

    remoteApi: string;

    isTetNet: boolean;

    constructor(isTetNet: boolean);

    coverNetWorkConfig: (network: any, remote?: any) => void;

    setRemoteApi: (api_: any) => void;

    getNetwork: () => "mainnet" | "ropsten";

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

    getTokenIconUrl: (tokenSymbol: string, contractAddress: string) => string;

    fetchTokenDetail: (contractAddress: string, network?: string) => Promise<any>;

    fetchAccountTokenTransferHistory: (address: string, symbolAddress: string, network?: string, page?: number, size?: number, timestamp?: number) => Promise<any>;

    fetchAccountTokens: (address: string, network?: string) => Promise<any>;

    fetchAccountTokenBalance: (contractAddress: string, address: string, network?: string) => Promise<any>;

    getTopTokens: (topN?: number) => Promise<any>;

    searchTokens: (keyword: string) => Promise<any>;
}

export class EthKeystoreClient implements keystoreClient, keystoreLedgerClient {
    
    ledgerSupport: boolean;

    mnemonic: string;

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

    getLedgerStatus: () => boolean;
}
