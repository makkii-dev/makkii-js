import BigNumber from "bignumber.js";

export interface TronTxObj {
    timestamp: number
    from: string
    value: BigNumber
    to: string
}

export interface TronTx extends TronTxObj{
    hash: string
    status: 'PENDING' | 'CONFIRMED' | 'FALIED'
}


export interface TronAccount {
    address: string
    balance: BigNumber
    private_key: string
}