import BigNumber from 'bignumber.js';
import {IsingleKeystoreFullClient } from '@makkii/makkii-core/src/interfaces/keystore_client';
import {IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client';

interface IConfig {
    network: 'BTC' | 'BTCTEST' | 'LTC' | 'LTCTEST'
    insight_api: string,
    broadcast?: string,
    explorer?: string,
}

export class BtcApiClient implements IsingleApiClient {

    constructor(config: IConfig);

    config: IConfig;
    
    getNetwork: () => string;

    setNetwork: (options: any) => void;

    getCurrentNetwork: () => string;

    getBlockByNumber: (blockNumber: Number) => Promise<any>;

    getBlockNumber: () => Promise<any>;

    getTransactionStatus: (hash: string) => Promise<any>;

    getTransactionExplorerUrl: (hash: any) => string;

    getBalance: (address: string) => Promise<any>;

    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => Promise<any>;

    validateBalanceSufficiency: (account: any, amount: number | BigNumber, extraParams?: any) => Promise<any>;

    sendTransaction: (account: any, to: string, value: number | BigNumber, data: any, extraParams: any, shouldBroadCast: boolean) => Promise<any>;

    sameAddress: (address1: string, address2: string) => boolean;

    sendAll: (address:string, byte_fee:number) => Promise<any>;
}

export class BtcKeystoreClient implements IsingleKeystoreFullClient {
    ledgerSupport: boolean;

    mnemonic: string;

    constructor(network: 'BTC'|'BTCTEST'|'LTC'|'LTCTEST');

    getCurrentNetwork: () => string;

    checkLedgerSupport: () => boolean;

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
