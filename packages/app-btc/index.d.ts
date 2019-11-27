import BigNumber from 'bignumber.js';
import {IsingleKeystoreFullClient } from '@makkii/makkii-core/src/interfaces/keystore_client';
import {IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client';
import { BtcTxStatus, BtcTx, BtcTxObj, BtcAccount } from '@makkii/makkii-type/src/btc';
import { validateBalanceRet, Keypair, LedgerKeypair } from '@makkii/makkii-type';
import { IConfig } from './src/api_client';

export class BtcApiClient implements IsingleApiClient {

    constructor(config: IConfig);

    config: IConfig;
    
    getNetwork: () => string;

    setNetwork: (options: any) => void;

    getCurrentNetwork: () => string;
    
    // not implemented
    getBlockByNumber: (blockNumber: string) => Promise<any>;

    // not implemented
    getBlockNumber: () => Promise<BigNumber>;

    getTransactionStatus: (hash: string) => Promise<BtcTxStatus>;

    getTransactionExplorerUrl: (hash: any) => string;

    getBalance: (address: string) => Promise<BigNumber>;

    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => Promise<{[hash: string]: BtcTx}>;

    validateBalanceSufficiency: (account: BtcAccount, amount: number | BigNumber, extraParams?: any) => Promise<validateBalanceRet>;

    sendTransaction: (account: BtcAccount, to: string, value: number | BigNumber, data: any, extraParams: any, shouldBroadCast: boolean) => 
        Promise<{encoded: string, txObj: BtcTxObj} | {pendingTx: BtcTxObj&{hash: string, status: 'PENDING'}}>;

    sameAddress: (address1: string, address2: string) => boolean;

    sendAll: (address:string, byte_fee:number) => Promise<number>;
}

export class BtcKeystoreClient implements IsingleKeystoreFullClient {
    ledgerSupport: boolean;

    mnemonic: string;

    constructor(network: 'BTC'|'BTCTEST'|'LTC'|'LTCTEST');

    getCurrentNetwork: () => string;

    checkLedgerSupport: () => boolean;

    signTransaction: (tx: any) => Promise<any>;

    setMnemonic: (mnemonic: string) => void;

    generateMnemonic: () => string;

    recoverKeyPairByPrivateKey: (priKey: string, options?: any) => Promise<Keypair&{sign: (message: string)=> string, toWIF:()=>string}>;

    recoverKeyPairByWIF: (WIF: string, options?: any) => Promise<Keypair&{sign: (message: string)=> string, toWIF:()=>string}>;

    // not implemented
    recoverKeyPairByKeyFile: (file: string, password: string) => Promise<any>;

    validatePrivateKey: (privateKey: string | Buffer) => boolean;

    validateAddress: (address: string) => boolean;

    getAccount: (address_index: number) => Promise<Keypair&{index:number}>;
   
    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<Keypair&{index:number}>;

    getAccountByLedger: (index: number) => Promise<LedgerKeypair>;

    signByLedger: (index: number, sender: string, msg: Buffer) => Promise<any>;

    setLedgerTransport: (transport: any) => void;

    getLedgerStatus: () => Promise<boolean>;
}
