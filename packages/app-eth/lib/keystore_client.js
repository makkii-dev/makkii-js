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
exports.__esModule = true;
var bip39 = require("bip39");
var lib_keystore_1 = require("./lib_keystore");
var EthKeystoreClient = (function () {
    function EthKeystoreClient() {
        this.ledgerSupport = true;
        this.signTransaction = function (tx, signer, signerParam) {
            return signer.signTransaction(tx, signerParam);
        };
        this.generateMnemonic = function () {
            var mnemonic = bip39.generateMnemonic();
            return mnemonic;
        };
        this.recoverKeyPairByPrivateKey = function (priKey, options) {
            try {
                var keyPair = lib_keystore_1["default"].keyPair(priKey);
                var privateKey = keyPair.privateKey, publicKey = keyPair.publicKey, address = keyPair.address, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                return Promise.resolve(__assign({ private_key: privateKey, public_key: publicKey, address: address }, reset));
            }
            catch (e) {
                return Promise.reject(new Error("recover privKey failed: " + e));
            }
        };
        this.validatePrivateKey = function (privateKey) {
            throw new Error("[eth] validatePrivateKey not implemented.");
        };
        this.validateAddress = function (address) {
            return lib_keystore_1["default"].validateAddress(address);
        };
        this.getAccountFromMnemonic = function (address_index, mnemonic) {
            return lib_keystore_1["default"].getAccountFromMnemonic(mnemonic, address_index);
        };
        this.getAccountFromHardware = function (address_index, hardware) {
            return hardware.getAccount(address_index);
        };
    }
    return EthKeystoreClient;
}());
exports["default"] = EthKeystoreClient;
