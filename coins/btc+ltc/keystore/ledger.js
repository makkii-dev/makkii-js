import Btc from "@ledgerhq/hw-app-btc";
import {payments} from "bitcoinjs-lib";

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
    const path = `m/49'/0'/0'/0/${index}`;
    try {
        const {publicKey} = await wallet.getWalletPublicKey(path);
        const {address} = payments.p2pkh({pubkey: Buffer.from(publicKey, 'hex'), network: network});
        return {address, index, publicKey};
    }catch (e) {
        throw e;
    }
};

const signByLedger = async (index, sender, msg, network) => {
    msg = Buffer.isBuffer(msg)? msg: Buffer.from(msg);
    let address;
    try{
        address = await getKeyByLedger(index, network).address;
    }catch (e) {
        throw e;
    }
    if(address!==sender)
        throw new Error('error.wrong_device');
    const path = `m/49'/0'/0'/0/${index}`;
    let result;
    try{
        result = await wallet.signMessageNew_async(path,msg.toString('hex'));
    }catch (e) {
        throw e;
    }
    const v = result['v'] + 27 + 4;
    const signature = Buffer.from(v.toString(16) + result['r'] + result['s'], 'hex').toString('base64');
    return {signature}
};


export {
    initWallet,
    getKeyByLedger,
    signByLedger,
    getWalletStatus
}
