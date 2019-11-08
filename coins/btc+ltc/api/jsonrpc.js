import BigNumber from "bignumber.js";
import {HttpClient} from "lib-common-util-js";
import {config} from '../../serverConfig';
const {btc:{networks}} = config.coins;

const getBalance =  async (address, network = 'BTC') => {
    const url = `${networks[network].jsonrpc}/addr/${address}`;
    console.log(`[${network} getBalance req]: ${url}` );
    try {
        const {data} = await HttpClient.get(url);
        console.log(`[${network} getBalance resp]:`,data);
        const {balance} = data;
        return BigNumber(balance);
    }catch (e) {
        throw Error(`[${network} getBalance error]: ${e}`);
    }
};


const getUnspentTx = async (address, network = 'BTC') => {
    const url = `${networks[network].jsonrpc}/addr/${address}/utxo`;
    console.log(`[${network} getUnspentTx req]: ${url}` );
    try {
        const {data=[]} = await HttpClient.get(url);
        console.log(`[${network} getUnspentTx resp]:`,data);
        const utxos = [];
        data.forEach(tx => {
            utxos.push({
                script: tx.scriptPubKey,
                amount: tx.satoshis,
                hash: tx.txid,
                index: tx.vout,
            });
        });
        return utxos;
    }catch (e) {
        throw Error(`[${network} getUnspentTx error]: ${e}`);
    }
};

const broadcastTransaction = async (encoded, network) => {
    const url = `${networks[network].broadcast}`;
    console.log(`[${network} broadcastTransaction req]: ${url}` );
    let resp;
    try {
        const payload = network.match('TEST')? {rawtx: encoded}: {tx: encoded};
        resp = await HttpClient.post(url, payload, true);
        console.log(`[${network} broadcastTransaction resp]:`,resp);
    }catch (e) {
        throw Error(`[${network} broadcastTransaction error]: ${e}`);
    }
    const { data:{ txid, tx } = {} } = resp || {};
    if(txid || tx) {
        return txid || tx.hash;
    }else{
        throw Error(`[${network} broadcastTransaction error]: ${resp.data}`)
    }

};

const getTransactionStatus = async (txId, network='BTC') => {
    const url = `${networks[network].jsonrpc}/tx/${txId}`;
    console.log(`[${network} getTransactionStatus req]: ${url}` );
    try {
        const {data} = await HttpClient.get(url);
        console.log(`[${network} getTransactionStatus resp]:`,data);
        const { blockheight, blocktime } = data;
        return {
            status: true,
            blockNumber: blockheight,
            timestamp: blocktime,
        };
    }catch (e) {
        throw Error(`[${network} getTransactionStatus error]: ${e}`);
    }
};


const getTransactionsByAddress = async (address, page, size, timestamp = undefined, network = 'BTC')=> {
    const url = `${networks[network].jsonrpc}/txs/?address=${address}&pageNum=${page}`;
    console.log(`[${network} getTransactionsByAddress req]: ${url}` );
    try {
        const {data} = await HttpClient.get(url);
        console.log(`[${network} getTransactionsByAddress resp]:`,data);
        const { txs: getTxs = [] } = data;
        const txs = {};
        getTxs.forEach(t => {
            let tx = {};
            tx.hash = t.txid;
            tx.timestamp = t.time * 1000;
            tx.blockNumber = t.blockheight;
            tx.status = 'CONFIRMED';
            const { vin, vout } = t;
            tx.from = _aggregateItems(vin);
            tx.to = _aggregateItems(vout);
            tx.fee = t.fees;
            if(tx.blockNumber>0){
                txs[tx.hash] = tx;
            }
        });
        return txs;
    }catch (e) {
        throw Error(`[${network} getTransactionsByAddress error]: ${e}`);
    }
};

const COIN = 100000000;
const _aggregateItems = (items) => {
    if (!items) return [];

    const l = items.length;

    let ret = [];
    let tmp = {};
    let u = 0;

    for(let i=0; i < l; i++) {

        let notAddr = false;
        // non standard input
        if (items[i].scriptSig && !items[i].addr) {
            items[i].addr = 'Unparsed address [' + u++ + ']';
            items[i].notAddr = true;
            notAddr = true;
        }

        // non standard output
        if (items[i].scriptPubKey && !items[i].scriptPubKey.addresses) {
            items[i].scriptPubKey.addresses = ['Unparsed address [' + u++ + ']'];
            items[i].notAddr = true;
            notAddr = true;
        }

        // multiple addr at output
        if (items[i].scriptPubKey && items[i].scriptPubKey.addresses.length > 1) {
            items[i].addr = items[i].scriptPubKey.addresses.join(',');
            ret.push(items[i]);
            continue;
        }

        let addr = items[i].addr || (items[i].scriptPubKey && items[i].scriptPubKey.addresses[0]);

        if (!tmp[addr]) {
            tmp[addr] = {};
            tmp[addr].valueSat = 0;
            tmp[addr].count = 0;
            tmp[addr].addr = addr;
            tmp[addr].items = [];
        }
        tmp[addr].isSpent = items[i].spentTxId;

        tmp[addr].doubleSpentTxID = tmp[addr].doubleSpentTxID   || items[i].doubleSpentTxID;
        tmp[addr].doubleSpentIndex = tmp[addr].doubleSpentIndex || items[i].doubleSpentIndex;
        tmp[addr].dbError = tmp[addr].dbError || items[i].dbError;
        tmp[addr].valueSat += Math.round(items[i].value * COIN);
        tmp[addr].items.push(items[i]);
        tmp[addr].notAddr = notAddr;

        if (items[i].unconfirmedInput)
            tmp[addr].unconfirmedInput = true;

        tmp[addr].count++;
    }

    Object.values(tmp).forEach(v=>{
        v.value    = v.value || parseInt(v.valueSat) / COIN;
        ret.push(v);
    });
    return ret;
};


export {
    broadcastTransaction,
    getBalance,
    getTransactionStatus,
    getTransactionsByAddress,
    getUnspentTx
}
