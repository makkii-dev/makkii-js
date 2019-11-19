"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require("bip39");
var keystore_1 = require("./keystore");
var TronKeystoreClient = (function () {
    function TronKeystoreClient() {
        this.mnemonic = '';
        this.mnemonic = '';
    }
    TronKeystoreClient.prototype.signTransaction = function (tx) {
        return keystore_1.default.signTransaction(tx);
    };
    TronKeystoreClient.prototype.getKey = function (address_index) {
        if (!bip39.validateMnemonic(this.mnemonic)) {
            throw new Error('set mnemonic first');
        }
        return keystore_1.default.getKeyFromMnemonic(this.mnemonic, address_index);
    };
    TronKeystoreClient.prototype.setMnemonic = function (mnemonic, passphrase) {
        this.mnemonic = mnemonic;
    };
    TronKeystoreClient.prototype.generateMnemonic = function () {
        var mnemonic = bip39.generateMnemonic();
        this.mnemonic = mnemonic;
        return mnemonic;
    };
    TronKeystoreClient.prototype.recoverKeyPairByPrivateKey = function (priKey, options) {
        try {
            var keyPair = keystore_1.default.keyPair(priKey);
            var privateKey = keyPair.privateKey, publicKey = keyPair.publicKey, address = keyPair.address, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
            return Promise.resolve(__assign({ private_key: privateKey, public_key: publicKey, address: address }, reset));
        }
        catch (e) {
            return Promise.reject(new Error("recover privKey failed: " + e));
        }
    };
    TronKeystoreClient.prototype.recoverKeyPairByWIF = function (WIF, options) {
        throw new Error("[tron] recoverKeyPairByWIF not implemented.");
    };
    TronKeystoreClient.prototype.recoverKeyPairBykeyFile = function (file, password) {
        throw new Error("[tron] recoverKeyPairBykeyFile not implemented.");
    };
    TronKeystoreClient.prototype.validatePrivateKey = function (privateKey) {
        throw new Error("[tron] validatePrivateKey not implemented.");
    };
    TronKeystoreClient.prototype.validateAddress = function (address) {
        return keystore_1.default.validateAddress(address);
    };
    TronKeystoreClient.prototype.getKeyFromMnemonic = function (address_index, mnemonic) {
        return keystore_1.default.getKeyFromMnemonic(mnemonic, address_index);
    };
    return TronKeystoreClient;
}());
exports.default = TronKeystoreClient;
//# sourceMappingURL=keystoreClient.js.map