"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const lib_common_util_js_1 = require("lib-common-util-js");
const utils_1 = require("../utils");
exports.default = config => {
    const getBalance = (address) => new Promise((resolve, reject) => {
        const url = `${config.trongrid_api}/wallet/getaccount`;
        const hexAddress = utils_1.base58check2HexString(address);
        const body = {
            address: hexAddress,
        };
        const promise = lib_common_util_js_1.HttpClient.post(url, body, true, { 'Content-Type': 'application/json' });
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
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
    const getLatestBlock = (network = 'mainnet') => new Promise(resolve => {
        const url = `${config.trongrid_api}/wallet/getnowblock`;
        const promise = lib_common_util_js_1.HttpClient.post(url);
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp] ', res.data);
            resolve(res.data);
        });
    });
    const broadcastTransaction = (tx) => new Promise(resolve => {
        const url = `${config.trongrid_api}/wallet/broadcasttransaction`;
        const promise = lib_common_util_js_1.HttpClient.post(url, tx, true, { 'Content-Type': 'application/json' });
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp] ', res.data);
            resolve(res.data);
        });
    });
    const getTransactionById = (hash) => new Promise(resolve => {
        const url = `${config.trongrid_api}/walletsolidity/gettransactionbyid`;
        const promise = lib_common_util_js_1.HttpClient.post(url, {
            value: hash,
        }, true, { 'Content-Type': 'application/json' });
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp]', res.data);
            resolve(res.data);
        });
    });
    const getTransactionInfoById = (hash) => new Promise(resolve => {
        const url = `${config.trongrid_api}/walletsolidity/gettransactioninfobyid`;
        const promise = lib_common_util_js_1.HttpClient.post(url, {
            value: hash,
        }, true, { 'Content-Type': 'application/json' });
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp]', res.data);
            resolve(res.data);
        });
    });
    return {
        broadcastTransaction,
        getBalance,
        getLatestBlock,
        getTransactionById,
        getTransactionInfoById,
    };
};
//# sourceMappingURL=jsonrpc.js.map