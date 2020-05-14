"use strict";
exports.__esModule = true;
var JsSha3 = require("js-sha3");
var makkii_utils_1 = require("@makkii/makkii-utils");
exports.AbiCoder = makkii_utils_1.AbiCoderETH;
var EthContract = (function () {
    function EthContract() {
        var _this = this;
        this.send = function (to, value) {
            var paramsABI = makkii_utils_1.AbiCoderETH.encode(["address", "uint256"], [to, value]);
            return _this.method_send + paramsABI.toString("hex");
        };
        this.balanceOf = function (address) {
            var paramsABI = makkii_utils_1.AbiCoderETH.encode(["address"], [address]);
            return _this.method_balanceOf + paramsABI.toString("hex");
        };
        this.name = function () {
            return _this.method_name;
        };
        this.symbol = function () {
            return _this.method_symbol;
        };
        this.decimals = function () {
            return _this.method_decimals;
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
    EthContract.generateMethodSig = function (name, inputs) {
        var value = inputs && inputs.length > 0
            ? name + "(" + inputs.join(",") + ")"
            : name + "()";
        return "0x" + JsSha3.keccak256(value).slice(0, 8);
    };
    return EthContract;
}());
var ethContract = new EthContract();
exports.ethContract = ethContract;
