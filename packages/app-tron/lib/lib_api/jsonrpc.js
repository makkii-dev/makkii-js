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
const utils_1 = require("../utils");
exports.default = config => {
    const getBalance = (address) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `${config.trongrid_api}/wallet/getaccount`;
        const hexAddress = utils_1.base58check2HexString(address);
        const body = {
            address: hexAddress
        };
        console.log(`[tron getBalance req] ${url}`);
        const res = yield lib_common_util_js_1.HttpClient.post(url, body, true, {
            "Content-Type": "application/json"
        });
        console.log("[tron getBalance resp] ", res.data);
        if (res.data.Error !== undefined) {
            throw new Error(res.data.Error);
        }
        else if (res.data.balance !== undefined) {
            return new bignumber_js_1.default(res.data.balance).shiftedBy(-6);
        }
        else {
            return new bignumber_js_1.default(0);
        }
    });
    const getLatestBlock = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = `${config.trongrid_api}/wallet/getnowblock`;
        console.log("[tron getLatestBlock req] ", url);
        const res = yield lib_common_util_js_1.HttpClient.post(url);
        return res.data;
    });
    const broadcastTransaction = (tx) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `${config.trongrid_api}/wallet/broadcasttransaction`;
        console.log(`[tron broadcastTransaction req] ${url}`);
        const res = yield lib_common_util_js_1.HttpClient.post(url, tx, true, {
            "Content-Type": "application/json"
        });
        console.log("[tron broadcastTransaction resp] ", res.data);
        return res.data;
    });
    const getTransactionById = (hash) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `${config.trongrid_api}/walletsolidity/gettransactionbyid`;
        console.log(`[tron getTransactionById req] ${url}`);
        const res = yield lib_common_util_js_1.HttpClient.post(url, {
            value: hash
        }, true, { "Content-Type": "application/json" });
        console.log("[tron getTransactionById resp]", res.data);
        return res.data;
    });
    const getTransactionInfoById = (hash) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `${config.trongrid_api}/walletsolidity/gettransactioninfobyid`;
        console.log(`[tron http req] ${url}`);
        const res = yield lib_common_util_js_1.HttpClient.post(url, {
            value: hash
        }, true, { "Content-Type": "application/json" });
        console.log("[tron http resp]", res.data);
        return res.data;
    });
    return {
        broadcastTransaction,
        getBalance,
        getLatestBlock,
        getTransactionById,
        getTransactionInfoById
    };
};
//# sourceMappingURL=jsonrpc.js.map