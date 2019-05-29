import { NativeModules } from 'react-native';
import {ECPair, TransactionBuilder, payments} from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';
import {CoinType} from './coinType';
const { RNMakkiiCore } = NativeModules;


const networks = {
    BTC: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },
    BTCTEST: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef
    },
    LTC: {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bip32: {
            public: 0x019da462,
            private: 0x019d9cfe
        },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0
    },
    LTCTEST:{
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4, //  for segwit (start with 2)
        wif: 0xef
    }
};
const estimateFeeBTC = (m,n)=>148 * m + 34 * n + 10;


const signTransaction = (tx, coinType)  => {
    if(coinType === CoinType.BITCOIN || coinType === CoinType.LITECOIN) {
        const {network} = tx;
        let tranasction = Object.assign({},tx);
        return signTransactionBTCOrLTC(tranasction, network);
    }else {
        return RNMakkiiCore.signTransaction(tx, coinType);
    }
};

/***
 *
 * @param transaction: {
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
const signTransactionBTCOrLTC = (transaction, network)=> new Promise((resolve, reject) => {
    const {private_key, utxos, amount: amount_, to_address, change_address} = transaction;
    const mainnet = networks[network];
    try {
        const keyPair = ECPair.fromPrivateKey(Buffer.from(private_key, 'hex'), {network: mainnet});

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

export default {
    ...RNMakkiiCore,
    signTransaction,
    CoinType
};
