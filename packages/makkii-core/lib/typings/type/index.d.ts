export declare type SignedTx = any;
export declare type Transaction = any;
export interface CoinPrice {
    crypto: string;
    fiat: string;
    price: number;
}
export interface Token {
    symbol: string;
    contractAddr: string;
    name: string;
    tokenDecimal: number;
}
export interface Keypair {
    private_key: string;
    public_key: string;
    address: string;
}
export interface LedgerKeypair {
    address: string;
    index: number;
}
