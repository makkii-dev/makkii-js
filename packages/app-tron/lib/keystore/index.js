"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var keypair_1 = require("./keypair");
var address_1 = require("./address");
var transaction_1 = require("./transaction");
var hdkey_1 = require("./hdkey");
exports.default = {
    getKeyFromMnemonic: hdkey_1.getKeyFromMnemonic,
    keyPair: keypair_1.keyPair,
    validateAddress: address_1.validateAddress,
    signTransaction: transaction_1.signTransaction
};
//# sourceMappingURL=index.js.map