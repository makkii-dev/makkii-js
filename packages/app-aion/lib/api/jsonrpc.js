"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const lib_common_util_js_1 = require("lib-common-util-js");
const network_1 = require("../network");
const checkBlockTag = (blockTag) => {
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
        return `0x${new bignumber_js_1.default(blockTag).toString(16)}`;
    }
    throw new Error('invalid blockTag');
};
const processRequest = (methodName, params) => {
    const requestData = {
        method: methodName,
        params,
        id: 42,
        jsonrpc: '2.0',
    };
    return JSON.stringify(requestData);
};
exports.processRequest = processRequest;
const getBlockByNumber = (blockNumber, fullTxs = false, network = 'mainnet') => new Promise((resolve, reject) => {
    const requestData = processRequest('eth_getBlockByNumber', [blockNumber, fullTxs]);
    const promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
        'Content-Type': 'application/json',
    });
    console.log(`[aion http req] eth_getBlockByNumber[${blockNumber},${fullTxs}]`);
    promise.then((res) => {
        console.log('[aion http resp] eth_getBlockByNumber', res.data);
        if (res.data.error)
            reject(res.data.error);
        else
            resolve(res.data.result);
    });
});
exports.getBlockByNumber = getBlockByNumber;
const blockNumber = (network = 'mainnet') => new Promise((resolve, reject) => {
    const requestData = processRequest('eth_blockNumber', []);
    const promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
        'Content-Type': 'application/json',
    });
    console.log('[aion http req] eth_blockNumber[]');
    promise.then((res) => {
        console.log('[aion http resp] eth_blockNumber', res.data);
        if (res.data.error)
            reject(res.data.error);
        else
            resolve(res.data.result);
    });
});
exports.blockNumber = blockNumber;
const getBalance = (address, network = 'mainnet') => new Promise((resolve, reject) => {
    const params = [address.toLowerCase(), 'latest'];
    const requestData = processRequest('eth_getBalance', params);
    const promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
        'Content-Type': 'application/json',
    });
    console.log(`[aion http req] eth_getBalance[${address}, 'latest']`);
    promise.then((res) => {
        console.log('[aion http resp] eth_getBalance', res.data);
        if (res.data.error)
            reject(res.data.error);
        else
            resolve(new bignumber_js_1.default(res.data.result).shiftedBy(-18));
    });
});
exports.getBalance = getBalance;
const getTransactionCount = (address, blockTag, network = 'mainnet') => new Promise((resolve, reject) => {
    const params = [address.toLowerCase(), checkBlockTag(blockTag)];
    const requestData = processRequest('eth_getTransactionCount', params);
    const promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
        'Content-Type': 'application/json',
    });
    console.log(`[aion http req] eth_getTransactionCount[${address}, ${blockTag}]`);
    promise.then((res) => {
        console.log('[aion http resp] eth_getTransactionCount', res.data);
        if (res.data.error)
            reject(res.data.error);
        resolve(res.data.result);
    });
});
exports.getTransactionCount = getTransactionCount;
const sendSignedTransaction = (signedTx, network = 'mainnet') => new Promise((resolve, reject) => {
    const params = [signedTx];
    const requestData = processRequest('eth_sendRawTransaction', params);
    const promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
        'Content-Type': 'application/json',
    });
    console.log(`[aion http req] eth_sendRawTransaction[${signedTx}]`);
    promise.then((res) => {
        console.log('[aion http resp] eth_sendRawTransaction', res.data);
        if (res.data.error)
            reject(res.data.error);
        resolve(res.data.result);
    });
});
exports.sendSignedTransaction = sendSignedTransaction;
const getTransactionReceipt = (hash, network = 'mainnet') => new Promise((resolve, reject) => {
    const params = [hash];
    const requestData = processRequest('eth_getTransactionReceipt', params);
    const promise = lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true, {
        'Content-Type': 'application/json',
    });
    console.log(`[aion http req] eth_getTransactionReceipt[${hash}]`);
    promise.then((res) => {
        console.log('[aion http resp] eth_getTransactionReceipt', res.data);
        if (res.data.error)
            reject(res.data.error);
        else
            resolve(res.data.result);
    });
});
exports.getTransactionReceipt = getTransactionReceipt;
//# sourceMappingURL=jsonrpc.js.map