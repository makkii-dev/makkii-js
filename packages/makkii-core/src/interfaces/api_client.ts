import BigNumber from "bignumber.js";
import { Transaction, CoinPrice } from "../type";
import { IkeystoreSigner } from "./keystore_client";

/**
 * Api client interface that manages multiple chains' api client and expose all functions.
 * @category Api
 */
export interface IApiClient {
    /**
     * Register an api client.
     *
     * @param coinType a key name for the added api client, you will specify the coinType for other operations.
     * @param client api client that implements IsingleApiClient or IsingleApiFullClient
     */
    addCoin(
        coinType: string,
        client: IsingleApiClient | IsingleApiFullClient
    ): void;

    /**
     * Remove a registered api client
     *
     * @param coinType api client key name
     * @returns if remove api client successfully
     */
    removeCoin(coinType: string): boolean;

    /**
     * Get block information by the given block number
     *
     * @param coinType coin type name you specified in addCoin
     * @param blockNumber block number. integer or hex string depends on kernel rpc implementation.
     * @returns depends on different chains' block structure
     */
    getBlockByNumber(coinType: string, blockNumber: string): Promise<any>;

    /**
     * Get latest block number of the given chain
     *
     * @param coinType coin type name you specified in addCoin
     * @returns latest block number whose type should be biginteger or hex string
     */
    getBlockNumber(coinType: string): Promise<any>;

    /**
     * Get balance of the given account
     *
     * @param coinType coin type name you specified in addCoin
     * @param address account's public address
     * @returns balance in hex string or biginteger
     */
    getBalance(coinType: string, address: string): Promise<any>;

    /**
     * Get transation status
     *
     * @param coinType coin type name you specified in addCoin
     * @param hash transaction hash
     * @returns transaction status, depends on different api client's implementation
     */
    getTransactionStatus(coinType: string, hash: string): Promise<any>;

    /**
     * Get web page url that can display transaction details.
     *
     * The url should be able to access from web browser by plain HTTP GET request.
     *
     * @param coinType coin type name you specified in addCoin
     * @param hash transaction hash
     * @returns web page url that display transaction details
     */
    getTransactionExplorerUrl(coinType: string, hash: any): string;

    /**
     * Get the given account's recent transactions by page.
     *
     * @param coinType coin type name you specified in addCoin
     * @param address account's public address
     * @param page page number
     * @param size how mnay transactions to get in this page
     * @return
     */
    getTransactionsByAddress(
        coinType: string,
        address: string,
        page: number,
        size: number
    ): Promise<any>;

    /**
     * Build up transaction object to sign.
     * transaction nonce should be encapsulated into transaction object.
     *
     * @param {string} coinType coin type name you specified in addCoin
     * @param from transaction sender
     * @param to amount receiver. this field isn't alway transaction's to field.
     *           if the transaction is a token transfer, transaction to field is token contract address,
     *           this field is encoded in contract method parameters.
     * @param value amount value. this field isn't alwasy transaction's value field.
     *           if the transaction is a token transfer, transaction value field is zero,
     *           this field is encoded in contract method parameters.
     * @param options common options could be: gas limit, gas price, contract address, is token transfer, data, etc.
     */
    buildTransaction(
        coinType: string,
        from: string,
        to: string,
        value: BigNumber,
        options: any
    ): Promise<any>;

    /**
     * Broadcast transaction.
     *
     * @param coinType coin type name you specified in addCoin
     * @param unsignedTx unsigned transaction object. User can call buildTransaction to get unsigned transaction.
     * @param signer implementation of IkeystoreSigner
     * @param signerParams sign parameters for differernt implementation IkeystoreSigner
     * @returns transaction hash
     */
    sendTransaction(
        coinType: string,
        unsignedTx: any,
        signer: IkeystoreSigner,
        signerParams: any
    ): Promise<any>;

    /**
     * Check if two address are the same account.
     *
     * @param coinType coin type name you specified in addCoin
     * @param address1 first address to compare
     * @param address2 second address to compare
     * @returns if two address are the same account.
     */
    sameAddress(coinType: string, address1: string, address2: string): boolean;

    /**
     * Get token icon url.
     *
     * @param coinType coin type name you specified in addCoin
     * @param tokenSymbol token symbol
     * @param contractAddress token creation contract address
     * @returns token icon url
     */
    getTokenIconUrl(
        coinType: string,
        tokenSymbol: string,
        contractAddress: string
    ): string;

    /**
     * Get token details. In general token details contains: contractAddress, symbol, name, tokenDecimals
     *
     * @param coinType coin type name you specified in addCoin
     * @param contractAddress token contract address
     * @returns toke details
     */
    getTokenDetail(coinType: string, contractAddress: string): Promise<any>;

    /**
     * Get token transfer history of the given account.
     * For pagination, user could use combination of page + size or timestamp + size.
     *
     * @param coinType coin type name you specified in addCoin
     * @param address account address
     * @param symbolAddress token contract address
     * @param page page number
     * @param size number of transfer records in this page
     * @param timestamp get transfer records earlier than this timestamp
     */
    getAccountTokenTransferHistory(
        coinType: string,
        address: string,
        symbolAddress: string,
        page?: number,
        size?: number,
        timestamp?: number
    ): Promise<any>;

    /**
     * Get tokens whose balance > 0 for the given account.
     *
     * @param coinType coin type name you specified in addCoin
     * @param address account address
     */
    getAccountTokens(coinType: string, address: string): Promise<any>;

    /**
     * Get token balance of the given account
     *
     * @param coinType coin type name you specified in addCoin
     * @param contractAddress token contract address
     * @param address account address
     */
    getAccountTokenBalance(
        coinType: string,
        contractAddress: string,
        address: string
    ): Promise<any>;

    /**
     * Get top tokens.
     *
     * @param coinType coin type name you specified in addCoin
     * @param topN number of tokens to get
     */
    getTopTokens(coinType: string, topN?: number): Promise<any>;

    /**
     * Search token by keyword.
     *
     * @param coinType coin type name you specified in addCoin
     * @param keyword keyword
     */
    searchTokens(coinType: string, keyword: string): Promise<any>;

    /**
     * Get coin prices
     *
     * @param currency fiat currency
     *
     * @returns array of coin price
     */
    getCoinPrices(currency: string): Promise<Array<CoinPrice>>;
}

/**
 * Interface that defines basic api client functions:
 * network configuration, block, transaction, balance, etc.
 *
 * @category Api
 */
export interface IsingleApiClient {
    /**
     * Configuration property.
     */
    config: any;

    /**
     * Coin symbol eg: 'AION', 'BTC' ...
     */
    readonly symbol: string;
    /**
     * Update configuration.
     *
     * @param config configuration
     */
    updateConfiguration(config: any): void;

    /**
     * get network name.
     *
     * @returns network name
     */
    getNetwork(): string;

    /**
     * Get block information by the given block number
     *
     * @param blockNumber block number. integer or hex string depends on kernel rpc implementation.
     * @returns depends on different chains' block structure
     */
    getBlockByNumber(blockNumber: string): Promise<any>;

    /**
     * Get latest block number of the given chain
     *
     * @returns latest block number whose type should be biginteger or hex string
     */
    getBlockNumber(): Promise<any>;

    /**
     * Get transation status
     *
     * @param hash transaction hash
     * @returns transaction status, depends on different api client's implementation
     */
    getTransactionStatus(hash: string): Promise<any>;

    /**
     * Get web page url that can display transaction details.
     *
     * The url should be able to access from web browser by plain HTTP GET request.
     *
     * @param hash transaction hash
     * @returns web page url that display transaction details
     */
    getTransactionExplorerUrl(hash: any): string;

    /**
     * Get balance of the given account
     *
     * @param address account's public address
     * @returns balance in hex string or biginteger
     */
    getBalance(address: string): Promise<any>;

    /**
     * Get the given account's recent transactions by page.
     *
     * @param address account's public address
     * @param page page number
     * @param size how mnay transactions to get in this page
     * @return
     */
    getTransactionsByAddress(
        address: string,
        page: number,
        size: number
    ): Promise<any>;

    /**
     * Build up transaction object to sign.
     * transaction nonce should be encapsulated into transaction object.
     *
     * @param from transaction sender
     * @param to amount receiver. this field isn't alway transaction's to field.
     *           if the transaction is a token transfer, transaction to field is token contract address,
     *           this field is encoded in contract method parameters.
     * @param value amount value. this field isn't alwasy transaction's value field.
     *           if the transaction is a token transfer, transaction value field is zero,
     *           this field is encoded in contract method parameters.
     * @param options common options could be: gas limit, gas price, contract address, is token transfer, data, etc.
     */
    buildTransaction(
        from: string,
        to: string,
        value: BigNumber,
        options: any
    ): Promise<Transaction>;

    /**
     * Broadcast transaction.
     *
     * @param unsignedTx unsigned transaction object. User can call [[buildTransaction]] to get unsigned transaction.
     * @param signer implementation of IkeystoreSigner
     * @param signerParams sign parameters for differernt implementation IkeystoreSigner
     * @returns transaction hash
     */
    sendTransaction(
        unsignedTx: any,
        signer: IkeystoreSigner,
        signerParams: any
    ): Promise<any>;

    /**
     * Check if two address are the same account.
     *
     * @param address1 first address to compare
     * @param address2 second address to compare
     * @returns if two address are the same account.
     */
    sameAddress(address1: string, address2: string): boolean;
}

/**
 * Interface that defines token related functions.
 *
 * @category Api
 */
export interface IsingleApiTokenClient {
    /**
     * is token supported
     */
    tokenSupport: boolean;

    /**
     * Get token icon url.
     *
     * @param tokenSymbol token symbol
     * @param contractAddress token creation contract address
     * @returns token icon url
     */
    getTokenIconUrl(tokenSymbol: string, contractAddress: string): string;

    /**
     * Get token details. In general token details contains: contractAddress, symbol, name, tokenDecimals
     *
     * @param contractAddress token contract address
     * @returns toke details
     */
    getTokenDetail(contractAddress: string): Promise<any>;

    /**
     * Get token transfer history of the given account.
     * For pagination, user could use combination of page + size or timestamp + size.
     *
     * @param address account address
     * @param symbolAddress token contract address
     * @param page optional, page number
     * @param size optional, number of transfer records in this page
     * @param timestamp optional, get transfer records earlier than this timestamp
     */
    getAccountTokenTransferHistory(
        address: string,
        cointractAddress: string,
        page?: number,
        size?: number,
        timestamp?: number
    ): Promise<any>;

    /**
     * Get tokens whose balance > 0 for the given account.
     *
     * @param address account address
     */
    getAccountTokens(address: string): Promise<any>;

    /**
     * Get token balance of the given account
     *
     * @param contractAddress token contract address
     * @param address account address
     */
    getAccountTokenBalance(
        contractAddress: string,
        address: string
    ): Promise<any>;

    /**
     * Get top tokens.
     *
     * @param topN number of tokens to get
     */
    getTopTokens(topN?: number): Promise<any>;

    /**
     * Search token by keyword.
     *
     * @param keyword keyword
     */
    searchTokens(keyword: string): Promise<any>;
}

/**
 * Interface that defines basic api client and token functions.
 * @category Api
 */
export interface IsingleApiFullClient
    extends IsingleApiClient,
        IsingleApiTokenClient {}
