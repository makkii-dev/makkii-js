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
var aion_web3_eth_contract_1 = require("aion-web3-eth-contract");
var lib_common_util_js_1 = require("lib-common-util-js");
var constants_1 = require("./constants");
var jsonrpc_1 = require("./jsonrpc");
var keystore_1 = require("../keystore");
var network_1 = require("../network");
function sendNativeTx(account, to, value_, gasPrice, gasLimit, data, network, shouldBroadCast) {
    var type = account.type, derivationIndex = account.derivationIndex, privateKey = account.private_key;
    return new Promise(function (resolve, reject) {
        var value = bignumber_js_1.default.isBigNumber(value_) ? value_ : new bignumber_js_1.default(value_);
        jsonrpc_1.getTransactionCount(account.address, 'pending', network)
            .then(function (count) {
            var extra_param = { type: type };
            if (type === '[ledger]') {
                extra_param = __assign(__assign({}, extra_param), { derivationIndex: derivationIndex, sender: account.address });
            }
            var tx = {
                nonce: count,
                to: to,
                amount: value.shiftedBy(18),
                timestamp: new Date().getTime() * 1000,
                type: 1,
                gasPrice: gasPrice,
                gas: gasLimit,
                extra_param: extra_param,
                private_key: privateKey,
            };
            if (data !== undefined) {
                tx = __assign(__assign({}, tx), { data: data });
            }
            keystore_1.default.signTransaction(tx)
                .then(function (_a) {
                var encoded = _a.encoded;
                if (shouldBroadCast) {
                    jsonrpc_1.sendSignedTransaction("0x" + encoded, network)
                        .then(function (hash) {
                        var pendingTx = {
                            hash: hash,
                            timestamp: tx.timestamp / 1000,
                            from: account.address,
                            to: to,
                            value: value,
                            status: 'PENDING',
                            gasPrice: gasPrice,
                        };
                        resolve({ pendingTx: pendingTx });
                    })
                        .catch(function (err) {
                        console.log('keystore send signed tx error:', err);
                        reject(err);
                    });
                }
                else {
                    var txObj = {
                        timestamp: tx.timestamp / 1000,
                        from: account.address,
                        to: to,
                        value: value,
                        gasPrice: gasPrice,
                    };
                    resolve({ encoded: encoded, txObj: txObj });
                }
            })
                .catch(function (err) {
                console.log('keystore sign tx error:', err);
                reject(err);
            });
        })
            .catch(function (err) {
            console.log('keystore get transaction count error: ', err);
            reject(err);
        });
    });
}
function sendTokenTx(account, symbol, to, value, gasPrice, gasLimit, network, shouldBroadCast) {
    if (network === void 0) { network = 'mainnet'; }
    var tokens = account.tokens;
    var _a = tokens[symbol], contractAddr = _a.contractAddr, tokenDecimal = _a.tokenDecimal;
    console.log('tokenDecimal=>', tokenDecimal);
    var tokenContract = new aion_web3_eth_contract_1.default(constants_1.CONTRACT_ABI, contractAddr);
    var methodsData = tokenContract.methods
        .send(to, value
        .shiftedBy(tokenDecimal - 0)
        .toFixed(0)
        .toString(), '')
        .encodeABI();
    return new Promise(function (resolve, reject) {
        sendNativeTx(account, contractAddr, new bignumber_js_1.default(0), gasPrice, gasLimit, methodsData, network, shouldBroadCast)
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
function getTransactionsByAddress(address, page, size, network) {
    if (page === void 0) { page = 0; }
    if (size === void 0) { size = 25; }
    if (network === void 0) { network = 'mainnet'; }
    var url = network_1.config.networks[network].explorer_api + "/aion/dashboard/getTransactionsByAddress?accountAddress=" + address.toLowerCase() + "&page=" + page + "&size=" + size;
    console.log("[aion req] get aion transactions by address: " + url);
    return new Promise(function (resolve, reject) {
        lib_common_util_js_1.HttpClient.get(url, false)
            .then(function (res) {
            console.log('[keystore resp] res:', res.data);
            var content = res.data.content;
            var txs = {};
            content.forEach(function (t) {
                var tx = {};
                var timestamp_ = "" + t.transactionTimestamp;
                tx.hash = "0x" + t.transactionHash;
                tx.timestamp = timestamp_.length === 16
                    ? parseInt(timestamp_) / 1000
                    : timestamp_.length === 13
                        ? parseInt(timestamp_) * 1
                        : timestamp_.length === 10
                            ? parseInt(timestamp_) * 1000
                            : null;
                tx.from = "0x" + t.fromAddr;
                tx.to = "0x" + t.toAddr;
                tx.value = new bignumber_js_1.default(t.value, 10).toNumber();
                tx.status = t.txError === '' ? 'CONFIRMED' : 'FAILED';
                tx.blockNumber = t.blockNumber;
                tx.fee = t.nrgConsumed * t.nrgPrice * Math.pow(10, -18);
                txs[tx.hash] = tx;
            });
            resolve(txs);
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.getTransactionsByAddress = getTransactionsByAddress;
function getTransactionUrlInExplorer(txHash, network) {
    if (network === void 0) { network = 'mainnet'; }
    return network_1.config.networks[network].explorer + "/" + txHash;
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