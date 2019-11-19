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
const transaction_1 = require("../keystore/transaction");
const validateBalanceSufficiency = (account, symbol, amount, extraParams) => new Promise((resolve, reject) => {
    if (!lib_common_util_js_1.validator.validateAmount(amount))
        resolve({ result: false, err: 'error_format_amount' });
    jsonrpc_1.getUnspentTx(account.address, extraParams.network)
        .then((utxos) => {
        let balance = bignumber_js_1.default(0);
        utxos.forEach((utxo) => {
            balance = balance.plus(bignumber_js_1.default(utxo.amount));
        });
        const fee = symbol === 'LTC' ? transaction_1.estimateFeeLTC : transaction_1.estimateFeeBTC(utxos.length, 2, extraParams.byte_fee || 10);
        const totalFee = bignumber_js_1.default(amount)
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
exports.validateBalanceSufficiency = validateBalanceSufficiency;
const sendAll = (address, symbol, network, byte_fee = 10) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const utxos = yield jsonrpc_1.getUnspentTx(address, network);
        let balance = bignumber_js_1.default(0);
        utxos.forEach((utxo) => {
            balance = balance.plus(bignumber_js_1.default(utxo.amount));
        });
        return Math.max(balance
            .minus(symbol === 'LTC' ? transaction_1.estimateFeeLTC : transaction_1.estimateFeeBTC(utxos.length, 2, byte_fee || 10))
            .shiftedBy(-8)
            .toNumber(), 0);
    }
    catch (e) {
        return 0;
    }
});
exports.sendAll = sendAll;
const formatAddress1Line = (address) => `${address.slice(0, 12)}...${address.slice(-10)}`;
exports.formatAddress1Line = formatAddress1Line;
const sameAddress = (address1, address2) => address1 === address2;
exports.sameAddress = sameAddress;
//# sourceMappingURL=tools.js.map