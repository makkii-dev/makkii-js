import BigNumber from "bignumber.js";
export interface BtcUnsignedTx {
    to: string;
    from: string;
    value: BigNumber;
    utxos: Array<{
        hash: string;
        index: number;
        script: string;
        raw: string;
        amount: number;
    }>;
    byte_fee: number;
}
