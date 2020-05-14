"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsSha3 = require("js-sha3");
const makkii_utils_1 = require("@makkii/makkii-utils");
exports.AbiCoder = makkii_utils_1.AbiCoderETH;
class EthContract {
    constructor() {
        this.send = (to, value) => {
            const paramsABI = makkii_utils_1.AbiCoderETH.encode(["address", "uint256"], [to, value]);
            return this.method_send + paramsABI.toString("hex");
        };
        this.balanceOf = (address) => {
            const paramsABI = makkii_utils_1.AbiCoderETH.encode(["address"], [address]);
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
}
EthContract.generateMethodSig = (name, inputs) => {
    const value = inputs && inputs.length > 0
        ? `${name}(${inputs.join(",")})`
        : `${name}()`;
    return `0x${JsSha3.keccak256(value).slice(0, 8)}`;
};
const ethContract = new EthContract();
exports.ethContract = ethContract;
//# sourceMappingURL=contract.js.map