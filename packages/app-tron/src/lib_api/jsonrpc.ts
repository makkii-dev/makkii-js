import BigNumber from "bignumber.js";
import { HttpClient } from "lib-common-util-js";
import { base58check2HexString } from "../utils";

export default config => {
    const getBalance = async address => {
        const url = `${config.trongrid_api}/wallet/getaccount`;
        const hexAddress = base58check2HexString(address);
        const body = {
            address: hexAddress
        };
        console.log(`[tron getBalance req] ${url}`);
        const res = await HttpClient.post(url, body, true, {
            "Content-Type": "application/json"
        });
        console.log("[tron getBalance resp] ", res.data);
        if (res.data.Error !== undefined) {
            throw new Error(res.data.Error);
        } else if (res.data.balance !== undefined) {
            return new BigNumber(res.data.balance).shiftedBy(-6);
        } else {
            return new BigNumber(0);
        }
    };

    const getLatestBlock = async () => {
        const url = `${config.trongrid_api}/wallet/getnowblock`;
        console.log("[tron getLatestBlock req] ", url);
        const res = await HttpClient.post(url);
        return res.data;
    };

    const broadcastTransaction = async tx => {
        const url = `${config.trongrid_api}/wallet/broadcasttransaction`;
        console.log(`[tron broadcastTransaction req] ${url}`);
        const res = await HttpClient.post(url, tx, true, {
            "Content-Type": "application/json"
        });
        console.log("[tron broadcastTransaction resp] ", res.data);
        return res.data;
    };

    const getTransactionById = async hash => {
        const url = `${config.trongrid_api}/walletsolidity/gettransactionbyid`;
        console.log(`[tron getTransactionById req] ${url}`);
        const res = await HttpClient.post(
            url,
            {
                value: hash
            },
            true,
            { "Content-Type": "application/json" }
        );
        console.log("[tron getTransactionById resp]", res.data);
        return res.data;
    };

    const getTransactionInfoById = async hash => {
        const url = `${config.trongrid_api}/walletsolidity/gettransactioninfobyid`;
        console.log(`[tron http req] ${url}`);
        const res = await HttpClient.post(
            url,
            {
                value: hash
            },
            true,
            { "Content-Type": "application/json" }
        );
        console.log("[tron http resp]", res.data);
        return res.data;
    };

    return {
        broadcastTransaction,
        getBalance,
        getLatestBlock,
        getTransactionById,
        getTransactionInfoById
    };
};
