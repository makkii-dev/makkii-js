"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const aion_web3_eth_contract_1 = require("aion-web3-eth-contract");
const aion_web3_eth_abi_1 = require("aion-web3-eth-abi");
const axios_1 = require("axios");
const lib_common_util_js_1 = require("lib-common-util-js");
const jsonrpc_1 = require("./jsonrpc");
const constants_1 = require("./constants");
const network_1 = require("../network");
function fetchAccountTokens(address, network) {
    return new Promise((resolve, reject) => {
        const url = `${network_1.config.networks[network].explorer_api}/aion/dashboard/getAccountDetails?accountAddress=${address.toLowerCase()}`;
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
                        balance: new bignumber_js_1.default(0),
                        tokenTxs: {},
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
exports.fetchAccountTokens = fetchAccountTokens;
const fetchAccountTokenBalance = (contractAddress, address, network) => new Promise((resolve, reject) => {
    const contract = new aion_web3_eth_contract_1.default(constants_1.CONTRACT_ABI);
    const requestData = jsonrpc_1.processRequest('eth_call', [
        { to: contractAddress, data: contract.methods.balanceOf(address).encodeABI() },
        'latest',
    ]);
    console.log('[AION get token balance req]:', network_1.config.networks[network].jsonrpc);
    lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true)
        .then((res) => {
        if (res.data.result) {
            resolve(new bignumber_js_1.default(aion_web3_eth_abi_1.default.decodeParameter('uint128', res.data.result)));
        }
        else {
            reject(new Error(`get account Balance failed:${res.data.error}`));
        }
    })
        .catch((e) => {
        reject(new Error(`get account Balance failed:${e}`));
    });
});
exports.fetchAccountTokenBalance = fetchAccountTokenBalance;
const fetchTokenDetail = (contractAddress, network) => new Promise((resolve, reject) => {
    const contract = new aion_web3_eth_contract_1.default(constants_1.CONTRACT_ABI);
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
    const url = network_1.config.networks[network].jsonrpc;
    const promiseSymbol = lib_common_util_js_1.HttpClient.post(url, requestGetSymbol, true);
    const promiseName = lib_common_util_js_1.HttpClient.post(url, requestGetName, true);
    const promiseDecimals = lib_common_util_js_1.HttpClient.post(url, requestGetDecimals, true);
    console.log('[AION get token detail req]:', network_1.config.networks[network].jsonrpc);
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
                symbol = aion_web3_eth_abi_1.default.decodeParameter('string', symbolRet.data.result);
            }
            catch (e) {
                symbol = lib_common_util_js_1.hexutil.hexToAscii(symbolRet.data.result);
                symbol = symbol.slice(0, symbol.indexOf('\u0000'));
            }
            try {
                name = aion_web3_eth_abi_1.default.decodeParameter('string', nameRet.data.result);
            }
            catch (e) {
                name = lib_common_util_js_1.hexutil.hexToAscii(nameRet.data.result);
                name = name.slice(0, name.indexOf('\u0000'));
            }
            const decimals = aion_web3_eth_abi_1.default.decodeParameter('uint8', decimalsRet.data.result);
            resolve({
                contractAddr: contractAddress, symbol, name, decimals,
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
exports.fetchTokenDetail = fetchTokenDetail;
function fetchAccountTokenTransferHistory(address, symbolAddress, network, page = 0, size = 25) {
    return new Promise((resolve, reject) => {
        const url = `${network_1.config.networks[network].explorer_api}/aion/dashboard/getTransactionsByAddress?accountAddress=${address.toLowerCase()}&tokenAddress=${symbolAddress.toLowerCase()}&page=${page}&size=${size}`;
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
exports.fetchAccountTokenTransferHistory = fetchAccountTokenTransferHistory;
const getTopTokens = (topN = 20, network) => new Promise((resolve, reject) => {
    const url = `${network_1.remote[network]}/token/aion?offset=0&size=${topN}`;
    console.log(`get top aion tokens: ${url}`);
    lib_common_util_js_1.HttpClient.get(url, false)
        .then((res) => {
        resolve(res.data);
    })
        .catch((err) => {
        console.log('get keystore top tokens error:', err);
        reject(err);
    });
});
exports.getTopTokens = getTopTokens;
const searchTokens = (keyword, network) => new Promise((resolve, reject) => {
    const url = `${network_1.remote[network]}/token/aion/search?keyword=${keyword}`;
    console.log(`search aion token: ${url}`);
    lib_common_util_js_1.HttpClient.get(url, false)
        .then((res) => {
        resolve(res.data);
    })
        .catch((err) => {
        console.log('search keystore token error:', err);
        reject(err);
    });
});
exports.searchTokens = searchTokens;
//# sourceMappingURL=token.js.map