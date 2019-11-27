import BigNumber from 'bignumber.js';
import { IsingleKeystoreFullClient } from '@makkii/makkii-core/src/interfaces/keystore_client'
import { IsingleApiFullClient } from '@makkii/makkii-core/src/interfaces/api_client'
import { Token, validateBalanceRet, Keypair, LedgerKeypair } from '@makkii/makkii-type';
import { EthTxStatus, EthTx, EthObj, EthAccount } from '@makkii/makkii-type/src/eth';
import { IConfig } from './src/api_client';

export class EthApiClient implements IsingleApiFullClient {
    tokenSupport: boolean;

    constructor(config: IConfig);

    config: any;

    setNetwork: (options: IConfig) => void;

    getNetwork: () => "mainnet" | "ropsten";

    /**
     * return jsonrpc response's result eth_getBlockByNumber 
     * see: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber
     */
    getBlockByNumber: (blockNumber: string) => Promise<any>;

    /**
     * return jsonrpc response's result eth_blocknumber 
     * see: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_blocknumber
     */
    getBlockNumber: () => Promise<any>;

    getTransactionStatus: (hash: string) => Promise<EthTxStatus>;

    getTransactionExplorerUrl: (hash: any) => string;

    getBalance: (address: string) => Promise<any>;

    getTransactionsByAddress: (address: string, page: number, size: number, timestamp?: number) => Promise<{[hash:string]: EthTx}>;

    validateBalanceSufficiency: (account: EthAccount, amount: number | BigNumber, extraParams?: any) => Promise<validateBalanceRet>;

    sendTransaction: (account: EthAccount, to: string, value: number | BigNumber, data: any, extraParams: any, shouldBroadCast: boolean) =>
        Promise<{encoded: string, txObj: EthObj}|{pendingTx: EthTx}>;

    sameAddress: (address1: string, address2: string) => boolean;

    getTokenIconUrl: (tokenSymbol: string, contractAddress: string) => string;

    getTokenDetail: (contractAddress: string) => Promise<Token>;

    getAccountTokenTransferHistory: (address: string, symbolAddress: string, page?: number, size?: number, timestamp?: number) => Promise<{[hash:string]: EthTx}>;
    
    // not implemented
    getAccountTokens: (address: string) => Promise<any>;

    getAccountTokenBalance: (contractAddress: string, address: string) => Promise<BigNumber>;

    getTopTokens: (topN?: number) => Promise<Array<Token>>;

    searchTokens: (keyword: string) => Promise<Array<Token>>;
}

export class EthKeystoreClient implements IsingleKeystoreFullClient {

    ledgerSupport: boolean;

    mnemonic: string;

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

    getAccountByLedger: (index: number) => Promise<LedgerKeypair>;

    signByLedger: (index: number, sender: string, msg: Buffer) => Promise<any>;

    setLedgerTransport: (transport: any) => void;

    getLedgerStatus: () => Promise<boolean>;
}
