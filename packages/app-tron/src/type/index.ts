import BigNumber from "bignumber.js";

/**
 * Tron unsigned transaction
 *
 * - to: string;
 * - owner: string;
 * - amount: number;
 * - timestamp: number;
 * - expiration: number;
 * - latest_block: { hash: string; number: string; };
 *
 * @category Coin TRON
 */
export interface TronUnsignedTx {
    to: string;
    owner: string;
    amount: number;
    timestamp: number;
    expiration: number;
    latest_block: {
        hash: string;
        number: string;
    };
}

/**
 * Tron pending transaction
 *
 * - to: string;
 * - from: string;
 * - value: BigNumber;
 * - timestamp: number;
 * - hash: string;
 * - status: "PENDING";
 *
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
 * Tron transaction status
 *
 * - blockNumber: number;
 * - status: boolean;
 *
 * @category Coin TRON
 */
export interface TronTxStatus {
    blockNumber: number;
    status: boolean;
}

/**
 * Tron transaction
 *
 * - hash: string;
 * - timestamp: number;
 * - from: string;
 * - to: string;
 * - value: BigNumber;
 * - blockNumber: number;
 * - status: "CONFIRMED" | "FAILED";
 *
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
 * Tron key pair
 *
 * - private_key: string;
 * - public_key: string;
 * - address: string;
 * - index?: number;
 * - sign?: (hash: any) => Buffer;
 * @category Coin TRON
 */
export interface TronKeypair {
    private_key: string;
    public_key: string;
    address: string;
    index?: number;
    sign?: (hash: any) => Buffer;
}
