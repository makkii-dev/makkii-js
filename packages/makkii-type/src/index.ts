export interface Token {
    symbol: string
    contractAddr: string
    name: string
    tokenDecimal: number
}

export interface Keypair {
    private_key: string
    public_key: string
    address: string
}

export interface LedgerKeypair {
    address: string,
    index: number
}


export interface validateBalanceRet {
    result: boolean
    err?: string // error mesage
}