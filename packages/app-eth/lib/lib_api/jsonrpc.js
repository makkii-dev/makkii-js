"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const lib_common_util_js_1 = require("lib-common-util-js");
const checkBlockTag = blockTag => {
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
exports.processRequest = (methodName, params) => {
    const requestData = {
        method: methodName,
        params,
        id: 42,
        jsonrpc: '2.0',
    };
    return JSON.stringify(requestData);
};
exports.default = config => {
    const getBlockByNumber = (blockNumber, fullTxs = false) => new Promise((resolve, reject) => {
        const requestData = exports.processRequest('eth_getBlockByNumber', [blockNumber, fullTxs]);
        const promise = lib_common_util_js_1.HttpClient.post(config.jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log(`[eth http req] eth_getBlockByNumber[${blockNumber},${fullTxs}]`);
        promise.then(res => {
            console.log('[eth http resp] eth_getBlockByNumber', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(res.data.result);
        });
    });
    const blockNumber = () => new Promise((resolve, reject) => {
        const requestData = exports.processRequest('eth_blockNumber', []);
        const promise = lib_common_util_js_1.HttpClient.post(config.jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log('[eth http req] eth_blockNumber[]');
        promise.then(res => {
            console.log('[eth http resp] eth_blockNumber', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(res.data.result);
        });
    });
    const getBalance = (address) => new Promise((resolve, reject) => {
        const params = [address.toLowerCase(), 'latest'];
        const requestData = exports.processRequest('eth_getBalance', params);
        const promise = lib_common_util_js_1.HttpClient.post(config.jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log(`[eth http req] eth_getBalance[${address},  'latest']`);
        promise.then(res => {
            console.log('[eth http resp] eth_getBalance', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(new bignumber_js_1.default(res.data.result).shiftedBy(-18));
        });
    });
    const getTransactionCount = (address, blockTag) => new Promise((resolve, reject) => {
        const params = [address.toLowerCase(), checkBlockTag(blockTag)];
        const requestData = exports.processRequest('eth_getTransactionCount', params);
        const promise = lib_common_util_js_1.HttpClient.post(config.jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log(`[eth http req] eth_getTransactionCount[${address}, ${blockTag}]`);
        promise.then(res => {
            console.log('[eth http resp] eth_getTransactionCount', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(res.data.result);
        }, err => {
            console.log('[eth http error]', err);
            reject(err);
        });
    });
    const sendSignedTransaction = (signedTx) => new Promise((resolve, reject) => {
        const params = [signedTx];
        const requestData = exports.processRequest('eth_sendRawTransaction', params);
        console.log(`send signed tx: ${config.jsonrpc}`);
        const promise = lib_common_util_js_1.HttpClient.post(config.jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log(`[eth http req] eth_sendRawTransaction[${signedTx}]`);
        promise.then(res => {
            console.log('[eth http resp] eth_sendRawTransaction ', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(res.data.result);
        });
    });
    const getTransactionReceipt = (hash) => new Promise((resolve, reject) => {
        const params = [hash];
        const requestData = exports.processRequest('eth_getTransactionReceipt', params);
        const promise = lib_common_util_js_1.HttpClient.post(config.jsonrpc, requestData, true, {
            'Content-Type': 'application/json',
        });
        console.log(`[eth http req] eth_getTransactionReceipt[${hash}]`);
        promise.then(res => {
            console.log('[eth http resp] eth_getTransactionReceipt', res.data);
            if (res.data.error)
                reject(res.data.error);
            else
                resolve(res.data.result);
        });
    });
    return {
        blockNumber,
        getBalance,
        getBlockByNumber,
        getTransactionReceipt,
        getTransactionCount,
        sendSignedTransaction,
    };
};
//# sourceMappingURL=jsonrpc.js.map