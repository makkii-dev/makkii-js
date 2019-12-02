"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const lib_common_util_js_1 = require("lib-common-util-js");
const constants_1 = require("./constants");
const jsonrpc_1 = require("./jsonrpc");
const Contract = require('aion-web3-eth-contract');
exports.default = (config) => {
    const { getTransactionReceipt, getTransactionCount, sendSignedTransaction } = jsonrpc_1.default(config);
    function sendTransaction(unsignedTx, signer, signerParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const signedTx = yield signer.signTransaction(unsignedTx, signerParams);
            const hash = yield sendSignedTransaction(signedTx);
            return {
                hash,
                status: 'PENDING',
                to: unsignedTx.to,
                from: unsignedTx.from,
                value: unsignedTx.value,
                tknTo: unsignedTx.tknTo,
                tknValue: unsignedTx.tknValue,
                timestamp: unsignedTx.timestamp,
                gasLimit: unsignedTx.gasLimit,
                gasPrice: unsignedTx.gasPrice
            };
        });
    }
    function buildTransaction(from, to, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: data_, gasLimit, gasPrice, contractAddr, isTransfer, tokenDecimal } = options;
            const nonce = yield getTransactionCount(from, 'pending');
            let data = data_;
            if (isTransfer) {
                const tokenContract = new Contract(constants_1.CONTRACT_ABI, contractAddr);
                data = tokenContract.methods
                    .send(to, value
                    .shiftedBy(tokenDecimal - 0)
                    .toFixed(0)
                    .toString(), '')
                    .encodeABI();
            }
            return {
                to: isTransfer ? contractAddr : to,
                from,
                nonce,
                value: isTransfer ? new bignumber_js_1.default(0) : new bignumber_js_1.default(value),
                gasPrice,
                gasLimit,
                timestamp: new Date().getTime() * 1000,
                data,
                type: 1,
                tknTo: isTransfer ? to : '',
                tknValue: isTransfer ? new bignumber_js_1.default(value) : new bignumber_js_1.default(0)
            };
        });
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
    return {
        sendTransaction,
        getTransactionsByAddress,
        getTransactionUrlInExplorer,
        getTransactionStatus,
        buildTransaction,
    };
};
//# sourceMappingURL=transaction.js.map