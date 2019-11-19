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
var BtcKeystoreClient = (function () {
    function BtcKeystoreClient(coin, isTestNet) {
        if (coin === void 0) { coin = 'btc'; }
        if (isTestNet === void 0) { isTestNet = false; }
        this.ledgerSupport = false;
        this.mnemonic = '';
        this.coin = coin;
        this.isTestNet = isTestNet;
        if (coin.toLowerCase() === 'btc') {
            this.ledgerSupport = true;
        }
    }
    BtcKeystoreClient.prototype.getCurrentNetwork = function () {
        var coin_ = this.coin.toUpperCase();
        var suffix = this.isTestNet ? 'TEST' : '';
        return coin_ + suffix;
    };
    BtcKeystoreClient.prototype.checkLedgerSupport = function () {
        return this.coin.toLowerCase() === 'btc';
    };
    BtcKeystoreClient.prototype.signTransaction = function (tx) {
        var network = this.getCurrentNetwork();
        return keystore_1.default.signTransaction(tx, network);
    };
    BtcKeystoreClient.prototype.getKey = function (address_index) {
        if (!bip39.validateMnemonic(this.mnemonic))
            throw new Error('Set Mnemonic first');
        var network = this.getCurrentNetwork();
        return keystore_1.default.getKeyByLedger(address_index, network);
    };
    BtcKeystoreClient.prototype.setMnemonic = function (mnemonic, passphrase) {
        this.mnemonic = mnemonic;
    };
    BtcKeystoreClient.prototype.generateMnemonic = function () {
        var mnemonic = bip39.generateMnemonic();
        this.mnemonic = mnemonic;
        return mnemonic;
    };
    BtcKeystoreClient.prototype.recoverKeyPairByPrivateKey = function (priKey, options) {
        var network = this.getCurrentNetwork();
        try {
            var keyPair = keystore_1.default.keyPair(priKey, __assign({ network: network }, options));
            if (keyPair) {
                var privateKey = keyPair.privateKey, publicKey = keyPair.publicKey, address = keyPair.address, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                return Promise.resolve(__assign({ private_key: privateKey, public_key: publicKey, address: address }, reset));
            }
            return Promise.reject(new Error(this.coin + " recover privKey failed"));
        }
        catch (e) {
            return Promise.reject(new Error(this.coin + " recover privKey failed: " + e));
        }
    };
    BtcKeystoreClient.prototype.recoverKeyPairByWIF = function (WIF, options) {
        var network = this.getCurrentNetwork();
        try {
            var keyPair = keystore_1.default.keyPairFromWIF(WIF, __assign({ network: network }, options));
            if (keyPair) {
                var privateKey = keyPair.privateKey, publicKey = keyPair.publicKey, address = keyPair.address, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                return Promise.resolve(__assign({ private_key: privateKey, public_key: publicKey, address: address }, reset));
            }
            return Promise.reject(new Error(this.coin + " recover privKey failed"));
        }
        catch (e) {
            return Promise.reject(new Error(this.coin + " recover privKey failed: " + e));
        }
    };
    BtcKeystoreClient.prototype.recoverKeyPairBykeyFile = function (file, password) {
        throw new Error(this.coin + " recoverKeyPairBykeyFile not implemented.");
    };
    BtcKeystoreClient.prototype.validatePrivateKey = function (privateKey) {
        throw new Error(this.coin + " validatePrivateKey not implemented.");
    };
    BtcKeystoreClient.prototype.validateAddress = function (address) {
        return keystore_1.default.validateAddress(address);
    };
    BtcKeystoreClient.prototype.getKeyFromMnemonic = function (address_index, mnemonic) {
        return keystore_1.default.getKeyFromMnemonic(mnemonic, address_index);
    };
    BtcKeystoreClient.prototype.getKeyByLedger = function (index) {
        if (!this.checkLedgerSupport()) {
            throw new Error(this.coin + " getKeyByLedger not implemented.");
        }
        var network = this.getCurrentNetwork();
        return keystore_1.default.getKeyByLedger(index, network);
    };
    BtcKeystoreClient.prototype.signByLedger = function (index, sender, msg) {
        if (!this.checkLedgerSupport()) {
            throw new Error(this.coin + " signByLedger not implemented.");
        }
        var network = this.getCurrentNetwork();
        return keystore_1.default.signByLedger(index, sender, msg, network);
    };
    BtcKeystoreClient.prototype.setLedgerTransport = function (transport) {
        if (!this.checkLedgerSupport()) {
            throw new Error(this.coin + " setLedgerTransport not implemented.");
        }
        return keystore_1.default.initWallet(transport);
    };
    BtcKeystoreClient.prototype.getLedgerStatus = function () {
        if (!this.checkLedgerSupport()) {
            throw new Error(this.coin + " getLedgerStatus not implemented.");
        }
        return keystore_1.default.getWalletStatus();
    };
    return BtcKeystoreClient;
}());
exports.default = BtcKeystoreClient;
//# sourceMappingURL=keystoreClient.js.map