import { NativeModules } from 'react-native';
import {CoinType} from './coinType';
import {hdWallet} from "./hd-wallet";
import coins from './coins';



const { RNMakkiiCore } = NativeModules;


/***
 *
 * @param tx
 * @param coinType
 * @returns {Promise<never>|Promise<any>|Promise<*>|Promise<any>}
 */
const signTransaction = (tx, coinType)  => {
    switch (coinType) {
        case CoinType.AION:
            return coins.aion.signTransaction(tx);
        case CoinType.BITCOIN:
        case CoinType.LITECOIN:
            const {network} = tx;
            let transaction = Object.assign({},tx);
            return coins.btc.signTransaction(transaction, network);
        case CoinType.ETHEREUM:
            return coins.eth.signTransaction(tx);
        case CoinType.TRON:
            return coins.tron.signTransaction(tx);
        default:
            return Promise.reject('not support coin:', coinType);
    }
};


/***
 *
 * @param coinType
 * @param account
 * @param change
 * @param address_index
 * @param isTestNet
 * @returns {*|Promise|Promise<any>|Promise<*>}
 */
const getKey = (coinType, account, change, address_index , isTestNet) => {
    return hdWallet.derivePath(coinType,account,change,address_index,isTestNet);
};

const createByMnemonic = (mnemonic, passphrase) => {
    hdWallet.setMnemonic(mnemonic)
};

const generateMnemonic = () => {
    return hdWallet.genMnemonic();
};

/***
 * @param priKey
 * @param coinType
 * @param isTestNet
 * @returns {Promise<any> | Promise<*>}
 */
const recoverKeyPairByPrivateKey = (priKey, coinType, isTestNet) => {
    return new Promise(((resolve, reject) => {
        try {
            let keyPair;
            switch (coinType) {
                case CoinType.AION:
                    keyPair = coins.aion.keyPair(priKey);
                    break;
                case CoinType.BITCOIN:
                    let options1 = isTestNet ? {network: 'BTCTEST'} : {network: 'BTC'};
                    keyPair = coins.btc.keyPair(priKey, options1);
                    break;
                case CoinType.ETHEREUM:
                    keyPair = coins.eth.keyPair(priKey);
                    break;
                case CoinType.LITECOIN:
                    let options2 = isTestNet ? {network: 'LTCTEST'} : {network: 'LTC'};
                    keyPair = coins.btc.keyPair(priKey, options2);
                    break;
                case CoinType.TRON:
                    keyPair = coins.tron.keyPair(priKey);
                    break;
                default:
            }
            if (keyPair !== undefined) {
                resolve({private_key: keyPair.privateKey, public_key: keyPair.publicKey, address: keyPair.address})
            } else {
                reject('recover privKey failed: not support this coinType ',coinType);
            }
        } catch (e) {
            reject('recover privKey failed:', e);
        }

    }));
};

/***
 *
 * @param address
 * @param coinType
 * @returns {Promise<never>|*|Promise|Promise<any>|Promise<*>}
 */
const validateAddress = (address, coinType) => {
    switch (coinType) {
        case CoinType.AION:
            return coins.aion.validateAddress(address);
        case CoinType.BITCOIN:
        case CoinType.LITECOIN:
            return coins.btc.validateAddress(address);
        case CoinType.ETHEREUM:
            return coins.eth.validateAddress(address);
        case CoinType.TRON:
            return coins.tron.validateAddress(address);
        default:
            return Promise.reject('not support this coinType ',coinType);
    }
};

export default {
    ...RNMakkiiCore,
    signTransaction,
    getKey,
    createByMnemonic,
    generateMnemonic,
    recoverKeyPairByPrivateKey,
    validateAddress,
    CoinType
};
