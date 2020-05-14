"use strict";
exports.__esModule = true;
var bs58check = require("bs58check");
exports.validateAddress = function (address) {
    try {
        var buffer = Buffer.from(address);
        if (buffer.length !== 34)
            return false;
        var res = bs58check.decode(address);
        return res.length === 21 && res[0] === 0x41;
    }
    catch (e) {
        return false;
    }
};
