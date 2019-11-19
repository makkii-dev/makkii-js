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
        this.getCurrentNetwork = () => {
            const coin_ = this.coin.toUpperCase();
            const suffix = this.isTestNet ? 'TEST' : '';
            return coin_ + suffix;
        };
        this.checkLedgerSupport = () => {
            return this.coin.toLowerCase() === 'btc';
        };
        this.signTransaction = (tx) => {
            const network = this.getCurrentNetwork();
            return keystore_1.default.signTransaction(tx, network);
        };
        this.getKey = (address_index) => {
            if (!bip39.validateMnemonic(this.mnemonic))
                throw new Error('Set Mnemonic first');
            const network = this.getCurrentNetwork();
            return keystore_1.default.getKeyFromMnemonic(this.mnemonic, address_index, { network });
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
        };
        this.recoverKeyPairByWIF = (WIF, options) => {
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
        };
        this.recoverKeyPairBykeyFile = (file, password) => {
            throw new Error(`${this.coin} recoverKeyPairBykeyFile not implemented.`);
        };
        this.validatePrivateKey = (privateKey) => {
            throw new Error(`${this.coin} validatePrivateKey not implemented.`);
        };
        this.validateAddress = (address) => {
            const network = this.getCurrentNetwork();
            return keystore_1.default.validateAddress(address, network);
        };
        this.getKeyFromMnemonic = (address_index, mnemonic) => {
            const network = this.getCurrentNetwork();
            return keystore_1.default.getKeyFromMnemonic(mnemonic, address_index, { network });
        };
        this.getKeyByLedger = (index) => {
            if (!this.checkLedgerSupport()) {
                throw new Error(`${this.coin} getKeyByLedger not implemented.`);
            }
            const network = this.getCurrentNetwork();
            return keystore_1.default.getKeyByLedger(index, network);
        };
        this.signByLedger = (index, sender, msg) => {
            if (!this.checkLedgerSupport()) {
                throw new Error(`${this.coin} signByLedger not implemented.`);
            }
            const network = this.getCurrentNetwork();
            return keystore_1.default.signByLedger(index, sender, msg, network);
        };
        this.setLedgerTransport = (transport) => {
            if (!this.checkLedgerSupport()) {
                throw new Error(`${this.coin} setLedgerTransport not implemented.`);
            }
            return keystore_1.default.initWallet(transport);
        };
        this.getLedgerStatus = () => {
            if (!this.checkLedgerSupport()) {
                throw new Error(`${this.coin} getLedgerStatus not implemented.`);
            }
            return keystore_1.default.getWalletStatus();
        };
        this.mnemonic = '';
        this.coin = coin;
        this.isTestNet = isTestNet;
        if (coin.toLowerCase() === 'btc') {
            this.ledgerSupport = true;
        }
    }
}
exports.default = BtcKeystoreClient;
//# sourceMappingURL=keystoreClient.js.map