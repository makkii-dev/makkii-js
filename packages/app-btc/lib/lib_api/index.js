"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("./transaction");
const jsonrpc_1 = require("./jsonrpc");
const tools_1 = require("./tools");
exports.default = config => {
    const { sendTransaction, getTransactionUrlInExplorer, buildTransaction } = transaction_1.default(config);
    const { getBalance, getTransactionStatus, getTransactionsByAddress, broadcastTransaction } = jsonrpc_1.default(config);
    const { sendAll, validateBalanceSufficiency, sameAddress } = tools_1.default(config);
    return {
        sendTransaction,
        buildTransaction,
        getTransactionUrlInExplorer,
        getTransactionStatus,
        getBalance,
        getTransactionsByAddress,
        validateBalanceSufficiency,
        sameAddress,
        sendAll,
    };
};
//# sourceMappingURL=index.js.map