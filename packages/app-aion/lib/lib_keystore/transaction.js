"use strict";
exports.__esModule = true;
var bignumber_js_1 = require("bignumber.js");
var makkii_utils_1 = require("@makkii/makkii-utils");
var address_1 = require("./address");
var rlp = require("aion-rlp");
var BN = require("bn.js");
exports.process_unsignedTx = function (transaction) {
    var tx = txInputFormatter(transaction);
    var unsignedTransaction = {
        nonce: tx.nonce,
        to: tx.to || "0x",
        data: tx.data,
        amount: numberToHex(new bignumber_js_1["default"](tx.value).shiftedBy(18)) || "0x",
        timestamp: (tx.timestamp || Date.now()) * 1000,
        type: tx.type || 1,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice
    };
    var rlpEncoded = rlp.encode([
        unsignedTransaction.nonce,
        unsignedTransaction.to.toLowerCase(),
        unsignedTransaction.amount,
        unsignedTransaction.data,
        unsignedTransaction.timestamp,
        toAionLong(unsignedTransaction.gasLimit),
        toAionLong(unsignedTransaction.gasPrice),
        toAionLong(unsignedTransaction.type)
    ]);
    return rlpEncoded;
};
var txInputFormatter = function (options) {
    if (options.to) {
        options.to = address_1.inputAddressFormatter(options.to);
    }
    if (options.data && options.input) {
        throw new Error('You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.');
    }
    if (!options.data && options.input) {
        options.data = options.input;
        delete options.input;
    }
    if (options.data && !makkii_utils_1.hexutil.isHex(options.data)) {
        throw new Error("The data field must be HEX encoded data.");
    }
    if (options.gas || options.gasLimit) {
        options.gasLimit = options.gas || options.gasLimit;
    }
    ["gasPrice", "gasLimit", "nonce"]
        .filter(function (key) { return options[key] !== undefined; })
        .forEach(function (key) {
        options[key] = numberToHex(options[key]);
    });
    return options;
};
var toAionLong = function (val) {
    var num;
    if (val === undefined || val === null || val === "" || val === "0x") {
        return null;
    }
    if (typeof val === "string") {
        if (makkii_utils_1.hexutil.isHex(val.toLowerCase())) {
            num = new BN(makkii_utils_1.hexutil.removeLeadingZeroX(val.toLowerCase()), 16);
        }
        else {
            num = new BN(val, 10);
        }
    }
    if (typeof val === "number") {
        num = new BN(val);
    }
    return new rlp.AionLong(num);
};
var numberToHex = function (value) {
    value = bignumber_js_1["default"].isBigNumber(value) ? value : new bignumber_js_1["default"](value);
    return "0x" + value.toString(16);
};
