export type SignedTx = any;

export type Transaction = any;
/**
 * @example {"crypto":"AION","fiat":"USD","price":0.06133475939999999}
 * @category Api
 */
export interface CoinPrice {
    crypto: string;
    fiat: string;
    price: number;
}
/**
 * token
 * @category Api
 */
export interface Token {
    symbol: string;
    contractAddr: string;
    name: string;
    tokenDecimal: number;
}

/**
 * Key pair
 * @category Keystore
 */
export interface Keypair {
    private_key: string;
    public_key: string;
    address: string;
}

/**
 * Ledger key pair
 * @category Hardware
 */
export interface LedgerKeypair {
    address: string;
    index: number;
}
