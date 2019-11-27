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
const lib_common_util_js_1 = require("lib-common-util-js");
const jsonrpc_1 = require("./jsonrpc");
const transaction_1 = require("../lib_keystore/transaction");
exports.default = config => {
    const { getUnspentTx } = jsonrpc_1.default(config);
    const validateBalanceSufficiency = (account, amount, extraParams) => new Promise((resolve, reject) => {
        if (!lib_common_util_js_1.validator.validateAmount(amount))
            resolve({ result: false, err: 'error_format_amount' });
        getUnspentTx(account.address)
            .then((utxos) => {
            let balance = new bignumber_js_1.default(0);
            utxos.forEach((utxo) => {
                balance = balance.plus(new bignumber_js_1.default(utxo.amount));
            });
            const fee = config.network.match('LTC') ? transaction_1.estimateFeeLTC : transaction_1.estimateFeeBTC(utxos.length, 2, extraParams.byte_fee || 10);
            const totalFee = new bignumber_js_1.default(amount)
                .shiftedBy(8)
                .plus(fee);
            if (balance.isGreaterThanOrEqualTo(totalFee)) {
                resolve({ result: true });
            }
            resolve({ result: false, err: 'error_insufficient_amount' });
        })
            .catch(() => {
            resolve({ result: false, err: 'error_insufficient_amount' });
        });
    });
    const sendAll = (address, byte_fee = 10) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const utxos = yield getUnspentTx(address);
            let balance = new bignumber_js_1.default(0);
            utxos.forEach((utxo) => {
                balance = balance.plus(new bignumber_js_1.default(utxo.amount));
            });
            return Math.max(balance
                .minus(config.network.match('LTC') ? transaction_1.estimateFeeLTC : transaction_1.estimateFeeBTC(utxos.length, 2, byte_fee || 10))
                .shiftedBy(-8)
                .toNumber(), 0);
        }
        catch (e) {
            return 0;
        }
    });
    const sameAddress = (address1, address2) => address1 === address2;
    return {
        validateBalanceSufficiency,
        sendAll,
        sameAddress,
    };
};
//# sourceMappingURL=tools.js.map