"use strict";
exports.__esModule = true;
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var network_1 = require("./network");
exports.keyPair = function (priKey, options) {
    if (typeof priKey === "string") {
        if (priKey.startsWith("0x")) {
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, "hex");
    }
    var network = network_1.networks.BTC;
    if (options && options.network) {
        network = network_1.networks[options.network];
    }
    try {
        var key_1 = bitcoinjs_lib_1.ECPair.fromPrivateKey(priKey, {
            network: network,
            compressed: options.compressed === undefined ? true : options.compressed
        });
        var privateKey = key_1.privateKey;
        var publicKey = key_1.publicKey;
        var address = bitcoinjs_lib_1.payments.p2pkh({ pubkey: key_1.publicKey, network: network }).address;
        return {
            privateKey: privateKey.toString("hex"),
            publicKey: publicKey.toString("hex"),
            address: address,
            sign: function (hash) { return key_1.sign(hash); },
            toWIF: function () { return key_1.toWIF(); }
        };
    }
    catch (e) {
        return undefined;
    }
};
exports.keyPairFromWIF = function (WIF, options) {
    var network = network_1.networks.BTC;
    if (options && options.network) {
        network = network_1.networks[options.network];
    }
    try {
        var key_2 = bitcoinjs_lib_1.ECPair.fromWIF(WIF, network);
        var privateKey = key_2.privateKey;
        var publicKey = key_2.publicKey;
        var address = bitcoinjs_lib_1.payments.p2pkh({ pubkey: key_2.publicKey, network: network }).address;
        return {
            privateKey: privateKey.toString("hex"),
            publicKey: publicKey.toString("hex"),
            address: address,
            sign: function (hash) { return key_2.sign(hash); },
            toWIF: function () { return key_2.toWIF(); },
            compressed: key_2.compressed
        };
    }
    catch (e) {
        return undefined;
    }
};
