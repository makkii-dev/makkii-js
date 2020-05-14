"use strict";
exports.__esModule = true;
var transaction_1 = require("./transaction");
var jsonrpc_1 = require("./jsonrpc");
var tools_1 = require("./tools");
exports["default"] = (function (config) {
    var getBalance = jsonrpc_1["default"](config).getBalance;
    var _a = transaction_1["default"](config), sendTransaction = _a.sendTransaction, getTransactionStatus = _a.getTransactionStatus, getTransactionUrlInExplorer = _a.getTransactionUrlInExplorer, getTransactionsByAddress = _a.getTransactionsByAddress, buildTransaction = _a.buildTransaction;
    return {
        getBalance: getBalance,
        buildTransaction: buildTransaction,
        sameAddress: tools_1.sameAddress,
        sendTransaction: sendTransaction,
        getTransactionStatus: getTransactionStatus,
        getTransactionUrlInExplorer: getTransactionUrlInExplorer,
        getTransactionsByAddress: getTransactionsByAddress
    };
});
