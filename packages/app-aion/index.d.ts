import BigNumber from 'bignumber.js';
import {IsingleKeystoreFullClient} from '@makkii/makkii-core/src/interfaces/keystore_client'
import {IsingleApiFullClient} from '@makkii/makkii-core/src/interfaces/api_client'
import { AionPendingTx, AionTxObj, AionTx, AionTxStatus, AionAccount } from '@makkii/makkii-type/src/aion';
import { Token, Keypair, LedgerKeypair, validateBalanceRet } from '@makkii/makkii-type';
import { IConfig } from './src/api_client';

export class AionApiClient implements IsingleApiFullClient {

    tokenSupport: boolean;

    isTestNet: boolean;

    config: IConfig;

    constructor(config: IConfig);

    getNetwork: () => string;

    setNetwork: (options: IConfig) => void;

    /**
     * return jsonrpc response's result eth_getBlockByNumber 
     * see: https://github.com/aionnetwork/aion_web3/wiki/API:-web3-eth#getblock
     */
    getBlockByNumber: (blockNumber: string) => Promise<any>;

    /**
     * return jsonrpc response's result eth_blockNumber 
     * see: https://github.com/aionnetwork/aion_web3/wiki/API:-web3-eth#getBlockNumber
     */
    getBlockNumber: () => Promise<any>;

    getTransactionStatus: (hash: string) => Promise<AionTxStatus>;

    getTransactionExplorerUrl: (hash: any) => string;

    /**
     * bignumber in AION
     */
    getBalance: (address: string) => Promise<BigNumber>;

    getTransactionsByAddress: (address: string, page: number, size: number) => Promise<{[hash:string]: AionTx}>;

    validateBalanceSufficiency: (account: AionAccount, amount: number | BigNumber, extraParams?: any) => Promise<validateBalanceRet>;

    sendTransaction: (account: AionAccount, to: string, value: number | BigNumber, data: any, extraParams: any, shouldBroadCast: boolean) => 
        Promise<{ pendingTx: AionPendingTx } | { encoded: string, txObj: AionTxObj }> ;

    sameAddress: (address1: string, address2: string) => boolean;

    // not implemented
    getTokenIconUrl: (tokenSymbol: string, contractAddress: string) => string;

    getTokenDetail: (contractAddress: string) => Promise<Token>;

    getAccountTokenTransferHistory: (address: string, symbolAddress: string, page?: number, size?: number) => Promise<{[hash:string]: AionTx}>;

    getAccountTokens: (address: string) => Promise<{[symbol: string]: Token}>;

    getAccountTokenBalance: (contractAddress: string, address: string) => Promise<BigNumber>;

    getTopTokens: (topN?: number) => Promise<Array<Token>>;

    searchTokens: (keyword: string) => Promise<Array<Token>>;
}

export class AionKeystoreClient implements IsingleKeystoreFullClient {
    ledgerSupport: boolean;

    mnemonic: string;

    signTransaction: (tx: any) => Promise<any>;

    getAccount: (address_index: number) => Promise<any>;

    setMnemonic: (mnemonic: string) => void;

    generateMnemonic: () => string;

    recoverKeyPairByPrivateKey: (priKey: string) => Promise<Keypair&{index: number}>;

    // not implemented
    recoverKeyPairByWIF: (WIF: string, options?: any) => Promise<any>;

    recoverKeyPairByKeyFile: (file: string, password: string) => Promise<Keypair>;

    validatePrivateKey: (privateKey: string | Buffer) => boolean;

    validateAddress: (address: string) => boolean;

    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<Keypair&{index: number}>;

    getAccountByLedger: (index: number) => Promise<LedgerKeypair>;

    signByLedger: (index: number, sender: string, msg: Buffer) => Promise<any>;

    setLedgerTransport: (transport: any) => void;

    getLedgerStatus: () => Promise<boolean>;
}

