import BigNumber from "bignumber.js";
declare namespace Api {

    interface client {
        setRemoteApi(network:RemoteApi);

        setCoinNetwork(coinType: string, network?: string);

        getTokenIconUrl(coinType: string, tokenSymbol: string, contractAddress: string): string

        getBlockByNumber(coinType: string, blockNumber: number): Promise<any>;

        getTransactionExplorerUrl(coinType: string, hash: string): string;

        getTransactionsByAddress(coinType: string, address: string, page: number, size: number, timestamp: number): Promise<any>;

        getBlockNumber(conType: string): Promise<any>;

        getTransactionStatus(coinType: string, hash: string): Promise<any>;

        getBalance(coinType: string, address: string): Promise<any>;

        sendTransaction(account: Sender, symbol: string, to: string, value: BigNumber | number, extraParams: ETHParams|BTCParams, data: any, shouldBroadCast: boolean): Promise<any>;

        sameAddress(coinType: string, address1: string, address2: string): boolean;

        formatAddress1Line(coinType: string, address: string): string

        validateBalanceSufficiency(account: Account, symbol: string, amount: BigNumber | number, extraParams?: ETHParams|BTCParams): Promise<any>;

        getCoinPrices(currency: string): Promise<any>

        fetchTokenDetail(coinType: string, contractAddress: string, network?: string): Promise<any>;

        fetchAccountTokenTransferHistory(coinType: string, address: string, symbolAddress: string, network?: string, page?: number, size?: number, timestamp?: number): Promise<any>

        fetchAccountTokens(coinType: string, address: string, network?: string): Promise<any>;

        fetchAccountTokenBalance(coinType: string, contractAddress: string, address: string, network?: string): Promise<any>;

        getTopTokens(coinType: string, topN?: number): Promise<any>;

        searchTokens(coinType: string, keyword: string): Promise<any>;
    }
    enum RemoteApi {
        'dev',
        'prod'
    }
    interface Sender {
        address: string;
        private_key: string;
        type?: any
        derivationIndex?: number
    }

    interface Account {
        address: string;
        balance: BigNumber | number;
        symbol?: string;
        tokens?: any
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
    interface client {
        signTransaction(tx: AionTransaction|BtcTransaction|EthTransaction|TronTransaction, coinType: string): Promise<any>,

        getKey(coinType: string, address_index: number): Promise<any>,

        setMnemonic(mnemonic: string, passphrase?: string): void,

        generateMnemonic(): string,

        recoverKeyPairByPrivateKey(priKey: string, coinType: string): Promise<any>,

        validateAddress(address: string, coinType: string): Promise<any>,

        getKeyFromMnemonic(coinType: string, address_index: number, mnemonic: string): Promise<any>,

        getKeyByLedger(symbol: string, index: number): Promise<any>,

        signByLedger(symbol: string, index: number, sender: string, msg: Buffer): Promise<any>,

        recoverFromKeystore(coinType: string, input: string, password: string): Promise<any>,

        setLedgerTransport(coinType: string, transport: any): void,

        validatePrivateKey(privateKey: string|Buffer, coinType:string):boolean
    }

    interface AionTransaction extends EthTransaction{
        extra_param?: AionTxParam
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
        to_address: string,
        change_address: string,
        amount: BigNumber|number,
        utxos: any
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
export function apiClient(support_coin_lists:Array<string>, isTestNet:boolean):Api.client
export function keystoreClient(support_coin_lists:Array<string>, isTestNet:boolean):Keystore.client
export function setCurrentServer(server):void
