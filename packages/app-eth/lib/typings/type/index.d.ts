import BigNumber from "bignumber.js";
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
