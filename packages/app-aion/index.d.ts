import BigNumber from 'bignumber.js';
import {IsingleKeystoreFullClient} from '@makkii/makkii-core/src/interfaces/keystore_client'
import {IsingleApiFullClient} from '@makkii/makkii-core/src/interfaces/api_client'
import { AionPendingTx, AionTxObj, AionTx, validateBalanceRet, AionTxStatus, AionAccount } from '@makkii/makkii-type/src/aion';
import { Token } from '@makkii/makkii-type';


interface INetworkConfig {
    network: 'mainnet' | 'amity'
    jsonrpc: string,
    explorer_api?: string,
    explorer?: string,
    remoteApi?: string,
  }


export class AionApiClient implements IsingleApiFullClient {

    tokenSupport: boolean;

    isTestNet: boolean;

    config: INetworkConfig;

    constructor(config: INetworkConfig);

    getNetwork: () => string;

    setNetwork: (options: INetworkConfig) => void;

    /**
     * return jsonrpc result eth_getBlockByNumber 
     * see: https://github.com/aionnetwork/aion_web3/wiki/API:-web3-eth#getblock
     */
    getBlockByNumber: (blockNumber: Number) => Promise<any>;

    getBlockNumber: () => Promise<number>;

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

    getAccountTokenTransferHistory: (address: string, symbolAddress: string, page?: number, size?: number, timestamp?: number) => Promise<{[hash:string]: AionTx}>;

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

    recoverKeyPairByPrivateKey: (priKey: string, options?: any) => Promise<any>;

    // not implemented
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

