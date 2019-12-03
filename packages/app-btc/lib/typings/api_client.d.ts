import BigNumber from "bignumber.js";
import { IsingleApiClient } from "@makkii/makkii-core/src/interfaces/api_client";
import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { BtcUnsignedTx, BtcTxStatus, BtcTransaction, BtcPendingTransaction } from "./type";
export interface IBtcConfig {
    network: "BTC" | "BTCTEST" | "LTC" | "LTCTEST";
    insight_api: string;
    broadcast?: string;
    explorer?: string;
}
export default class BtcApiClient implements IsingleApiClient {
    private api;
    config: IBtcConfig;
    constructor(config: IBtcConfig);
    getNetwork: () => string;
    updateConfiguration: (config: IBtcConfig) => void;
    getBlockByNumber: (blockNumber: string) => never;
    getBlockNumber: () => never;
    getTransactionStatus: (hash: string) => Promise<BtcTxStatus>;
    getTransactionExplorerUrl: (hash: any) => string;
    getBalance: (address: string) => Promise<BigNumber>;
    getTransactionsByAddress: (address: string, page: number, size: number) => Promise<Map<string, BtcTransaction>>;
    sendTransaction: (unsignedTx: BtcUnsignedTx, signer: IkeystoreSigner, signerParams: any) => Promise<BtcPendingTransaction>;
    sameAddress: (address1: string, address2: string) => boolean;
    sendAll: (address: string, byte_fee: number) => Promise<number>;
    buildTransaction: (from: string, to: string, value: BigNumber, options: {
        byte_fee: number;
    }) => Promise<BtcUnsignedTx>;
}
