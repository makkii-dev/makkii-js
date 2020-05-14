import * as JsSha3 from "js-sha3";
import { AbiCoderAION as AbiCoder } from "@makkii/makkii-utils";

class AionFvmContract {
    method_name: string;

    method_decimals: string;

    method_symbol: string;

    method_send: string;

    method_balanceOf: string;

    constructor() {
        this.method_name = AionFvmContract.generateMethodSig("name", []);
        this.method_symbol = AionFvmContract.generateMethodSig("symbol", []);
        this.method_decimals = AionFvmContract.generateMethodSig("decimals");
        this.method_send = AionFvmContract.generateMethodSig("send", [
            "address",
            "uint128",
            "bytes"
        ]);
        this.method_balanceOf = AionFvmContract.generateMethodSig("balanceOf", [
            "address"
        ]);
    }

    static generateMethodSig = (name: string, inputs?: string[]) => {
        const value =
            inputs && inputs.length > 0
                ? `${name}(${inputs.join(",")})`
                : `${name}()`;
        return `0x${JsSha3.keccak256(value).slice(0, 8)}`;
    };

    send = (to: string, value: string, bytes = "") => {
        const paramsABI = AbiCoder.encode(
            ["address", "uint128", "bytes"],
            [to, value, bytes]
        );
        return this.method_send + paramsABI.toString("hex");
    };

    balanceOf = (address: string) => {
        const paramsABI = AbiCoder.encode(["address"], [address]);
        return this.method_balanceOf + paramsABI.toString("hex");
    };

    name = () => {
        return this.method_name;
    };

    symbol = () => {
        return this.method_symbol;
    };

    decimals = () => {
        return this.method_decimals;
    };
}

const aionfvmContract = new AionFvmContract();

export { aionfvmContract, AbiCoder };
