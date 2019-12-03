export type SignedTx = any;

export type Transaction = any;

/**
 * token
 */
export interface Token {
    symbol: string;
    contractAddr: string;
    name: string;
    tokenDecimal: number;
}

/**
 * Key pair
 */
export interface Keypair {
    private_key: string;
    public_key: string;
    address: string;
}

/**
 * Ledger key pair
 */
export interface LedgerKeypair {
    address: string;
    index: number;
}
