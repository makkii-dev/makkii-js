"use strict";
exports.__esModule = true;
var keypair_1 = require("./keypair");
var address_1 = require("./address");
var hdkey_1 = require("./hdkey");
exports["default"] = {
    getAccountFromMnemonic: hdkey_1.getAccountFromMnemonic,
    keyPair: keypair_1.keyPair,
    validateAddress: address_1.validateAddress
};
