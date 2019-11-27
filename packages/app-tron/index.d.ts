import BigNumber from 'bignumber.js';
import { IsingleKeystoreClient } from '@makkii/makkii-core/src/interfaces/keystore_client'
import { IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client'
import { TronTx, TronTxObj, TronAccount } from '@makkii/makkii-type/src/tron';
import { validateBalanceRet, Keypair } from '@makkii/makkii-type';
import { IConfig } from './src/api_client';

export class TronApiClient implements IsingleApiClient {
    tokenSupport: boolean;

    constructor(config: IConfig);

    config: IConfig;

    getNetwork: () => "shasta" | "mainnet";
    
    setNetwork: (options: IConfig) => void;

    // not implemented
    getBlockByNumber: (blockNumber: string) => Promise<any>;

    // not implemented
    getBlockNumber: () => Promise<any>;

    getTransactionStatus: (hash: string) => Promise<any>;

    getTransactionExplorerUrl: (hash: any) => string;

    getBalance: (address: string) => Promise<BigNumber>;

    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => Promise<{[hash: string]: TronTx}>;

    validateBalanceSufficiency: (account: TronAccount, amount: number | BigNumber, extraParams?: any) => Promise<validateBalanceRet>;

    sendTransaction: (account: TronAccount, to: string, value: number | BigNumber, data: any, extraParams: any, shouldBroadCast: boolean) => 
        Promise<{encoded: string, txObj: TronTxObj}|{pendingTx: TronTx}>;

    sameAddress: (address1: string, address2: string) => boolean;

}

export class TronKeystoreClient implements IsingleKeystoreClient {
    mnemonic: string;

    constructor();

    signTransaction: (tx: any) => Promise<any>;

    setMnemonic: (mnemonic: string) => void;

    generateMnemonic: () => string;

    recoverKeyPairByPrivateKey: (priKey: string, options?: any) => Promise<Keypair>;

    // not implemented
    recoverKeyPairByWIF: (WIF: string, options?: any) => Promise<any>;

    // not implemented
    recoverKeyPairByKeyFile: (file: string, password: string) => Promise<any>;

    validatePrivateKey: (privateKey: string | Buffer) => boolean;

    validateAddress: (address: string) => boolean;

    getAccount: (address_index: number) => Promise<Keypair&{index: number}>;
    
    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<Keypair&{index: number}>;
}
