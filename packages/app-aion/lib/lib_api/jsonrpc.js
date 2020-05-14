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
const makkii_utils_1 = require("@makkii/makkii-utils");
exports.processRequest = (methodName, params) => {
    const requestData = {
        method: methodName,
        params,
        id: 42,
        jsonrpc: "2.0"
    };
    return JSON.stringify(requestData);
};
exports.default = config => {
    const checkBlockTag = blockTag => {
        if (blockTag == null) {
            return "latest";
        }
        if (blockTag === "earliest") {
            return "0x0";
        }
        if (blockTag === "latest" || blockTag === "pending") {
            return blockTag;
        }
        if (typeof blockTag === "number") {
            return `0x${new bignumber_js_1.default(blockTag).toString(16)}`;
        }
        throw new Error("invalid blockTag");
    };
    const getBlockByNumber = (blockNumber, fullTxs = false) => __awaiter(void 0, void 0, void 0, function* () {
        const requestData = exports.processRequest("eth_getBlockByNumber", [
            blockNumber,
            fullTxs
        ]);
        console.log("[AION req] get block by number req:", requestData);
        const res = yield makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get block by number resp:", res.data);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.result;
    });
    const blockNumber = () => __awaiter(void 0, void 0, void 0, function* () {
        const requestData = exports.processRequest("eth_blockNumber", []);
        console.log("[AION req] get blockNumber:", requestData);
        const res = yield makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get blockNUmber:", res.data);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.result;
    });
    const getBalance = (address) => __awaiter(void 0, void 0, void 0, function* () {
        const params = [address.toLowerCase(), "latest"];
        const requestData = exports.processRequest("eth_getBalance", params);
        console.log("[AION req] get balance:", requestData);
        const res = yield makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get balance:", res.data);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return new bignumber_js_1.default(res.data.result).shiftedBy(-18);
    });
    const getTransactionCount = (address, blockTag) => __awaiter(void 0, void 0, void 0, function* () {
        const params = [address.toLowerCase(), checkBlockTag(blockTag)];
        const requestData = exports.processRequest("eth_getTransactionCount", params);
        console.log("[AION req] get nonce:", requestData);
        const res = yield makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get nonce", res.data);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.result;
    });
    const sendSignedTransaction = (signedTx) => __awaiter(void 0, void 0, void 0, function* () {
        const params = [signedTx];
        const requestData = exports.processRequest("eth_sendRawTransaction", params);
        console.log("[AION req] broadcast:", requestData);
        const res = yield makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] broadcast:", res.data);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.result;
    });
    const getTransactionReceipt = (hash) => __awaiter(void 0, void 0, void 0, function* () {
        const params = [hash];
        const requestData = exports.processRequest("eth_getTransactionReceipt", params);
        console.log("[AION req] get transaction receipt:", requestData);
        const res = yield makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get transaction receipt", res.data);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.result;
    });
    return {
        blockNumber,
        getBalance,
        getBlockByNumber,
        getTransactionCount,
        getTransactionReceipt,
        sendSignedTransaction,
        processRequest: exports.processRequest
    };
};
//# sourceMappingURL=jsonrpc.js.map