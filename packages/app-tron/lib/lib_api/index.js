"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("./transaction");
const jsonrpc_1 = require("./jsonrpc");
const tools_1 = require("./tools");
exports.default = config => {
    const { getBalance } = jsonrpc_1.default(config);
    const { sendTransaction, getTransactionStatus, getTransactionUrlInExplorer, getTransactionsByAddress, buildTransaction } = transaction_1.default(config);
    return {
        getBalance,
        buildTransaction,
        sameAddress: tools_1.sameAddress,
        sendTransaction,
        getTransactionStatus,
        getTransactionUrlInExplorer,
        getTransactionsByAddress
    };
};
//# sourceMappingURL=index.js.map