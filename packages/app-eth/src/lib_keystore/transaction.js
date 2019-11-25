import EthereumTx from 'ethereumjs-tx';
import { hexutil } from "../lib_api/node_modules/lib-common-util-js";
import { wallet } from "./ledger";

const KEY_MAP = [
    'amount',
    'nonce',
    'gasLimit',
    'gasPrice',
    'to',
    'private_key',
];


/** *
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
// eslint-disable-next-line import/prefer-default-export
export const signTransaction = async (transaction) => {
    const { network, amount, nonce, gasLimit, gasPrice, to, private_key, data, extra_param } = transaction;
    const privateKey = Buffer.from(hexutil.removeLeadingZeroX(private_key), 'hex');

    // check key;
    KEY_MAP.forEach(k => {
        // eslint-disable-next-line no-prototype-builtins
        if (!transaction.hasOwnProperty(k)) {
            throw new Error(`${k} not found`);
        }
    });

    let txParams = {
        nonce: hexutil.toHex(nonce),
        gasPrice: hexutil.toHex(gasPrice),
        gasLimit: hexutil.toHex(gasLimit),
        to: hexutil.toHex(to),
        value: hexutil.toHex(amount),
        chainId: getChainId(network),
        v: getChainId(network),
        r: "0x00",
        s: "0x00",
    };
    if (data) {
        txParams = { ...txParams, data };
    }
    const tx = new EthereumTx(txParams);
    if (extra_param && extra_param.type === '[ledger]') {
        const { sender, derivationIndex } = extra_param;
        const path = `44'/60'/0'/0/${derivationIndex}`;
        const { address } = await wallet.getAddress(path, false);
        if (address !== sender) {
            throw new Error('ledger.wrong_device');
        }
        console.log('try sign=>', tx.serialize().toString('hex'))
        const res = await wallet.signTransaction(path, tx.serialize().toString('hex'));
        const sig = {};
        sig.r = Buffer.from(res.r, 'hex');
        sig.s = Buffer.from(res.s, 'hex');
        sig.v = parseInt(res.v, 16);
        Object.assign(tx, sig);
        const validSig = tx.verifySignature();
        console.log('validSig=>', validSig);
        console.log('tx=>', tx.serialize().toString('hex'));
        return { encoded: `0x${tx.serialize().toString('hex')}`, r: tx.r.toString('hex'), s: tx.s.toString('hex'), v: tx.v.toString('hex') };
    }

    tx.sign(privateKey);
    console.log('tx=>', tx.serialize().toString('hex'));
    return { encoded: `0x${tx.serialize().toString('hex')}`, r: tx.r.toString('hex'), s: tx.s.toString('hex'), v: tx.v.toString('hex') };

};


const getChainId = (network) => {
    if (network.toLowerCase() === 'morden') {
        return 2;
    } if (network.toLowerCase() === 'ropsten') {
        return 3;
    } if (network.toLowerCase() === 'rinkeby') {
        return 4;
    } if (network.toLowerCase() === 'goerli') {
        return 5;
    } if (network.toLowerCase() === 'kovan') {
        return 42;
    }
    return 1;

}
