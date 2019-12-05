import BigNumber from "bignumber.js";

/**
 * Aion unsigned transaction interface
 *
 * - to: string;
 * - from: string;
 * - nonce: string;
 * - value: BigNumber;
 * - gasPrice: number;
 * - gasLimit: number;
 * - timestamp: number;
 * - data?: any;
 * - type?: number;
 * - tknTo?: string;
 * - tknValue?: BigNumber;
 *
 * @category Coin AION
 */
export interface AionUnsignedTx {
    to: string;
    from: string;
    nonce: string;
    value: BigNumber;
    gasPrice: number;
    gasLimit: number;
    timestamp: number;
    data?: any;
    type?: number;
    tknTo?: string;
    tknValue?: BigNumber;
}

/**
 * Aion pending transaction
 *
 * - hash: string;
 * - status: "PENDING";
 * - to: string;
 * - from: string;
 * - value: BigNumber;
 * - tknTo?: string;
 * - tknValue?: BigNumber;
 * - timestamp: number;
 * - gasPrice: number;
 * - gasLimit: number;
 *
 * @category Coin AION
 */
export interface AionPendingTx {
    hash: string;
    status: "PENDING";
    to: string;
    from: string;
    value: BigNumber;
    tknTo?: string;
    tknValue?: BigNumber;
    timestamp: number;
    gasPrice: number;
    gasLimit: number;
}
