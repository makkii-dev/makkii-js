import { NativeModules } from 'react-native';
import {ECPair, TransactionBuilder, payments} from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';
import {CoinType} from './coinType';
const { RNMakkiiCore } = NativeModules;

/***
 *
 * @param tx = {
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

const signTransactionBTCOrLTC = (tx, network)=> new Promise((resolve, reject) => {
    const {private_key, utxos, amount: amount_, to_address, change_address} = tx;
    const mainnet = networks[network];
    const keyPair = new ECPair(Buffer.from(private_key, 'hex'), undefined, {network: mainnet});
    const p2wpkh = payments.p2wpkh({pubkey:keyPair.publicKey, network: mainnet});
    const p2sh = payments.p2sh({redeem:p2wpkh,network:mainnet});
    const txb = new TransactionBuilder(mainnet);
    const amount = new BigNumber(amount_);

    const fee   = estimateFeeBTC(utxos.length, 2);

    let balance = new BigNumber(0);
    for (let ip = 0; ip < utxos.length; ip++) {
        balance.plus(new BigNumber(utxos[ip].amount));
        txb.addInput(utxos[ip].hash, utxos[ip].index);
    }
    if (balance.toNumber() < amount.toNumber() + fee){
        reject("error_insufficient_amount")
    }
    const needChange = balance.toNumber() > amount.toNumber() + fee;
    txb.addOutput(to_address, amount.toNumber());
    needChange&&txb.addOutput(change_address, balance.toNumber()-amount.toNumber()-fee);
    for (let ip = 0; ip < utxos.length; ip++) {
        txb.sign(ip, keyPair, p2sh.redeem.output, null, utxos[ip].amount)
    }
    const tx = txb.build();
    resolve({encoded:tx.toHex()});
});

const signTransaction = (tx, coinType)  => {
    if(coinType === CoinType.BITCOIN || coinType === CoinType.LITECOIN) {
        return signTransactionBTCOrLTC(tx, tx.network);
    }else {
        return RNMakkiiCore.signTransaction(tx, coinType);
    }
};

export default {
    ...RNMakkiiCore,
    signTransaction,
    CoinType
};
