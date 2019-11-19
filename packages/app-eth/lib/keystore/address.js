"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethereumjs_util_1 = require("ethereumjs-util");
exports.validateAddress = function (address) { return new Promise(function (resolve, reject) {
    resolve(ethereumjs_util_1.isValidAddress(address));
}); };
//# sourceMappingURL=address.js.map