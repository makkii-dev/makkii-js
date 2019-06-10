import {toHex,hexString2Array,isHex} from '../utils'
import {keyPair} from "./keyPair";
import {inputAddressFormatter} from './address';
import blake2b from 'blake2b';
import sodium from 'sodium-javascript';
import rlp from 'aion-rlp';
const KEY_MAP = [
    'amount',
    'nonce',
    'gasLimit',
    'gasPrice',
    'to',
    'private_key',
    'timestamp',
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
        if(!unsignedTransaction.hasOwnProperty(k)){
            reject(k + 'not found');
        }
    });

    const {private_key} = transaction;
    // recover keypair
    let ecKey;
    try{
        ecKey = keyPair(private_key)
    }catch (e) {
        reject('invalid private key');
    }
    let tx;
    try {
        tx = txInputFormatter(transaction);
    }catch (e) {
        reject(e)
    }
    const unsignedTransaction = {
        to: tx.to || '0x',
        data: tx.data || '0x',
        value: tx.value || '0x',
        timestamp: tx.timestamp || Math.floor(new Date().getTime() * 1000),
        type: toHex(tx.type||1)
    };

    const rlpEncoded = rlp.encode([
        unsignedTransaction.nonce,
        unsignedTransaction.to.toLowerCase(),
        unsignedTransaction.value,
        unsignedTransaction.data,
        unsignedTransaction.timestamp,
        rlp.AionLong(tx.gasLimit),
        rlp.AionLong(tx.gasPrice),
        unsignedTransaction.type
    ]);
    // hash encoded message
    let rawHash = blake2b(32).update(rlpEncoded).digest();
    // sign
    let signature = ecKey.sign(rawHash);

    // verify signature
    if (sodium.crypto_sign_verify_detached(signature, rawHash, ecKey.publicKey) === false) {
        throw new Error('Could not verify signature.');
    }

    let fullSignature = Buffer.concat([signature,Buffer.from(hexString2Array(ecKey.publicKey))]);
    // add the aion fullSignature
    const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);

    // re-encode with signature included
    const rawTransaction = rlp.encode(rawTx);

    resolve({encoded:rawTransaction.toString('hex'), signature:toHex(signature)})
});


const txInputFormatter = (options) => {

    if (options.to) { // it might be contract creation
        options.to = inputAddressFormatter(options.to);
    }

    if (options.data && options.input) {
        throw new Error('You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.');
    }

    if (!options.data && options.input) {
        options.data = options.input;
        delete options.input;
    }

    if(options.data && !isHex(options.data)) {
        throw new Error('The data field must be HEX encoded data.');
    }

    // allow both
    if (options.gas || options.gasLimit) {
        options.gasLimit = options.gas || options.gasLimit;
    }

    ['gasPrice', 'gasLimit', 'value', 'nonce'].filter(function (key) {
        return options[key] !== undefined;
    }).forEach(function(key){
        options[key] = toHex(options[key]);
    });

    return options;
};

