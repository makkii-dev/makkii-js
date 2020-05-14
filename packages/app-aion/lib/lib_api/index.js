"use strict";
exports.__esModule = true;
var tools_1 = require("./tools");
var jsonrpc_1 = require("./jsonrpc");
var transaction_1 = require("./transaction");
var token_1 = require("./token");
exports["default"] = (function (config) {
    var _a = jsonrpc_1["default"](config), getBalance = _a.getBalance, getBlockByNumber = _a.getBlockByNumber, blockNumber = _a.blockNumber;
    var _b = transaction_1["default"](config), sendTransaction = _b.sendTransaction, getTransactionsByAddress = _b.getTransactionsByAddress, getTransactionUrlInExplorer = _b.getTransactionUrlInExplorer, getTransactionStatus = _b.getTransactionStatus, buildTransaction = _b.buildTransaction;
    var _c = token_1["default"](config), getAccountTokens = _c.getAccountTokens, getAccountTokenBalance = _c.getAccountTokenBalance, getAccountTokenTransferHistory = _c.getAccountTokenTransferHistory, getTokenDetail = _c.getTokenDetail, getTopTokens = _c.getTopTokens, searchTokens = _c.searchTokens;
    return {
        getBlockByNumber: getBlockByNumber,
        getBalance: getBalance,
        blockNumber: blockNumber,
        sameAddress: tools_1.sameAddress,
        buildTransaction: buildTransaction,
        sendTransaction: sendTransaction,
        getTransactionsByAddress: getTransactionsByAddress,
        getTransactionUrlInExplorer: getTransactionUrlInExplorer,
        getTransactionStatus: getTransactionStatus,
        getAccountTokens: getAccountTokens,
        getAccountTokenBalance: getAccountTokenBalance,
        getAccountTokenTransferHistory: getAccountTokenTransferHistory,
        getTokenDetail: getTokenDetail,
        getTopTokens: getTopTokens,
        searchTokens: searchTokens
    };
});
