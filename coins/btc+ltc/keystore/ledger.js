import Btc from "@ledgerhq/hw-app-btc";
import {payments} from "bitcoinjs-lib";
import {networks} from './network';

let wallet = {};
let isConnect =  false;

const initWallet = (transport) => {
    transport.on('disconnect',()=>{
        isConnect = false
    });
    wallet = new Btc(transport);
};

const getWalletStatus = ()=>isConnect;

const getKeyByLedger = async (index, network) => {
    /*
        purpose 44: for legacy, prefix: 1
        purpose 49: for p2sh, prefix: 3
        purpose 84: for bench32, prefix: bc1
    */
    const coinType = network.startsWith('BTC') ? 0 : 2;
    const network_ = networks[network];
    const path = `m/49'/${coinType}'/0'/0/${index}`;
    try {
        let {publicKey} = await wallet.getWalletPublicKey(path);
        publicKey = getCompressPublicKey(publicKey);
        const {address} = payments.p2pkh({pubkey: Buffer.from(publicKey, 'hex'), network: network_});
        return {address, index, publicKey};
    }catch (e) {
        throw e;
    }
};


function getCompressPublicKey(publicKey) {
    let compressedKeyIndex;
    if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
        compressedKeyIndex = "03";
    } else {
        compressedKeyIndex = "02";
    }
    return compressedKeyIndex + publicKey.substring(2, 66);
}
const signByLedger = async (index, sender, msg, network) => {
    msg = Buffer.isBuffer(msg)? msg: Buffer.from(msg);
    let address;
    try{
        const ret  = await getKeyByLedger(index, network);
        address = ret.address;
    }catch (e) {
        throw e;
    }
    if(address!==sender)
        throw new Error('error.wrong_device');
    const coinType = network.startsWith('BTC') ? 0 : 2;
    const path = `m/49'/${coinType}'/0'/0/${index}`;
    let result;
    try{
        result = await wallet.signMessageNew(path,msg.toString('hex'));
    }catch (e) {
        throw e;
    }
    return {signature: result.r+result.s}
};


export {
    wallet,
    initWallet,
    getKeyByLedger,
    signByLedger,
    getWalletStatus
}
