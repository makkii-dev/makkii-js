"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const jsonrpc_1 = require("./jsonrpc");
const lib_keystore_1 = require("../lib_keystore");
const transaction_1 = require("../lib_keystore/transaction");
exports.default = config => {
    const { broadcastTransaction, getUnspentTx } = jsonrpc_1.default(config);
    const sendTransaction = (account, to, value, _extraParams, shouldBroadCast = true) => new Promise((resolve, reject) => {
        value = bignumber_js_1.default.isBigNumber(value) ? value : new bignumber_js_1.default(value);
        getUnspentTx(account.address)
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
            const valueIn = utxos.reduce((valueIn_, el) => valueIn_.plus(new bignumber_js_1.default(el.amount)), new bignumber_js_1.default(0));
            const fee = config.network.match(/LTC/) ? transaction_1.estimateFeeLTC : transaction_1.estimateFeeBTC(utxos.length, 2, tx.byte_fee || 10);
            lib_keystore_1.default.signTransaction(tx, config.network)
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
                    broadcastTransaction(res.encoded)
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
    const getTransactionUrlInExplorer = (txHash, network = 'BTC') => `${config.explorer}/${txHash}`;
    return {
        sendTransaction,
        getTransactionUrlInExplorer,
    };
};
//# sourceMappingURL=transaction.js.map