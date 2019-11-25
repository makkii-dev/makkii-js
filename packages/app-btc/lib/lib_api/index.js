"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("./transaction");
const jsonrpc_1 = require("./jsonrpc");
const tools_1 = require("./tools");
exports.default = config => {
    const { sendTransaction, getTransactionUrlInExplorer } = transaction_1.default(config);
    const { getBalance, getTransactionStatus, getTransactionsByAddress } = jsonrpc_1.default(config);
    const { sendAll, validateBalanceSufficiency, formatAddress1Line, sameAddress } = tools_1.default(config);
    return {
        sendTransaction,
        getTransactionUrlInExplorer,
        getTransactionStatus,
        getBalance,
        getTransactionsByAddress,
        validateBalanceSufficiency,
        formatAddress1Line,
        sameAddress,
    };
};
//# sourceMappingURL=index.js.map