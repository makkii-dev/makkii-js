import BigNumber from 'bignumber.js';
import { HttpClient } from 'lib-common-util-js';

export default config => {

  const getBalance = async (address) => {
    const url = `${config.insight_api}/addr/${address}`;
    console.log(`[${config.network} getBalance req]: ${url}`);
    try {
      const { data } = await HttpClient.get(url);
      console.log(`[${config.network} getBalance resp]:`, data);
      const { balance } = data;
      return new BigNumber(balance);
    } catch (e) {
      throw new Error(`[${config.network} getBalance error]: ${e}`);
    }
  };


  const getUnspentTx = async (address) => {
    const url = `${config.insight_api}/addr/${address}/utxo`;
    console.log(`[${config.network} getUnspentTx req]: ${url}`);
    try {
      const { data = [] } = await HttpClient.get(url);
      console.log(`[${config.network} getUnspentTx resp]:`, data);
      const utxos = [];
      for (let i=0; i< data.length; i+=1){
        const tx = data[i];
        // eslint-disable-next-line no-await-in-loop
        const rawtx = await getRawTx(tx.txid);
        utxos.push({
          script: tx.scriptPubKey,
          amount: tx.satoshis,
          hash: tx.txid,
          index: tx.vout,
          raw: rawtx,
        });
      }
      return utxos;
    } catch (e) {
      throw new Error(`[${config.network} getUnspentTx error]: ${e}`);
    }
  };

  const getRawTx = async (txhash) => {
    const url = `${config.insight_api}/rawtx/${txhash}`;
    console.log(`[${config.network} getRawTx req]: ${url}`);
    try {
      const { data = {} } = await HttpClient.get(url);
      return data.rawtx;
    } catch (e) {
      throw new Error(`[${config.network} getRawTx error]: ${e}`);
    }
  };


  const broadcastTransaction = async (encoded) => {
    const url = `${config.broadcast}`;
    console.log(`[${config.network} broadcastTransaction req]: ${url}`);
    let resp;
    try {
      const payload = config.network.match('TEST') ? { rawtx: encoded } : { tx: encoded };
      resp = await HttpClient.post(url, payload, true);
      console.log(`[${config.network} broadcastTransaction resp]:`, resp);
    } catch (e) {
      throw new Error(`[${config.network} broadcastTransaction error]: ${e}`);
    }
    const { data: { txid, tx } = {} } = resp || {};
    if (txid || tx) {
      return txid || tx.hash;
    }
    throw new Error(`[${config.network} broadcastTransaction error]: ${resp.data}`);
  };

  const getTransactionStatus = async (txId) => {
    const url = `${config.insight_api}/tx/${txId}`;
    console.log(`[${config.network} getTransactionStatus req]: ${url}`);
    try {
      const { data } = await HttpClient.get(url);
      console.log(`[${config.network} getTransactionStatus resp]:`, data);
      const { blockheight, blocktime } = data;
      return {
        status: true,
        blockNumber: blockheight,
        timestamp: blocktime,
      };
    } catch (e) {
      throw new Error(`[${config.network} getTransactionStatus error]: ${e}`);
    }
  };


  const getTransactionsByAddress = async (address, page, size) => {
    const url = `${config.insight_api}/txs/?address=${address}&pageNum=${page}`;
    console.log(`[${config.network} getTransactionsByAddress req]: ${url}`);
    try {
      const { data } = await HttpClient.get(url);
      console.log(`[${config.network} getTransactionsByAddress resp]:`, data);
      const { txs: getTxs = [] } = data;
      const txs = {};
      getTxs.forEach((t) => {
        const tx = {};
        tx.hash = t.txid;
        tx.timestamp = t.time * 1000;
        tx.blockNumber = t.blockheight;
        tx.status = 'CONFIRMED';
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
      throw new Error(`[${config.network} getTransactionsByAddress error]: ${e}`);
    }
  };

  const COIN = 100000000;
  const _aggregateItems = (items) => {
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
      if (items[i].scriptPubKey && items[i].scriptPubKey.addresses.length > 1) {
        items[i].addr = items[i].scriptPubKey.addresses.join(',');
        ret.push(items[i]);
        // eslint-disable-next-line no-continue
        continue;
      }

      const addr = items[i].addr || (items[i].scriptPubKey && items[i].scriptPubKey.addresses[0]);

      if (!tmp[addr]) {
        tmp[addr] = {};
        tmp[addr].valueSat = 0;
        tmp[addr].count = 0;
        tmp[addr].addr = addr;
        tmp[addr].items = [];
      }
      tmp[addr].isSpent = items[i].spentTxId;

      tmp[addr].doubleSpentTxID = tmp[addr].doubleSpentTxID || items[i].doubleSpentTxID;
      tmp[addr].doubleSpentIndex = tmp[addr].doubleSpentIndex || items[i].doubleSpentIndex;
      tmp[addr].dbError = tmp[addr].dbError || items[i].dbError;
      tmp[addr].valueSat += Math.round(items[i].value * COIN);
      tmp[addr].items.push(items[i]);
      tmp[addr].notAddr = notAddr;

      if (items[i].unconfirmedInput) { tmp[addr].unconfirmedInput = true; }

      tmp[addr].count += 1;
    }

    Object.values(tmp).forEach((v) => {
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
    getRawTx,
  };
}