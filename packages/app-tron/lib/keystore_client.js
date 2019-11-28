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
class TronKeystoreClient {
    constructor() {
        this.signTransaction = (tx, signer, signerParam) => {
            return signer.signTransaction(tx, signerParam);
        };
        this.generateMnemonic = () => {
            const mnemonic = bip39.generateMnemonic();
            return mnemonic;
        };
        this.recoverKeyPairByPrivateKey = (priKey) => {
            try {
                const keyPair = lib_keystore_1.default.keyPair(priKey);
                const { privateKey, publicKey, address } = keyPair, reset = __rest(keyPair, ["privateKey", "publicKey", "address"]);
                return Promise.resolve(Object.assign({ private_key: privateKey, public_key: publicKey, address }, reset));
            }
            catch (e) {
                return Promise.reject(new Error(`recover privKey failed: ${e}`));
            }
        };
        this.validatePrivateKey = (privateKey) => {
            throw new Error("[tron] validatePrivateKey not implemented.");
        };
        this.validateAddress = (address) => {
            return lib_keystore_1.default.validateAddress(address);
        };
        this.getAccountFromMnemonic = (address_index, mnemonic) => {
            return lib_keystore_1.default.getAccountFromMnemonic(mnemonic, address_index);
        };
        this.getAccountFromHardware = (address_index, hardware) => {
            throw new Error("[tron] getAccountFromHardware not implemented.");
        };
    }
}
exports.default = TronKeystoreClient;
//# sourceMappingURL=keystore_client.js.map