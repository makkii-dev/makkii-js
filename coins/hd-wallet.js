import * as bip39 from 'bip39';
import {CoinType} from './coinType';
import aion from './aion/keystore';
import btc from './btc+ltc/keystore';
import eth from './eth/keystore';
import tron from './tron/keystore';
import hdKey from 'hdkey';

class HDWallet {
    mnemonic;

    constructor(mnemonic) {
        this.mnemonic = mnemonic;
    }

    setMnemonic =(mnemonic)=>{
        this.mnemonic = mnemonic;
    };

    genMnemonic = () => {
        this.mnemonic = bip39.generateMnemonic(128);
        return this.mnemonic;
    };


    derivePath = (coinType, account, change, address_index, isTestNet = false) => new Promise(((resolve, reject) => {
        let path = `m/44'/${coinType}'/${account}'/${change}/${address_index}`;
        if(coinType === CoinType.BITCOIN || coinType === CoinType.LITECOIN) {
            path = `m/84'/${coinType}'/${account}'/${change}/${address_index}`;
        }

        bip39.mnemonicToSeed(this.mnemonic, '').then(seed=>{
            if(coinType === CoinType.AION){
                const keyPair = aion.derivePath(path ,seed);
                resolve({private_key: keyPair.privateKey, public_key: keyPair.publicKey, address:keyPair.address, index: address_index});
            }else {
                let node = hdKey.fromMasterSeed(seed);
                let keyPairBIP44 = node.derive(path);
                let keyPair;
                switch (coinType) {
                    case CoinType.BITCOIN:
                        let options1 = isTestNet?{network: 'BTCTEST'}:{network:'BTC'};
                        keyPair = btc.keyPair(keyPairBIP44.privateKey, options1);
                        break;
                    case CoinType.LITECOIN:
                        let options2 = isTestNet?{network: 'LTCTEST'}:{network:'LTC'};
                        keyPair = btc.keyPair(keyPairBIP44.privateKey, options2);
                        break;
                    case CoinType.ETHEREUM:
                        keyPair = eth.keyPair(keyPairBIP44.privateKey);
                        break;
                    case CoinType.TRON:
                        keyPair = tron.keyPair(keyPairBIP44.privateKey,{isTestNet: isTestNet});
                        break;
                }
                if(keyPair) {
                    resolve({private_key: keyPair.privateKey, public_key: keyPair.publicKey, address:keyPair.address, index: address_index});
                }else {
                    reject(`not support coin: ${coinType}`);
                }
            }
        }).catch(e=>{
            reject('not set mnemonic' + e);
        })

    }))

}

export {HDWallet}

export const hdWallet = new HDWallet();

