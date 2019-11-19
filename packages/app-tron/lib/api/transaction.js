"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_common_util_js_1 = require("lib-common-util-js");
var bignumber_js_1 = require("bignumber.js");
var keystore_1 = require("../keystore");
var jsonrpc_1 = require("./jsonrpc");
var utils_1 = require("../utils");
var network_1 = require("../network");
function sendTransaction(account, symbol, to, value, network, shouldBroadCast) {
    if (network === void 0) { network = 'mainnet'; }
    if (shouldBroadCast === void 0) { shouldBroadCast = true; }
    return new Promise(function (resolve, reject) {
        value = bignumber_js_1.default.isBigNumber(value) ? value : bignumber_js_1.default(value);
        jsonrpc_1.getLatestBlock(network)
            .then(function (block) {
            console.log('get latest block =>', block);
            var latest_block = {
                hash: block.blockID,
                number: block.block_header.raw_data.number,
            };
            var now = new Date().getTime();
            var expire = now + 10 * 60 * 60 * 1000;
            var tx = {
                timestamp: now,
                expiration: expire,
                to_address: to,
                amount: value.shiftedBy(6).toNumber(),
                owner_address: account.address,
                private_key: account.private_key,
                latest_block: latest_block,
            };
            keystore_1.default.signTransaction(tx)
                .then(function (signRes) {
                console.log('sign result =>', signRes);
                var signedTx = {
                    signature: signRes.signature,
                    txID: signRes.txID,
                    raw_data: {
                        contract: [
                            {
                                parameter: {
                                    value: {
                                        amount: tx.amount,
                                        owner_address: utils_1.base58check2HexString(tx.owner_address),
                                        to_address: utils_1.base58check2HexString(tx.to_address),
                                    },
                                    type_url: 'type.googleapis.com/protocol.TransferContract',
                                },
                                type: 'TransferContract',
                            },
                        ],
                        ref_block_bytes: signRes.ref_block_bytes,
                        ref_block_hash: signRes.ref_block_hash,
                        expiration: tx.expiration,
                        timestamp: tx.timestamp,
                    },
                };
                if (shouldBroadCast) {
                    jsonrpc_1.broadcastTransaction(signedTx, network)
                        .then(function (broadcastRes) {
                        if (broadcastRes.result) {
                            var pendingTx = {
                                hash: "" + signedTx.txID,
                                timestamp: now,
                                from: account.address,
                                to: to,
                                value: value,
                                status: 'PENDING',
                            };
                            resolve({ pendingTx: pendingTx, pendingTokenTx: undefined });
                        }
                        else {
                            reject(new Error("" + broadcastRes));
                        }
                    })
                        .catch(function (err) {
                        console.log('keystore broadcast tx failed', err);
                        reject(err);
                    });
                }
                else {
                    var txObj = {
                        timestamp: now,
                        from: account.address,
                        to: to,
                        value: value,
                    };
                    resolve({ encoded: signedTx, txObj: txObj });
                }
            })
                .catch(function (err) {
                console.log('keystore sign tx failed', err);
                reject(err);
            });
        })
            .catch(function (err) {
            console.log('keystore get latest block failed.', err);
            reject(err);
        });
    });
}
exports.sendTransaction = sendTransaction;
function getTransactionStatus(txHash, network) {
    if (network === void 0) { network = 'mainnet'; }
    return new Promise(function (resolve, reject) {
        jsonrpc_1.getTransactionInfoById(txHash, network)
            .then(function (res) {
            var blockNumber = res.blockNumber;
            jsonrpc_1.getTransactionById(txHash, network)
                .then(function (tx) {
                if (tx.ret !== undefined &&
                    tx.ret instanceof Array &&
                    tx.ret.length > 0 &&
                    tx.ret[0].contractRet !== undefined) {
                    resolve({
                        blockNumber: blockNumber,
                        status: tx.ret[0].contractRet === 'SUCCESS',
                    });
                    return;
                }
                resolve(undefined);
            })
                .catch(function (err) {
                reject(err);
            });
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.getTransactionStatus = getTransactionStatus;
function getTransactionsByAddress(address, page, size, timestamp, network) {
    if (page === void 0) { page = 0; }
    if (size === void 0) { size = 25; }
    if (timestamp === void 0) { timestamp = undefined; }
    if (network === void 0) { network = 'mainnet'; }
    var url = network_1.config.networks[network].explorer_api + "/transfer?sort=-timestamp&limit=" + size + "&start=" + page * size + "&address=" + address;
    console.log("[tron req] get tron txs by address: " + url);
    return new Promise(function (resolve, reject) {
        lib_common_util_js_1.HttpClient.get(url, false)
            .then(function (res) {
            var data = res.data.data;
            var txs = {};
            data.forEach(function (t) {
                if (t.tokenName === '_') {
                    var tx = {};
                    tx.hash = "" + t.transactionHash;
                    tx.timestamp = t.timestamp;
                    tx.from = t.transferFromAddress;
                    tx.to = t.transferToAddress;
                    tx.value = new bignumber_js_1.default(t.amount, 10).shiftedBy(-6).toNumber();
                    tx.blockNumber = t.block;
                    tx.status = t.confirmed ? 'CONFIRMED' : 'FAILED';
                    txs[tx.hash] = tx;
                }
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
    txHash = txHash.startsWith('0x') ? txHash.slice(2) : txHash;
    return network_1.config.networks[network].explorer + "/" + txHash;
}
exports.getTransactionUrlInExplorer = getTransactionUrlInExplorer;
//# sourceMappingURL=transaction.js.map