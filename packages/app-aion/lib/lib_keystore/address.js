"use strict";
exports.__esModule = true;
exports.inputAddressFormatter = function (address) {
    if (/^(0x)?[A|a]0[0-9a-f]{62}$/i.test(address)) {
        return "0x" + address.toLowerCase().replace("0x", "");
    }
    throw new Error("Provided address \"" + address + "\" is invalid");
};
exports.validateAddress = function (address) {
    try {
        exports.inputAddressFormatter(address);
        return true;
    }
    catch (e) {
        return false;
    }
};
