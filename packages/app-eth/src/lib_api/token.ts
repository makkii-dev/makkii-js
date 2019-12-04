import BigNumber from "bignumber.js";
import { HttpClient, hexutil } from "lib-common-util-js";
import { ERC20ABI } from "./constants";
import { processRequest } from "./jsonrpc";

const Contract = require("web3-eth-contract");
const AbiCoder = require("web3-eth-abi");

export default config => {
    const getAccountTokenBalance = (contractAddress, address) =>
        new Promise((resolve, reject) => {
            const contract = new Contract(ERC20ABI);
            const requestData = processRequest("eth_call", [
                {
                    to: contractAddress,
                    data: contract.methods.balanceOf(address).encodeABI()
                },
                "latest"
            ]);
            console.log("[ETH get token balance req]:", config.jsonrpc);
            HttpClient.post(config.jsonrpc, requestData, true)
                .then(res => {
                    if (res.data.result) {
                        resolve(
                            new BigNumber(
                                AbiCoder.decodeParameter(
                                    "uint256",
                                    res.data.result
                                )
                            )
                        );
                    } else {
                        reject(
                            new Error(
                                `get account Balance failed:${res.data.error}`
                            )
                        );
                    }
                })
                .catch(e => {
                    reject(new Error(`get account Balance failed:${e}`));
                });
        });

    const getTokenDetail = async contractAddress => {
        const contract = new Contract(ERC20ABI);
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
        console.log("[ETH get token detail req]:", config.jsonrpc);
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

    const getAccountTokenTransferHistory = async (
        address,
        symbolAddress,
        page = 0,
        size = 25,
        timestamp
    ) => {
        const { explorer_api } = config;
        if (explorer_api.provider === "etherscan") {
            const url = `${explorer_api.url}?module=account&action=tokentx&contractaddress=${symbolAddress}&address=${address}&page=${page}&offset=${size}&sort=asc&apikey=${explorer_api.key}`;
            console.log(`[eth http req] get token history by address: ${url}`);
            const res = await HttpClient.get(url);
            const { data } = res;
            if (data.status === "1") {
                const transfers = {};
                const { result: txs = [] } = data;
                txs.forEach(t => {
                    const tx: any = {};
                    tx.hash = t.hash;
                    tx.timestamp = parseInt(t.timeStamp) * 1000;
                    tx.from = t.from;
                    tx.to = t.to;
                    tx.value = new BigNumber(t.value)
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
        const url = `${explorer_api.url}/getAddressHistory/${address}?apiKey=${
            explorer_api.key
        }&token=${symbolAddress}&type=transfer&limit=${size}&timestamp=${timestamp /
            1000 -
            1}`;
        console.log(`[eth http req] get token history by address: ${url}`);
        const res = await HttpClient.get(url);
        const transfers = {};
        const { operations: txs = [] } = res.data;
        txs.forEach(t => {
            const tx: any = {};
            tx.hash = t.transactionHash;
            tx.timestamp = t.timeStamp * 1000;
            tx.from = t.from;
            tx.to = t.to;
            tx.value = new BigNumber(t.value, 10)
                .shiftedBy(-parseInt(t.tokenInfo.decimals))
                .toNumber();
            tx.status = "CONFIRMED";
            transfers[tx.hash] = tx;
        });
        return transfers;
    };

    const getAccountTokens = () => Promise.resolve({});

    async function getTopTokens(topN = 20) {
        const url = `${config.remote_api}/token/eth/popular`;
        console.log(`get top eth tokens: ${url}`);
        const res = await HttpClient.get(url, false);
        return res.data;
    }

    async function searchTokens(keyword) {
        const url = `${config.remote_api}/token/eth/search?offset=0&size=20&keyword=${keyword}`;
        console.log(`search eth token: ${url}`);
        const res = await HttpClient.get(url, false);
        return res.data;
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
