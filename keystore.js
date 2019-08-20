import aionkeystore from './coins/aion/keystore';
import btckeystore from './coins/btc+ltc/keystore';
import ethkeystore from './coins/eth/keystore';
import tronkeystore from './coins/tron/keystore';
import * as bip39 from "bip39";

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
    function signTransaction (tx, coinType){
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
     * @param priKey
     * @param coinType
     * @returns {Promise<any> | Promise<*>}
     */
    const recoverKeyPairByPrivateKey = (priKey, coinType) => {
        const coin = COINS[coinType.toUpperCase()];
        return new Promise(((resolve, reject) => {
            try {
                let keyPair = coin.keystore.keyPair(priKey, {network: coin.network});
                if (keyPair !== undefined) {
                    resolve({private_key: keyPair.privateKey, public_key: keyPair.publicKey, address: keyPair.address})
                } else {
                    reject(`recover privKey failed: not support this coinType ${coinType}`);
                }
            } catch (e) {
                reject(`recover privKey failed: not support this coinType ${coinType}`);
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
        const coin = COINS[coinType.toUpperCase()];
        if(coin.keystore.validateAddress!==undefined){
            return coin.keystore.validateAddress(address);
        }
        return Promise.reject(`not support this coinType ${coinType}`);
    };


    const getKeyByLedger = async  (symbol, index) => {
        const coin = COINS[symbol.toUpperCase()];
        if (coin.keystore.getKeyByLedger !== undefined) {
            try {
                return await coin.keystore.getKeyByLedger(index);
            }catch (e) {
                throw e;
            }
        }
        return Error(`not support coin: ${symbol}`);
    };

    const signByLedger = async  (symbol, index, sender, msg) => {
        const coin = COINS[symbol.toUpperCase()];
        if (coin.keystore.signByLedger !== undefined) {
            try {
                return await coin.keystore.signByLedger(index, sender, msg);
            }catch (e) {
                throw e;
            }
        }
        return Error(`not support coin: ${symbol}`);
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

    return {
        signTransaction,
        getKey,
        setMnemonic,
        generateMnemonic,
        recoverKeyPairByPrivateKey,
        validateAddress,
        getKeyFromMnemonic,
        getKeyByLedger,
        signByLedger,
        recoverFromKeystore,
        setLedgerTransport
    }
}