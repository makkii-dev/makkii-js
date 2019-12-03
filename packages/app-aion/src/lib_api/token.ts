import BigNumber from "bignumber.js";
import { HttpClient, hexutil } from "lib-common-util-js";
import { processRequest } from "./jsonrpc";
import { CONTRACT_ABI } from "./constants";

const Contract = require("aion-web3-eth-contract");
const AbiCoder = require("aion-web3-eth-abi");

export default config => {
    async function getAccountTokens(address) {
        const url = `${
            config.explorer_api
        }/aion/dashboard/getAccountDetails?accountAddress=${address.toLowerCase()}`;
        const { data } = await HttpClient.get(url);
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
    }

    const getAccountTokenBalance = async (contractAddress, address) => {
        const contract = new Contract(CONTRACT_ABI);
        const requestData = processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract.methods.balanceOf(address).encodeABI()
            },
            "latest"
        ]);
        console.log("[AION get token balance req]:", config.jsonrpc);

        const res = await HttpClient.post(config.jsonrpc, requestData, true);
        if (res.data.result) {
            return new BigNumber(
                AbiCoder.decodeParameter("uint128", res.data.result)
            );
        }
        throw new Error(`get account Balance failed:${res.data.error}`);
    };

    const getTokenDetail = async contractAddress => {
        const contract = new Contract(CONTRACT_ABI);
        const requestGetSymbol = processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract.methods.symbol().encodeABI()
            },
            "latest"
        ]);
        const requestGetName = processRequest("eth_call", [
            { to: contractAddress, data: contract.methods.name().encodeABI() },
            "latest"
        ]);
        const requestGetDecimals = processRequest("eth_call", [
            {
                to: contractAddress,
                data: contract.methods.decimals().encodeABI()
            },
            "latest"
        ]);
        const url = config.jsonrpc;
        const promiseSymbol = HttpClient.post(url, requestGetSymbol, true);
        const promiseName = HttpClient.post(url, requestGetName, true);
        const promiseDecimals = HttpClient.post(url, requestGetDecimals, true);
        console.log("[AION get token detail req]:", config.jsonrpc);
        const [symbolRet, nameRet, decimalsRet] = await Promise.all([
            promiseSymbol,
            promiseName,
            promiseDecimals
        ]);
        if (
            symbolRet.data.result &&
            nameRet.data.result &&
            decimalsRet.data.result
        ) {
            console.log("[get token symobl resp]=>", symbolRet.data);
            console.log("[get token name resp]=>", nameRet.data);
            console.log("[get token decimals resp]=>", decimalsRet.data);
            let symbol;
            let name;
            try {
                symbol = AbiCoder.decodeParameter(
                    "string",
                    symbolRet.data.result
                );
            } catch (e) {
                symbol = hexutil.hexToAscii(symbolRet.data.result);
                symbol = symbol.slice(0, symbol.indexOf("\u0000"));
            }
            try {
                name = AbiCoder.decodeParameter("string", nameRet.data.result);
            } catch (e) {
                name = hexutil.hexToAscii(nameRet.data.result);
                name = name.slice(0, name.indexOf("\u0000"));
            }
            const decimals = AbiCoder.decodeParameter(
                "uint8",
                decimalsRet.data.result
            );
            return {
                contractAddr: contractAddress,
                symbol,
                name,
                tokenDecimal: decimals
            };
        }
        throw new Error("get token detail failed");
    };

    async function getAccountTokenTransferHistory(
        address,
        symbolAddress,
        page = 0,
        size = 25
    ) {
        const url = `${
            config.explorer_api
        }/aion/dashboard/getTransactionsByAddress?accountAddress=${address.toLowerCase()}&tokenAddress=${symbolAddress.toLowerCase()}&page=${page}&size=${size}`;
        console.log(`get account token transactions: ${url}`);
        const res = await HttpClient.get(url);
        const { content = [] } = res.data;
        const txs = {};
        content.forEach(t => {
            const tx = {
                hash: `0x${t.transactionHash}`,
                timestamp: t.transferTimestamp * 1000,
                from: `0x${t.fromAddr}`,
                to: `0x${t.toAddr}`,
                value: new BigNumber(t.tknValue, 10).toNumber(),
                status: "CONFIRMED",
                blockNumber: t.blockNumber
            };
            txs[tx.hash] = tx;
        });
        return txs;
    }

    const getTopTokens = async (topN = 20) => {
        const url = `${config.remoteApi}/token/aion?offset=0&size=${topN}`;
        console.log(`get top aion tokens: ${url}`);
        const res = await HttpClient.get(url, false);
        return res.data;
    };

    const searchTokens = async keyword => {
        const url = `${config.remoteApi}/token/aion/search?keyword=${keyword}`;
        console.log(`search aion token: ${url}`);
        const res = await HttpClient.get(url, false);
        return res.data;
    };

    return {
        getAccountTokens,
        getAccountTokenBalance,
        getAccountTokenTransferHistory,
        getTokenDetail,
        getTopTokens,
        searchTokens
    };
};
