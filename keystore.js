import {CoinType} from './coins/coinType';
import {HDWallet, hdWallet} from "./coins/hd-wallet";
import aionkeystore from './coins/aion/keystore';
import btckeystore from './coins/btc+ltc/keystore';
import ethkeystore from './coins/eth/keystore';
import tronkeystore from './coins/tron/keystore';

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


    /***
     *
     * @param tx
     * @param coinType
     * @returns {Promise<never>|Promise<any>|Promise<*>|Promise<any>}
     */
    function signTransaction (tx, coinType){
        const coin = COINS[coinType.toUpperCase()];
        if(coin.keystore!==undefined){
            return coin.keystore.signTransaction(tx, coin.network);
        }
       return Promise.reject('not support coin:', coinType);
    }


    /***
     *
     * @param coinType
     * @param address_index
     * @returns {*|Promise|Promise<any>|Promise<*>}
     */
    const getKey = (coinType, address_index) => {
        coinType = typeof coinType === "number"? coinType: CoinType.fromCoinSymbol(coinType);
        return hdWallet.derivePath(coinType, 0, 0, address_index, isTestNet);
    };

    const setMnemonic = (mnemonic, passphrase) => {
        hdWallet.setMnemonic(mnemonic)
    };

    const generateMnemonic = () => {
        return hdWallet.genMnemonic();
    };

    const getKeyFromMnemonic = (coinType, address_index, mnemonic) => {
        coinType = typeof coinType === "number"? coinType: CoinType.fromCoinSymbol(coinType);
        const wallet = new HDWallet(mnemonic);
        return wallet.derivePath(coinType, 0, 0, address_index, isTestNet);
    };

    /***
     * @param priKey
     * @param coinType
     * @param isTestNet
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
                    reject('recover privKey failed: not support this coinType ', coinType);
                }
            } catch (e) {
                reject('recover privKey failed: not support this coinType ', coinType);
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
        if(coin.keystore!==undefined){
            return coin.keystore.validateAddress(address);
        }
        return Promise.reject('not support this coinType ', coinType);
    };


    return {
        signTransaction,
        getKey,
        setMnemonic,
        generateMnemonic,
        recoverKeyPairByPrivateKey,
        validateAddress,
        getKeyFromMnemonic,
    }
}