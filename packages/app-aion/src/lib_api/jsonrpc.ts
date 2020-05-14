import BigNumber from "bignumber.js";
import { HttpClient } from "@makkii/makkii-utils";

/**
 * @hidden
 * @private
 */
export const processRequest = (methodName, params) => {
    const requestData = {
        method: methodName,
        params,
        id: 42,
        jsonrpc: "2.0"
    };

    return JSON.stringify(requestData);
};

export default config => {
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
            return `0x${new BigNumber(blockTag).toString(16)}`;
        }

        throw new Error("invalid blockTag");
    };

    const getBlockByNumber = async (
        blockNumber /* hex string */,
        fullTxs = false
    ) => {
        const requestData = processRequest("eth_getBlockByNumber", [
            blockNumber,
            fullTxs
        ]);
        console.log("[AION req] get block by number req:", requestData);
        const res = await HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get block by number resp:", res.data);
        if (res.data.error) throw new Error(res.data.error.message);
        return res.data.result;
    };

    const blockNumber = async () => {
        const requestData = processRequest("eth_blockNumber", []);
        console.log("[AION req] get blockNumber:", requestData);
        const res = await HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get blockNUmber:", res.data);
        if (res.data.error) throw new Error(res.data.error.message);
        return res.data.result;
    };

    const getBalance = async address => {
        const params = [address.toLowerCase(), "latest"];
        const requestData = processRequest("eth_getBalance", params);
        console.log("[AION req] get balance:", requestData);
        const res = await HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get balance:", res.data);
        if (res.data.error) throw new Error(res.data.error.message);
        return new BigNumber(res.data.result).shiftedBy(-18);
    };

    const getTransactionCount = async (address, blockTag) => {
        const params = [address.toLowerCase(), checkBlockTag(blockTag)];
        const requestData = processRequest("eth_getTransactionCount", params);
        console.log("[AION req] get nonce:", requestData);
        const res = await HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get nonce", res.data);
        if (res.data.error) throw new Error(res.data.error.message);
        return res.data.result;
    };

    const sendSignedTransaction = async signedTx => {
        const params = [signedTx];
        const requestData = processRequest("eth_sendRawTransaction", params);
        console.log("[AION req] broadcast:", requestData);
        const res = await HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] broadcast:", res.data);
        if (res.data.error) throw new Error(res.data.error.message);
        return res.data.result;
    };

    const getTransactionReceipt = async hash => {
        const params = [hash];
        const requestData = processRequest("eth_getTransactionReceipt", params);
        console.log("[AION req] get transaction receipt:", requestData);
        const res = await HttpClient.post(config.jsonrpc, requestData, true, {
            "Content-Type": "application/json"
        });
        console.log("[AION resp] get transaction receipt", res.data);
        if (res.data.error) throw new Error(res.data.error.message);
        return res.data.result;
    };

    return {
        blockNumber,
        getBalance,
        getBlockByNumber,
        getTransactionCount,
        getTransactionReceipt,
        sendSignedTransaction,
        processRequest
    };
};
