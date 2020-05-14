"use strict";
exports.__esModule = true;
var makkii_utils_1 = require("@makkii/makkii-utils");
var utils_1 = require("../utils");
var keyPair_1 = require("./keyPair");
var RLP = require("aion-rlp");
var scrypt = require("scrypt.js");
var blake2b = require("blake2b");
var fromV3 = function (input, password) {
    return new Promise(function (resolve, reject) {
        try {
            var KeystoreItem = RLP.decode(input);
            var Crypto_1 = RLP.decode(KeystoreItem[3]);
            var CipherParams = RLP.decode(Crypto_1[4]);
            var KdfParams = RLP.decode(Crypto_1[5]);
            var Keystore = {};
            Keystore.id = utils_1.ab2str(KeystoreItem[0]);
            Keystore.version = makkii_utils_1.hexutil.toHex(KeystoreItem[1]);
            Keystore.address = utils_1.ab2str(KeystoreItem[2]);
            Keystore.crypto = {};
            Keystore.crypto.cipher = utils_1.ab2str(Crypto_1[0]);
            Keystore.crypto.cipherText = utils_1.ab2str(Crypto_1[1]);
            Keystore.crypto.kdf = utils_1.ab2str(Crypto_1[2]);
            Keystore.crypto.mac = utils_1.ab2str(Crypto_1[3]);
            Keystore.crypto.cipherParams = {};
            Keystore.crypto.cipherParams.iv = utils_1.ab2str(CipherParams[0]);
            var derivedKey = void 0;
            if (Keystore.crypto.kdf === "scrypt") {
                Keystore.crypto.kdfParams = {};
                Keystore.crypto.kdfParams.c = makkii_utils_1.hexutil.toHex(KdfParams[0]);
                Keystore.crypto.kdfParams.dklen = makkii_utils_1.hexutil.toHex(KdfParams[1]);
                Keystore.crypto.kdfParams.n = makkii_utils_1.hexutil.toHex(KdfParams[2]);
                Keystore.crypto.kdfParams.p = makkii_utils_1.hexutil.toHex(KdfParams[3]);
                Keystore.crypto.kdfParams.r = makkii_utils_1.hexutil.toHex(KdfParams[4]);
                Keystore.crypto.kdfParams.salt = utils_1.ab2str(KdfParams[5]);
                derivedKey = scrypt(Buffer.from(password), Buffer.from(Keystore.crypto.kdfParams.salt, "hex"), parseInt(Keystore.crypto.kdfParams.n, 16), parseInt(Keystore.crypto.kdfParams.r, 16), parseInt(Keystore.crypto.kdfParams.p, 16), parseInt(Keystore.crypto.kdfParams.dklen, 16));
            }
            else if (Keystore.crypto.kdf === "pbkdf2") {
                Keystore.crypto.kdfParams = {};
                Keystore.crypto.kdfParams.c = makkii_utils_1.hexutil.toHex(KdfParams[0]);
                Keystore.crypto.kdfParams.dklen = makkii_utils_1.hexutil.toHex(KdfParams[1]);
                Keystore.crypto.kdfParams.prf = "hmac-sha256";
                Keystore.crypto.kdfParams.salt = utils_1.ab2str(KdfParams[5]);
                derivedKey = utils_1.crypto.pbkdf2Sync(Buffer.from(password), Buffer.from(Keystore.crypto.kdfParams.salt, "hex"), parseInt(Keystore.crypto.kdfParams.c, 16), parseInt(Keystore.crypto.kdfParams.dklen, 16), "sha256");
            }
            else {
                reject(new Error("Unsupported key derivation scheme"));
            }
            var ciphertext = Buffer.from(Keystore.crypto.cipherText, "hex");
            var actual = blake2b(32)
                .update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
                .digest("hex");
            if (actual !== Keystore.crypto.mac.toString("hex")) {
                reject(new Error("Invalid Password!"));
            }
            var decipher = utils_1.crypto.createDecipheriv(Keystore.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(Keystore.crypto.cipherParams.iv, "hex"));
            var seed = runCipherBuffer(decipher, ciphertext);
            resolve(keyPair_1.keyPair(seed));
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.fromV3 = fromV3;
function toV3(privateKey, password) {
    var salt = utils_1.crypto.randomBytes(32);
    var n = 8192;
    var p = 1;
    var r = 8;
    var dklen = 32;
    var kdfparams = [];
    kdfparams[0] = 0;
    kdfparams[1] = dklen;
    kdfparams[2] = n;
    kdfparams[3] = p;
    kdfparams[4] = r;
    kdfparams[5] = salt.toString("hex");
    var Kdfparams = RLP.encode(kdfparams);
    var tempParams = utils_1.crypto.randomBytes(16);
    var cipherparams = [];
    cipherparams[0] = tempParams.toString("hex");
    var Cipherparams = RLP.encode(cipherparams);
    var derivedKey = scrypt(Buffer.from(password), Buffer.from(salt, "hex"), n, r, p, dklen);
    var cipher = utils_1.crypto.createCipheriv("aes-128-ctr", derivedKey.slice(0, 16), tempParams);
    var ciphertext = Buffer.concat([
        cipher.update(privateKey),
        cipher.final()
    ]);
    var mac = blake2b(32)
        .update(Buffer.concat([Buffer.from(derivedKey.slice(16, 32)), ciphertext]))
        .digest();
    var crypto_ = [];
    crypto_[0] = "aes-128-ctr";
    crypto_[1] = ciphertext.toString("hex");
    crypto_[2] = "scrypt";
    crypto_[3] = mac;
    crypto_[4] = Cipherparams;
    crypto_[5] = Kdfparams;
    var Crypto = RLP.encode(crypto_);
    var keystore = [];
    keystore[0] = utils_1.crypto
        .randomBytes(4)
        .toString("hex") + "-" + utils_1.crypto
        .randomBytes(2)
        .toString("hex") + "-" + utils_1.crypto
        .randomBytes(2)
        .toString("hex") + "-" + utils_1.crypto
        .randomBytes(2)
        .toString("hex") + "-" + utils_1.crypto.randomBytes(6).toString("hex");
    keystore[1] = 3;
    keystore[2] = keyPair_1.keyPair(privateKey).address;
    keystore[3] = Crypto;
    return RLP.encode(keystore);
}
exports.toV3 = toV3;
function runCipherBuffer(cipher, data) {
    return Buffer.concat([cipher.update(data), cipher.final()]);
}
