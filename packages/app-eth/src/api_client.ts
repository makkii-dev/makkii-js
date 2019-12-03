import BigNumber from "bignumber.js";
import { IsingleApiFullClient } from "@makkii/makkii-core/src/interfaces/api_client";
import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { Token } from "@makkii/makkii-core/src/type";
import API from "./lib_api";
import network from "./network";
import { EthUnsignedTx, EthPendingTx } from "./type";

/**
 * Ethereum configuration interface
 * @category Coin ETH
 */
export interface IEthConfig {
    network: "mainnet" | "ropsten";
    jsonrpc: string;
    /**
     * api endpoint that used to query transaction information
     */
    explorer_api?: {
        /**
         * api provider. currently supported values are: 'etherscan' and 'ethplorer'
         */
        provider: string;
        /**
         * api base url
         */
        url: string;
        /**
         * api access key
         */
        key: string;
    };
    explorer?: {
        /**
         * explorer url provider. currently supported values are: 'etherscan' and 'ethplorer'
         */
        provider: string;
        /**
         * explorer base url
         */
        url: string;
    };
    /**
     * app server endpoint that provides token, icons, etc.
     */
    remoteApi?: string;
}

/**
 * Ethereum api client that implements IsingleApiFullClient
 * @category Api Client
 */
export default class EthApiClient implements IsingleApiFullClient {
    symbol: string = "ETH";

    tokenSupport: boolean = true;

    config: IEthConfig;

    private api: any;

    constructor(config: IEthConfig) {
        let restSet: {
            explorer_api?: {
                provider: string;
                url: string;
                key: string;
            };
            explorer?: {
                provider: string;
                url: string;
            };
            remoteApi?: string;
        };
        // check
        ["network", "jsonrpc"].forEach(f => {
            if (!(f in config)) {
                throw new Error(`config miss field ${f}`);
            }
        });

        if (config.network === "mainnet") {
            restSet = network.mainnet;
        } else {
            restSet = network.ropsten;
        }
        this.config = {
            ...restSet,
            ...config
        };
        this.api = API(this.config);
    }

    /**
     * Get network name: mainnet, amity.
     */
    getNetwork = () => this.config.network;

    updateConfiguration = (config: IEthConfig) => {
        this.config = { ...this.config, ...config };
        this.api = API(this.config);
    };

    /**
     * Get block by number, block information doesn't contains transaction details
     *
     * @param blockNumber block number's hex string
     * @returns eth_getBlockNumber response's result
     */
    getBlockByNumber = (blockNumber: string) => {
        return this.api.getBlockByNumber(blockNumber, false);
    };

    /**
     * Get latest block number
     *
     * @returns eth_getBlockNumber response's result
     */
    getBlockNumber = () => {
        return this.api.blockNumber(network);
    };

    /**
     * Get transaction status.
     *
     * @param hash transaction hash
     * @returns
     * ```
     * if eth_getTransactionReceipt is null, returns null;
     * else return object { status: true/false, blockNumber: intger, gasUsed: integer }
     * ```
     */
    getTransactionStatus = (hash: string): Promise<any> => {
        return this.api.getTransactionStatus(hash);
    };

    getTransactionExplorerUrl = (hash: any) => {
        return this.api.getTransactionUrlInExplorer(hash);
    };

    getBalance = (address: string) => {
        return this.api.getBalance(address);
    };

    /**
     * Get transactions by the given address
     *
     * @param address account address
     * @param page page number
     * @param size page size
     * @param timestamp earlier than this timestamp
     * @returns array of object structure which contains:<br>
     * - **hash**: string, with prefix 0x
     * - **timestamp**: milli-seconds from 1970
     * - **from**: sender
     * - **to**: receiver
     * - **value**: transfer amount
     * - **status**: 'CONFIRMED' or 'FAILED'
     * - **blockNumber**: hex string
     * - **fee**: integer
     */
    getTransactionsByAddress = (
        address: string,
        page: number,
        size: number,
        timestamp?: number
    ) => {
        return this.api.getTransactionsByAddress(
            address,
            page,
            size,
            timestamp
        );
    };

    /**
     * Send transaction
     * @param unsignedTx unsigned transaction build by buildTransaction
     * @param signer localSigner or hardware
     * @param signerParams
     * ```
     * localSigner: {private_key} hardware:{derivationIndex}
     * ```
     */
    sendTransaction = (
        unsignedTx: EthUnsignedTx,
        signer: IkeystoreSigner,
        signerParams: any
    ): Promise<EthPendingTx> => {
        return this.api.sendTransaction(unsignedTx, signer, signerParams);
    };

    sameAddress = (address1: string, address2: string): boolean => {
        return this.api.sameAddress(address1, address2);
    };

    buildTransaction = (
        from: string,
        to: string,
        value: BigNumber,
        options: {
            gasLimit: number;
            gasPrice: number;
            isTransfer: boolean;
            data?: any;
            contractAddr?: string;
            tokenDecimal?: number;
        }
    ): Promise<EthUnsignedTx> => {
        return this.api.buildTransaction(from, to, value, options);
    };

    getTokenIconUrl = (tokenSymbol: string, contractAddress: string) => {
        return this.api.getTokenIconUrl(tokenSymbol, contractAddress);
    };

    getTokenDetail = (contractAddress: string): Promise<Token> => {
        return this.api.getTokenDetail(contractAddress);
    };

    getAccountTokenTransferHistory = (
        address: string,
        symbolAddress: string,
        page?: number,
        size?: number,
        timestamp?: number
    ) => {
        return this.api.getAccountTokenTransferHistory(
            address,
            symbolAddress,
            page,
            size,
            timestamp
        );
    };

    getAccountTokens = (address: string) => {
        throw new Error("[ETH] getAccountTokens not implemented.");
    };

    getAccountTokenBalance = (
        contractAddress: string,
        address: string
    ): Promise<BigNumber> => {
        return this.api.getAccountTokenBalance(contractAddress, address);
    };

    /**
     * Get top tokens
     *
     * @param topN default 20
     */
    getTopTokens = (topN?: number): Promise<Array<Token>> => {
        return this.api.getTopTokens(topN);
    };

    searchTokens = (keyword: string): Promise<Array<Token>> => {
        return this.api.searchTokens(keyword);
    };
}
