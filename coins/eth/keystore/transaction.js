import EthereumTx from 'ethereumjs-tx';
import {hexutil} from "lib-common-util-js";

const KEY_MAP = [
    'amount',
    'nonce',
    'gasLimit',
    'gasPrice',
    'to',
    'private_key',
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
 *     network: one of {morden, ropsten, rinkeby, goerli, kovan}
 * }
 * @returns {Promise<any> | Promise<*>} {encoded: hex String: signature: hex string}
 */
export const signTransaction = (transaction)=> new Promise((resolve, reject) => {
    const {network, amount, nonce, gasLimit, gasPrice, to, private_key, data} = transaction;
    const privateKey = Buffer.from(hexutil.removeLeadingZeroX(private_key),'hex');

    // check key;
    KEY_MAP.forEach(k=>{
        if(!transaction.hasOwnProperty(k)){
            reject(k + ' not found');
        }
    });

    let txParams = {
        nonce: hexutil.toHex(nonce),
        gasPrice: hexutil.toHex(gasPrice),
        gasLimit: hexutil.toHex(gasLimit),
        to: hexutil.toHex(to),
        value: hexutil.toHex(amount),
        chainId: getChainId(network),
    };
    if (data) {
        txParams = {...txParams, data:data};
    }
    const tx = new EthereumTx(txParams);
    try{
        tx.sign(privateKey);
        resolve({encoded:'0x'+tx.serialize().toString('hex'), r:tx.r.toString('hex'),s:tx.s.toString('hex'),v:tx.v.toString('hex') })
    }catch (e) {
        reject(`keystore sign transaction failed: ${e}`);
    }
});


const getChainId=(network)=> {
    if (network.toLowerCase() === 'morden') {
        return 2;
    } else if (network.toLowerCase() === 'ropsten') {
        return 3;
    } else if (network.toLowerCase() === 'rinkeby') {
        return 4;
    } else if (network.toLowerCase() === 'goerli') {
        return 5;
    } else if (network.toLowerCase() === 'kovan') {
        return 42;
    } else {
        return 1;
    }
}