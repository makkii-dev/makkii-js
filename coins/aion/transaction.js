import {toHex,hexString2Array} from '../utils'
import {AionRlp} from "./rlp";
import {keyPair} from "./keyPair";
import blake2b from 'blake2b';

const KEY_MAP = [
    'amount',
    'nonce',
    'gasLimit',
    'gasPrice',
    'to',
    'private_key',
    'timestamp',
    'data'
];

/***
 *
 * @param transaction
 * {
 *     amount:
 *     nonce:
 *     gasLimit:
 *     gasPrice:
 *     to:
 *     private_key:
 *     timestamp:
 *     data:
 * }
 * @returns {Promise<any> | Promise<*>} {encoded: hex String: signature: hex string}
 */
export const signTransaction = (transaction) => new Promise((resolve, reject) => {
    // check key;
    KEY_MAP.forEach(k=>{
        if(!transaction.hasOwnProperty(k)){
            reject(k + 'not found');
        }
    });

    const {amount, nonce, gasLimit, gasPrice, to, private_key, timestamp, data} = transaction;
    // recover keypair
    let ecKey;
    try{
        ecKey = keyPair(private_key)
    }catch (e) {
        reject('invalid private key');
    }

    // get encodeRow
    let encodedTx = {};
    encodedTx.nonce = AionRlp.encode(toHex(nonce));
    encodedTx.to = AionRlp.encode(toHex(to));
    encodedTx.amount = AionRlp.encode(toHex(amount));
    if(data) {
        encodedTx.data = AionRlp.encode(toHex(data));
    }else {
        encodedTx.data = AionRlp.encode(data);
    }
    encodedTx.timestamp = AionRlp.encode(toHex(timestamp));
    encodedTx.gasLimit = AionRlp.encode(toHex(gasLimit));
    encodedTx.gasPrice = AionRlp.encode(toHex(gasPrice));
    encodedTx.type = AionRlp.encode(1);

    let encoded = AionRlp.encodeList([
        encodedTx.nonce,
        encodedTx.to,
        encodedTx.amount,
        encodedTx.data,
        encodedTx.timestamp,
        encodedTx.gasLimit,
        encodedTx.gasPrice,
        encodedTx.type
    ]);
    let rawHash = blake2b(32).update(encoded).digest();
    let signature = ecKey.sign(rawHash);
    let fullSignature = Buffer.concat([signature,Buffer.from(hexString2Array(ecKey.publicKey))]);
    encodedTx.fullSignature  = AionRlp.encode(fullSignature);

    let encoded2 = AionRlp.encodeList([
        encodedTx.nonce,
        encodedTx.to,
        encodedTx.amount,
        encodedTx.data,
        encodedTx.timestamp,
        encodedTx.gasLimit,
        encodedTx.gasPrice,
        encodedTx.type,
        encodedTx.fullSignature,
    ]);
    resolve({encoded:encoded2.toString('hex'), signature:toHex(signature)})
});

