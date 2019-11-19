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
class AionKeystoreClient {
    constructor() {
        this.ledgerSupport = true;
        this.signTransaction = (tx) => {
            return keystore_1.default.signTransaction(tx);
        };
        this.getKey = (address_index) => {
            if (!bip39.validateMnemonic(this.mnemonic))
                throw new Error('Set Mnemonic first');
            return keystore_1.default.getKeyFromMnemonic(this.mnemonic, address_index);
        };
        this.setMnemonic = (mnemonic, passphrase) => {
            this.mnemonic = mnemonic;
        };
        this.generateMnemonic = () => {
            const mnemonic = bip39.generateMnemonic();
            this.mnemonic = mnemonic;
            return mnemonic;
        };
        this.recoverKeyPairByPrivateKey = (priKey, options) => {
            try {
                const keyPair = keystore_1.default.keyPair(priKey);
                const { privateKey, publicKey, address } = keyPair, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                return Promise.resolve(Object.assign({ private_key: privateKey, public_key: publicKey, address }, reset));
            }
            catch (e) {
                return Promise.reject(new Error(`recover privKey failed: ${e}`));
            }
        };
        this.recoverKeyPairByWIF = (WIF, options) => {
            throw new Error('[AION] recoverKeyPairByWIF not implemented.');
        };
        this.recoverKeyPairBykeyFile = (file, password) => {
            return keystore_1.default.fromV3(file, password);
        };
        this.validatePrivateKey = (privateKey) => {
            try {
                return keystore_1.default.validatePrivateKey(privateKey);
            }
            catch (e) {
                return false;
            }
        };
        this.validateAddress = (address) => {
            return keystore_1.default.validateAddress(address);
        };
        this.getKeyFromMnemonic = (address_index, mnemonic) => {
            return keystore_1.default.getKeyFromMnemonic(mnemonic, address_index);
        };
        this.getKeyByLedger = (index) => {
            return keystore_1.default.getKeyByLedger(index);
        };
        this.signByLedger = (index, sender, msg) => {
            return keystore_1.default.signByLedger(index, sender, msg);
        };
        this.setLedgerTransport = (transport) => {
            keystore_1.default.initWallet(transport);
        };
        this.getLedgerStatus = () => {
            return keystore_1.default.getWalletStatus();
        };
        this.mnemonic = '';
    }
}
exports.default = AionKeystoreClient;
//# sourceMappingURL=keystoreClient.js.map