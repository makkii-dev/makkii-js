import BigNumber from "bignumber.js";
import { IsingleApiClient } from "@makkii/makkii-core/src/interfaces/api_client";
import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import API from "./lib_api";
import network from "./network";
import {
    BtcUnsignedTx,
    BtcTxStatus,
    BtcTransaction,
    BtcPendingTransaction
} from "./type";

export interface IBtcConfig {
    network: "BTC" | "BTCTEST" | "LTC" | "LTCTEST";
    /**
     * bitcoin reset api: https://github.com/bitpay/insight-api/tree/v0.4.3
     */
    insight_api: string;
    /**
     * bitcoin broadcasst tx api
     */
    broadcast?: string;
    /**
     * bitcoin explorer url to show tx detail
     */
    explorer?: string;
}
export default class BtcApiClient implements IsingleApiClient {
    private api: any;

    /**
     * Config  of btc api client
     *
     */
    config: IBtcConfig;

    constructor(config: IBtcConfig) {
        let restSet: {
            broadcast?: string;
            explorer?: string;
        };
        // check
        ["network", "insight_api"].forEach(f => {
            if (!(f in config)) {
                throw new Error(`config miss field ${f}`);
            }
        });

        if (config.network === "BTC") {
            restSet = network.BTC;
        } else if (config.network === "BTCTEST") {
            restSet = network.BTCTEST;
        } else if (config.network === "LTC") {
            restSet = network.LTC;
        } else if (config.network === "LTCTEST") {
            restSet = network.LTCTEST;
        } else {
            throw new Error(`BtcApiClient Unsupport nework: ${config.network}`);
        }

        this.config = {
            ...restSet,
            ...config
        };
        this.api = API(this.config);
    }

    /**
     * Get network of btc api client
     *
     * @return {string} network
     */
    getNetwork = (): string => this.config.network;

    /**
     * Update configuration of btc api client
     *
     * @param {IBtcConfig} config
     */
    updateConfiguration = (config: IBtcConfig) => {
        this.config = { ...this.config, ...config };
        this.api = API(this.config);
    };

    /**
     * Get block by number
     *
     * not implemented
     */
    getBlockByNumber = (blockNumber: string) => {
        throw new Error(
            `[${this.config.network}] getBlockByNumber not implemented.`
        );
    };

    /**
     * Get current Block height
     *
     * not implemented
     */
    getBlockNumber = () => {
        throw new Error(
            `[${this.config.network}] getBlockNumber not implemented.`
        );
    };

    /**
     * Get transaction status by tx id
     *
     * @param {string} hash transaction id
     *
     * @returns {Promise<BtcTxStatus>} transaction status
     */
    getTransactionStatus = (hash: string): Promise<BtcTxStatus> => {
        return this.api.getTransactionStatus(hash);
    };

    /**
     * Get an explorer url showing transaction details
     *
     * @return {string} url
     */
    getTransactionExplorerUrl = (hash: any): string => {
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

    /**
     * Get transactions by address
     *
     * @return {Promise<Map<string, BtcTransaction>>}
     */
    getTransactionsByAddress = (
        address: string,
        page: number,
        size: number
    ): Promise<Map<string, BtcTransaction>> => {
        return this.api.getTransactionsByAddress(address, page, size);
    };

    /**
     * Send transaction
     * @param unsignedTx unsigned transaction build by buildTransaction
     * @param signer localSigner or hardware
     * @param signerParams localSigner: {private_key, compressed} hardware:{derivationIndex}
     */
    sendTransaction = (
        unsignedTx: BtcUnsignedTx,
        signer: IkeystoreSigner,
        signerParams: any
    ): Promise<BtcPendingTransaction> => {
        return this.api.sendTransaction(unsignedTx, signer, signerParams);
    };

    /**
     * check if two address is same
     *
     * @returns {boolean}
     */
    sameAddress = (address1: string, address2: string): boolean => {
        return this.api.sameAddress(address1, address2);
    };

    /**
     * try to estimate send one address all balance
     *
     * @returns one address all balance after minus fee
     */
    sendAll = (address: string, byte_fee: number): Promise<number> => {
        return this.api.sendAll(address, byte_fee);
    };

    /**
     * Build transaction
     *
     * @param from
     * @param to
     * @param value
     * @param {{byte_fee: number}}
     */
    buildTransaction = (
        from: string,
        to: string,
        value: BigNumber,
        options: {
            byte_fee: number;
        }
    ): Promise<BtcUnsignedTx> => {
        return this.api.buildTransaction(from, to, value, options);
    };
}
