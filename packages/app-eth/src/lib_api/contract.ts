import * as JsSha3 from "js-sha3";
import { AbiCoderETH as AbiCoder } from "@makkii/makkii-utils";

class EthContract {
    method_name: string;

    method_decimals: string;

    method_symbol: string;

    method_send: string;

    method_balanceOf: string;

    constructor() {
        this.method_name = EthContract.generateMethodSig("name", []);
        this.method_symbol = EthContract.generateMethodSig("symbol", []);
        this.method_decimals = EthContract.generateMethodSig("decimals");
        this.method_send = EthContract.generateMethodSig("transfer", [
            "address",
            "uint256"
        ]);
        this.method_balanceOf = EthContract.generateMethodSig("balanceOf", [
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

    send = (to: string, value: string) => {
        const paramsABI = AbiCoder.encode(["address", "uint256"], [to, value]);
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

const ethContract = new EthContract();

export { ethContract, AbiCoder };
