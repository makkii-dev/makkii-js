import BigNumber from "bignumber.js";

/**
 * Aion unsigned transaction interface
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
    /**
     * token transfer to
     */
    tknTo?: string;
    /**
     * token transfer value
     */
    tknValue?: BigNumber;
}

/**
 * Aion pending transaction
 * @category Coin AION
 */
export interface AionPendingTx {
    hash: string;
    status: "PENDING";
    to: string;
    from: string;
    value: BigNumber;
    /**
     * token transfer to
     */
    tknTo?: string;
    /**
     * token transfer value
     */
    tknValue?: BigNumber;
    timestamp: number;
    gasPrice: number;
    gasLimit: number;
}
