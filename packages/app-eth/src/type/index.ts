import BigNumber from "bignumber.js";

/**
 * Ethereum unsigned transaction
 * - to: string;
 * - from: string;
 * - nonce: string;
 * - value: BigNumber;
 * - gasPrice: number;
 * - gasLimit: number;
 * - data?: any;
 * - network: string;
 *
 * @category Coin ETH
 */
export interface EthUnsignedTx {
    to: string;
    from: string;
    nonce: string;
    value: BigNumber;
    gasPrice: number;
    gasLimit: number;
    data?: any;
    network: string;
}

/**
 * Ethereum pending transaction
 * - hash: string;
 * - status: "PENDING";
 * - to: string;
 * - from: string;
 * - value: BigNumber;
 * - tknTo?: string;
 * - tknValue: BigNumber;
 * - gasPrice: number;
 * - gasLimit: number;
 *
 * @category Coin ETH
 */
export interface EthPendingTx {
    hash: string;
    status: "PENDING";
    to: string;
    from: string;
    value: BigNumber;
    tknTo?: string;
    tknValue: BigNumber;
    gasPrice: number;
    gasLimit: number;
}
