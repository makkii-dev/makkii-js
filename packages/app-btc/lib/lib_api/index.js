"use strict";
exports.__esModule = true;
var transaction_1 = require("./transaction");
var jsonrpc_1 = require("./jsonrpc");
var tools_1 = require("./tools");
exports["default"] = (function (config) {
    var _a = transaction_1["default"](config), sendTransaction = _a.sendTransaction, getTransactionUrlInExplorer = _a.getTransactionUrlInExplorer, buildTransaction = _a.buildTransaction;
    var _b = jsonrpc_1["default"](config), getBalance = _b.getBalance, getTransactionStatus = _b.getTransactionStatus, getTransactionsByAddress = _b.getTransactionsByAddress, broadcastTransaction = _b.broadcastTransaction;
    var _c = tools_1["default"](config), sendAll = _c.sendAll, sameAddress = _c.sameAddress;
    return {
        sendTransaction: sendTransaction,
        buildTransaction: buildTransaction,
        getTransactionUrlInExplorer: getTransactionUrlInExplorer,
        getTransactionStatus: getTransactionStatus,
        getBalance: getBalance,
        getTransactionsByAddress: getTransactionsByAddress,
        sameAddress: sameAddress,
        sendAll: sendAll
    };
});
