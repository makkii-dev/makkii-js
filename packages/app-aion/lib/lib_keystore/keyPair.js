"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makkii_utils_1 = require("@makkii/makkii-utils");
const nacl = require("tweetnacl");
const blake2b = require("blake2b");
const A0_IDENTIFIER = [0xa0];
exports.validatePrivateKey = priKey => {
    if (typeof priKey === "string") {
        priKey = Buffer.from(makkii_utils_1.hexutil.stripZeroXHexString(priKey), "hex");
    }
    else if (!Buffer.isBuffer(priKey)) {
        throw new Error("Seed must be a buffer or a hex string");
    }
    if (priKey.length === nacl.sign.seedLength) {
        return true;
    }
    if (priKey.length !== nacl.sign.secretKeyLength) {
        return false;
    }
    const keyPair = nacl.sign.keyPair.fromSecretKey(priKey);
    const msg = Buffer.from("test");
    const sig = nacl.sign.detached(msg, keyPair.secretKey);
    return nacl.sign.detached.verify(msg, sig, keyPair.publicKey);
};
function computeA0Address(publicKey) {
    const addressHash = blake2b(32)
        .update(publicKey)
        .digest();
    addressHash.set(A0_IDENTIFIER, 0);
    return addressHash;
}
exports.keyPair = priKey => {
    if (typeof priKey === "string") {
        priKey = Buffer.from(makkii_utils_1.hexutil.stripZeroXHexString(priKey), "hex");
    }
    else if (!Buffer.isBuffer(priKey)) {
        throw new Error("Seed must be a buffer or a hex string");
    }
    if (!exports.validatePrivateKey(priKey)) {
        throw new Error("inValid privateKey");
    }
    const keyPair_ = priKey.length === 64
        ? nacl.sign.keyPair.fromSecretKey(priKey)
        : nacl.sign.keyPair.fromSeed(priKey);
    const privateKey = Buffer.from(keyPair_.secretKey);
    const publicKey = Buffer.from(keyPair_.publicKey);
    const address = computeA0Address(publicKey);
    function sign(digest) {
        if (typeof digest === "string") {
            digest = Buffer.from(makkii_utils_1.hexutil.stripZeroXHexString(digest), "hex");
        }
        try {
            const res = nacl.sign.detached(digest, Buffer.from(privateKey));
            return Buffer.from(res);
        }
        catch (e) {
            throw new Error(`Message failed to sign, ${e}`);
        }
    }
    return {
        privateKey: privateKey.toString("hex"),
        publicKey: publicKey.toString("hex"),
        address: makkii_utils_1.hexutil.toHex(address),
        sign
    };
};
//# sourceMappingURL=keyPair.js.map