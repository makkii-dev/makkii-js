import BigNumber from "bignumber.js";

export interface TronUnsignedTx {
    to: string
    owner: string
    amount:BigNumber
    timestamp: number
    expiration: number
    latest_block: {
        hash: string,
        number: string,
    }
}


export interface TronPendingTx {
    to: string
    from: string
    value:BigNumber
    timestamp: number
    hash: string
    status: 'PENDING'
}