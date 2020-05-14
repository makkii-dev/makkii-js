"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsSha3 = require("js-sha3");
const makkii_utils_1 = require("@makkii/makkii-utils");
exports.AbiCoder = makkii_utils_1.AbiCoderAION;
class AionFvmContract {
    constructor() {
        this.send = (to, value, bytes = "") => {
            const paramsABI = makkii_utils_1.AbiCoderAION.encode(["address", "uint128", "bytes"], [to, value, bytes]);
            return this.method_send + paramsABI.toString("hex");
        };
        this.balanceOf = (address) => {
            const paramsABI = makkii_utils_1.AbiCoderAION.encode(["address"], [address]);
            return this.method_balanceOf + paramsABI.toString("hex");
        };
        this.name = () => {
            return this.method_name;
        };
        this.symbol = () => {
            return this.method_symbol;
        };
        this.decimals = () => {
            return this.method_decimals;
        };
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
}
AionFvmContract.generateMethodSig = (name, inputs) => {
    const value = inputs && inputs.length > 0
        ? `${name}(${inputs.join(",")})`
        : `${name}()`;
    return `0x${JsSha3.keccak256(value).slice(0, 8)}`;
};
const aionfvmContract = new AionFvmContract();
exports.aionfvmContract = aionfvmContract;
//# sourceMappingURL=contract.js.map