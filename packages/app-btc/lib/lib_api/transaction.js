"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const jsonrpc_1 = require("./jsonrpc");
const transaction_1 = require("../lib_keystore/transaction");
exports.default = config => {
    const { broadcastTransaction, getUnspentTx } = jsonrpc_1.default(config);
    const sendTransaction = (unsignedTx, signer, signerParams) => __awaiter(void 0, void 0, void 0, function* () {
        const singedTx = yield signer.signTransaction(unsignedTx, signerParams);
        const txId = yield broadcastTransaction(singedTx);
        const { to, from, value, fee } = unsignedTx;
        return {
            from,
            to,
            value,
            fee,
            hash: txId,
            status: "PENDING"
        };
    });
    const getTransactionUrlInExplorer = txHash => `${config.explorer}/${txHash}`;
    const buildTransaction = (from, to, value, options) => __awaiter(void 0, void 0, void 0, function* () {
        const { byte_fee = 10 } = options;
        value = bignumber_js_1.default.isBigNumber(value) ? value : new bignumber_js_1.default(value);
        const utxos = yield getUnspentTx(from);
        const valueIn = utxos.reduce((valueIn_, el) => valueIn_.plus(new bignumber_js_1.default(el.amount)), new bignumber_js_1.default(0));
        const fee = config.network.match("LTC")
            ? transaction_1.estimateFeeLTC
            : transaction_1.estimateFeeBTC(utxos.length, 2, byte_fee || 10);
        const vout = [{ addr: to, value: value.toNumber() }];
        if (valueIn.toNumber() >
            value.shiftedBy(8).toNumber() + fee.toNumber()) {
            vout.push({
                addr: from,
                value: valueIn
                    .minus(value.shiftedBy(8))
                    .minus(fee)
                    .shiftedBy(-8)
                    .toNumber()
            });
        }
        return {
            from: [{ addr: from, value: valueIn.shiftedBy(-8).toNumber() }],
            to: vout,
            fee: fee.shiftedBy(-8).toNumber(),
            to_address: to,
            change_address: from,
            value,
            utxos,
            byte_fee
        };
    });
    return {
        sendTransaction,
        buildTransaction,
        getTransactionUrlInExplorer
    };
};
//# sourceMappingURL=transaction.js.map