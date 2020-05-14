"use strict";
exports.__esModule = true;
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var bignumber_js_1 = require("bignumber.js");
var network_1 = require("./network");
exports.process_unsignedTx = function (transaction, network) {
    var utxos = transaction.utxos, value = transaction.value, to_address = transaction.to_address, change_address = transaction.change_address, byte_fee = transaction.byte_fee;
    var mainnet = network_1.networks[network];
    var amount = new bignumber_js_1["default"](value).shiftedBy(8);
    var fee = network === "BTC" || network === "BTCTEST"
        ? exports.estimateFeeBTC(utxos.length, 2, byte_fee || 10)
        : exports.estimateFeeLTC(byte_fee || 10);
    var balance = new bignumber_js_1["default"](0);
    for (var ip = 0; ip < utxos.length; ip += 1) {
        balance = balance.plus(new bignumber_js_1["default"](utxos[ip].amount));
    }
    if (balance.isLessThan(amount.plus(fee))) {
        throw new Error("error_insufficient_amount");
    }
    var needChange = balance.isGreaterThan(amount.plus(fee));
    var txb = new bitcoinjs_lib_1.TransactionBuilder(mainnet);
    for (var ip = 0; ip < utxos.length; ip += 1) {
        txb.addInput(utxos[ip].hash, utxos[ip].index, 0xffffffff, Buffer.from(utxos[ip].script, "hex"));
    }
    txb.addOutput(to_address, amount.toNumber());
    if (needChange) {
        txb.addOutput(change_address, balance
            .minus(amount)
            .minus(fee)
            .toNumber());
    }
    return txb;
};
exports.estimateFeeBTC = function (m, n, byte_fee) {
    return new bignumber_js_1["default"](148 * m + 34 * n + 10).times(byte_fee);
};
exports.estimateFeeLTC = function (byte_fee) { return new bignumber_js_1["default"](2000).times(byte_fee); };
