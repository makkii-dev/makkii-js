"use strict";
exports.__esModule = true;
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var Base58Prefix = {
    BTC: [0x00, 0x05],
    BTCTEST: [0x6f, 0xc4],
    LTC: [0x30, 0x32],
    LTCTEST: [0x6f, 0xc4, 0x3a]
};
var Bench32prefix = {
    BTC: "bc",
    BTCTEST: "tb",
    LTC: "ltc",
    LTCTEST: "tltc"
};
var validateBase58 = function (address, network) {
    try {
        var res = bitcoinjs_lib_1.address.fromBase58Check(address);
        var networkType = Base58Prefix[network] || Base58Prefix.BTC;
        return networkType.indexOf(res.version) >= 0;
    }
    catch (e) {
        return false;
    }
};
var validateBench32 = function (address, network) {
    try {
        var res = bitcoinjs_lib_1.address.fromBech32(address);
        var prefix = Bench32prefix[network] || Bench32prefix.BTC;
        return prefix === res.prefix;
    }
    catch (e) {
        return false;
    }
};
exports.validateAddress = function (address, network) {
    return validateBase58(address, network) || validateBench32(address, network);
};
