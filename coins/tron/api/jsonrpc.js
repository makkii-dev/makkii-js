import BigNumber from "bignumber.js";
import {HttpClient} from "lib-common-util-js";
import {config} from '../../serverConfig';
const {tron:{networks}} = config.coins;


const getBalance = (address, network = 'mainnet') =>
    new Promise((resolve, reject) => {
        const url = `${networks[network].jsonrpc}/v1/accounts/${address}`;
        const promise = HttpClient.get(url);
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp] ', res.data);
            if (res.data.error !== undefined) {
                reject(res.data.error);
            } else if (res.data.data.balance !== undefined) {
                resolve(new BigNumber(res.data.data.balance).shiftedBy(-6));
            } else {
                resolve(new BigNumber(0));
            }
        });
    });


const getLatestBlock = (network = 'mainnet') =>
    new Promise(resolve => {
        const url = `${networks[network].jsonrpc}/wallet/getnowblock`;
        const promise = HttpClient.get(url);
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp] ', res.data);
            resolve(res.data);
        });
    });

const broadcastTransaction = (tx, network = 'mainnet') =>
    new Promise(resolve => {
        const url = `${networks[network].jsonrpc}/wallet/broadcasttransaction`;
        const promise = HttpClient.post(url, tx, true, { 'Content-Type': 'application/json' });
        console.log(`[tron http req] ${url}`);
        promise.then(res => {
            console.log('[keystore http resp] ', res.data);
            resolve(res.data);
        });
    });

const getTransactionById = (hash, network = 'mainnet') =>
    new Promise(resolve => {
        const url = `${networks[network].jsonrpc}/walletsolidity/gettransactionbyid`;
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

const getTransactionInfoById = (hash, network = 'mainnet') =>
    new Promise(resolve => {
        const url = `${networks[network].jsonrpc}/walletsolidity/gettransactioninfobyid`;
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

export {
    broadcastTransaction,
    getBalance,
    getLatestBlock,
    getTransactionById,
    getTransactionInfoById,
}
