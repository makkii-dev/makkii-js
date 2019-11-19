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
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var jsonrpc_1 = require("./jsonrpc");
var keystore_1 = require("../keystore");
var transaction_1 = require("../keystore/transaction");
var network_1 = require("../network");
var sendTransaction = function (account, symbol, to, value, _extraParams, network, shouldBroadCast) {
    if (network === void 0) { network = 'BTC'; }
    if (shouldBroadCast === void 0) { shouldBroadCast = true; }
    return new Promise(function (resolve, reject) {
        value = bignumber_js_1.default.isBigNumber(value) ? value : bignumber_js_1.default(value);
        jsonrpc_1.getUnspentTx(account.address, network)
            .then(function (utxos) {
            var type = account.type, derivationIndex = account.derivationIndex;
            var extra_param = { type: type };
            if (type === '[ledger]') {
                extra_param = __assign(__assign({}, extra_param), { derivationIndex: derivationIndex, sender: account.address });
            }
            var tx = {
                amount: value.shiftedBy(8).toNumber(),
                change_address: account.address,
                to_address: to,
                byte_fee: 10,
                private_key: account.private_key,
                compressed: account.compressed,
                extra_param: extra_param,
                utxos: utxos,
            };
            var valueIn = utxos.reduce(function (valueIn_, el) { return valueIn_.plus(bignumber_js_1.default(el.amount)); }, bignumber_js_1.default(0));
            var fee = network.match(/LTC/) ? transaction_1.estimateFeeLTC : transaction_1.estimateFeeBTC(utxos.length, 2, tx.byte_fee || 10);
            keystore_1.default.signTransaction(tx, network)
                .then(function (res) {
                console.log('[keystore sign resp]=>', res);
                var vout = [
                    { addr: to, value: value.toNumber() },
                ];
                if (valueIn.toNumber() > value.shiftedBy(8).toNumber() + fee.toNumber()) {
                    vout.push({ addr: account.address, value: valueIn.minus(value.shiftedBy(8)).minus(fee).shiftedBy(-8).toNumber() });
                }
                var txObj = {
                    from: [{ addr: account.address, value: valueIn.shiftedBy(-8).toNumber() }],
                    to: vout,
                    fee: fee.shiftedBy(-8).toNumber(),
                };
                if (shouldBroadCast) {
                    jsonrpc_1.broadcastTransaction(res.encoded, network)
                        .then(function (txid) {
                        var pendingTx = __assign(__assign({}, txObj), { hash: txid, status: 'PENDING' });
                        resolve({ pendingTx: pendingTx });
                    })
                        .catch(function (e) { return reject(e); });
                }
                else {
                    resolve({ encoded: res.encoded, txObj: txObj });
                }
            })
                .catch(function (e) { return reject(e); });
        })
            .catch(function (e) { return reject(e); });
    });
};
exports.sendTransaction = sendTransaction;
var getTransactionUrlInExplorer = function (txHash, network) {
    if (network === void 0) { network = 'BTC'; }
    return network_1.config.networks[network].explorer + "/" + txHash;
};
exports.getTransactionUrlInExplorer = getTransactionUrlInExplorer;
//# sourceMappingURL=transaction.js.map