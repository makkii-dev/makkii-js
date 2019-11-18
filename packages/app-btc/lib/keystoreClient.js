"use strict";
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
const bip39 = require("bip39");
const keystore_1 = require("./keystore");
class BtcKeystoreClient {
    constructor(coin = 'btc', isTestNet = false) {
        this.ledgerSupport = false;
        this.mnemonic = '';
        this.coin = coin;
        this.isTestNet = isTestNet;
        if (coin.toLowerCase() === 'btc') {
            this.ledgerSupport = true;
        }
    }
    getCurrentNetwork() {
        const coin_ = this.coin.toUpperCase();
        const suffix = this.isTestNet ? 'TEST' : '';
        return coin_ + suffix;
    }
    checkLedgerSupport() {
        return this.coin.toLowerCase() === 'btc';
    }
    signTransaction(tx) {
        const network = this.getCurrentNetwork();
        return keystore_1.default.signTransaction(tx, network);
    }
    getKey(address_index) {
        if (!bip39.validateMnemonic(this.mnemonic))
            throw new Error('Set Mnemonic first');
        const network = this.getCurrentNetwork();
        return keystore_1.default.getKeyByLedger(address_index, network);
    }
    setMnemonic(mnemonic, passphrase) {
        this.mnemonic = mnemonic;
    }
    generateMnemonic() {
        const mnemonic = bip39.generateMnemonic();
        this.mnemonic = mnemonic;
        return mnemonic;
    }
    recoverKeyPairByPrivateKey(priKey, options) {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = keystore_1.default.keyPair(priKey, Object.assign({ network }, options));
            if (keyPair) {
                const { privateKey, publicKey, address } = keyPair, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                return Promise.resolve(Object.assign({ private_key: privateKey, public_key: publicKey, address }, reset));
            }
            return Promise.reject(new Error(`${this.coin} recover privKey failed`));
        }
        catch (e) {
            return Promise.reject(new Error(`${this.coin} recover privKey failed: ${e}`));
        }
    }
    recoverKeyPairByWIF(WIF, options) {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = keystore_1.default.keyPairFromWIF(WIF, Object.assign({ network }, options));
            if (keyPair) {
                const { privateKey, publicKey, address } = keyPair, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                return Promise.resolve(Object.assign({ private_key: privateKey, public_key: publicKey, address }, reset));
            }
            return Promise.reject(new Error(`${this.coin} recover privKey failed`));
        }
        catch (e) {
            return Promise.reject(new Error(`${this.coin} recover privKey failed: ${e}`));
        }
    }
    recoverKeyPairBykeyFile(file, password) {
        throw new Error(`${this.coin} recoverKeyPairBykeyFile not implemented.`);
    }
    validatePrivateKey(privateKey) {
        throw new Error(`${this.coin} validatePrivateKey not implemented.`);
    }
    validateAddress(address) {
        return keystore_1.default.validateAddress(address);
    }
    getKeyFromMnemonic(address_index, mnemonic) {
        return keystore_1.default.getKeyFromMnemonic(mnemonic, address_index);
    }
    getKeyByLedger(index) {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} getKeyByLedger not implemented.`);
        }
        const network = this.getCurrentNetwork();
        return keystore_1.default.getKeyByLedger(index, network);
    }
    signByLedger(index, sender, msg) {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} signByLedger not implemented.`);
        }
        const network = this.getCurrentNetwork();
        return keystore_1.default.signByLedger(index, sender, msg, network);
    }
    setLedgerTransport(transport) {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} setLedgerTransport not implemented.`);
        }
        return keystore_1.default.initWallet(transport);
    }
    getLedgerStatus() {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} getLedgerStatus not implemented.`);
        }
        return keystore_1.default.getWalletStatus();
    }
}
exports.default = BtcKeystoreClient;
//# sourceMappingURL=keystoreClient.js.map