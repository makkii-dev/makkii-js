"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var web3_eth_contract_1 = require("web3-eth-contract");
var lib_common_util_js_1 = require("lib-common-util-js");
var keystore_1 = require("../keystore");
var jsonrpc_1 = require("./jsonrpc");
var constants_1 = require("./constants");
var network_1 = require("../network");
function sendNativeTx(account, to, value, gasPrice, gasLimit, data, network, shouldBroadCast) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        value = bignumber_js_1.default.isBigNumber(value) ? value : bignumber_js_1.default(value);
        jsonrpc_1.getTransactionCount(account.address, 'latest', network)
            .then(function (count) {
            var type = account.type, derivationIndex = account.derivationIndex;
            var extra_param = { type: type };
            if (type === '[ledger]') {
                extra_param = __assign(__assign({}, extra_param), { derivationIndex: derivationIndex, sender: account.address });
            }
            var tx = {
                network: network,
                amount: value.shiftedBy(18).toNumber(),
                nonce: count,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                to: to,
                private_key: account.private_key,
                extra_param: extra_param,
            };
            if (data !== undefined) {
                tx = __assign(__assign({}, tx), { data: data });
            }
            keystore_1.default.signTransaction(tx)
                .then(function (res) {
                var encoded = res.encoded;
                console.log('encoded keystore tx => ', encoded);
                if (shouldBroadCast) {
                    jsonrpc_1.sendSignedTransaction(encoded, network)
                        .then(function (hash) {
                        var pendingTx = {
                            hash: hash,
                            from: account.address,
                            to: to,
                            value: value,
                            status: 'PENDING',
                            gasPrice: gasPrice
                        };
                        resolve({ pendingTx: pendingTx });
                    })
                        .catch(function (e) {
                        console.log('send signed tx:', e);
                        reject(e);
                    });
                }
                else {
                    var txObj = {
                        from: account.address,
                        to: to,
                        value: value,
                        gasPrice: gasPrice
                    };
                    resolve({ encoded: encoded, txObj: txObj });
                }
            })
                .catch(function (e) {
                console.log('sign error:', e);
                reject(e);
            });
        })
            .catch(function (err) {
            console.log('get tx count error:', err);
            reject(err);
        });
    });
}
function sendTokenTx(account, symbol, to, value, gasPrice, gasLimit, network, shouldBroadCast) {
    if (network === void 0) { network = 'mainnet'; }
    var tokens = account.tokens;
    var _a = tokens[symbol], contractAddr = _a.contractAddr, tokenDecimal = _a.tokenDecimal;
    var tokenContract = new web3_eth_contract_1.default(constants_1.ERC20ABI, contractAddr);
    var methodsData = tokenContract.methods
        .transfer(to, value
        .shiftedBy(tokenDecimal - 0)
        .toFixed(0)
        .toString())
        .encodeABI();
    return new Promise(function (resolve, reject) {
        sendNativeTx(account, contractAddr, bignumber_js_1.default(0), gasPrice, gasLimit, methodsData, network, shouldBroadCast)
            .then(function (res) {
            if (shouldBroadCast) {
                var pendingTx = res.pendingTx;
                pendingTx.tknTo = to;
                pendingTx.tknValue = value;
                resolve({ pendingTx: pendingTx });
            }
            else {
                resolve(res);
            }
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
function sendTransaction(account, symbol, to, value, extraParams, data, network, shouldBroadCast) {
    if (network === void 0) { network = 'mainnet'; }
    if (shouldBroadCast === void 0) { shouldBroadCast = true; }
    var gasPrice = extraParams.gasPrice;
    var gasLimit = extraParams.gasLimit;
    if (account.symbol === symbol) {
        return sendNativeTx(account, to, value, gasPrice, gasLimit, data, network, shouldBroadCast);
    }
    return sendTokenTx(account, symbol, to, value, gasPrice, gasLimit, network, shouldBroadCast);
}
exports.sendTransaction = sendTransaction;
function getTransactionsByAddress(address, page, size, timestamp, network) {
    if (network === void 0) { network = 'mainnet'; }
    var explorer_api = network_1.config.networks[network].explorer_api;
    if (explorer_api.provider === "etherscan") {
        var url_1 = explorer_api.url + "?module=account&action=txlist&address=" + address + "&page=" + page + "&offset=" + size + "&sort=asc&apikey=" + network_1.config.etherscanApikey;
        console.log("[eth http req] get transactions by address: " + url_1);
        return new Promise(function (resolve, reject) {
            lib_common_util_js_1.HttpClient.get(url_1, false).then(function (res) {
                console.log('[http resp]', res.data);
                var result = res.data.result;
                var txs = {};
                result.forEach(function (t) {
                    var tx = {};
                    tx.hash = t.hash;
                    tx.timestamp = parseInt(t.timeStamp) * 1000;
                    tx.from = t.from;
                    tx.to = t.to;
                    tx.value = bignumber_js_1.default(t.value, 10).shiftedBy(-18).toNumber();
                    tx.status = t.isError === '0' ? 'CONFIRMED' : 'FAILED';
                    tx.blockNumber = parseInt(t.blockNumber);
                    tx.fee = t.gasPrice * t.gasUsed * Math.pow(10, -18);
                    txs[tx.hash] = tx;
                });
                resolve(txs);
            }, function (err) {
                console.log('[http resp] err: ', err);
                reject(err);
            });
        });
    }
    var url = explorer_api.url + "/getAddressTransactions/" + address + "?apiKey=" + network_1.config.ethplorerApiKey + "&limit=" + size + "&timestamp=" + (timestamp / 1000 - 1) + "&showZeroValues=true";
    console.log("[eth http req] get transactions by address: " + url);
    return new Promise(function (resolve, reject) {
        lib_common_util_js_1.HttpClient.get(url, false).then(function (res) {
            console.log('[http resp]', res.data);
            if (res.data.error) {
                reject(res.data.error);
            }
            else {
                var txs_1 = {};
                res.data.forEach(function (t) {
                    var tx = {};
                    tx.hash = t.hash;
                    tx.timestamp = t.timestamp * 1000;
                    tx.from = t.from;
                    tx.to = t.to;
                    tx.value = bignumber_js_1.default(t.value);
                    tx.status = t.success ? "CONFIRMED" : 'FAILED';
                    txs_1[tx.hash] = tx;
                });
                resolve(txs_1);
            }
        }, function (err) {
            console.log('[http resp] err: ', err);
            reject(err);
        });
    });
}
exports.getTransactionsByAddress = getTransactionsByAddress;
function getTransactionUrlInExplorer(txHash, network) {
    if (network === void 0) { network = 'mainnet'; }
    var explorer = network_1.config.networks[network].explorer;
    if (explorer.provider === "etherscan") {
        return explorer.url + "/" + txHash;
    }
    return explorer.url + "/" + txHash;
}
exports.getTransactionUrlInExplorer = getTransactionUrlInExplorer;
function getTransactionStatus(txHash, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        jsonrpc_1.getTransactionReceipt(txHash, network)
            .then(function (receipt) {
            if (receipt !== null) {
                resolve({
                    status: parseInt(receipt.status, 16) === 1,
                    blockNumber: parseInt(receipt.blockNumber, 16),
                    gasUsed: parseInt(receipt.gasUsed, 16),
                });
            }
            else {
                resolve(null);
            }
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.getTransactionStatus = getTransactionStatus;
//# sourceMappingURL=transaction.js.map