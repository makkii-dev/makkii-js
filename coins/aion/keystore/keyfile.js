import {ab2str, crypto, toHex} from "../../../utils";
import RLP from 'aion-rlp'
import scrypt from 'scrypt.js'
import blake2b from 'blake2b';
import {keyPair} from './keyPair'

function fromV3(input, password){
    let KeystoreItem = RLP.decode(input);
    const Crypto = RLP.decode(KeystoreItem[3]);
    const CipherParams = RLP.decode(Crypto[4]);
    const KdfParams = RLP.decode(Crypto[5]);

    let Keystore = {};
    Keystore['id'] = ab2str(KeystoreItem[0]); //0
    Keystore['version'] = toHex(KeystoreItem[1]); //1
    Keystore['address'] = ab2str(KeystoreItem[2]);//2

    Keystore['crypto'] = {};//3
    Keystore.crypto['cipher'] = ab2str(Crypto[0]);//4
    Keystore.crypto['cipherText'] = ab2str(Crypto[1]);//5
    Keystore.crypto['kdf'] = ab2str(Crypto[2]);//6
    Keystore.crypto['mac'] = ab2str(Crypto[3]);//7

    Keystore.crypto['cipherParams'] = {};//8
    Keystore.crypto.cipherParams['iv'] = ab2str(CipherParams[0]);//10


    let derivedKey;
    if (Keystore.crypto['kdf'] === 'scrypt') {
        Keystore.crypto['kdfParams'] = {};
        Keystore.crypto.kdfParams['c'] = toHex(KdfParams[0]);//11
        Keystore.crypto.kdfParams['dklen'] = toHex(KdfParams[1]);//12
        Keystore.crypto.kdfParams['n'] = toHex(KdfParams[2]);//13
        Keystore.crypto.kdfParams['p'] = toHex(KdfParams[3]);//14
        Keystore.crypto.kdfParams['r'] = toHex(KdfParams[4]);//15
        Keystore.crypto.kdfParams['salt'] = ab2str(KdfParams[5]);//16
        derivedKey = scrypt(
            Buffer.from(password),
            Buffer.from(Keystore.crypto.kdfParams['salt'], 'hex'),
            parseInt(Keystore.crypto.kdfParams['n'],16),
            parseInt(Keystore.crypto.kdfParams['r'],16),
            parseInt(Keystore.crypto.kdfParams['p'],16),
            parseInt(Keystore.crypto.kdfParams['dklen'],16)
        );
    }else if(Keystore.crypto['kdf'] === 'pbkdf2'){
        Keystore.crypto['kdfParams'] = {};
        Keystore.crypto.kdfParams['c'] = toHex(KdfParams[0]);//11
        Keystore.crypto.kdfParams['dklen'] = toHex(KdfParams[1]);//12
        Keystore.crypto.kdfParams['prf'] = 'hmac-sha256';//13
        Keystore.crypto.kdfParams['salt'] = ab2str(KdfParams[5]);//16
        derivedKey = crypto.pbkdf2Sync(
            Buffer.from(password),
            Buffer.from(Keystore.crypto.kdfParams['salt'], 'hex'),
            parseInt(Keystore.crypto.kdfParams['c'],16),
            parseInt(Keystore.crypto.kdfParams['dklen'],16),
            'sha256',
        )

    } else {
        throw new Error('Unsupported key derivation scheme')
    }
    const ciphertext = Buffer.from(Keystore.crypto['cipherText'], 'hex');
    const actual = blake2b(32).update(Buffer.concat([derivedKey.slice(16,32),ciphertext])).digest('hex');
    if(actual!== Keystore.crypto['mac'].toString('hex')){
        throw new Error("Invalid Password!");
    }

    const decipher = crypto.createDecipheriv(
        Keystore.crypto['cipher'],
        derivedKey.slice(0, 16),
        Buffer.from(Keystore.crypto.cipherParams['iv'], 'hex')
    );
    const seed = runCipherBuffer(decipher, ciphertext);
    return keyPair(seed);
}

function toV3(privateKey, password) {
    const salt = crypto.randomBytes(32);

    const n = 8192;

    const p = 1;
    const r = 8;
    const dklen = 32;

    console.log(r+" "+p);

    let kdfparams=[];

    kdfparams[0] = 0;

    kdfparams[1] = dklen;
    kdfparams[2] = n;
    kdfparams[3] = p;
    kdfparams[4] = r;
    kdfparams[5] = salt.toString('hex');

    const Kdfparams = RLP.encode(kdfparams);

    const tempParams =  crypto.randomBytes(16);
    let cipherparams=[];
    cipherparams[0] = tempParams.toString('hex');
    const Cipherparams = RLP.encode(cipherparams);

    const derivedKey = scrypt(Buffer.from(password), Buffer.from(salt,'hex'), n, r, p, dklen);

    const cipher = crypto.createCipheriv('aes-128-ctr', derivedKey.slice(0, 16), tempParams);
    const ciphertext = Buffer.concat([cipher.update(privateKey), cipher.final()]);
    const mac = blake2b(32).update(Buffer.concat([Buffer.from(derivedKey.slice(16,32)),ciphertext])).digest();

    let crypto=[];
    crypto[0] = 'aes-128-ctr'; // cypher
    crypto[1] = ciphertext.toString('hex');
    crypto[2] = "scrypt";
    crypto[3] = mac;
    crypto[4] = Cipherparams;
    crypto[5] = Kdfparams;
    const Crypto = RLP.encode(crypto);

    const keystore = [];

    keystore[0] = crypto.randomBytes(4).toString('hex')+"-"+crypto.randomBytes(2).toString('hex')
        +"-"+crypto.randomBytes(2).toString('hex')+"-"+crypto.randomBytes(2).toString('hex')
        +"-"+crypto.randomBytes(6).toString('hex');
    keystore[1] = 3;
    keystore[2] = keyPair(privateKey).address;
    keystore[3] = Crypto;
    return RLP.encode(keystore);
}


function runCipherBuffer(cipher,data){
    return Buffer.concat([cipher.update(data), cipher.final()])
}


export {
    fromV3,
    toV3
}