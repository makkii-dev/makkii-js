import BigNumber from "bignumber.js";
import { IsingleApiFullClient } from "@makkii/makkii-core/src/interfaces/api_client";
import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { Token } from "@makkii/makkii-core/src/type";
import API from "./lib_api";
import network from "./network";
import { AionUnsignedTx, AionPendingTx } from "./type";

/**
 * Aion configuration interface
 */
export interface IConfig {
    network: "mainnet" | "amity";
    jsonrpc: string;
    /**
     * api endpoint that used to query transaction information
     */
    explorer_api?: string;
    /**
     * transaction page base url
     */
    explorer?: string;
    /**
     * app server endpoint that provides token, icons, etc.
     */
    remoteApi?: string;
}

/**
 * Aion api client that implement IsingleApiFullClient
 */
export default class AionApiClient implements IsingleApiFullClient {
    tokenSupport: boolean = true;

    config: IConfig;

    private api: any;

    constructor(config: IConfig) {
        let restSet: {
            explorer_api?: string;
            explorer?: string;
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
            restSet = network.amity;
        }
        this.config = {
            ...restSet,
            ...config
        };
        this.api = API(this.config);
    }

    /**
     * Get network name: mainnet, amity and mastery.
     */
    getNetwork = () => this.config.network;

    updateConfiguration = (config: IConfig) => {
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
        return this.api.blockNumber();
    };

    /**
     * Get transaction status.
     *
     * @param hash transaction hash
     * @returns if eth_getTransactionReceipt is null, returns null;
     *          else return object { status: true/false, blockNumber: intger, gasUsed: integer }
     */
    getTransactionStatus = (hash: string) => {
        return this.api.getTransactionStatus(hash);
    };

    getTransactionExplorerUrl = (hash: any): string => {
        return this.api.getTransactionUrlInExplorer(hash);
    };

    getBalance = (address: string): Promise<BigNumber> => {
        return this.api.getBalance(address);
    };

    /**
     * Get transactions by the given address
     *
     * @param address account address
     * @param page page number
     * @param size page size
     * @returns array of object structure which contains:
     *          hash: string, with prefix 0x
     *          timestamp: milli-seconds from 1970
     *          from: sender
     *          to: receiver
     *          value: transfer amount
     *          status: 'CONFIRMED' or 'FAILED'
     *          blockNumber: hex string
     *          fee: integer
     */
    getTransactionsByAddress = (
        address: string,
        page: number,
        size: number
    ) => {
        return this.api.getTransactionsByAddress(address, page, size);
    };

    sendTransaction = (
        unsignedTx: AionUnsignedTx,
        signer: IkeystoreSigner,
        signerParams: any
    ): Promise<AionPendingTx> => {
        return this.api.sendTransaction(unsignedTx, signer, signerParams);
    };

    sameAddress = (address1: string, address2: string): boolean => {
        return this.api.sameAddress(address1, address2);
    };

    /**
     * throw not implementated error
     */
    getTokenIconUrl = (tokenSymbol: string, contractAddress: string) => {
        throw new Error("Method getTokenIconUrl not implemented.");
    };

    getTokenDetail = (contractAddress: string): Promise<Token> => {
        return this.api.getTokenDetail(contractAddress);
    };

    getAccountTokenTransferHistory = (
        address: string,
        symbolAddress: string,
        page?: number,
        size?: number
    ) => {
        return this.api.getAccountTokenTransferHistory(
            address,
            symbolAddress,
            page,
            size
        );
    };

    getAccountTokens = (
        address: string
    ): Promise<{ [symbol: string]: Token }> => {
        return this.api.getAccountTokens(address);
    };

    getAccountTokenBalance = (
        contractAddress: string,
        address: string
    ): Promise<BigNumber> => {
        return this.api.getAccountTokenBalance(contractAddress, address);
    };

    getTopTokens = (topN?: number): Promise<Array<Token>> => {
        return this.api.getTopTokens(topN);
    };

    searchTokens = (keyword: string): Promise<Array<Token>> => {
        return this.api.searchTokens(keyword);
    };

    /**
     * TODO: not general enough.
     * Build transaction
     *
     * options parameters contains: gasLimit, gasPrice, isTransfer, data(optional), contractAddr(optional), tokenDecimal(optional).
     * if isTransfer is true, transaction value is zero and transaction to is token contract creation address,
     * to parameter is encoded in data.
     *
     * @param from transaction sender
     * @param to amount receiver
     * @param value amount value
     * @param options extra parameters
     */
    buildTransaction = (
        from: string,
        to: string,
        value: BigNumber,
        options: {
            gasLimit: number;
            gasPrice: number;
            isTransfer: boolean; // is token transfer
            data?: any;
            contractAddr?: string;
            tokenDecimal?: number;
        }
    ): Promise<AionUnsignedTx> => {
        return this.api.buildTransaction(from, to, value, options);
    };
}
