import { TransactionBuilder } from "bitcoinjs-lib";
import BigNumber from "bignumber.js";
export declare const process_unsignedTx: (transaction: any, network: any) => TransactionBuilder;
export declare const estimateFeeBTC: (m: any, n: any, byte_fee: any) => BigNumber;
export declare const estimateFeeLTC: (byte_fee: any) => BigNumber;
