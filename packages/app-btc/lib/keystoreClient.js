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
const lib_keystore_1 = require("./lib_keystore");
class BtcKeystoreClient {
    constructor(network) {
        this.ledgerSupport = false;
        this.getCurrentNetwork = () => {
            return this.network;
        };
        this.checkLedgerSupport = () => {
            return this.ledgerSupport;
        };
        this.signTransaction = (tx) => {
            const network = this.getCurrentNetwork();
            return lib_keystore_1.default.signTransaction(tx, network);
        };
        this.getAccount = (address_index) => {
            if (!bip39.validateMnemonic(this.mnemonic))
                throw new Error('Set Mnemonic first');
            const network = this.getCurrentNetwork();
            return lib_keystore_1.default.getAccountFromMnemonic(this.mnemonic, address_index, { network });
        };
        this.setMnemonic = (mnemonic) => {
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
                const keyPair = lib_keystore_1.default.keyPair(priKey, Object.assign({ network }, options));
                if (keyPair) {
                    const { privateKey, publicKey, address } = keyPair, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                    return Promise.resolve(Object.assign({ private_key: privateKey, public_key: publicKey, address }, reset));
                }
                return Promise.reject(new Error(`${this.network} recover privKey failed`));
            }
            catch (e) {
                return Promise.reject(new Error(`${this.network} recover privKey failed: ${e}`));
            }
        };
        this.recoverKeyPairByWIF = (WIF, options) => {
            const network = this.getCurrentNetwork();
            try {
                const keyPair = lib_keystore_1.default.keyPairFromWIF(WIF, Object.assign({ network }, options));
                if (keyPair) {
                    const { privateKey, publicKey, address } = keyPair, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                    return Promise.resolve(Object.assign({ private_key: privateKey, public_key: publicKey, address }, reset));
                }
                return Promise.reject(new Error(`${this.network} recover privKey failed`));
            }
            catch (e) {
                return Promise.reject(new Error(`${this.network} recover privKey failed: ${e}`));
            }
        };
        this.recoverKeyPairByKeyFile = (file, password) => {
            throw new Error(`${this.network} recoverKeyPairByKeyFile not implemented.`);
        };
        this.validatePrivateKey = (privateKey) => {
            throw new Error(`${this.network} validatePrivateKey not implemented.`);
        };
        this.validateAddress = (address) => {
            const network = this.getCurrentNetwork();
            return lib_keystore_1.default.validateAddress(address, network);
        };
        this.getAccountFromMnemonic = (address_index, mnemonic) => {
            const network = this.getCurrentNetwork();
            return lib_keystore_1.default.getAccountFromMnemonic(mnemonic, address_index, { network });
        };
        this.getAccountByLedger = (index) => {
            if (!this.checkLedgerSupport()) {
                throw new Error(`${this.network} getAccountByLedger not implemented.`);
            }
            const network = this.getCurrentNetwork();
            return lib_keystore_1.default.getAccountByLedger(index, network);
        };
        this.signByLedger = (index, sender, msg) => {
            if (!this.checkLedgerSupport()) {
                throw new Error(`${this.network} signByLedger not implemented.`);
            }
            const network = this.getCurrentNetwork();
            return lib_keystore_1.default.signByLedger(index, sender, msg, network);
        };
        this.setLedgerTransport = (transport) => {
            if (!this.checkLedgerSupport()) {
                throw new Error(`${this.network} setLedgerTransport not implemented.`);
            }
            return lib_keystore_1.default.initWallet(transport);
        };
        this.getLedgerStatus = () => {
            if (!this.checkLedgerSupport()) {
                throw new Error(`${this.network} getLedgerStatus not implemented.`);
            }
            return lib_keystore_1.default.getWalletStatus();
        };
        if (!(['BTC', 'BTCTEST', 'LTC', 'LTCTEST'].includes(network))) {
            throw new Error(`BtcKeystoreClient Unsupport network: ${network}`);
        }
        this.mnemonic = '';
        this.network = network;
        if (network.match('BTC')) {
            this.ledgerSupport = true;
        }
    }
}
exports.default = BtcKeystoreClient;
//# sourceMappingURL=keystoreClient.js.map