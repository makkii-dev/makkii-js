import nacl from 'tweetnacl';
import blake2b from 'blake2b';
import { hexutil } from "lib-common-util-js";
const A0_IDENTIFIER = [0xA0];

export const keyPair = function(priKey) {

    if(typeof priKey === 'string'){
        priKey = Buffer.from(hexutil.stripZeroXHexString(priKey), 'hex');
    }else if(!Buffer.isBuffer(priKey)){
        throw Error('Seed must be a buffer or a hex string');
    }
    if(!validatePrivateKey(priKey)){
        throw Error('inValid privateKey')
    }
    const keyPair = priKey.length === 64?nacl.sign.keyPair.fromSecretKey(priKey):nacl.sign.keyPair.fromSeed(priKey);

    const privateKey = Buffer.from(keyPair.secretKey);
    const publicKey = Buffer.from(keyPair.publicKey);
    const address = computeA0Address(publicKey);

    function sign(digest){
        if (typeof digest === 'string') {
            digest = Buffer.from(hexutil.stripZeroXHexString(digest), 'hex');
        }
        try{
            let res = nacl.sign.detached(digest, Buffer.from(privateKey));
            return Buffer.from(res);
        }catch (e) {
            throw `Message failed to sign, ${e}`;
        }
    }

    function computeA0Address(publicKey){
        let addressHash = blake2b(32).update(publicKey).digest();
        addressHash.set(A0_IDENTIFIER, 0);
        return addressHash;
    }

    return {privateKey:privateKey.toString('hex'), publicKey:publicKey.toString('hex'), address:hexutil.toHex(address), sign}
};


export const validatePrivateKey = (priKey)=>{
    if(typeof priKey === 'string'){
        priKey = Buffer.from(hexutil.stripZeroXHexString(priKey), 'hex');
    }else if(!Buffer.isBuffer(priKey)){
        throw Error('Seed must be a buffer or a hex string');
    }
    if(priKey.length === nacl.sign.seedLength){
        return true;
    }else if(priKey.length !== nacl.sign.secretKeyLength){
        return false;
    }
    const keyPair = nacl.sign.keyPair.fromSecretKey(priKey);
    const msg = Buffer.from('test');
    const sig = nacl.sign.detached(msg, keyPair.secretKey);
    return nacl.sign.detached.verify(msg,sig,keyPair.publicKey);
};




