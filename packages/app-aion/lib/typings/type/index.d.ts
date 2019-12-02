import BigNumber from "bignumber.js";
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
export interface AionPendingTx {
    hash: string;
    status: 'PENDING';
    to: string;
    from: string;
    value: BigNumber;
    tknTo?: string;
    tknValue?: BigNumber;
    timestamp: number;
    gasPrice: number;
    gasLimit: number;
}
