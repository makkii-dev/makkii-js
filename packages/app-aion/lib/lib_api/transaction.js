"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const aion_web3_eth_contract_1 = require("aion-web3-eth-contract");
const lib_common_util_js_1 = require("lib-common-util-js");
const constants_1 = require("./constants");
const jsonrpc_1 = require("./jsonrpc");
const lib_keystore_1 = require("../lib_keystore");
exports.default = (config) => {
    const { getTransactionReceipt, getTransactionCount, sendSignedTransaction } = jsonrpc_1.default(config);
    function sendNativeTx(account, to, value_, gasPrice, gasLimit, data, shouldBroadCast) {
        const { type, derivationIndex, private_key: privateKey } = account;
        return new Promise((resolve, reject) => {
            const value = bignumber_js_1.default.isBigNumber(value_) ? value_ : new bignumber_js_1.default(value_);
            getTransactionCount(account.address, 'pending')
                .then((count) => {
                let extra_param = { type };
                if (type === '[ledger]') {
                    extra_param = Object.assign(Object.assign({}, extra_param), { derivationIndex, sender: account.address });
                }
                let tx = {
                    nonce: count,
                    to,
                    amount: value.shiftedBy(18),
                    timestamp: new Date().getTime() * 1000,
                    type: 1,
                    gasPrice,
                    gas: gasLimit,
                    extra_param,
                    private_key: privateKey,
                };
                if (data !== undefined) {
                    tx = Object.assign(Object.assign({}, tx), { data });
                }
                lib_keystore_1.default.signTransaction(tx)
                    .then(({ encoded }) => {
                    if (shouldBroadCast) {
                        sendSignedTransaction(`0x${encoded}`)
                            .then((hash) => {
                            const pendingTx = {
                                hash,
                                timestamp: tx.timestamp / 1000,
                                from: account.address,
                                to,
                                value,
                                status: 'PENDING',
                                gasPrice,
                            };
                            resolve({ pendingTx });
                        })
                            .catch((err) => {
                            console.log('keystore send signed tx error:', err);
                            reject(err);
                        });
                    }
                    else {
                        const txObj = {
                            timestamp: tx.timestamp / 1000,
                            from: account.address,
                            to,
                            value,
                            gasPrice,
                        };
                        resolve({ encoded, txObj });
                    }
                })
                    .catch((err) => {
                    console.log('keystore sign tx error:', err);
                    reject(err);
                });
            })
                .catch((err) => {
                console.log('keystore get transaction count error: ', err);
                reject(err);
            });
        });
    }
    function sendTokenTx(account, symbol, to, value, gasPrice, gasLimit, shouldBroadCast) {
        const { tokens } = account;
        const { contractAddr, tokenDecimal } = tokens[symbol];
        console.log('tokenDecimal=>', tokenDecimal);
        const tokenContract = new aion_web3_eth_contract_1.default(constants_1.CONTRACT_ABI, contractAddr);
        const methodsData = tokenContract.methods
            .send(to, value
            .shiftedBy(tokenDecimal - 0)
            .toFixed(0)
            .toString(), '')
            .encodeABI();
        return new Promise((resolve, reject) => {
            sendNativeTx(account, contractAddr, new bignumber_js_1.default(0), gasPrice, gasLimit, methodsData, shouldBroadCast)
                .then((res) => {
                if (shouldBroadCast) {
                    const { pendingTx } = res;
                    pendingTx.tknTo = to;
                    pendingTx.tknValue = value;
                    resolve({ pendingTx });
                }
                else {
                    resolve(res);
                }
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    function sendTransaction(account, symbol, to, value, data, extraParams, shouldBroadCast = true) {
        const { gasPrice, gasLimit } = extraParams;
        if (account.symbol === symbol) {
            return sendNativeTx(account, to, value, gasPrice, gasLimit, data, shouldBroadCast);
        }
        return sendTokenTx(account, symbol, to, value, gasPrice, gasLimit, shouldBroadCast);
    }
    function getTransactionsByAddress(address, page = 0, size = 25) {
        const url = `${config.explorer_api}/aion/dashboard/getTransactionsByAddress?accountAddress=${address.toLowerCase()}&page=${page}&size=${size}`;
        console.log(`[aion req] get aion transactions by address: ${url}`);
        return new Promise((resolve, reject) => {
            lib_common_util_js_1.HttpClient.get(url, false)
                .then((res) => {
                console.log('[keystore resp] res:', res.data);
                const { content } = res.data;
                const txs = {};
                content.forEach((t) => {
                    const tx = {};
                    const timestamp_ = `${t.transactionTimestamp}`;
                    tx.hash = `0x${t.transactionHash}`;
                    tx.timestamp = timestamp_.length === 16
                        ? parseInt(timestamp_) / 1000
                        : timestamp_.length === 13
                            ? parseInt(timestamp_) * 1
                            : timestamp_.length === 10
                                ? parseInt(timestamp_) * 1000
                                : null;
                    tx.from = `0x${t.fromAddr}`;
                    tx.to = `0x${t.toAddr}`;
                    tx.value = new bignumber_js_1.default(t.value, 10).toNumber();
                    tx.status = t.txError === '' ? 'CONFIRMED' : 'FAILED';
                    tx.blockNumber = t.blockNumber;
                    tx.fee = t.nrgConsumed * t.nrgPrice * Math.pow(10, -18);
                    txs[tx.hash] = tx;
                });
                resolve(txs);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    function getTransactionUrlInExplorer(txHash) {
        return `${config.explorer}/${txHash}`;
    }
    function getTransactionStatus(txHash) {
        return new Promise((resolve, reject) => {
            getTransactionReceipt(txHash)
                .then((receipt) => {
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
                .catch((err) => {
                reject(err);
            });
        });
    }
    export { sendTransaction, getTransactionsByAddress, getTransactionUrlInExplorer, getTransactionStatus, };
};
//# sourceMappingURL=transaction.js.map