"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const bignumber_js_1 = require("bignumber.js");
const network_1 = require("./network");
exports.process_unsignedTx = (transaction, params) => {
    const { utxos, value, to, from, byte_fee, } = transaction;
    const { network } = params;
    const mainnet = network_1.networks[network];
    const amount = new bignumber_js_1.default(value);
    const fee = network === 'BTC' || network === 'BTCTEST' ? exports.estimateFeeBTC(utxos.length, 2, byte_fee || 10) : exports.estimateFeeLTC;
    let balance = new bignumber_js_1.default(0);
    for (let ip = 0; ip < utxos.length; ip += 1) {
        balance = balance.plus(new bignumber_js_1.default(utxos[ip].amount));
    }
    if (balance.isLessThan(amount.plus(fee))) {
        throw new Error('error_insufficient_amount');
    }
    const needChange = balance.isGreaterThan(amount.plus(fee));
    const txb = new bitcoinjs_lib_1.TransactionBuilder(mainnet);
    for (let ip = 0; ip < utxos.length; ip += 1) {
        txb.addInput(utxos[ip].hash, utxos[ip].index, 0xffffffff, Buffer.from(utxos[ip].script, 'hex'));
    }
    txb.addOutput(to, amount.toNumber());
    if (needChange) {
        txb.addOutput(from, balance.minus(amount).minus(fee).toNumber());
    }
    return txb;
};
exports.estimateFeeBTC = (m, n, byte_fee) => new bignumber_js_1.default(148 * m + 34 * n + 10).times(byte_fee);
exports.estimateFeeLTC = new bignumber_js_1.default(20000);
//# sourceMappingURL=transaction.js.map