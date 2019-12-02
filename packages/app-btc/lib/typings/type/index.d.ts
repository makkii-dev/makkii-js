/// <reference types="node" />
import BigNumber from "bignumber.js";
export interface BtcUnsignedTx {
    to: Array<{
        addr: string;
        value: number;
    }>;
    from: Array<{
        addr: string;
        value: number;
    }>;
    value: BigNumber;
    utxos: Array<{
        hash: string;
        index: number;
        script: string;
        raw: string;
        amount: number;
    }>;
    change_address: string;
    to_address: string;
    byte_fee: number;
    network: string;
}
export interface BtcTxStatus {
    status: boolean;
    blockNumber?: number;
    timestamp?: number;
}
export interface BtcTransaction {
    hash: string;
    timestamp: number;
    blockNUmber: number;
    status: 'CONFIRMED';
    from: Array<{
        addr: string;
        value: number;
    }>;
    to: Array<{
        addr: string;
        value: number;
    }>;
    fee: number;
}
export interface BtcPendingTransaction {
    hash: string;
    status: 'PENDING';
    from: Array<{
        addr: string;
        value: number;
    }>;
    to: Array<{
        addr: string;
        value: number;
    }>;
    fee: number;
}
export interface BtcrecoverOptions {
    network?: string;
    compressed?: boolean;
}
export interface BtcKeypair {
    private_key: string;
    public_key: string;
    address: string;
    index?: number;
    compressed?: boolean;
    sign?: (hash: any) => Buffer;
    toWIF?: () => string;
}
