import {ECPair, TransactionBuilder} from "bitcoinjs-lib";
import BigNumber from "bignumber.js";
import {networks} from './network';
import {removeLeadingZeroX} from "../utils";
/***
 *
 * @param transaction
 * {
 *    private_key: hex String
 *    to_address: hex String
 *    change_address: hex String
 *    amount: number (satoshi)
 *    utxos: [
 *        {
 *            amount: number (satoshi)
 *            script: hex String
 *            hash: hex String
 *            index: number
 *        }
 *        ...
 *    ]
 * }
 * @param network: one of [BTC, BTCTEST, LTC, LTCTEST]
 * @returns {Promise<any>} {encoded: hex String}
 */
export const signTransaction = (transaction, network='BTC')=> new Promise((resolve, reject) => {
    const {private_key, utxos, amount: amount_, to_address, change_address} = transaction;
    const mainnet = networks[network];
    try {
        const keyPair = ECPair.fromPrivateKey(Buffer.from(removeLeadingZeroX(private_key), 'hex'), {network: mainnet});

        const txb = new TransactionBuilder(mainnet);
        const amount = new BigNumber(amount_);

        const fee = estimateFeeBTC(utxos.length, 2);

        let balance = new BigNumber(0);
        for (let ip = 0; ip < utxos.length; ip++) {
            balance = balance.plus(new BigNumber(utxos[ip].amount));
            txb.addInput(utxos[ip].hash, utxos[ip].index, 0xffffffff, Buffer.from(utxos[ip].script, 'hex'));
        }
        if (balance.toNumber() < amount.toNumber() + fee) {
            reject("error_insufficient_amount")
        }
        const needChange = balance.toNumber() > amount.toNumber() + fee;
        txb.addOutput(to_address, amount.toNumber());
        needChange && txb.addOutput(change_address, balance.toNumber() - amount.toNumber() - fee);
        for (let ip = 0; ip < utxos.length; ip++) {
            txb.sign(ip, keyPair);
        }
        const tx = txb.build();
        resolve({encoded: tx.toHex()});
    }catch (e) {
        reject(e)
    }
});

const estimateFeeBTC = (m,n)=>148 * m + 34 * n + 10;