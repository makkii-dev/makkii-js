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
