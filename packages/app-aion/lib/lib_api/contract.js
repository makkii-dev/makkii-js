"use strict";
exports.__esModule = true;
var JsSha3 = require("js-sha3");
var makkii_utils_1 = require("@makkii/makkii-utils");
exports.AbiCoder = makkii_utils_1.AbiCoderAION;
var AionFvmContract = (function () {
    function AionFvmContract() {
        var _this = this;
        this.send = function (to, value, bytes) {
            if (bytes === void 0) { bytes = ""; }
            var paramsABI = makkii_utils_1.AbiCoderAION.encode(["address", "uint128", "bytes"], [to, value, bytes]);
            return _this.method_send + paramsABI.toString("hex");
        };
        this.balanceOf = function (address) {
            var paramsABI = makkii_utils_1.AbiCoderAION.encode(["address"], [address]);
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
    AionFvmContract.generateMethodSig = function (name, inputs) {
        var value = inputs && inputs.length > 0
            ? name + "(" + inputs.join(",") + ")"
            : name + "()";
        return "0x" + JsSha3.keccak256(value).slice(0, 8);
    };
    return AionFvmContract;
}());
var aionfvmContract = new AionFvmContract();
exports.aionfvmContract = aionfvmContract;
