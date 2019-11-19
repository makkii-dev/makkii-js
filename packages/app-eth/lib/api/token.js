"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var bignumber_js_1 = require("bignumber.js");
var web3_eth_contract_1 = require("web3-eth-contract");
var web3_eth_abi_1 = require("web3-eth-abi");
var lib_common_util_js_1 = require("lib-common-util-js");
var constants_1 = require("./constants");
var jsonrpc_1 = require("./jsonrpc");
var network_1 = require("../network");
var fetchAccountTokenBalance = function (contractAddress, address, network) {
    return new Promise(function (resolve, reject) {
        var contract = new web3_eth_contract_1.default(constants_1.ERC20ABI);
        var requestData = jsonrpc_1.processRequest('eth_call', [
            { to: contractAddress, data: contract.methods.balanceOf(address).encodeABI() },
            'latest',
        ]);
        console.log('[ETH get token balance req]:', network_1.config.networks[network].jsonrpc);
        lib_common_util_js_1.HttpClient.post(network_1.config.networks[network].jsonrpc, requestData, true)
            .then(function (res) {
            if (res.data.result) {
                resolve(bignumber_js_1.default(web3_eth_abi_1.default.decodeParameter('uint256', res.data.result)));
            }
            else {
                reject(new Error("get account Balance failed:" + res.data.error));
            }
        })
            .catch(function (e) {
            reject(new Error("get account Balance failed:" + e));
        });
    });
};
exports.fetchAccountTokenBalance = fetchAccountTokenBalance;
var fetchTokenDetail = function (contractAddress, network) {
    return new Promise(function (resolve, reject) {
        var contract = new web3_eth_contract_1.default(constants_1.ERC20ABI);
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
        console.log('[ETH get token detail req]:', network_1.config.networks[network].jsonrpc);
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
                    symbol = web3_eth_abi_1.default.decodeParameter('string', symbolRet.data.result);
                }
                catch (e) {
                    symbol = lib_common_util_js_1.hexutil.hexToAscii(symbolRet.data.result);
                    symbol = symbol.slice(0, symbol.indexOf('\u0000'));
                }
                try {
                    name_1 = web3_eth_abi_1.default.decodeParameter('string', nameRet.data.result);
                }
                catch (e) {
                    name_1 = lib_common_util_js_1.hexutil.hexToAscii(nameRet.data.result);
                    name_1 = name_1.slice(0, name_1.indexOf('\u0000'));
                }
                var decimals = web3_eth_abi_1.default.decodeParameter('uint8', decimalsRet.data.result);
                resolve({ contractAddr: contractAddress, symbol: symbol, name: name_1, decimals: decimals });
            }
            else {
                reject(new Error('get token detail failed'));
            }
        }))
            .catch(function (e) {
            reject(new Error("get token detail failed:" + e));
        });
    });
};
exports.fetchTokenDetail = fetchTokenDetail;
var fetchAccountTokenTransferHistory = function (address, symbolAddress, network, page, size, timestamp) {
    if (page === void 0) { page = 0; }
    if (size === void 0) { size = 25; }
    return new Promise(function (resolve, reject) {
        var explorer_api = network_1.config.networks[network].explorer_api;
        if (explorer_api.provider === "etherscan") {
            var url = explorer_api.url + "?module=account&action=tokentx&contractaddress=" + symbolAddress + "&address=" + address + "&page=" + page + "&offset=" + size + "&sort=asc&apikey=" + network_1.config.etherscanApikey;
            console.log("[eth http req] get token history by address: " + url);
            lib_common_util_js_1.HttpClient.get(url)
                .then(function (res) {
                var data = res.data;
                if (data.status === '1') {
                    var transfers_1 = {};
                    var _a = data.result, txs = _a === void 0 ? [] : _a;
                    txs.forEach(function (t) {
                        var tx = {};
                        tx.hash = t.hash;
                        tx.timestamp = parseInt(t.timeStamp) * 1000;
                        tx.from = t.from;
                        tx.to = t.to;
                        tx.value = bignumber_js_1.default(t.value).shiftedBy(-t.tokenDecimal).toNumber();
                        tx.status = 'CONFIRMED';
                        tx.blockNumber = t.blockNumber;
                        transfers_1[tx.hash] = tx;
                    });
                    resolve(transfers_1);
                }
                else {
                    resolve({});
                }
            })
                .catch(function (err) {
                console.log('[http resp] err: ', err);
                reject(err);
            });
        }
        else {
            var url = explorer_api.url + "/getAddressHistory/" + address + "?apiKey=" + network_1.config.ethplorerApiKey + "&token=" + symbolAddress + "&type=transfer&limit=" + size + "&timestamp=" + (timestamp / 1000 - 1);
            console.log("[eth http req] get token history by address: " + url);
            lib_common_util_js_1.HttpClient.get(url)
                .then(function (res) {
                var transfers = {};
                var _a = res.data.operations, txs = _a === void 0 ? [] : _a;
                txs.forEach(function (t) {
                    var tx = {};
                    tx.hash = t.transactionHash;
                    tx.timestamp = t.timeStamp * 1000;
                    tx.from = t.from;
                    tx.to = t.to;
                    tx.value = bignumber_js_1.default(t.value, 10).shiftedBy(-parseInt(t.tokenInfo.decimals)).toNumber();
                    tx.status = 'CONFIRMED';
                    transfers[tx.hash] = tx;
                });
                resolve(transfers);
            })
                .catch(function (err) {
                console.log('[http resp] err: ', err);
                reject(err);
            });
        }
    });
};
exports.fetchAccountTokenTransferHistory = fetchAccountTokenTransferHistory;
var fetchAccountTokens = function () { return Promise.resolve({}); };
exports.fetchAccountTokens = fetchAccountTokens;
function getTopTokens(topN, network) {
    if (topN === void 0) { topN = 20; }
    return new Promise(function (resolve, reject) {
        var url = network_1.remote[network] + "/token/eth/popular";
        console.log("get top eth tokens: " + url);
        lib_common_util_js_1.HttpClient.get(url, false)
            .then(function (res) {
            resolve(res.data);
        })
            .catch(function (err) {
            console.log('get keystore top tokens error:', err);
            reject(err);
        });
    });
}
exports.getTopTokens = getTopTokens;
function searchTokens(keyword, network) {
    return new Promise(function (resolve, reject) {
        var url = network_1.remote[network] + "/token/eth/search?offset=0&size=20&keyword=" + keyword;
        console.log("search eth token: " + url);
        lib_common_util_js_1.HttpClient.get(url, false)
            .then(function (res) {
            resolve(res.data);
        })
            .catch(function (err) {
            console.log('search keystore token error:', err);
            reject(err);
        });
    });
}
exports.searchTokens = searchTokens;
function getTokenIconUrl(tokenSymbol, contractAddress, network) {
    return network_1.remote[network] + "/token/eth/img?contractAddress=" + contractAddress;
}
exports.getTokenIconUrl = getTokenIconUrl;
//# sourceMappingURL=token.js.map