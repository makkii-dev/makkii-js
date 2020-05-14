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
var BtcKeystoreClient = (function () {
    function BtcKeystoreClient(network) {
        var _this = this;
        this.ledgerSupport = false;
        this.getCurrentNetwork = function () {
            return _this.network;
        };
        this.checkLedgerSupport = function () {
            return _this.ledgerSupport;
        };
        this.signTransaction = function (tx, signer, signerParam) {
            var network = _this.getCurrentNetwork();
            return signer.signTransaction(tx, __assign(__assign({}, signerParam), { network: network }));
        };
        this.generateMnemonic = function () {
            var mnemonic = bip39.generateMnemonic();
            return mnemonic;
        };
        this.recoverKeyPairByPrivateKey = function (priKey, options) {
            var network = _this.getCurrentNetwork();
            try {
                var keyPair = lib_keystore_1["default"].keyPair(priKey, __assign({ network: network }, options));
                if (keyPair) {
                    var privateKey = keyPair.privateKey, publicKey = keyPair.publicKey, address = keyPair.address, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                    return Promise.resolve(__assign({ private_key: privateKey, public_key: publicKey, address: address }, reset));
                }
                return Promise.reject(new Error(_this.network + " recover privKey failed"));
            }
            catch (e) {
                return Promise.reject(new Error(_this.network + " recover privKey failed: " + e));
            }
        };
        this.recoverKeyPairByWIF = function (WIF) {
            var network = _this.getCurrentNetwork();
            try {
                var keyPair = lib_keystore_1["default"].keyPairFromWIF(WIF, {
                    network: network
                });
                if (keyPair) {
                    var privateKey = keyPair.privateKey, publicKey = keyPair.publicKey, address = keyPair.address, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                    return Promise.resolve(__assign({ private_key: privateKey, public_key: publicKey, address: address }, reset));
                }
                return Promise.reject(new Error(_this.network + " recover privKey failed"));
            }
            catch (e) {
                return Promise.reject(new Error(_this.network + " recover privKey failed: " + e));
            }
        };
        this.validatePrivateKey = function (privateKey) {
            throw new Error(_this.network + " validatePrivateKey not implemented.");
        };
        this.validateAddress = function (address) {
            var network = _this.getCurrentNetwork();
            return lib_keystore_1["default"].validateAddress(address, network);
        };
        this.getAccountFromMnemonic = function (address_index, mnemonic) {
            var network = _this.getCurrentNetwork();
            return lib_keystore_1["default"].getAccountFromMnemonic(mnemonic, address_index, {
                network: network
            });
        };
        this.getAccountFromHardware = function (index, hardware) {
            if (!_this.checkLedgerSupport()) {
                throw new Error(_this.network + " getAccountFromHardware not implemented.");
            }
            return hardware.getAccount(index);
        };
        if (!["BTC", "BTCTEST", "LTC", "LTCTEST"].includes(network)) {
            throw new Error("BtcKeystoreClient Unsupport network: " + network);
        }
        this.network = network;
        if (network.match("BTC")) {
            this.ledgerSupport = true;
        }
    }
    return BtcKeystoreClient;
}());
exports["default"] = BtcKeystoreClient;
