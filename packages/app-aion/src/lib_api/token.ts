/* eslint-disable prefer-destructuring */
import BigNumber from "bignumber.js";
import { HttpClient, hexutil } from "@makkii/makkii-utils";
import { processRequest } from "./jsonrpc";
import { aionfvmContract, AbiCoder } from "./contract";

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
        const requestData = processRequest("eth_call", [
            {
                to: contractAddress,
                data: aionfvmContract.balanceOf(address)
            },
            "latest"
        ]);
        console.log("[AION req] get token balance:", address);

        const res = await HttpClient.post(config.jsonrpc, requestData, true);
        console.log("[AION resp] get token balance", res.data);
        if (res.data.result) {
            return new BigNumber(
                AbiCoder.decode(res.data.result, ["uint128"])[0]
            );
        }
        throw new Error(`[AION error] get token failed:${res.data.error}`);
    };

    const getTokenDetail = async contractAddress => {
        const requestGetSymbol = processRequest("eth_call", [
            {
                to: contractAddress,
                data: aionfvmContract.symbol()
            },
            "latest"
        ]);
        const requestGetName = processRequest("eth_call", [
            { to: contractAddress, data: aionfvmContract.name() },
            "latest"
        ]);
        const requestGetDecimals = processRequest("eth_call", [
            {
                to: contractAddress,
                data: aionfvmContract.decimals()
            },
            "latest"
        ]);
        const url = config.jsonrpc;
        const promiseSymbol = HttpClient.post(url, requestGetSymbol, true);
        const promiseName = HttpClient.post(url, requestGetName, true);
        const promiseDecimals = HttpClient.post(url, requestGetDecimals, true);
        console.log("[AION req] get token detail:", config.jsonrpc);
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
            console.log("[AION resp] get token symobl:", symbolRet.data);
            console.log("[AION resp] get token name", nameRet.data);
            console.log("[AION resp] get token decimals", decimalsRet.data);
            let symbol;
            let name;
            try {
                symbol = AbiCoder.decode(symbolRet.data.result, ["string"])[0];
            } catch (e) {
                symbol = hexutil.hexToAscii(symbolRet.data.result);
                symbol = symbol.slice(0, symbol.indexOf("\u0000"));
            }
            try {
                name = AbiCoder.decode(nameRet.data.result, ["string"])[0];
            } catch (e) {
                name = hexutil.hexToAscii(nameRet.data.result);
                name = name.slice(0, name.indexOf("\u0000"));
            }
            const decimals = AbiCoder.decode(decimalsRet.data.result, [
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
        console.log(`[AION req] get account token transactions: ${url}`);
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
        const url = `${config.remote_api}/token/aion?offset=0&size=${topN}`;
        console.log(`[AION req] get top aion tokens: ${url}`);
        const res = await HttpClient.get(url, false);
        console.log(`[AION resp] get top aion tokens:`, res.data);
        return res.data;
    };

    const searchTokens = async keyword => {
        const url = `${config.remote_api}/token/aion/search?keyword=${keyword}`;
        console.log(`[AION req] search aion token: ${url}`);
        const res = await HttpClient.get(url, false);
        console.log(`[AION resp] search aion token:`, res.data);
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
