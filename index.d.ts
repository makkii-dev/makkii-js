import BigNumber from "bignumber.js";
declare namespace Api {
    interface clientConfig {
        /**
         * set client remote api
         * @param network (qa or prod)
         */
        setRemoteApi(network:RemoteApi);

        /**
         * set single coin network
         * @param coinType
         * @param network (mainnet or testnet)
         */
        setCoinNetwork(coinType: string, network?: string);

        /**
         * cover remote api
         * @param customServerConfig see: 'coins/server.json'
         */
        coverRemoteApi(customServerConfig:any);

    }

    interface clientToken {
        // all token api only support eth and aion
        /**
         * get token Icon url from remote; only support eth
         * @param coinType
         * @param tokenSymbol
         * @param contractAddress
         */
        getTokenIconUrl(coinType: string, tokenSymbol: string, contractAddress: string): string

        /**
         * get erc20 or ats  contract detail; return {symbol, name, decimals}
         * @param coinType
         * @param contractAddress
         * @param network
         */
        fetchTokenDetail(coinType: string, contractAddress: string, network?: string): Promise<any>;

        /**
         * get token transfer history by address
         * @param coinType
         * @param address
         * @param symbolAddress
         * @param network
         * @param page
         * @param size
         * @param timestamp
         */
        fetchAccountTokenTransferHistory(coinType: string, address: string, symbolAddress: string, network?: string, page?: number, size?: number, timestamp?: number): Promise<any>

        /**
         * get account tokens by address
         * @param coinType
         * @param address
         * @param network
         */
        fetchAccountTokens(coinType: string, address: string, network?: string): Promise<any>;

        /**
         * get account specific token's balance
         * @param coinType
         * @param contractAddress
         * @param address
         * @param network
         */
        fetchAccountTokenBalance(coinType: string, contractAddress: string, address: string, network?: string): Promise<any>;

        /**
         * get top N tokens
         * @param coinType
         * @param topN
         */
        getTopTokens(coinType: string, topN?: number): Promise<any>;

        /**
         * get token information from remote server
         * @param coinType
         * @param keyword
         */
        searchTokens(coinType: string, keyword: string): Promise<any>;
    }


    interface client extends clientToken, clientConfig {

        /**
         * get block detail by number
         * @param coinType
         * @param blockNumber
         */
        getBlockByNumber(coinType: string, blockNumber: number): Promise<any>;

        /**
         * return tx detail' explorer url
         * @param coinType
         * @param hash
         */
        getTransactionExplorerUrl(coinType: string, hash: string): string;

        /**
         * get transactions history by address
         * @param coinType
         * @param address
         * @param page
         * @param size
         * @param timestamp
         */
        getTransactionsByAddress(coinType: string, address: string, page: number, size: number, timestamp: number): Promise<any>;

        /**
         * get current blockchain height
         * @param conType
         */
        getBlockNumber(conType: string): Promise<any>;

        /**
         * get transactions status： status, blocknumber, gasused
         * @param coinType
         * @param hash
         */
        getTransactionStatus(coinType: string, hash: string): Promise<any>;

        /**
         * get address balance
         * @param coinType
         * @param address
         */
        getBalance(coinType: string, address: string): Promise<any>;

        /**
         * sign and broadcast transaction
         * @param account
         * @param symbol
         * @param to
         * @param value
         * @param extraParams
         * @param data
         * @param shouldBroadCast when set false, only sign
         */
        sendTransaction(account: Sender, symbol: string, to: string, value: BigNumber | number, extraParams: ETHParams|BTCParams, data: any, shouldBroadCast: boolean): Promise<any>;

        /**
         * whether two addresses are same
         * @param coinType
         * @param address1
         * @param address2
         */
        sameAddress(coinType: string, address1: string, address2: string): boolean;

        /**
         * format address one line
         * eg:
         * 0xa0014115968c43a785fd1aeeafdb8999c8415fd386aa4e518829b57d4b375b38 => 0xa001411596...57d4b375b38
         * @param coinType
         * @param address
         */
        formatAddress1Line(coinType: string, address: string): string

        /**
         * validate balance is sufficiency?
         * @param account
         * @param symbol
         * @param amount
         * @param extraParams
         */
        validateBalanceSufficiency(account: Account, symbol: string, amount: BigNumber | number, extraParams?: ETHParams|BTCParams): Promise<any>;

        /**
         * get current coin-Legal currency prices
         * @param currency
         */
        getCoinPrices(currency: string): Promise<any>


    }
    enum RemoteApi {
        qa='qa',
        prod='prod'
    }
    interface Sender {
        address: string,
        private_key: string,
        compressed?: boolean,
        type?: any,
        derivationIndex?: number,
    }

    interface Account {
        address: string,
        balance: BigNumber | number,
        symbol?: string,
        tokens?: any,
    }

    interface ETHParams {
        gasPrice: number|BigNumber,
        gasLimit: number|BigNumber,
    }

    interface BTCParams {
        byte_fee: number,
        network? : string,
    }

}
declare namespace Keystore {

    interface clientLedger {
        getKeyByLedger(coinType: string, index: number): Promise<any>,

        signByLedger(coinType: string, index: number, sender: string, msg: Buffer): Promise<any>,

        setLedgerTransport(coinType: string, transport: any): void,

        getLedgerStatus(coinType:string):boolean
    }


    interface client extends  clientLedger{
        signTransaction(coinType: string, tx: BtcTransaction|EthTransaction|TronTransaction): Promise<any>,

        getKey(coinType: string, address_index: number): Promise<any>,

        setMnemonic(mnemonic: string, passphrase?: string): void,

        generateMnemonic(): string,

        recoverKeyPairByPrivateKey(coinType: string,  priKey: string, options?:any): Promise<any>,

        recoverKeyPairByWIF(coinType: string, WIF: string,  options?:any): Promise<any>,

        validatePrivateKey(coinType:string ,privateKey: string|Buffer):boolean

        validateAddress(coinType: string, address: string ): Promise<any>,

        getKeyFromMnemonic(coinType: string, address_index: number, mnemonic: string): Promise<any>,

        recoverFromKeystore(coinType: string, input: string, password: string): Promise<any>,
    }


    interface AionTxParam {
        type: AccountType,
        sender: string,
        derivationIndex: string,
    }

    enum AccountType {
        '[local]',
        '[ledger]',
    }

    enum EthNetwork {
        'morden',
        'ropsten',
        'rinkeby',
        'goerli',
        'kovan'
    }

    interface BtcTransaction {
        private_key:string,
        compressed?:boolean,
        to_address: string,
        change_address: string,
        amount: BigNumber|number,
        utxos: any,
        extra_param?: AionTxParam,
    }

    interface EthTransaction {
        amount: BigNumber|number,
        nonce: string| number
        gasLimit: string| number,
        gasPrice: string | number,
        to: string,
        private_key: string,
        timestamp?: number,
        data?: string,
        network?:EthNetwork
        extra_param?: AionTxParam,
    }


    interface TronTransaction {
        timestamp: number,
        expiration: number,
        to_address: string,
        owner_address: string,
        private_key: string,
        amount: BigNumber| number,
        latest_block: TronBlock
    }

    interface TronBlock {
        hash: string,
        number: number

    }
}

export interface CoinType {
    AION:425,
    BITCOIN: 0,
    EOS: 194,
    ETHEREUM: 60,
    LITECOIN: 2,
    TRON: 195,
    fromCoinSymbol(symbol):number
}

/**
 *
 * @param support_coin_lists
 * @param isTestNet
 * @param customServerConfig see 'coins/server.json'
 */
export function apiClient(support_coin_lists:Array<string>, isTestNet:boolean, customServerConfig?: any):Api.client
export function keystoreClient(support_coin_lists:Array<string>, isTestNet:boolean):Keystore.client
export function setCurrentServer(server):void
