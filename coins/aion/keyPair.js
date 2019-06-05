import sodium from 'sodium-javascript';
import blake2b from 'blake2b';
import {toHex} from '../utils';
const A0_IDENTIFIER = [0xA0];

export const keyPair = function(priKey: Buffer|String, option?:any) {

    if (typeof priKey == 'string') {
        if (priKey.startsWith('0x')){
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, 'hex');
    }

    const privateKey = priKey;
    const publicKey = priKey.slice(32,64);
    const address = computeA0Address(publicKey);

    function sign(digest){
        let signedMessage = new Buffer((new Uint8Array(64)));
        if (typeof hash === 'string') {
            digest = Buffer.from(digest, 'hex');
        }
        let res = sodium.crypto_sign_detached(signedMessage, digest, Buffer.from(privateKey));

        if (res === -1) {
            throw new Error("Message failed to sign");
        }
        return signedMessage;
    }

    function computeA0Address(publicKey){
        let addressHash = blake2b(32).update(publicKey).digest();
        addressHash.set(A0_IDENTIFIER, 0);
        return addressHash;
    }

    return {privateKey:toHex(privateKey), publicKey:toHex(publicKey), address, sign}
};

export const getKeyPairFromSeed = function (seed) {
    let pk = new Buffer(new Uint8Array(32));
    let sk = new Buffer(new Uint8Array(64));
    let bufferSeed = new Buffer(seed);

    sodium.crypto_sign_seed_keypair(pk, sk, bufferSeed);
    return keyPair(sk);
};


