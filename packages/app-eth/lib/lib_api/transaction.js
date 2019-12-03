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
const jsonrpc_1 = require("./jsonrpc");
const constants_1 = require("./constants");
const Contract = require('web3-eth-contract');
exports.default = config => {
    const { sendSignedTransaction, getTransactionCount, getTransactionReceipt } = jsonrpc_1.default(config);
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
                const tokenContract = new Contract(constants_1.ERC20ABI, contractAddr);
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
                data,
                tknTo: isTransfer ? to : '',
                tknValue: isTransfer ? new bignumber_js_1.default(value) : new bignumber_js_1.default(0),
                network: config.network
            };
        });
    }
    function getTransactionsByAddress(address, page, size, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { explorer_api } = config;
            if (explorer_api.provider === "etherscan") {
                const url = `${explorer_api.url}?module=account&action=txlist&address=${address}&page=${page}&offset=${size}&sort=asc&apikey=${config.etherscanApikey}`;
                console.log(`[eth getTransactionsByAddress req] : ${url}`);
                const res = yield lib_common_util_js_1.HttpClient.get(url, false);
                console.log('[eth getTransactionsByAddress req]', res.data);
                const { result } = res.data;
                const txs = {};
                result.forEach(t => {
                    const tx = {};
                    tx.hash = t.hash;
                    tx.timestamp = parseInt(t.timeStamp) * 1000;
                    tx.from = t.from;
                    tx.to = t.to;
                    tx.value = new bignumber_js_1.default(t.value, 10).shiftedBy(-18).toNumber();
                    tx.status = t.isError === '0' ? 'CONFIRMED' : 'FAILED';
                    tx.blockNumber = parseInt(t.blockNumber);
                    tx.fee = t.gasPrice * t.gasUsed * Math.pow(10, -18);
                    txs[tx.hash] = tx;
                });
                return txs;
            }
            const url = `${explorer_api.url}/getAddressTransactions/${address}?apiKey=${config.ethplorerApiKey}&limit=${size}&timestamp=${timestamp / 1000 - 1}&showZeroValues=true`;
            console.log(`[eth getTransactionsByAddress req] : ${url}`);
            const res = yield lib_common_util_js_1.HttpClient.get(url, false);
            console.log('[eth getTransactionsByAddress req]', res.data);
            if (res.data.error) {
                throw res.data.error;
            }
            else {
                const txs = {};
                res.data.forEach(t => {
                    const tx = {};
                    tx.hash = t.hash;
                    tx.timestamp = t.timestamp * 1000;
                    tx.from = t.from;
                    tx.to = t.to;
                    tx.value = new bignumber_js_1.default(t.value);
                    tx.status = t.success ? "CONFIRMED" : 'FAILED';
                    txs[tx.hash] = tx;
                });
                return txs;
            }
        });
    }
    function getTransactionUrlInExplorer(txHash) {
        const { explorer } = config;
        if (explorer.provider === "etherscan") {
            return `${explorer.url}/${txHash}`;
        }
        return `${explorer.url}/${txHash}`;
    }
    function getTransactionStatus(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receipt = yield getTransactionReceipt(txHash);
                return {
                    status: parseInt(receipt.status, 16) === 1,
                    blockNumber: parseInt(receipt.blockNumber, 16),
                    gasUsed: parseInt(receipt.gasUsed, 16),
                };
            }
            catch (e) {
                return null;
            }
        });
    }
    return {
        sendTransaction,
        buildTransaction,
        getTransactionsByAddress,
        getTransactionUrlInExplorer,
        getTransactionStatus
    };
};
//# sourceMappingURL=transaction.js.map