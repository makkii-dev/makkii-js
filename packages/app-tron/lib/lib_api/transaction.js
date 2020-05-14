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
const makkii_utils_1 = require("@makkii/makkii-utils");
const bignumber_js_1 = require("bignumber.js");
const jsonrpc_1 = require("./jsonrpc");
exports.default = config => {
    const { getTransactionById, getTransactionInfoById, getLatestBlock, broadcastTransaction } = jsonrpc_1.default(config);
    function sendTransaction(unsignedTx, signer, signerParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const signedTx = yield signer.signTransaction(unsignedTx, signerParams);
            const broadcastRes = yield broadcastTransaction(signedTx);
            if (broadcastRes.result) {
                return {
                    hash: `${signedTx.txID}`,
                    timestamp: unsignedTx.timestamp,
                    from: unsignedTx.owner,
                    to: unsignedTx.to,
                    value: unsignedTx.amount,
                    status: "PENDING"
                };
            }
            throw new Error("broadcast tx failed");
        });
    }
    function buildTransaction(from, to, value) {
        return __awaiter(this, void 0, void 0, function* () {
            value = bignumber_js_1.default.isBigNumber(value) ? value : new bignumber_js_1.default(value);
            const block = yield getLatestBlock();
            const latest_block = {
                hash: block.blockID,
                number: block.block_header.raw_data.number
            };
            const now = new Date().getTime();
            const expire = now + 10 * 60 * 60 * 1000;
            const tx = {
                to,
                owner: from,
                amount: value.toNumber(),
                timestamp: now,
                expiration: expire,
                latest_block
            };
            return tx;
        });
    }
    function getTransactionStatus(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield getTransactionInfoById(txHash);
                const { blockNumber } = res;
                const tx = yield getTransactionById(txHash);
                if (tx.ret !== undefined &&
                    tx.ret instanceof Array &&
                    tx.ret.length > 0 &&
                    tx.ret[0].contractRet !== undefined) {
                    return {
                        blockNumber,
                        status: tx.ret[0].contractRet === "SUCCESS"
                    };
                }
                return null;
            }
            catch (e) {
                return null;
            }
        });
    }
    function getTransactionsByAddress(address, page = 0, size = 25) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${config.explorer_api}/transfer?sort=-timestamp&limit=${size}&start=${page *
                size}&address=${address}`;
            console.log(`[TRON req] getTransactionsByAddress: ${url}`);
            const res = yield makkii_utils_1.HttpClient.get(url, false);
            console.log(`[TRON resp] getTransactionsByAddress:`, res.data);
            const { data } = res.data;
            const txs = {};
            data.forEach(t => {
                if (t.tokenName === "_") {
                    const tx = {};
                    tx.hash = `${t.transactionHash}`;
                    tx.timestamp = t.timestamp;
                    tx.from = t.transferFromAddress;
                    tx.to = t.transferToAddress;
                    tx.value = new bignumber_js_1.default(t.amount, 10).shiftedBy(-6).toNumber();
                    tx.blockNumber = t.block;
                    tx.status = t.confirmed ? "CONFIRMED" : "FAILED";
                    txs[tx.hash] = tx;
                }
            });
            return txs;
        });
    }
    function getTransactionUrlInExplorer(txHash) {
        txHash = txHash.startsWith("0x") ? txHash.slice(2) : txHash;
        return `${config.explorer}/${txHash}`;
    }
    return {
        sendTransaction,
        getTransactionStatus,
        getTransactionUrlInExplorer,
        getTransactionsByAddress,
        buildTransaction
    };
};
//# sourceMappingURL=transaction.js.map