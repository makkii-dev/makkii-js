"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var lib_common_util_js_1 = require("lib-common-util-js");
var network_1 = require("../network");
var checkBlockTag = function (blockTag) {
    if (blockTag == null) {
        return 'latest';
    }
    if (blockTag === 'earliest') {
        return '0x0';
    }
    if (blockTag === 'latest' || blockTag === 'pending') {
        return blockTag;
    }
    if (typeof blockTag === 'number') {
        return "0x" + new bignumber_js_1.default(blockTag).toString(16);
    }
    throw new Error('invalid blockTag');
};
var processRequest = function (methodName, params) {
    var requestData = {
        method: methodName,
        params: params,
        id: 42,
        jsonrpc: '2.0',
    };
    return JSON.stringify(requestData);
};
exports.processRequest = processRequest;
var getBlockByNumber = function (blockNumber, fullTxs, network) {
    if (fullTxs === void 0) { fullTxs = false; }
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        var requestData = processRequest('eth_getBlockByNumber', [blockNumber, fullTxs]);
        var promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log("[aion http req] eth_getBlockByNumber[" + blockNumber + "," + fullTxs + "]");
        promise.then(function (res) {
            console.log('[aion http resp] eth_getBlockByNumber', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(res.data.result);
        });
    });
};
exports.getBlockByNumber = getBlockByNumber;
var blockNumber = function (network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        var requestData = processRequest('eth_blockNumber', []);
        var promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log('[aion http req] eth_blockNumber[]');
        promise.then(function (res) {
            console.log('[aion http resp] eth_blockNumber', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(res.data.result);
        });
    });
};
exports.blockNumber = blockNumber;
var getBalance = function (address, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        var params = [address.toLowerCase(), 'latest'];
        var requestData = processRequest('eth_getBalance', params);
        var promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log("[aion http req] eth_getBalance[" + address + ", 'latest']");
        promise.then(function (res) {
            console.log('[aion http resp] eth_getBalance', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(new bignumber_js_1.default(res.data.result).shiftedBy(-18));
        });
    });
};
exports.getBalance = getBalance;
var getTransactionCount = function (address, blockTag, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        var params = [address.toLowerCase(), checkBlockTag(blockTag)];
        var requestData = processRequest('eth_getTransactionCount', params);
        var promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log("[aion http req] eth_getTransactionCount[" + address + ", " + blockTag + "]");
        promise.then(function (res) {
            console.log('[aion http resp] eth_getTransactionCount', res.data);
            if (res.data.error)
                reject(res.data.error);
            resolve(res.data.result);
        });
    });
};
exports.getTransactionCount = getTransactionCount;
var sendSignedTransaction = function (signedTx, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        var params = [signedTx];
        var requestData = processRequest('eth_sendRawTransaction', params);
        var promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log("[aion http req] eth_sendRawTransaction[" + signedTx + "]");
        promise.then(function (res) {
            console.log('[aion http resp] eth_sendRawTransaction', res.data);
            if (res.data.error)
                reject(res.data.error);
            resolve(res.data.result);
        });
    });
};
exports.sendSignedTransaction = sendSignedTransaction;
var getTransactionReceipt = function (hash, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        var params = [hash];
        var requestData = processRequest('eth_getTransactionReceipt', params);
        var promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log("[aion http req] eth_getTransactionReceipt[" + hash + "]");
        promise.then(function (res) {
            console.log('[aion http resp] eth_getTransactionReceipt', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(res.data.result);
        });
    });
};
exports.getTransactionReceipt = getTransactionReceipt;
//# sourceMappingURL=jsonrpc.js.map