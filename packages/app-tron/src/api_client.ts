import BigNumber from "bignumber.js";
import { IsingleApiClient } from "@makkii/makkii-core/src/interfaces/api_client";
import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import API from "./lib_api";
import network from "./network";
import {
    TronUnsignedTx,
    TronPendingTx,
    TronTxStatus,
    TronTransaction
} from "./type";

type hash = string;

/**
 * @category Coin TRON
 */
export interface ITronConfig {
    /**
     * Network name.
     */
    network: "mainnet" | "shasta";
    /**
     *  trongrid api
     */
    trongrid_api: string;
    /**
     *  explorer_api use to get transactions by address
     */
    explorer_api?: string;
    /**
     *  explorer url that show transaction detail
     */
    explorer?: string;
}
/**
 * Tron api client that implement IsingleApiClient
 * @category Api Client
 */
export default class TronApiClient implements IsingleApiClient {
    symbol: string = "TRX";

    config: ITronConfig;

    private api: any;

    /**
     * Tron api client constructor
     *
     * @param config
     */
    constructor(config: ITronConfig) {
        let restSet: {
            explorer_api?: string;
            explorer?: string;
        };
        // check
        ["network", "trongrid_api"].forEach(f => {
            if (!(f in config)) {
                throw new Error(`config miss field ${f}`);
            }
        });

        if (config.network === "mainnet") {
            restSet = network.mainnet;
        } else {
            restSet = network.shasta;
        }
        this.config = {
            ...restSet,
            ...config
        };
        this.api = API(this.config);
    }

    /**
     * Get network
     * @returns nework
     * ```
     * mainnet|shasta
     * ```
     */
    getNetwork = () => this.config.network;

    /**
     * Update tron api config
     */
    updateConfiguration = (config: ITronConfig) => {
        this.config = { ...this.config, ...config };
        this.api = API(this.config);
    };

    /**
     * Get block by number
     *
     * not implemented
     */
    getBlockByNumber = (blockNumber: string) => {
        throw new Error("[tron] getBlockByNumber not implemented.");
    };

    /**
     * Get block height
     *
     * not implemented
     */
    getBlockNumber = () => {
        throw new Error("[tron] getBlockNumber not implemented.");
    };

    /**
     * Get transaction status by tx hash
     *
     * @param hash tx hash
     */
    getTransactionStatus = (hash: string): Promise<TronTxStatus> => {
        return this.api.getTransactionStatus(hash);
    };

    /**
     * Get an explorer url showing transaction details
     *
     * @return {string} url
     */
    getTransactionExplorerUrl = (hash: string) => {
        return this.api.getTransactionUrlInExplorer(hash);
    };

    /**
     * Get an account's balance
     *
     * @param address
     * @return balance
     */
    getBalance = (address: string): Promise<BigNumber> => {
        return this.api.getBalance(address);
    };

    getTransactionsByAddress = (
        address: string,
        page: number,
        size: number
    ): Promise<Map<hash, TronTransaction>> => {
        return this.api.getTransactionsByAddress(address, page, size);
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
    sendTransaction = <T extends IkeystoreSigner>(
        unsignedTx: TronUnsignedTx,
        signer: T,
        signerParams: any
    ): Promise<TronPendingTx> => {
        return this.api.sendTransaction(unsignedTx, signer, signerParams);
    };

    /**
     * check if two address is same
     *
     * @returns {boolean}
     */
    sameAddress = (address1: string, address2: string) => {
        return this.api.sameAddress(address1, address2);
    };

    /**
     * Build transaction
     *
     * @param from
     * @param to
     * @param value
     */
    buildTransaction = (
        from: string,
        to: string,
        value: BigNumber
    ): Promise<TronUnsignedTx> => {
        return this.api.buildTransaction(from, to, value);
    };
}
