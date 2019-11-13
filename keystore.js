import aionkeystore from './coins/aion/keystore';
import btckeystore from './coins/btc+ltc/keystore';
import ethkeystore from './coins/eth/keystore';
import tronkeystore from './coins/tron/keystore';
import * as bip39 from "bip39";
import {getWalletStatus} from "./coins/btc+ltc/keystore/ledger";

function initKeystore(support_coin_lists,isTestNet){
    let COINS = {};
    for (let coin of support_coin_lists){
        switch (coin) {
            case 'AION':
                COINS = {
                    ...COINS,
                    AION: {
                        keystore: aionkeystore
                    }
                };
                break;
            case 'BTC':
                COINS = {
                    ...COINS,
                    BTC: {
                        keystore: btckeystore,
                        network: isTestNet ? 'BTCTEST' : 'BTC',
                    }
                };
                break;
            case 'ETH':
                COINS = {
                    ...COINS,
                    ETH: {
                        keystore: ethkeystore,
                    }
                };
                break;
            case 'LTC':
                COINS = {
                    ...COINS,
                    LTC: {
                        keystore: btckeystore,
                        network: isTestNet ? 'LTCTEST' : 'LTC',
                    }
                };
                break;
            case 'TRX':
                COINS = {
                    ...COINS,
                    TRX: {
                        keystore: tronkeystore,
                    }
                };
                break;
            default:
                throw new Error(`Not support for coin ${coin}`);
        }
    }
    return COINS;
}



export function client (support_coin_lists, isTestNet) {

    const COINS = initKeystore(support_coin_lists, isTestNet);
    let _mnemonic = '';

    /***
     *
     * @param tx
     * @param coinType
     * @returns {Promise<never>|Promise<any>|Promise<*>|Promise<any>}
     */
    function signTransaction (coinType, tx){
        const coin = COINS[coinType.toUpperCase()];
        if(coin.keystore.signTransaction!==undefined){
            return coin.keystore.signTransaction(tx, coin.network);
        }
       return Promise.reject(`not support coin: ${coinType}`);
    }


    /***
     *
     * @param coinType
     * @param address_index
     * @returns {*|Promise|Promise<any>|Promise<*>}
     */
    const getKey = (coinType, address_index) => new Promise((resolve, reject) => {
        const coin = COINS[coinType.toUpperCase()];
        if(coin.keystore.getKeyFromMnemonic!==undefined){
            coin.keystore.getKeyFromMnemonic(_mnemonic, address_index, {network:coin.network}).then(res=>
                resolve(res)
            ).catch(e=>{
                reject(e)
            })
        }else{
            reject(`not support coin: ${coinType}`);
        }
    });

    const setMnemonic = (mnemonic, passphrase) => {
        _mnemonic = mnemonic;
    };

    const generateMnemonic = () => {
        _mnemonic =  bip39.generateMnemonic();
        return _mnemonic;
    };

    const getKeyFromMnemonic = (coinType, address_index, mnemonic) => new Promise((resolve, reject) => {
        const coin = COINS[coinType.toUpperCase()];
        if(coin.keystore.getKeyFromMnemonic!==undefined){
            coin.keystore.getKeyFromMnemonic(mnemonic, address_index, {network:coin.network}).then(res=>
                resolve(res)
            ).catch(e=>{
                reject(e)
            })
        }else{
            reject(`not support coin: ${coinType}`);
        }
    });

    /***
     * @param coinType
     * @param priKey
     * @param options
     * @returns {Promise<any> | Promise<*>}
     */
    const recoverKeyPairByPrivateKey = (coinType, priKey, options) => {
        const coin = COINS[coinType.toUpperCase()];
        return new Promise(((resolve, reject) => {
            try {
                let keyPair = coin.keystore.keyPair(priKey, {network: coin.network, ...options});
                if (keyPair !== undefined) {
                    const {privateKey, publicKey, address, ...reset} = keyPair;
                    resolve({private_key: privateKey, public_key: publicKey, address, ...reset})
                } else {
                    reject(`recover privKey failed: not support this coinType ${coinType}`);
                }
            } catch (e) {
                reject(`recover privKey failed: not support this coinType ${coinType}`);
            }
        }));
    };

    /***
     * @param coinType
     * @param WIF
     * @param options
     * @returns {Promise<any> | Promise<*>}
     */
    const recoverKeyPairByWIF = (coinType, WIF, options) => {
        const coin = COINS[coinType.toUpperCase()];
        return new Promise(((resolve, reject) => {
            try {
                let keyPair = coin.keystore.keyPairFromWIF(WIF, {network: coin.network, ...options});
                if (keyPair !== undefined) {
                    const {privateKey, publicKey, address, ...reset} = keyPair;
                    resolve({private_key: privateKey, public_key: publicKey, address, ...reset})
                } else {
                    reject(`recover WIF failed: not support this coinType ${coinType}`);
                }
            } catch (e) {
                reject(`recover WIF failed: not support this coinType ${coinType}`);
            }
        }));
    };

    /***
     *
     * @param address
     * @param coinType
     * @returns {Promise<never>|*|Promise|Promise<any>|Promise<*>}
     */
    const validateAddress = (coinType, address) => {
        const coin = COINS[coinType.toUpperCase()];
        if(coin.keystore.validateAddress!==undefined){
            return coin.keystore.validateAddress(address, coin.network);
        }
        return Promise.reject(`not support this coinType ${coinType}`);
    };

    const validatePrivateKey = (coinType, privateKey) => {
        const coin = COINS[coinType.toUpperCase()];
        if(coin.keystore.validatePrivateKey!==undefined){
            return coin.keystore.validatePrivateKey(privateKey);
        }
        return true;
    };


    const getKeyByLedger = async  (coinType, index) => {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.keystore.getKeyByLedger !== undefined) {
            try {
                return await coin.keystore.getKeyByLedger(index, coin.network);
            }catch (e) {
                throw e;
            }
        }
        return Error(`not support coin: ${coinType}`);
    };

    const signByLedger = async  (coinType, index, sender, msg) => {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.keystore.signByLedger !== undefined) {
            try {
                return await coin.keystore.signByLedger(index, sender, msg, coin.netowrk);
            }catch (e) {
                throw e;
            }
        }
        return Error(`not support coin: ${coinType}`);
    };

    const recoverFromKeystore = (coinType, input, password) =>{
        const coin = COINS[coinType.toUpperCase()];
        if (coin.keystore.getKeyByLedger !== undefined) {
            try {
                return coin.keystore.fromV3(input, password);
            }catch (e) {
                throw e;
            }
        }
        return Error(`not support coin: ${coinType}`);
    };

    const setLedgerTransport = (coinType, transport) => {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.keystore.initWallet !== undefined) {
            try {
                return coin.keystore.initWallet(transport);
            }catch (e) {
                throw e;
            }
        }
        return Error(`not support coin: ${coinType}`);
    };

    const getLedgerStatus = (coinType) => {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.keystore.initWallet !== undefined) {
            try {
                return coin.keystore.getWalletStatus();
            }catch (e) {
                throw e;
            }
        }
        return Error(`not support coin: ${coinType}`);
    };

    return {
        signTransaction,
        getKey,
        setMnemonic,
        generateMnemonic,
        recoverKeyPairByPrivateKey,
        recoverKeyPairByWIF,
        validateAddress,
        getKeyFromMnemonic,
        getKeyByLedger,
        signByLedger,
        recoverFromKeystore,
        setLedgerTransport,
        validatePrivateKey,
        getLedgerStatus
    }
}
