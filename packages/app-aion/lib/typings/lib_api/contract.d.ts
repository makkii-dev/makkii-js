import { AbiCoderAION as AbiCoder } from "@makkii/makkii-utils";
declare class AionFvmContract {
    method_name: string;
    method_decimals: string;
    method_symbol: string;
    method_send: string;
    method_balanceOf: string;
    constructor();
    static generateMethodSig: (name: string, inputs?: string[]) => string;
    send: (to: string, value: string, bytes?: string) => string;
    balanceOf: (address: string) => string;
    name: () => string;
    symbol: () => string;
    decimals: () => string;
}
declare const aionfvmContract: AionFvmContract;
export { aionfvmContract, AbiCoder };
