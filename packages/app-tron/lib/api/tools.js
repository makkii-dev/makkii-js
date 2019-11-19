"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var lib_common_util_js_1 = require("lib-common-util-js");
var formatAddress1Line = function (address) { return address.slice(0, 12) + "..." + address.slice(-10); };
exports.formatAddress1Line = formatAddress1Line;
function validateBalanceSufficiency(account, symbol, amount) {
    return new Promise(function (resolve) {
        if (!lib_common_util_js_1.validator.validateAmount(amount))
            resolve({ result: false, err: 'error_format_amount' });
        var balance = bignumber_js_1.default(account.balance);
        var transferAmount = bignumber_js_1.default(amount);
        if (transferAmount.isGreaterThan(balance)) {
            resolve({ result: false, err: 'error_insufficient_amount' });
        }
        resolve({ result: true });
    });
}
exports.validateBalanceSufficiency = validateBalanceSufficiency;
function sameAddress(address1, address2) {
    return address1 === address2;
}
exports.sameAddress = sameAddress;
//# sourceMappingURL=tools.js.map