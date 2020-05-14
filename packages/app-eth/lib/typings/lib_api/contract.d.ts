import { AbiCoderETH as AbiCoder } from "@makkii/makkii-utils";
declare class EthContract {
    method_name: string;
    method_decimals: string;
    method_symbol: string;
    method_send: string;
    method_balanceOf: string;
    constructor();
    static generateMethodSig: (name: string, inputs?: string[]) => string;
    send: (to: string, value: string) => string;
    balanceOf: (address: string) => string;
    name: () => string;
    symbol: () => string;
    decimals: () => string;
}
declare const ethContract: EthContract;
export { ethContract, AbiCoder };
