import {ECPair, payments} from 'bitcoinjs-lib';
import {networks} from './network';
import {toHex} from '../utils';

export const keyPair = function(priKey:Buffer|String, options?:any){
    if (typeof priKey == 'string') {
        if (priKey.startsWith('0x')){
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, 'hex');
    }
    let network = networks.BTC;
    if(options&&options.network){
        network = networks[options.network];
    }
    const key  = ECPair.fromPrivateKey(priKey,{network: network});
    const privateKey = key.privateKey;
    const publicKey = key.publicKey;
    const { address } = payments.p2pkh({ pubkey: key.publicKey, network:network});
    return {privateKey: toHex(privateKey), publicKey: toHex(publicKey), address, sign: key.sign}
};

