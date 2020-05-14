"use strict";
exports.__esModule = true;
var ethereumjs_util_1 = require("ethereumjs-util");
var bs58 = require("bs58");
var ec = require("elliptic").ec("secp256k1");
var prefix = "41";
var padTo32 = function (msg) {
    while (msg.length < 32) {
        msg = Buffer.concat([Buffer.from([0]), msg]);
    }
    if (msg.length !== 32) {
        throw new Error("invalid key length: " + msg.length);
    }
    return msg;
};
var computeAddress = function (publicKey) {
    if (publicKey.length === 65) {
        publicKey = publicKey.slice(1);
    }
    var hash = ethereumjs_util_1.keccak256(publicKey).toString("hex");
    var addressHex = hash.substring(24);
    addressHex = prefix + addressHex;
    return addressHex;
};
var getBase58checkAddress = function (address) {
    var hash0 = ethereumjs_util_1.sha256(Buffer.from(address, "hex"));
    var hash1 = ethereumjs_util_1.sha256(hash0);
    var checkSum = hash1.slice(0, 4);
    var addressBytes = Buffer.from(address, "hex");
    return bs58.encode(Buffer.concat([addressBytes, checkSum]));
};
exports.keyPair = function (priKey) {
    if (typeof priKey === "string") {
        if (priKey.startsWith("0x")) {
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, "hex");
    }
    var key = ec.keyFromPrivate(priKey);
    var bip32pubKey = key.getPublic().toJSON();
    var publicKey = Buffer.concat([
        padTo32(Buffer.from(bip32pubKey[0].toArray())),
        padTo32(Buffer.from(bip32pubKey[1].toArray()))
    ]);
    var address = computeAddress(publicKey);
    address = getBase58checkAddress(address);
    return {
        privateKey: key.getPrivate("hex"),
        publicKey: publicKey.toString("hex"),
        address: address,
        sign: function (hash) { return key.sign(hash); }
    };
};
