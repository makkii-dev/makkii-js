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
var tools_1 = require("./tools");
var jsonrpc_1 = require("./jsonrpc");
var transaction = require("./transaction");
var token = require("./token");
exports.default = __assign(__assign({ formatAddress1Line: tools_1.formatAddress1Line,
    validateBalanceSufficiency: tools_1.validateBalanceSufficiency,
    getBlockByNumber: jsonrpc_1.getBlockByNumber,
    getBalance: jsonrpc_1.getBalance,
    blockNumber: jsonrpc_1.blockNumber,
    sameAddress: tools_1.sameAddress }, transaction), token);
//# sourceMappingURL=index.js.map