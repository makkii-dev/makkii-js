import {toHex,hexString2Array,isHex,removeLeadingZeroX} from '../../../utils'
import {keyPair} from "./keyPair";
import {inputAddressFormatter} from './address';
import blake2b from 'blake2b';
import sodium from 'sodium-javascript';
import rlp from 'aion-rlp';
import {BN} from "ethereumjs-util";
import {signByLedger} from "../../../utils/ledger";

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
 *     extra_param: {type, sender derivationIndex}
 * }
 * @returns {Promise<any> | Promise<*>} {encoded: hex String: signature: hex string}
 */
export const signTransaction = (transaction) => new Promise((resolve, reject) => {
    const {private_key,extra_param} = transaction;
    // format tx
    let tx;
    try {
        tx = txInputFormatter(transaction);
    }catch (e) {
        reject(e)
    }
    const unsignedTransaction = {
        nonce: tx.nonce,
        to: tx.to || '0x',
        data: tx.data || '0x',
        amount: tx.amount || '0x',
        timestamp: tx.timestamp || Math.floor(new Date().getTime()*1000),
        type: new BN(tx.type||1),
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
    };
    console.log('unsigned ++++=>', unsignedTransaction);


    const rlpEncoded = rlp.encode([
        unsignedTransaction.nonce,
        unsignedTransaction.to.toLowerCase(),
        unsignedTransaction.amount,
        unsignedTransaction.data,
        toAionLong(unsignedTransaction.timestamp),
        toAionLong(unsignedTransaction.gasLimit),
        toAionLong(unsignedTransaction.gasPrice),
        unsignedTransaction.type
    ]);
    // ledger
    if(extra_param&&extra_param.type === '[ledger]'){
        signByLedger(extra_param.derivationIndex, extra_param.sender, Object.values(rlpEncoded)).then(({signature, publicKey})=>{
            let fullSignature = Buffer.concat([Buffer.from(hexString2Array(publicKey)), signature]);
            // add the keystore fullSignature
            const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);

            // re-encode with signature included
            const rawTransaction = rlp.encode(rawTx);

            resolve({encoded: rawTransaction.toString('hex'), signature: toHex(signature)})
        }).catch(e=>{
            reject(e);
        })
    }else {
        // recover keypair
        let ecKey;
        try{
            ecKey = keyPair(private_key)
        }catch (e) {
            reject('invalid private key');
        }

        // hash encoded message
        let rawHash = blake2b(32).update(rlpEncoded).digest();
        // sign
        let signature = ecKey.sign(rawHash);
        // verify signature
        if (sodium.crypto_sign_verify_detached(signature, rawHash, Buffer.from(hexString2Array(ecKey.publicKey))) === false) {
            throw new Error('Could not verify signature.');
        }

        let fullSignature = Buffer.concat([Buffer.from(hexString2Array(ecKey.publicKey)), signature]);
        // add the keystore fullSignature
        const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);

        // re-encode with signature included
        const rawTransaction = rlp.encode(rawTx);

        resolve({encoded: rawTransaction.toString('hex'), signature: toHex(signature)})
    }
});


const  txInputFormatter = (options) => {

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

    ['gasPrice', 'gasLimit', 'nonce'].filter(function (key) {
        return options[key] !== undefined;
    }).forEach(function(key){
        options[key] = toHex(options[key]);
    });

    return options;
};


const toAionLong = (val) => {
    let num;
    if (
        val === undefined ||
        val === null ||
        val === '' ||
        val === '0x'
    ) {
        return null;
    }

    if (typeof val === 'string') {
        if(isHex(val.toLowerCase())){
            num = new BN(removeLeadingZeroX(val.toLowerCase()), 16);
        }else{
            num = new BN(val, 10);
        }
    }

    if (typeof val === 'number') {
        num = new BN(val);
    }

    return new rlp.AionLong(num);
};
