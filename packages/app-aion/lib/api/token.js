"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var aion_web3_eth_contract_1 = require("aion-web3-eth-contract");
var aion_web3_eth_abi_1 = require("aion-web3-eth-abi");
var axios_1 = require("axios");
var lib_common_util_js_1 = require("lib-common-util-js");
var jsonrpc_1 = require("./jsonrpc");
var constants_1 = require("./constants");
var network_1 = require("../network");
function fetchAccountTokens(address, network) {
    return new Promise(function (resolve, reject) {
        var url = network_1.config.networks[network].explorer_api + "/aion/dashboard/getAccountDetails?accountAddress=" + address.toLowerCase();
        lib_common_util_js_1.HttpClient.get(url)
            .then(function (_a) {
            var data = _a.data;
            var res = {};
            if (data.content.length > 0) {
                var tokens = data.content[0].tokens;
                tokens.forEach(function (token) {
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
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.fetchAccountTokens = fetchAccountTokens;
var fetchAccountTokenBalance = function (contractAddress, address, network) { return new Promise(function (resolve, reject) {
    var contract = new aion_web3_eth_contract_1.default(constants_1.CONTRACT_ABI);
    var requestData = jsonrpc_1.processRequest('eth_call', [
        { to: contractAddress, data: contract.methods.balanceOf(address).encodeABI() },
        'latest',
    ]);
    console.log('[AION get token balance req]:', network_1.config.networks[network].jsonrpc);
    lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true)
        .then(function (res) {
        if (res.data.result) {
            resolve(new bignumber_js_1.default(aion_web3_eth_abi_1.default.decodeParameter('uint128', res.data.result)));
        }
        else {
            reject(new Error("get account Balance failed:" + res.data.error));
        }
    })
        .catch(function (e) {
        reject(new Error("get account Balance failed:" + e));
    });
}); };
exports.fetchAccountTokenBalance = fetchAccountTokenBalance;
var fetchTokenDetail = function (contractAddress, network) { return new Promise(function (resolve, reject) {
    var contract = new aion_web3_eth_contract_1.default(constants_1.CONTRACT_ABI);
    var requestGetSymbol = jsonrpc_1.processRequest('eth_call', [
        { to: contractAddress, data: contract.methods.symbol().encodeABI() },
        'latest',
    ]);
    var requestGetName = jsonrpc_1.processRequest('eth_call', [
        { to: contractAddress, data: contract.methods.name().encodeABI() },
        'latest',
    ]);
    var requestGetDecimals = jsonrpc_1.processRequest('eth_call', [
        { to: contractAddress, data: contract.methods.decimals().encodeABI() },
        'latest',
    ]);
    var url = network_1.config.networks[network].jsonrpc;
    var promiseSymbol = lib_common_util_js_1.HttpClient.post(url, requestGetSymbol, true);
    var promiseName = lib_common_util_js_1.HttpClient.post(url, requestGetName, true);
    var promiseDecimals = lib_common_util_js_1.HttpClient.post(url, requestGetDecimals, true);
    console.log('[AION get token detail req]:', network_1.config.networks[network].jsonrpc);
    axios_1.default
        .all([promiseSymbol, promiseName, promiseDecimals])
        .then(axios_1.default.spread(function (symbolRet, nameRet, decimalsRet) {
        if (symbolRet.data.result && nameRet.data.result && decimalsRet.data.result) {
            console.log('[get token symobl resp]=>', symbolRet.data);
            console.log('[get token name resp]=>', nameRet.data);
            console.log('[get token decimals resp]=>', decimalsRet.data);
            var symbol = void 0;
            var name_1;
            try {
                symbol = aion_web3_eth_abi_1.default.decodeParameter('string', symbolRet.data.result);
            }
            catch (e) {
                symbol = lib_common_util_js_1.hexutil.hexToAscii(symbolRet.data.result);
                symbol = symbol.slice(0, symbol.indexOf('\u0000'));
            }
            try {
                name_1 = aion_web3_eth_abi_1.default.decodeParameter('string', nameRet.data.result);
            }
            catch (e) {
                name_1 = lib_common_util_js_1.hexutil.hexToAscii(nameRet.data.result);
                name_1 = name_1.slice(0, name_1.indexOf('\u0000'));
            }
            var decimals = aion_web3_eth_abi_1.default.decodeParameter('uint8', decimalsRet.data.result);
            resolve({
                contractAddr: contractAddress, symbol: symbol, name: name_1, decimals: decimals,
            });
        }
        else {
            reject(new Error('get token detail failed'));
        }
    }))
        .catch(function (e) {
        reject(new Error("get token detail failed" + e));
    });
}); };
exports.fetchTokenDetail = fetchTokenDetail;
function fetchAccountTokenTransferHistory(address, symbolAddress, network, page, size) {
    if (page === void 0) { page = 0; }
    if (size === void 0) { size = 25; }
    return new Promise(function (resolve, reject) {
        var url = network_1.config.networks[network].explorer_api + "/aion/dashboard/getTransactionsByAddress?accountAddress=" + address.toLowerCase() + "&tokenAddress=" + symbolAddress.toLowerCase() + "&page=" + page + "&size=" + size;
        console.log("get account token transactions: " + url);
        lib_common_util_js_1.HttpClient.get(url)
            .then(function (res) {
            var _a = res.data.content, content = _a === void 0 ? [] : _a;
            var txs = {};
            content.forEach(function (t) {
                var tx = {
                    hash: "0x" + t.transactionHash,
                    timestamp: t.transferTimestamp * 1000,
                    from: "0x" + t.fromAddr,
                    to: "0x" + t.toAddr,
                    value: new bignumber_js_1.default(t.tknValue, 10).toNumber(),
                    status: 'CONFIRMED',
                    blockNumber: t.blockNumber,
                };
                txs[tx.hash] = tx;
            });
            resolve(txs);
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.fetchAccountTokenTransferHistory = fetchAccountTokenTransferHistory;
var getTopTokens = function (topN, network) {
    if (topN === void 0) { topN = 20; }
    return new Promise(function (resolve, reject) {
        var url = network_1.remote[network] + "/token/aion?offset=0&size=" + topN;
        console.log("get top aion tokens: " + url);
        lib_common_util_js_1.HttpClient.get(url, false)
            .then(function (res) {
            resolve(res.data);
        })
            .catch(function (err) {
            console.log('get keystore top tokens error:', err);
            reject(err);
        });
    });
};
exports.getTopTokens = getTopTokens;
var searchTokens = function (keyword, network) { return new Promise(function (resolve, reject) {
    var url = network_1.remote[network] + "/token/aion/search?keyword=" + keyword;
    console.log("search aion token: " + url);
    lib_common_util_js_1.HttpClient.get(url, false)
        .then(function (res) {
        resolve(res.data);
    })
        .catch(function (err) {
        console.log('search keystore token error:', err);
        reject(err);
    });
}); };
exports.searchTokens = searchTokens;
//# sourceMappingURL=token.js.map