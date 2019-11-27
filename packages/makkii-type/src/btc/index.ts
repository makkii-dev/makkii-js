export interface BtcTxStatus {
    status: boolean
    blockNumber: number // block number
    timestamp: number // block timestamp
}

export interface BtcTx {
    hash: string
    timestamp: number
    blockNumber: number
    status: 'PENDING' | 'CONFIRMED' | 'FALIED'
    from: {
        [addr: string]: {
            addr?: string,
            value: number,
            notAddr: boolean
        }
    }
    to: {
        [addr: string]: {
            addr?: string,
            value: number,
            notAddr: boolean
        }
    }
    fee: number
}

export interface BtcTxObj {
  
    from: {
        [addr: string]: {
            addr?: string,
            value: number,
            notAddr: boolean
        }
    }
    to: {
        [addr: string]: {
            addr?: string,
            value: number,
            notAddr: boolean
        }
    }
    fee: number
}


export interface BtcAccount {
    address: string
    type: '[ledger]' | '[local]'
    private_key?: string
    compressed?: boolean
    derivationIndex?: number
}