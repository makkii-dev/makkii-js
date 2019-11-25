import BigNumber from 'bignumber.js';
import { IsingleKeystoreFullClient } from '@makkii/makkii-core/src/interfaces/keystoreClient'
import { IsingleApiFullClient } from '@makkii/makkii-core/src/interfaces/apiclient'



interface IConfig {
    network: 'mainnet' | 'ropsten';
    jsonrpc: string;
    explorer_api?: {
        provider: string,
        url: string,
        key: string,
    };
    explorer?: {
        provider: string,
        url: string,
    };
    remoteApi?: string;
  }

export class EthApiClient implements IsingleApiFullClient {
    tokenSupport: boolean;

    constructor(config: IConfig);

    config: any;

    setNetwork: (options: IConfig) => void;

    getNetwork: () => "mainnet" | "ropsten";

    getBlockByNumber: (blockNumber: Number) => Promise<any>;

    getBlockNumber: () => Promise<any>;

    getTransactionStatus: (hash: string) => Promise<any>;

    getTransactionExplorerUrl: (hash: any) => string;

    getBalance: (address: string) => Promise<any>;

    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => Promise<any>;

    validateBalanceSufficiency: (account: any, amount: number | BigNumber, extraParams?: any) => Promise<any>;

    sendTransaction: (account: any, to: string, value: number | BigNumber, data: any, extraParams: any, shouldBroadCast: boolean) => Promise<any>;

    sameAddress: (address1: string, address2: string) => boolean;

    getTokenIconUrl: (tokenSymbol: string, contractAddress: string) => string;

    getTokenDetail: (contractAddress: string) => Promise<any>;

    getAccountTokenTransferHistory: (address: string, symbolAddress: string, page?: number, size?: number, timestamp?: number) => Promise<any>;

    getAccountTokens: (address: string) => Promise<any>;

    getAccountTokenBalance: (contractAddress: string, address: string) => Promise<any>;

    getTopTokens: (topN?: number) => Promise<any>;

    searchTokens: (keyword: string) => Promise<any>;
}

export class EthKeystoreClient implements IsingleKeystoreFullClient {

    ledgerSupport: boolean;

    mnemonic: string;

    signTransaction: (tx: any) => Promise<any>;

    getAccount: (address_index: number) => Promise<any>;

    setMnemonic: (mnemonic: string) => void;

    generateMnemonic: () => string;

    recoverKeyPairByPrivateKey: (priKey: string, options?: any) => Promise<any>;

    recoverKeyPairByWIF: (WIF: string, options?: any) => Promise<any>;

    recoverKeyPairByKeyFile: (file: string, password: string) => Promise<any>;

    validatePrivateKey: (privateKey: string | Buffer) => boolean;

    validateAddress: (address: string) => Promise<any>;

    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<any>;

    getAccountByLedger: (index: number) => Promise<any>;

    signByLedger: (index: number, sender: string, msg: Buffer) => Promise<any>;

    setLedgerTransport: (transport: any) => void;

    getLedgerStatus: () => Promise<boolean>;
}
