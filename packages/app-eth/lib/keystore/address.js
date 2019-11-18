"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
exports.validateAddress = (address) => new Promise((resolve, reject) => {
    resolve(ethereumjs_util_1.isValidAddress(address));
});
//# sourceMappingURL=address.js.map