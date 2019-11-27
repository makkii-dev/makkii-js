"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const axios_1 = require("axios");
const lib_common_util_js_1 = require("lib-common-util-js");
const jsonrpc_1 = require("./jsonrpc");
const constants_1 = require("./constants");
const Contract = require('aion-web3-eth-contract');
const AbiCoder = require('aion-web3-eth-abi');
exports.default = (config) => {
    function getAccountTokens(address) {
        return new Promise((resolve, reject) => {
            const url = `${config.explorer_api}/aion/dashboard/getAccountDetails?accountAddress=${address.toLowerCase()}`;
            lib_common_util_js_1.HttpClient.get(url)
                .then(({ data }) => {
                const res = {};
                if (data.content.length > 0) {
                    const { tokens } = data.content[0];
                    tokens.forEach((token) => {
                        res[token.symbol] = {
                            symbol: token.symbol,
                            contractAddr: token.contractAddr,
                            name: token.name,
                            tokenDecimal: token.tokenDecimal,
                        };
                    });
                }
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    const getAccountTokenBalance = (contractAddress, address) => new Promise((resolve, reject) => {
        const contract = new Contract(constants_1.CONTRACT_ABI);
        const requestData = jsonrpc_1.processRequest('eth_call', [
            { to: contractAddress, data: contract.methods.balanceOf(address).encodeABI() },
            'latest',
        ]);
        console.log('[AION get token balance req]:', config.jsonrpc);
        lib_common_util_js_1.HttpClient.post(config.jsonrpc, requestData, true)
            .then((res) => {
            if (res.data.result) {
                resolve(new bignumber_js_1.default(AbiCoder.decodeParameter('uint128', res.data.result)));
            }
            else {
                reject(new Error(`get account Balance failed:${res.data.error}`));
            }
        })
            .catch((e) => {
            reject(new Error(`get account Balance failed:${e}`));
        });
    });
    const getTokenDetail = (contractAddress) => new Promise((resolve, reject) => {
        const contract = new Contract(constants_1.CONTRACT_ABI);
        const requestGetSymbol = jsonrpc_1.processRequest('eth_call', [
            { to: contractAddress, data: contract.methods.symbol().encodeABI() },
            'latest',
        ]);
        const requestGetName = jsonrpc_1.processRequest('eth_call', [
            { to: contractAddress, data: contract.methods.name().encodeABI() },
            'latest',
        ]);
        const requestGetDecimals = jsonrpc_1.processRequest('eth_call', [
            { to: contractAddress, data: contract.methods.decimals().encodeABI() },
            'latest',
        ]);
        const url = config.jsonrpc;
        const promiseSymbol = lib_common_util_js_1.HttpClient.post(url, requestGetSymbol, true);
        const promiseName = lib_common_util_js_1.HttpClient.post(url, requestGetName, true);
        const promiseDecimals = lib_common_util_js_1.HttpClient.post(url, requestGetDecimals, true);
        console.log('[AION get token detail req]:', config.jsonrpc);
        axios_1.default
            .all([promiseSymbol, promiseName, promiseDecimals])
            .then(axios_1.default.spread((symbolRet, nameRet, decimalsRet) => {
            if (symbolRet.data.result && nameRet.data.result && decimalsRet.data.result) {
                console.log('[get token symobl resp]=>', symbolRet.data);
                console.log('[get token name resp]=>', nameRet.data);
                console.log('[get token decimals resp]=>', decimalsRet.data);
                let symbol;
                let name;
                try {
                    symbol = AbiCoder.decodeParameter('string', symbolRet.data.result);
                }
                catch (e) {
                    symbol = lib_common_util_js_1.hexutil.hexToAscii(symbolRet.data.result);
                    symbol = symbol.slice(0, symbol.indexOf('\u0000'));
                }
                try {
                    name = AbiCoder.decodeParameter('string', nameRet.data.result);
                }
                catch (e) {
                    name = lib_common_util_js_1.hexutil.hexToAscii(nameRet.data.result);
                    name = name.slice(0, name.indexOf('\u0000'));
                }
                const decimals = AbiCoder.decodeParameter('uint8', decimalsRet.data.result);
                resolve({
                    contractAddr: contractAddress, symbol, name, tokenDecimal: decimals,
                });
            }
            else {
                reject(new Error('get token detail failed'));
            }
        }))
            .catch((e) => {
            reject(new Error(`get token detail failed${e}`));
        });
    });
    function getAccountTokenTransferHistory(address, symbolAddress, page = 0, size = 25) {
        return new Promise((resolve, reject) => {
            const url = `${config.explorer_api}/aion/dashboard/getTransactionsByAddress?accountAddress=${address.toLowerCase()}&tokenAddress=${symbolAddress.toLowerCase()}&page=${page}&size=${size}`;
            console.log(`get account token transactions: ${url}`);
            lib_common_util_js_1.HttpClient.get(url)
                .then((res) => {
                const { content = [] } = res.data;
                const txs = {};
                content.forEach((t) => {
                    const tx = {
                        hash: `0x${t.transactionHash}`,
                        timestamp: t.transferTimestamp * 1000,
                        from: `0x${t.fromAddr}`,
                        to: `0x${t.toAddr}`,
                        value: new bignumber_js_1.default(t.tknValue, 10).toNumber(),
                        status: 'CONFIRMED',
                        blockNumber: t.blockNumber,
                    };
                    txs[tx.hash] = tx;
                });
                resolve(txs);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    const getTopTokens = (topN = 20) => new Promise((resolve, reject) => {
        const url = `${config.remoteApi}/token/aion?offset=0&size=${topN}`;
        console.log(`get top aion tokens: ${url}`);
        lib_common_util_js_1.HttpClient.get(url, false)
            .then((res) => {
            resolve(res.data);
        })
            .catch((err) => {
            console.log('get aion top tokens error:', err);
            reject(err);
        });
    });
    const searchTokens = (keyword) => new Promise((resolve, reject) => {
        const url = `${config.remoteApi}/token/aion/search?keyword=${keyword}`;
        console.log(`search aion token: ${url}`);
        lib_common_util_js_1.HttpClient.get(url, false)
            .then((res) => {
            resolve(res.data);
        })
            .catch((err) => {
            console.log('search aion token error:', err);
            reject(err);
        });
    });
    return {
        getAccountTokens,
        getAccountTokenBalance,
        getAccountTokenTransferHistory,
        getTokenDetail,
        getTopTokens,
        searchTokens,
    };
};
//# sourceMappingURL=token.js.map