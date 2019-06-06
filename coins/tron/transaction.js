import {buildTransferTransaction} from '@tronscan/client/src/utils/transactionBuilder';
import {signTransaction as TronSignTransaction} from '@tronscan/client/src/utils/crypto';
import {longToByteArray, hexString2Array} from '../utils';
import {sha256} from "ethereumjs-util";

/***
 *
 * @param transaction
 * {
 *      "timestamp" : 1558600764000,
 *      "expiration" : 155860090000,
 *      "to_address": "THTR75o8xXAgCTQqpiot2AFRAjvW1tSbVV",
 *      "owner_address": "TJRyWwFs9wTFGZg3JbrVriFbNfCug5tDeC",
 *      "private_key" : "2d8f68944bdbfbc0769542fba8fc2d2a3de67393334471624364c7006da2aa54",
 *      "amount": 1,
 *      "latest_block": {
 *          hash: '00000000000080f82038aa301eda07eb27906589dd849d1c9ba5d84af94cf038'
 *          number: 33016
 *      }
 *  }
 * @returns {Promise<any> | Promise<*>}
 * {
 *      "signature" : ["97c825b41c77de2a8bd65b3df55cd4c0df59c307c0187e42321dcc1cc455ddba583dd9502e17cfec5945b34cad0511985a6165999092a6dec84c2bdd97e649fc01"]
 *      "txID": "454f156bf1256587ff6ccdbc56e64ad0c51e4f8efea5490dcbc720ee606bc7b8"
 *      "ref_block_bytes": "267e"
 *      "ref_block_hash": "9a447d222e8de9f2"
 *
 *  }
 */
export const signTransaction = (transaction) => new Promise((resolve, reject) => {
    try {
        const {private_key, expiration, timestamp, to_address, owner_address, amount, latest_block} = transaction;
        let tx = buildTransferTransaction('TRX', owner_address, to_address, amount);
        let latestBlockHash = latest_block.hash;
        let latestBlockNum = latest_block.number;
        let numBytes = longToByteArray(latestBlockNum);
        numBytes.reverse();
        let hashBytes = hexString2Array(latestBlockHash);
        let generateBlockId = [...numBytes.slice(0, 8), ...hashBytes.slice(8, hashBytes.length - 1)];
        let rawData = tx.getRawData();
        rawData.setRefBlockHash(Uint8Array.from(generateBlockId.slice(8, 16)));
        rawData.setRefBlockBytes(Uint8Array.from(numBytes.slice(6, 8)));
        rawData.setExpiration(expiration);
        rawData.setTimestamp(timestamp);
        tx.setRawData(rawData);
        const signed = TronSignTransaction(hexString2Array(private_key), tx);
        const txID = sha256(signed.hex).toString('hex');
        const signature = signed.transaction.getSignatureList().map(e=>Buffer.from(e).toString('hex'));
        const ref_block_bytes = signed.transaction.toObject().rawData.refBlockBytes;
        const ref_block_hash = signed.transaction.toObject().rawData.refBlockHash;
        resolve({signature, txID, ref_block_bytes, ref_block_hash});
    }catch (e) {
        reject('eth sign transaction failed',e);
    }


});