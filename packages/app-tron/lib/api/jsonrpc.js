"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const lib_common_util_js_1 = require("lib-common-util-js");
const utils_1 = require("../utils");
const network_1 = require("../network");
const getBalance = (address, network = 'mainnet') => new Promise((resolve, reject) => {
    const url = `${network_1.config.networks[network].jsonrpc}/wallet/getaccount`;
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
exports.getBalance = getBalance;
const getLatestBlock = (network = 'mainnet') => new Promise(resolve => {
    const url = `${network_1.config.networks[network].jsonrpc}/wallet/getnowblock`;
    const promise = lib_common_util_js_1.HttpClient.post(url);
    console.log(`[tron http req] ${url}`);
    promise.then(res => {
        console.log('[keystore http resp] ', res.data);
        resolve(res.data);
    });
});
exports.getLatestBlock = getLatestBlock;
const broadcastTransaction = (tx, network = 'mainnet') => new Promise(resolve => {
    const url = `${network_1.config.networks[network].jsonrpc}/wallet/broadcasttransaction`;
    const promise = lib_common_util_js_1.HttpClient.post(url, tx, true, { 'Content-Type': 'application/json' });
    console.log(`[tron http req] ${url}`);
    promise.then(res => {
        console.log('[keystore http resp] ', res.data);
        resolve(res.data);
    });
});
exports.broadcastTransaction = broadcastTransaction;
const getTransactionById = (hash, network = 'mainnet') => new Promise(resolve => {
    const url = `${network_1.config.networks[network].jsonrpc}/walletsolidity/gettransactionbyid`;
    const promise = lib_common_util_js_1.HttpClient.post(url, {
        value: hash,
    }, true, { 'Content-Type': 'application/json' });
    console.log(`[tron http req] ${url}`);
    promise.then(res => {
        console.log('[keystore http resp]', res.data);
        resolve(res.data);
    });
});
exports.getTransactionById = getTransactionById;
const getTransactionInfoById = (hash, network = 'mainnet') => new Promise(resolve => {
    const url = `${network_1.config.networks[network].jsonrpc}/walletsolidity/gettransactioninfobyid`;
    const promise = lib_common_util_js_1.HttpClient.post(url, {
        value: hash,
    }, true, { 'Content-Type': 'application/json' });
    console.log(`[tron http req] ${url}`);
    promise.then(res => {
        console.log('[keystore http resp]', res.data);
        resolve(res.data);
    });
});
exports.getTransactionInfoById = getTransactionInfoById;
//# sourceMappingURL=jsonrpc.js.map