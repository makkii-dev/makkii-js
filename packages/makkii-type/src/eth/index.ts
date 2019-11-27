import BigNumber from "bignumber.js";
import { Token } from "..";

export interface EthTxStatus {
    status: boolean // true: comfirmed or false: failed
    blockNumber: number // tx be sealed block
    gasUsed: number
}

export interface EthObj {
    hash: string
    timestamp: number
    from: string
    to: string
    value: BigNumber
    fee?: number // tx gas price * gas used
}

export interface EthTx extends EthObj {
    status: 'PENDING' | 'CONFIRMED' | 'FALIED'
    blockNumber: number
    fee: number
}


export interface EthAccount {
    address: string,
    symbol: 'ETH',
    balance: BigNumber,
    tokens: {[symbol: string]: Token & { balance: BigNumber}},
    type: '[ledger]' | '[local]',
    private_key?: string // type is [local] sign by privateKey
    derivationIndex?: number // type is [ledger] sign by ledger (account index in ledger)
}
