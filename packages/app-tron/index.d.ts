import BigNumber from 'bignumber.js';
import { IsingleKeystoreClient } from '@makkii/makkii-core/src/interfaces/keystore_client'
import { IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client'


interface IConfig {
    network: 'mainnet' | 'shasta'
    trongrid_api: string,
    explorer_api?: string,
    explorer?: string,
}

export class TronApiClient implements IsingleApiClient {
    tokenSupport: boolean;

    constructor(config: IConfig);

    config: any;

    getNetwork: () => "shasta" | "mainnet";

    getBlockByNumber: (blockNumber: Number) => Promise<any>;

    getBlockNumber: () => Promise<any>;

    getTransactionStatus: (hash: string) => Promise<any>;

    getTransactionExplorerUrl: (hash: any) => string;

    getBalance: (address: string) => Promise<any>;

    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => Promise<any>;

    validateBalanceSufficiency: (account: any, amount: number | BigNumber, extraParams?: any) => Promise<any>;

    sendTransaction: (account: any, to: string, value: number | BigNumber, data: any, extraParams: any, shouldBroadCast: boolean) => Promise<any>;

    sameAddress: (address1: string, address2: string) => boolean;

    setNetwork: (options: any) => void;
}

export class TronKeystoreClient implements IsingleKeystoreClient {
    mnemonic: string;

    constructor();

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
}
