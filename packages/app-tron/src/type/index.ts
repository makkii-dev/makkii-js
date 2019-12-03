import BigNumber from "bignumber.js";

/**
 * @category Coin TRON
 */
export interface TronUnsignedTx {
    to: string;
    owner: string;
    amount: BigNumber;
    timestamp: number;
    expiration: number;
    latest_block: {
        hash: string;
        number: string;
    };
}

/**
 * @category Coin TRON
 */
export interface TronPendingTx {
    to: string;
    from: string;
    value: BigNumber;
    timestamp: number;
    hash: string;
    status: "PENDING";
}

/**
 * @category Coin TRON
 */
export interface TronTxStatus {
    blockNumber: number;
    status: boolean;
}

/**
 * @category Coin TRON
 */
export interface TronTransaction {
    hash: string;
    timestamp: number;
    from: string;
    to: string;
    value: BigNumber;
    blockNumber: number;
    status: "CONFIRMED" | "FAILED";
}

/**
 * @category Coin TRON
 */
export interface TronKeypair {
    private_key: string;
    public_key: string;
    address: string;
    index?: number;
    sign?: (hash: any) => Buffer;
}
