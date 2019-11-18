"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
const jsonrpc_1 = require("./jsonrpc");
const transaction = require("./transaction");
const token = require("./token");
exports.default = Object.assign(Object.assign({ formatAddress1Line: tools_1.formatAddress1Line,
    validateBalanceSufficiency: tools_1.validateBalanceSufficiency,
    getBlockByNumber: jsonrpc_1.getBlockByNumber,
    getBalance: jsonrpc_1.getBalance,
    blockNumber: jsonrpc_1.blockNumber,
    sameAddress: tools_1.sameAddress }, transaction), token);
//# sourceMappingURL=index.js.map