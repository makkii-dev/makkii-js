"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var lib_common_util_js_1 = require("lib-common-util-js");
var utils_1 = require("../utils");
var network_1 = require("../network");
var getBalance = function (address, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        var url = network_1.config.networks[network].jsonrpc + "/wallet/getaccount";
        var hexAddress = utils_1.base58check2HexString(address);
        var body = {
            address: hexAddress,
        };
        var promise = lib_common_util_js_1.HttpClient.post(url, body, true, { 'Content-Type': 'application/json' });
        console.log("[tron http req] " + url);
        promise.then(function (res) {
            console.log('[keystore http resp] ', res.data);
            if (res.data.Error !== undefined) {
                reject(res.data.Error);
            }
            else if (res.data.balance !== undefined) {
                resolve(new bignumber_js_1.default(res.data.balance).shiftedBy(-6));
            }
            else {
                resolve(new bignumber_js_1.default(0));
            }
        });
    });
};
exports.getBalance = getBalance;
var getLatestBlock = function (network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve) {
        var url = network_1.config.networks[network].jsonrpc + "/wallet/getnowblock";
        var promise = lib_common_util_js_1.HttpClient.post(url);
        console.log("[tron http req] " + url);
        promise.then(function (res) {
            console.log('[keystore http resp] ', res.data);
            resolve(res.data);
        });
    });
};
exports.getLatestBlock = getLatestBlock;
var broadcastTransaction = function (tx, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve) {
        var url = network_1.config.networks[network].jsonrpc + "/wallet/broadcasttransaction";
        var promise = lib_common_util_js_1.HttpClient.post(url, tx, true, { 'Content-Type': 'application/json' });
        console.log("[tron http req] " + url);
        promise.then(function (res) {
            console.log('[keystore http resp] ', res.data);
            resolve(res.data);
        });
    });
};
exports.broadcastTransaction = broadcastTransaction;
var getTransactionById = function (hash, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve) {
        var url = network_1.config.networks[network].jsonrpc + "/walletsolidity/gettransactionbyid";
        var promise = lib_common_util_js_1.HttpClient.post(url, {
            value: hash,
        }, true, { 'Content-Type': 'application/json' });
        console.log("[tron http req] " + url);
        promise.then(function (res) {
            console.log('[keystore http resp]', res.data);
            resolve(res.data);
        });
    });
};
exports.getTransactionById = getTransactionById;
var getTransactionInfoById = function (hash, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve) {
        var url = network_1.config.networks[network].jsonrpc + "/walletsolidity/gettransactioninfobyid";
        var promise = lib_common_util_js_1.HttpClient.post(url, {
            value: hash,
        }, true, { 'Content-Type': 'application/json' });
        console.log("[tron http req] " + url);
        promise.then(function (res) {
            console.log('[keystore http resp]', res.data);
            resolve(res.data);
        });
    });
};
exports.getTransactionInfoById = getTransactionInfoById;
//# sourceMappingURL=jsonrpc.js.map