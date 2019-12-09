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
        this.signTransaction = (tx, signer, signerParam) => {
            const network = this.getCurrentNetwork();
            return signer.signTransaction(tx, Object.assign(Object.assign({}, signerParam), { network }));
        };
        this.generateMnemonic = () => {
            const mnemonic = bip39.generateMnemonic();
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
        this.recoverKeyPairByWIF = (WIF) => {
            const network = this.getCurrentNetwork();
            try {
                const keyPair = lib_keystore_1.default.keyPairFromWIF(WIF, {
                    network
                });
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
        this.validatePrivateKey = (privateKey) => {
            throw new Error(`${this.network} validatePrivateKey not implemented.`);
        };
        this.validateAddress = (address) => {
            const network = this.getCurrentNetwork();
            return lib_keystore_1.default.validateAddress(address, network);
        };
        this.getAccountFromMnemonic = (address_index, mnemonic) => {
            const network = this.getCurrentNetwork();
            return lib_keystore_1.default.getAccountFromMnemonic(mnemonic, address_index, {
                network
            });
        };
        this.getAccountFromHardware = (index, hardware) => {
            if (!this.checkLedgerSupport()) {
                throw new Error(`${this.network} getAccountFromHardware not implemented.`);
            }
            return hardware.getAccount(index);
        };
        if (!["BTC", "BTCTEST", "LTC", "LTCTEST"].includes(network)) {
            throw new Error(`BtcKeystoreClient Unsupport network: ${network}`);
        }
        this.network = network;
        if (network.match("BTC")) {
            this.ledgerSupport = true;
        }
    }
}
exports.default = BtcKeystoreClient;
//# sourceMappingURL=keystore_client.js.map