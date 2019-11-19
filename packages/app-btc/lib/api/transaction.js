"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const jsonrpc_1 = require("./jsonrpc");
const keystore_1 = require("../keystore");
const transaction_1 = require("../keystore/transaction");
const network_1 = require("../network");
const sendTransaction = (account, symbol, to, value, _extraParams, network = 'BTC', shouldBroadCast = true) => new Promise((resolve, reject) => {
    value = bignumber_js_1.default.isBigNumber(value) ? value : bignumber_js_1.default(value);
    jsonrpc_1.getUnspentTx(account.address, network)
        .then((utxos) => {
        const { type, derivationIndex } = account;
        let extra_param = { type };
        if (type === '[ledger]') {
            extra_param = Object.assign(Object.assign({}, extra_param), { derivationIndex, sender: account.address });
        }
        const tx = {
            amount: value.shiftedBy(8).toNumber(),
            change_address: account.address,
            to_address: to,
            byte_fee: 10,
            private_key: account.private_key,
            compressed: account.compressed,
            extra_param,
            utxos,
        };
        const valueIn = utxos.reduce((valueIn_, el) => valueIn_.plus(bignumber_js_1.default(el.amount)), bignumber_js_1.default(0));
        const fee = network.match(/LTC/) ? transaction_1.estimateFeeLTC : transaction_1.estimateFeeBTC(utxos.length, 2, tx.byte_fee || 10);
        keystore_1.default.signTransaction(tx, network)
            .then((res) => {
            console.log('[keystore sign resp]=>', res);
            const vout = [
                { addr: to, value: value.toNumber() },
            ];
            if (valueIn.toNumber() > value.shiftedBy(8).toNumber() + fee.toNumber()) {
                vout.push({ addr: account.address, value: valueIn.minus(value.shiftedBy(8)).minus(fee).shiftedBy(-8).toNumber() });
            }
            const txObj = {
                from: [{ addr: account.address, value: valueIn.shiftedBy(-8).toNumber() }],
                to: vout,
                fee: fee.shiftedBy(-8).toNumber(),
            };
            if (shouldBroadCast) {
                jsonrpc_1.broadcastTransaction(res.encoded, network)
                    .then((txid) => {
                    const pendingTx = Object.assign(Object.assign({}, txObj), { hash: txid, status: 'PENDING' });
                    resolve({ pendingTx });
                })
                    .catch((e) => reject(e));
            }
            else {
                resolve({ encoded: res.encoded, txObj });
            }
        })
            .catch((e) => reject(e));
    })
        .catch((e) => reject(e));
});
exports.sendTransaction = sendTransaction;
const getTransactionUrlInExplorer = (txHash, network = 'BTC') => `${network_1.config.networks[network].explorer}/${txHash}`;
exports.getTransactionUrlInExplorer = getTransactionUrlInExplorer;
//# sourceMappingURL=transaction.js.map