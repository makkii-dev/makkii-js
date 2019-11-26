import BigNumber from "bignumber.js";
import { Token } from "..";

export interface AionPendingTx extends AionTxObj{
    hash: string,
    status: 'PENDING',
}

export interface AionTxObj {
    timestamp: number,
    from: string,
    to: string, // tx send to
    value: BigNumber// tx amount
    tknTo?: string,//  ats token transfer to
    tknValue?: BigNumber// ats transfer amount
    gasPrice: number,
}

export interface AionTx {
    hash: string
    timestamp: number
    from: string
    to: string
    value: BigNumber
    status: 'CONFIRMED'| 'FAILED'
    blockNumber: number
    fee?: number // tx gas price * gas used
}


export interface validateBalanceRet {
    result: boolean
    err?: string // error mesage
}

export interface AionTxStatus {
    status: boolean // true: comfirmed or false: failed
    blockNumber: number // tx be sealed block
    gasUsed: number
}


export interface AionAccount {
    address: string,
    symbol: 'AION',
    balance: BigNumber,
    tokens: {[symbol: string]: Token & { balance: BigNumber}},
    type: '[ledger]' | '[local]',
    private_key?: string // type is [local] sign by privateKey
    derivationIndex?: number // type is [ledger] sign by ledger (account index in ledger)
}

