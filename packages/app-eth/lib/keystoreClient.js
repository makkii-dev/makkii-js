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
class EthKeystoreClient {
    constructor() {
        this.ledgerSupport = true;
        this.mnemonic = '';
    }
    signTransaction(tx) {
        return keystore_1.default.signTransaction(tx);
    }
    getKey(address_index) {
        if (!bip39.validateMnemonic(this.mnemonic))
            throw new Error('Set Mnemonic first');
        return keystore_1.default.getKeyFromMnemonic(this.mnemonic, address_index);
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
        try {
            const keyPair = keystore_1.default.keyPair(priKey);
            const { privateKey, publicKey, address } = keyPair, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
            return Promise.resolve(Object.assign({ private_key: privateKey, public_key: publicKey, address }, reset));
        }
        catch (e) {
            return Promise.reject(new Error(`recover privKey failed: ${e}`));
        }
    }
    recoverKeyPairByWIF(WIF, options) {
        throw new Error("[eth] recoverKeyPairByWIF not implemented.");
    }
    recoverKeyPairBykeyFile(file, password) {
        throw new Error("[eth] recoverKeyPairBykeyFile not implemented.");
    }
    validatePrivateKey(privateKey) {
        throw new Error("[eth] validatePrivateKey not implemented.");
    }
    validateAddress(address) {
        return keystore_1.default.validateAddress(address);
    }
    getKeyFromMnemonic(address_index, mnemonic) {
        return keystore_1.default.getKeyFromMnemonic(mnemonic, address_index);
    }
    getKeyByLedger(index) {
        if (!this.getLedgerStatus()) {
            throw new Error('ledger is not available');
        }
        return keystore_1.default.getKeyByLedger(index);
    }
    signByLedger(index, sender, msg) {
        throw new Error("[eth] signByLedger not implemented.");
    }
    setLedgerTransport(transport) {
        keystore_1.default.initWallet(transport);
    }
    getLedgerStatus() {
        return keystore_1.default.getWalletStatus();
    }
}
exports.default = EthKeystoreClient;
//# sourceMappingURL=keystoreClient.js.map