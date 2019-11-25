import BigNumber from "bignumber.js";
import {HttpClient} from "lib-common-util-js";
import {base58check2HexString} from "../utils";

export default config => {
const getBalance = (address) =>
    new Promise((resolve, reject) => {
        const url = `${config.trongrid_api}/wallet/getaccount`;
        const hexAddress = base58check2HexString(address);
        const body = {
            address: hexAddress,
        };
        const promise = HttpClient.post(url, body, true, { 'Content-Type': 'application/json' });
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp] ', res.data);
            if (res.data.Error !== undefined) {
                reject(res.data.Error);
            } else if (res.data.balance !== undefined) {
                resolve(new BigNumber(res.data.balance).shiftedBy(-6));
            } else {
                resolve(new BigNumber(0));
            }
        });
    });


const getLatestBlock = (network = 'mainnet') =>
    new Promise(resolve => {
        const url = `${config.trongrid_api}/wallet/getnowblock`;
        const promise = HttpClient.post(url);
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp] ', res.data);
            resolve(res.data);
        });
    });

const broadcastTransaction = (tx) =>
    new Promise(resolve => {
        const url = `${config.trongrid_api}/wallet/broadcasttransaction`;
        const promise = HttpClient.post(url, tx, true, { 'Content-Type': 'application/json' });
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp] ', res.data);
            resolve(res.data);
        });
    });

const getTransactionById = (hash) =>
    new Promise(resolve => {
        const url = `${config.trongrid_api}/walletsolidity/gettransactionbyid`;
        const promise = HttpClient.post(
            url,
            {
                value: hash,
            },
            true,
            { 'Content-Type': 'application/json' },
        );
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp]', res.data);
            resolve(res.data);
        });
    });

const getTransactionInfoById = (hash) =>
    new Promise(resolve => {
        const url = `${config.trongrid_api}/walletsolidity/gettransactioninfobyid`;
        const promise = HttpClient.post(
            url,
            {
                value: hash,
            },
            true,
            { 'Content-Type': 'application/json' },
        );
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp]', res.data);
            resolve(res.data);
        });
    });

return {
    broadcastTransaction,
    getBalance,
    getLatestBlock,
    getTransactionById,
    getTransactionInfoById,
}

}