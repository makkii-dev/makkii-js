"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const Base58Prefix = {
    BTC: [0x00, 0x05],
    BTCTEST: [0x6f, 0xc4],
    LTC: [0x30, 0x32],
    LTCTEST: [0x6f, 0xc4, 0x3a],
};
const Bench32prefix = {
    BTC: 'bc',
    BTCTEST: 'tb',
    LTC: 'ltc',
    LTCTEST: 'tltc',
};
const validateBase58 = (address, network) => {
    try {
        const res = bitcoinjs_lib_1.address.fromBase58Check(address);
        const networkType = Base58Prefix[network] || Base58Prefix.BTC;
        return networkType.indexOf(res.version) >= 0;
    }
    catch (e) {
        return false;
    }
};
const validateBench32 = (address, network) => {
    try {
        const res = bitcoinjs_lib_1.address.fromBech32(address);
        const prefix = Bench32prefix[network] || Bench32prefix.BTC;
        return prefix === res.prefix;
    }
    catch (e) {
        return false;
    }
};
exports.validateAddress = (address, network) => validateBase58(address, network) || validateBench32(address, network);
//# sourceMappingURL=address.js.map