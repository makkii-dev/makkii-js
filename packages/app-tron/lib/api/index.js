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
var transaction = require("./transaction");
var jsonrpc_1 = require("./jsonrpc");
var tools_1 = require("./tools");
exports.default = __assign({ getBalance: jsonrpc_1.getBalance,
    validateBalanceSufficiency: tools_1.validateBalanceSufficiency,
    formatAddress1Line: tools_1.formatAddress1Line,
    sameAddress: tools_1.sameAddress }, transaction);
//# sourceMappingURL=index.js.map