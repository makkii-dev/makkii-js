import BigNumber from "bignumber.js";
import { HttpClient } from "@makkii/makkii-utils";

export default config => {
    const getBalance = async address => {
        const url = `${config.insight_api}/addr/${address}`;
        console.log(`[${config.network} req] getBalance: ${url}`);
        try {
            const { data } = await HttpClient.get(url);
            console.log(`[${config.network} resp] getBalance:`, data);
            const { balance } = data;
            return new BigNumber(balance);
        } catch (e) {
            throw new Error(`[${config.network} getBalance error]: ${e}`);
        }
    };

    const getUnspentTx = async address => {
        const url = `${config.insight_api}/addr/${address}/utxo`;
        console.log(`[${config.network} req] getUnspentTx: ${url}`);
        try {
            const { data = [] } = await HttpClient.get(url);
            console.log(`[${config.network} resp] getUnspentTx:`, data);
            const utxos = [];
            for (let i = 0; i < data.length; i += 1) {
                const tx = data[i];
                // eslint-disable-next-line no-await-in-loop
                const rawtx = await getRawTx(tx.txid);
                utxos.push({
                    script: tx.scriptPubKey,
                    amount: tx.satoshis,
                    hash: tx.txid,
                    index: tx.vout,
                    raw: rawtx
                });
            }
            return utxos;
        } catch (e) {
            throw new Error(`[${config.network} error] getUnspentTx: ${e}`);
        }
    };

    const getRawTx = async txhash => {
        const url = `${config.insight_api}/rawtx/${txhash}`;
        console.log(`[${config.network} req] getRawTx: ${url}`);
        try {
            const { data = {} } = await HttpClient.get(url);
            return data.rawtx;
        } catch (e) {
            throw new Error(`[${config.network} error] getRawTx: ${e}`);
        }
    };

    const broadcastTransaction = async encoded => {
        const url = `${config.broadcast}`;
        console.log(`[${config.network} req] broadcastTransaction: ${url}`);
        let resp;
        try {
            const payload = config.network.match("TEST")
                ? { rawtx: encoded }
                : { tx: encoded };
            resp = await HttpClient.post(url, payload, true);
            console.log(`[${config.network} resp] broadcastTransaction:`, resp);
        } catch (e) {
            throw new Error(
                `[${config.network} error] broadcastTransaction: ${e}`
            );
        }
        const { data = {} } = resp || {};
        const { txid, tx } = data;
        if (txid || tx) {
            return txid || tx.hash;
        }
        throw new Error(
            `[${config.network}  error] broadcastTransaction: ${resp.data}`
        );
    };

    const getTransactionStatus = async txId => {
        const url = `${config.insight_api}/tx/${txId}`;
        console.log(`[${config.network} req] getTransactionStatus: ${url}`);
        try {
            const { data } = await HttpClient.get(url);
            console.log(`[${config.network} resp] getTransactionStatus:`, data);
            const { blockheight, blocktime } = data;
            return {
                status: true,
                blockNumber: blockheight,
                timestamp: blocktime
            };
        } catch (e) {
            return null;
        }
    };

    const getTransactionsByAddress = async (address, page, size) => {
        const url = `${config.insight_api}/txs/?address=${address}&pageNum=${page}`;
        console.log(`[${config.network} req] getTransactionsByAddress: ${url}`);
        try {
            const { data } = await HttpClient.get(url);
            console.log(
                `[${config.network} resp] getTransactionsByAddress:`,
                data
            );
            const { txs: getTxs = [] } = data;
            const txs = {};
            getTxs.forEach(t => {
                const tx: any = {};
                tx.hash = t.txid;
                tx.timestamp = t.time * 1000;
                tx.blockNumber = t.blockheight;
                tx.status = "CONFIRMED";
                const { vin, vout } = t;
                tx.from = _aggregateItems(vin);
                tx.to = _aggregateItems(vout);
                tx.fee = t.fees;
                if (tx.blockNumber > 0) {
                    txs[tx.hash] = tx;
                }
            });
            return txs;
        } catch (e) {
            throw new Error(
                `[${config.network} error] getTransactionsByAddress: ${e}`
            );
        }
    };

    const COIN = 100000000;
    const _aggregateItems = items => {
        if (!items) return [];

        const l = items.length;

        const ret = [];
        const tmp = {};
        let u = 0;

        for (let i = 0; i < l; i++) {
            let notAddr = false;
            // non standard input
            if (items[i].scriptSig && !items[i].addr) {
                items[i].addr = `Unparsed address [${u++}]`;
                items[i].notAddr = true;
                notAddr = true;
            }

            // non standard output
            if (items[i].scriptPubKey && !items[i].scriptPubKey.addresses) {
                items[i].scriptPubKey.addresses = [`Unparsed address [${u++}]`];
                items[i].notAddr = true;
                notAddr = true;
            }

            // multiple addr at output
            if (
                items[i].scriptPubKey &&
                items[i].scriptPubKey.addresses.length > 1
            ) {
                items[i].addr = items[i].scriptPubKey.addresses.join(",");
                ret.push(items[i]);
                // eslint-disable-next-line no-continue
                continue;
            }

            const addr =
                items[i].addr ||
                (items[i].scriptPubKey && items[i].scriptPubKey.addresses[0]);

            if (!tmp[addr]) {
                tmp[addr] = {};
                tmp[addr].valueSat = 0;
                tmp[addr].count = 0;
                tmp[addr].addr = addr;
                tmp[addr].items = [];
            }
            tmp[addr].isSpent = items[i].spentTxId;

            tmp[addr].doubleSpentTxID =
                tmp[addr].doubleSpentTxID || items[i].doubleSpentTxID;
            tmp[addr].doubleSpentIndex =
                tmp[addr].doubleSpentIndex || items[i].doubleSpentIndex;
            tmp[addr].dbError = tmp[addr].dbError || items[i].dbError;
            tmp[addr].valueSat += Math.round(items[i].value * COIN);
            tmp[addr].items.push(items[i]);
            tmp[addr].notAddr = notAddr;

            if (items[i].unconfirmedInput) {
                tmp[addr].unconfirmedInput = true;
            }

            tmp[addr].count += 1;
        }

        Object.values(tmp).forEach((v: any) => {
            v.value = v.value || parseInt(v.valueSat) / COIN;
            ret.push(v);
        });
        return ret;
    };

    return {
        broadcastTransaction,
        getBalance,
        getTransactionStatus,
        getTransactionsByAddress,
        getUnspentTx,
        getRawTx
    };
};
