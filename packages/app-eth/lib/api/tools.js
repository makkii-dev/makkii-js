"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var lib_common_util_js_1 = require("lib-common-util-js");
function formatAddress1Line(address) {
    var pre = address.startsWith('0x') ? 2 : 0;
    return address.substring(0, 10 + pre) + "..." + address.substring(address.length - 10);
}
exports.formatAddress1Line = formatAddress1Line;
function validateBalanceSufficiency(account, symbol, amount, extraParams) {
    return new Promise(function (resolve) {
        if (!lib_common_util_js_1.validator.validateAmount(amount))
            resolve({ result: false, err: 'error_format_amount' });
        if (!lib_common_util_js_1.validator.validateAmount(extraParams.gasPrice))
            resolve({ result: false, err: 'error_invalid_gas_price' });
        if (!lib_common_util_js_1.validator.validatePositiveInteger(extraParams.gasLimit))
            resolve({ result: false, err: 'error_invalid_gas_limit' });
        var gasLimit = bignumber_js_1.default(extraParams.gasLimit);
        var gasPrice = bignumber_js_1.default(extraParams.gasPrice);
        var balance = bignumber_js_1.default(account.balance);
        var transferAmount = bignumber_js_1.default(amount);
        if (account.symbol === symbol) {
            if (transferAmount
                .plus(gasPrice.multipliedBy(gasLimit).dividedBy(bignumber_js_1.default(10).pow(9)))
                .isGreaterThan(balance)) {
                resolve({ result: false, err: 'error_insufficient_amount' });
            }
        }
        else {
            if (gasPrice
                .multipliedBy(gasLimit)
                .dividedBy(bignumber_js_1.default(10).pow(9))
                .isGreaterThan(balance)) {
                resolve({ result: false, err: 'error_insufficient_amount' });
            }
            var totalCoins = account.tokens[symbol].balance;
            if (transferAmount.isGreaterThan(totalCoins)) {
                resolve({ result: false, err: 'error_insufficient_amount' });
            }
        }
        resolve({ result: true });
    });
}
exports.validateBalanceSufficiency = validateBalanceSufficiency;
function addressFormat(address) {
    address = address.toLowerCase();
    address = address.startsWith('0x') ? address : "0x" + address;
    return address;
}
function sameAddress(address1, address2) {
    return addressFormat(address1) === addressFormat(address2);
}
exports.sameAddress = sameAddress;
//# sourceMappingURL=tools.js.map