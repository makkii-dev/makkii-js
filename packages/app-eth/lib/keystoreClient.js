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
var EthKeystoreClient = (function () {
    function EthKeystoreClient() {
        this.ledgerSupport = true;
        this.mnemonic = '';
    }
    EthKeystoreClient.prototype.signTransaction = function (tx) {
        return keystore_1.default.signTransaction(tx);
    };
    EthKeystoreClient.prototype.getKey = function (address_index) {
        if (!bip39.validateMnemonic(this.mnemonic))
            throw new Error('Set Mnemonic first');
        return keystore_1.default.getKeyFromMnemonic(this.mnemonic, address_index);
    };
    EthKeystoreClient.prototype.setMnemonic = function (mnemonic, passphrase) {
        this.mnemonic = mnemonic;
    };
    EthKeystoreClient.prototype.generateMnemonic = function () {
        var mnemonic = bip39.generateMnemonic();
        this.mnemonic = mnemonic;
        return mnemonic;
    };
    EthKeystoreClient.prototype.recoverKeyPairByPrivateKey = function (priKey, options) {
        try {
            var keyPair = keystore_1.default.keyPair(priKey);
            var privateKey = keyPair.privateKey, publicKey = keyPair.publicKey, address = keyPair.address, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
            return Promise.resolve(__assign({ private_key: privateKey, public_key: publicKey, address: address }, reset));
        }
        catch (e) {
            return Promise.reject(new Error("recover privKey failed: " + e));
        }
    };
    EthKeystoreClient.prototype.recoverKeyPairByWIF = function (WIF, options) {
        throw new Error("[eth] recoverKeyPairByWIF not implemented.");
    };
    EthKeystoreClient.prototype.recoverKeyPairBykeyFile = function (file, password) {
        throw new Error("[eth] recoverKeyPairBykeyFile not implemented.");
    };
    EthKeystoreClient.prototype.validatePrivateKey = function (privateKey) {
        throw new Error("[eth] validatePrivateKey not implemented.");
    };
    EthKeystoreClient.prototype.validateAddress = function (address) {
        return keystore_1.default.validateAddress(address);
    };
    EthKeystoreClient.prototype.getKeyFromMnemonic = function (address_index, mnemonic) {
        return keystore_1.default.getKeyFromMnemonic(mnemonic, address_index);
    };
    EthKeystoreClient.prototype.getKeyByLedger = function (index) {
        if (!this.getLedgerStatus()) {
            throw new Error('ledger is not available');
        }
        return keystore_1.default.getKeyByLedger(index);
    };
    EthKeystoreClient.prototype.signByLedger = function (index, sender, msg) {
        throw new Error("[eth] signByLedger not implemented.");
    };
    EthKeystoreClient.prototype.setLedgerTransport = function (transport) {
        keystore_1.default.initWallet(transport);
    };
    EthKeystoreClient.prototype.getLedgerStatus = function () {
        return keystore_1.default.getWalletStatus();
    };
    return EthKeystoreClient;
}());
exports.default = EthKeystoreClient;
//# sourceMappingURL=keystoreClient.js.map