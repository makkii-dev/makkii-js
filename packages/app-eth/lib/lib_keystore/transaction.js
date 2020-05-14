"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var makkii_utils_1 = require("@makkii/makkii-utils");
var bignumber_js_1 = require("bignumber.js");
var EthereumTx = require("ethereumjs-tx");
var KEY_MAP = ["value", "nonce", "gasLimit", "gasPrice", "to"];
exports.process_unsignedTx = function (transaction) {
    var network = transaction.network, amount = transaction.value, nonce = transaction.nonce, gasLimit = transaction.gasLimit, gasPrice = transaction.gasPrice, to = transaction.to, data = transaction.data;
    KEY_MAP.forEach(function (k) {
        if (!transaction.hasOwnProperty(k)) {
            throw new Error(k + " not found");
        }
    });
    var txParams = {
        nonce: makkii_utils_1.hexutil.toHex(nonce),
        gasPrice: makkii_utils_1.hexutil.toHex(new bignumber_js_1["default"](gasPrice)),
        gasLimit: makkii_utils_1.hexutil.toHex(new bignumber_js_1["default"](gasLimit)),
        to: makkii_utils_1.hexutil.toHex(to),
        value: makkii_utils_1.hexutil.toHex(new bignumber_js_1["default"](amount).shiftedBy(18)),
        chainId: getChainId(network),
        v: getChainId(network),
        r: "0x00",
        s: "0x00"
    };
    if (data) {
        txParams = __assign(__assign({}, txParams), { data: data });
    }
    var tx = new EthereumTx(txParams);
    return tx;
};
var getChainId = function (network) {
    if (network.toLowerCase() === "morden") {
        return 2;
    }
    if (network.toLowerCase() === "ropsten") {
        return 3;
    }
    if (network.toLowerCase() === "rinkeby") {
        return 4;
    }
    if (network.toLowerCase() === "goerli") {
        return 5;
    }
    if (network.toLowerCase() === "kovan") {
        return 42;
    }
    return 1;
};
