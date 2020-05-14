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
const jsonrpc_1 = require("./jsonrpc");
const contract_1 = require("./contract");
exports.default = config => {
    function getAccountTokens(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${config.explorer_api}/aion/dashboard/getAccountDetails?accountAddress=${address.toLowerCase()}`;
            const { data } = yield makkii_utils_1.HttpClient.get(url);
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
        const requestData = jsonrpc_1.processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract_1.aionfvmContract.balanceOf(address)
            },
            "latest"
        ]);
        console.log("[AION req] get token balance:", address);
        const res = yield makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true);
        console.log("[AION resp] get token balance", res.data);
        if (res.data.result) {
            return new bignumber_js_1.default(contract_1.AbiCoder.decode(res.data.result, ["uint128"])[0]);
        }
        throw new Error(`[AION error] get token failed:${res.data.error}`);
    });
    const getTokenDetail = (contractAddress) => __awaiter(void 0, void 0, void 0, function* () {
        const requestGetSymbol = jsonrpc_1.processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract_1.aionfvmContract.symbol()
            },
            "latest"
        ]);
        const requestGetName = jsonrpc_1.processRequest("eth_call", [
            { to: contractAddress, data: contract_1.aionfvmContract.name() },
            "latest"
        ]);
        const requestGetDecimals = jsonrpc_1.processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract_1.aionfvmContract.decimals()
            },
            "latest"
        ]);
        const url = config.jsonrpc;
        const promiseSymbol = makkii_utils_1.HttpClient.post(url, requestGetSymbol, true);
        const promiseName = makkii_utils_1.HttpClient.post(url, requestGetName, true);
        const promiseDecimals = makkii_utils_1.HttpClient.post(url, requestGetDecimals, true);
        console.log("[AION req] get token detail:", config.jsonrpc);
        const [symbolRet, nameRet, decimalsRet] = yield Promise.all([
            promiseSymbol,
            promiseName,
            promiseDecimals
        ]);
        if (symbolRet.data.result &&
            nameRet.data.result &&
            decimalsRet.data.result) {
            console.log("[AION resp] get token symobl:", symbolRet.data);
            console.log("[AION resp] get token name", nameRet.data);
            console.log("[AION resp] get token decimals", decimalsRet.data);
            let symbol;
            let name;
            try {
                symbol = contract_1.AbiCoder.decode(symbolRet.data.result, ["string"])[0];
            }
            catch (e) {
                symbol = makkii_utils_1.hexutil.hexToAscii(symbolRet.data.result);
                symbol = symbol.slice(0, symbol.indexOf("\u0000"));
            }
            try {
                name = contract_1.AbiCoder.decode(nameRet.data.result, ["string"])[0];
            }
            catch (e) {
                name = makkii_utils_1.hexutil.hexToAscii(nameRet.data.result);
                name = name.slice(0, name.indexOf("\u0000"));
            }
            const decimals = contract_1.AbiCoder.decode(decimalsRet.data.result, [
                "uint8"
            ])[0];
            return {
                contractAddr: contractAddress,
                symbol,
                name,
                tokenDecimal: decimals.toNumber()
            };
        }
        throw new Error("[AION error] get token detail failed");
    });
    function getAccountTokenTransferHistory(address, symbolAddress, page = 0, size = 25) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${config.explorer_api}/aion/dashboard/getTransactionsByAddress?accountAddress=${address.toLowerCase()}&tokenAddress=${symbolAddress.toLowerCase()}&page=${page}&size=${size}`;
            console.log(`[AION req] get account token transactions: ${url}`);
            const res = yield makkii_utils_1.HttpClient.get(url);
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
        console.log(`[AION req] get top aion tokens: ${url}`);
        const res = yield makkii_utils_1.HttpClient.get(url, false);
        console.log(`[AION resp] get top aion tokens:`, res.data);
        return res.data;
    });
    const searchTokens = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `${config.remote_api}/token/aion/search?keyword=${keyword}`;
        console.log(`[AION req] search aion token: ${url}`);
        const res = yield makkii_utils_1.HttpClient.get(url, false);
        console.log(`[AION resp] search aion token:`, res.data);
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