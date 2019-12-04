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
const Contract = require("aion-web3-eth-contract");
const AbiCoder = require("aion-web3-eth-abi");
exports.default = config => {
    function getAccountTokens(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${config.explorer_api}/aion/dashboard/getAccountDetails?accountAddress=${address.toLowerCase()}`;
            const { data } = yield lib_common_util_js_1.HttpClient.get(url);
            const res = {};
            if (data.content.length > 0) {
                const { tokens } = data.content[0];
                tokens.forEach(token => {
                    res[token.symbol] = {
                        symbol: token.symbol,
                        contractAddr: token.contractAddr,
                        name: token.name,
                        tokenDecimal: token.tokenDecimal
                    };
                });
            }
            return res;
        });
    }
    const getAccountTokenBalance = (contractAddress, address) => __awaiter(void 0, void 0, void 0, function* () {
        const contract = new Contract(constants_1.CONTRACT_ABI);
        const requestData = jsonrpc_1.processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract.methods.balanceOf(address).encodeABI()
            },
            "latest"
        ]);
        console.log("[AION get token balance req]:", config.jsonrpc);
        const res = yield lib_common_util_js_1.HttpClient.post(config.jsonrpc, requestData, true);
        if (res.data.result) {
            return new bignumber_js_1.default(AbiCoder.decodeParameter("uint128", res.data.result));
        }
        throw new Error(`get account Balance failed:${res.data.error}`);
    });
    const getTokenDetail = (contractAddress) => __awaiter(void 0, void 0, void 0, function* () {
        const contract = new Contract(constants_1.CONTRACT_ABI);
        const requestGetSymbol = jsonrpc_1.processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract.methods.symbol().encodeABI()
            },
            "latest"
        ]);
        const requestGetName = jsonrpc_1.processRequest("eth_call", [
            { to: contractAddress, data: contract.methods.name().encodeABI() },
            "latest"
        ]);
        const requestGetDecimals = jsonrpc_1.processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract.methods.decimals().encodeABI()
            },
            "latest"
        ]);
        const url = config.jsonrpc;
        const promiseSymbol = lib_common_util_js_1.HttpClient.post(url, requestGetSymbol, true);
        const promiseName = lib_common_util_js_1.HttpClient.post(url, requestGetName, true);
        const promiseDecimals = lib_common_util_js_1.HttpClient.post(url, requestGetDecimals, true);
        console.log("[AION get token detail req]:", config.jsonrpc);
        const [symbolRet, nameRet, decimalsRet] = yield Promise.all([
            promiseSymbol,
            promiseName,
            promiseDecimals
        ]);
        if (symbolRet.data.result &&
            nameRet.data.result &&
            decimalsRet.data.result) {
            console.log("[get token symobl resp]=>", symbolRet.data);
            console.log("[get token name resp]=>", nameRet.data);
            console.log("[get token decimals resp]=>", decimalsRet.data);
            let symbol;
            let name;
            try {
                symbol = AbiCoder.decodeParameter("string", symbolRet.data.result);
            }
            catch (e) {
                symbol = lib_common_util_js_1.hexutil.hexToAscii(symbolRet.data.result);
                symbol = symbol.slice(0, symbol.indexOf("\u0000"));
            }
            try {
                name = AbiCoder.decodeParameter("string", nameRet.data.result);
            }
            catch (e) {
                name = lib_common_util_js_1.hexutil.hexToAscii(nameRet.data.result);
                name = name.slice(0, name.indexOf("\u0000"));
            }
            const decimals = AbiCoder.decodeParameter("uint8", decimalsRet.data.result);
            return {
                contractAddr: contractAddress,
                symbol,
                name,
                tokenDecimal: decimals
            };
        }
        throw new Error("get token detail failed");
    });
    function getAccountTokenTransferHistory(address, symbolAddress, page = 0, size = 25) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${config.explorer_api}/aion/dashboard/getTransactionsByAddress?accountAddress=${address.toLowerCase()}&tokenAddress=${symbolAddress.toLowerCase()}&page=${page}&size=${size}`;
            console.log(`get account token transactions: ${url}`);
            const res = yield lib_common_util_js_1.HttpClient.get(url);
            const { content = [] } = res.data;
            const txs = {};
            content.forEach(t => {
                const tx = {
                    hash: `0x${t.transactionHash}`,
                    timestamp: t.transferTimestamp * 1000,
                    from: `0x${t.fromAddr}`,
                    to: `0x${t.toAddr}`,
                    value: new bignumber_js_1.default(t.tknValue, 10).toNumber(),
                    status: "CONFIRMED",
                    blockNumber: t.blockNumber
                };
                txs[tx.hash] = tx;
            });
            return txs;
        });
    }
    const getTopTokens = (topN = 20) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `${config.remote_api}/token/aion?offset=0&size=${topN}`;
        console.log(`get top aion tokens: ${url}`);
        const res = yield lib_common_util_js_1.HttpClient.get(url, false);
        return res.data;
    });
    const searchTokens = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `${config.remote_api}/token/aion/search?keyword=${keyword}`;
        console.log(`search aion token: ${url}`);
        const res = yield lib_common_util_js_1.HttpClient.get(url, false);
        return res.data;
    });
    return {
        getAccountTokens,
        getAccountTokenBalance,
        getAccountTokenTransferHistory,
        getTokenDetail,
        getTopTokens,
        searchTokens
    };
};
//# sourceMappingURL=token.js.map