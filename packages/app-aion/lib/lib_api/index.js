"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
const jsonrpc_1 = require("./jsonrpc");
const transaction_1 = require("./transaction");
const token_1 = require("./token");
exports.default = config => {
    const { getBalance, getBlockByNumber, blockNumber } = jsonrpc_1.default(config);
    const { sendTransaction, getTransactionsByAddress, getTransactionUrlInExplorer, getTransactionStatus, buildTransaction } = transaction_1.default(config);
    const { getAccountTokens, getAccountTokenBalance, getAccountTokenTransferHistory, getTokenDetail, getTopTokens, searchTokens } = token_1.default(config);
    return {
        getBlockByNumber,
        getBalance,
        blockNumber,
        sameAddress: tools_1.sameAddress,
        buildTransaction,
        sendTransaction,
        getTransactionsByAddress,
        getTransactionUrlInExplorer,
        getTransactionStatus,
        getAccountTokens,
        getAccountTokenBalance,
        getAccountTokenTransferHistory,
        getTokenDetail,
        getTopTokens,
        searchTokens
    };
};
//# sourceMappingURL=index.js.map