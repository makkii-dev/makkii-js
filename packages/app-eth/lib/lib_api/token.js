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
    const getAccountTokenBalance = (contractAddress, address) => new Promise((resolve, reject) => {
        const requestData = jsonrpc_1.processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract_1.ethContract.balanceOf(address)
            },
            "latest"
        ]);
        console.log("[ETH req]  get token balance:", address);
        makkii_utils_1.HttpClient.post(config.jsonrpc, requestData, true)
            .then(res => {
            console.log("[ETH resp] get token balance:", res.data);
            if (res.data.result) {
                resolve(new bignumber_js_1.default(contract_1.AbiCoder.decode(res.data.result, ["uint256"])[0]));
            }
            else {
                reject(new Error(`[ETH error] get account Balance failed:${res.data.error}`));
            }
        })
            .catch(e => {
            reject(new Error(`[ETH error] get account Balance failed:${e}`));
        });
    });
    const getTokenDetail = (contractAddress) => __awaiter(void 0, void 0, void 0, function* () {
        const requestGetSymbol = jsonrpc_1.processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract_1.ethContract.symbol()
            },
            "latest"
        ]);
        const requestGetName = jsonrpc_1.processRequest("eth_call", [
            { to: contractAddress, data: contract_1.ethContract.name() },
            "latest"
        ]);
        const requestGetDecimals = jsonrpc_1.processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract_1.ethContract.decimals()
            },
            "latest"
        ]);
        const url = config.jsonrpc;
        const promiseSymbol = makkii_utils_1.HttpClient.post(url, requestGetSymbol, true);
        const promiseName = makkii_utils_1.HttpClient.post(url, requestGetName, true);
        const promiseDecimals = makkii_utils_1.HttpClient.post(url, requestGetDecimals, true);
        console.log("[ETH req] get token detail:", config.jsonrpc);
        const [symbolRet, nameRet, decimalsRet] = yield Promise.all([
            promiseSymbol,
            promiseName,
            promiseDecimals
        ]);
        if (symbolRet.data.result &&
            nameRet.data.result &&
            decimalsRet.data.result) {
            console.log("[ETH resp] get token symobl:", symbolRet.data);
            console.log("[ETH resp] get token name:", nameRet.data);
            console.log("[ETH resp] get token decimals", decimalsRet.data);
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
        throw new Error("get token detail failed");
    });
    const getAccountTokenTransferHistory = (address, symbolAddress, page = 0, size = 25, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
        const { explorer_api } = config;
        if (explorer_api.provider === "etherscan") {
            const url = `${explorer_api.url}?module=account&action=tokentx&contractaddress=${symbolAddress}&address=${address}&page=${page}&offset=${size}&sort=asc&apikey=${explorer_api.key}`;
            console.log(`[ETH req] get token history by address: ${url}`);
            const res = yield makkii_utils_1.HttpClient.get(url);
            const { data } = res;
            if (data.status === "1") {
                const transfers = {};
                const { result: txs = [] } = data;
                txs.forEach(t => {
                    const tx = {};
                    tx.hash = t.hash;
                    tx.timestamp = parseInt(t.timeStamp) * 1000;
                    tx.from = t.from;
                    tx.to = t.to;
                    tx.value = new bignumber_js_1.default(t.value)
                        .shiftedBy(-t.tokenDecimal)
                        .toNumber();
                    tx.status = "CONFIRMED";
                    tx.blockNumber = t.blockNumber;
                    transfers[tx.hash] = tx;
                });
                return transfers;
            }
            return {};
        }
        const url = `${explorer_api.url}/getAddressHistory/${address}?apiKey=${explorer_api.key}&token=${symbolAddress}&type=transfer&limit=${size}&timestamp=${timestamp /
            1000 -
            1}`;
        console.log(`[ETH req] get token history by address: ${url}`);
        const res = yield makkii_utils_1.HttpClient.get(url);
        const transfers = {};
        const { operations: txs = [] } = res.data;
        txs.forEach(t => {
            const tx = {};
            tx.hash = t.transactionHash;
            tx.timestamp = t.timestamp * 1000;
            tx.from = t.from;
            tx.to = t.to;
            tx.value = new bignumber_js_1.default(t.value, 10)
                .shiftedBy(-parseInt(t.tokenInfo.decimals))
                .toNumber();
            tx.status = "CONFIRMED";
            transfers[tx.hash] = tx;
        });
        return transfers;
    });
    const getAccountTokens = () => Promise.resolve({});
    function getTopTokens(topN = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${config.remote_api}/token/eth/popular`;
            console.log(`[ETH req] get top eth tokens: ${url}`);
            const res = yield makkii_utils_1.HttpClient.get(url, false);
            return res.data;
        });
    }
    function searchTokens(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${config.remote_api}/token/eth/search?offset=0&size=20&keyword=${keyword}`;
            console.log(`[ETH req] search eth token: ${url}`);
            const res = yield makkii_utils_1.HttpClient.get(url, false);
            return res.data;
        });
    }
    function getTokenIconUrl(tokenSymbol, contractAddress) {
        return `${config.remote_api}/token/eth/img?contractAddress=${contractAddress}`;
    }
    return {
        getTokenDetail,
        getAccountTokenBalance,
        getAccountTokens,
        getAccountTokenTransferHistory,
        getTopTokens,
        getTokenIconUrl,
        searchTokens
    };
};
//# sourceMappingURL=token.js.map