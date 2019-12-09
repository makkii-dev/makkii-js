"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_common_util_js_1 = require("lib-common-util-js");
const utils_1 = require("../utils");
const keyPair_1 = require("./keyPair");
const RLP = require("aion-rlp");
const scrypt = require("scrypt.js");
const blake2b = require("blake2b");
const fromV3 = (input, password) => new Promise((resolve, reject) => {
    try {
        const KeystoreItem = RLP.decode(input);
        const Crypto = RLP.decode(KeystoreItem[3]);
        const CipherParams = RLP.decode(Crypto[4]);
        const KdfParams = RLP.decode(Crypto[5]);
        const Keystore = {};
        Keystore.id = utils_1.ab2str(KeystoreItem[0]);
        Keystore.version = lib_common_util_js_1.hexutil.toHex(KeystoreItem[1]);
        Keystore.address = utils_1.ab2str(KeystoreItem[2]);
        Keystore.crypto = {};
        Keystore.crypto.cipher = utils_1.ab2str(Crypto[0]);
        Keystore.crypto.cipherText = utils_1.ab2str(Crypto[1]);
        Keystore.crypto.kdf = utils_1.ab2str(Crypto[2]);
        Keystore.crypto.mac = utils_1.ab2str(Crypto[3]);
        Keystore.crypto.cipherParams = {};
        Keystore.crypto.cipherParams.iv = utils_1.ab2str(CipherParams[0]);
        let derivedKey;
        if (Keystore.crypto.kdf === "scrypt") {
            Keystore.crypto.kdfParams = {};
            Keystore.crypto.kdfParams.c = lib_common_util_js_1.hexutil.toHex(KdfParams[0]);
            Keystore.crypto.kdfParams.dklen = lib_common_util_js_1.hexutil.toHex(KdfParams[1]);
            Keystore.crypto.kdfParams.n = lib_common_util_js_1.hexutil.toHex(KdfParams[2]);
            Keystore.crypto.kdfParams.p = lib_common_util_js_1.hexutil.toHex(KdfParams[3]);
            Keystore.crypto.kdfParams.r = lib_common_util_js_1.hexutil.toHex(KdfParams[4]);
            Keystore.crypto.kdfParams.salt = utils_1.ab2str(KdfParams[5]);
            derivedKey = scrypt(Buffer.from(password), Buffer.from(Keystore.crypto.kdfParams.salt, "hex"), parseInt(Keystore.crypto.kdfParams.n, 16), parseInt(Keystore.crypto.kdfParams.r, 16), parseInt(Keystore.crypto.kdfParams.p, 16), parseInt(Keystore.crypto.kdfParams.dklen, 16));
        }
        else if (Keystore.crypto.kdf === "pbkdf2") {
            Keystore.crypto.kdfParams = {};
            Keystore.crypto.kdfParams.c = lib_common_util_js_1.hexutil.toHex(KdfParams[0]);
            Keystore.crypto.kdfParams.dklen = lib_common_util_js_1.hexutil.toHex(KdfParams[1]);
            Keystore.crypto.kdfParams.prf = "hmac-sha256";
            Keystore.crypto.kdfParams.salt = utils_1.ab2str(KdfParams[5]);
            derivedKey = utils_1.crypto.pbkdf2Sync(Buffer.from(password), Buffer.from(Keystore.crypto.kdfParams.salt, "hex"), parseInt(Keystore.crypto.kdfParams.c, 16), parseInt(Keystore.crypto.kdfParams.dklen, 16), "sha256");
        }
        else {
            reject(new Error("Unsupported key derivation scheme"));
        }
        const ciphertext = Buffer.from(Keystore.crypto.cipherText, "hex");
        const actual = blake2b(32)
            .update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
            .digest("hex");
        if (actual !== Keystore.crypto.mac.toString("hex")) {
            reject(new Error("Invalid Password!"));
        }
        const decipher = utils_1.crypto.createDecipheriv(Keystore.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(Keystore.crypto.cipherParams.iv, "hex"));
        const seed = runCipherBuffer(decipher, ciphertext);
        resolve(keyPair_1.keyPair(seed));
    }
    catch (e) {
        reject(e);
    }
});
exports.fromV3 = fromV3;
function toV3(privateKey, password) {
    const salt = utils_1.crypto.randomBytes(32);
    const n = 8192;
    const p = 1;
    const r = 8;
    const dklen = 32;
    const kdfparams = [];
    kdfparams[0] = 0;
    kdfparams[1] = dklen;
    kdfparams[2] = n;
    kdfparams[3] = p;
    kdfparams[4] = r;
    kdfparams[5] = salt.toString("hex");
    const Kdfparams = RLP.encode(kdfparams);
    const tempParams = utils_1.crypto.randomBytes(16);
    const cipherparams = [];
    cipherparams[0] = tempParams.toString("hex");
    const Cipherparams = RLP.encode(cipherparams);
    const derivedKey = scrypt(Buffer.from(password), Buffer.from(salt, "hex"), n, r, p, dklen);
    const cipher = utils_1.crypto.createCipheriv("aes-128-ctr", derivedKey.slice(0, 16), tempParams);
    const ciphertext = Buffer.concat([
        cipher.update(privateKey),
        cipher.final()
    ]);
    const mac = blake2b(32)
        .update(Buffer.concat([Buffer.from(derivedKey.slice(16, 32)), ciphertext]))
        .digest();
    const crypto_ = [];
    crypto_[0] = "aes-128-ctr";
    crypto_[1] = ciphertext.toString("hex");
    crypto_[2] = "scrypt";
    crypto_[3] = mac;
    crypto_[4] = Cipherparams;
    crypto_[5] = Kdfparams;
    const Crypto = RLP.encode(crypto_);
    const keystore = [];
    keystore[0] = `${utils_1.crypto
        .randomBytes(4)
        .toString("hex")}-${utils_1.crypto
        .randomBytes(2)
        .toString("hex")}-${utils_1.crypto
        .randomBytes(2)
        .toString("hex")}-${utils_1.crypto
        .randomBytes(2)
        .toString("hex")}-${utils_1.crypto.randomBytes(6).toString("hex")}`;
    keystore[1] = 3;
    keystore[2] = keyPair_1.keyPair(privateKey).address;
    keystore[3] = Crypto;
    return RLP.encode(keystore);
}
exports.toV3 = toV3;
function runCipherBuffer(cipher, data) {
    return Buffer.concat([cipher.update(data), cipher.final()]);
}
//# sourceMappingURL=keyfile.js.map