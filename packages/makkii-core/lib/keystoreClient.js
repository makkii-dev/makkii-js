"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isInstanceOfKeystoreClient(client) {
    const map = [
        "signTransaction",
        "generateMnemonic",
        "recoverKeyPairByPrivateKey",
        "validatePrivateKey",
        "validateAddress",
        "getAccountFromMnemonic",
        "getAccountFromHardware"
    ];
    return !map.some(i => !(i in client));
}
class KeystoreClient {
    constructor() {
        this.coins = {};
        this.addCoin = (coinType, client) => {
            if (!isInstanceOfKeystoreClient(client)) {
                throw new Error('not a keystore client!');
            }
            this.coins[coinType.toLowerCase()] = client;
        };
        this.removeCoin = (coinType) => {
            if (this.coins[coinType.toLowerCase()]) {
                delete this.coins[coinType.toLowerCase()];
                return true;
            }
            return false;
        };
        this.getCoin = (coinType) => {
            const coin = this.coins[coinType.toLowerCase()];
            if (!coin) {
                throw new Error(`coin: [${coinType}] is not init or unsupported.`);
            }
            return coin;
        };
        this.signTransaction = (coinType, tx, signer, signerParams) => {
            const coin = this.getCoin(coinType);
            return coin.signTransaction(tx, signer, signerParams);
        };
        this.generateMnemonic = (coinType) => {
            const coin = this.getCoin(coinType);
            return coin.generateMnemonic();
        };
        this.recoverKeyPairByPrivateKey = (coinType, priKey, options) => {
            const coin = this.getCoin(coinType);
            return coin.recoverKeyPairByPrivateKey(priKey, options);
        };
        this.validatePrivateKey = (coinType, privateKey) => {
            const coin = this.getCoin(coinType);
            return coin.validatePrivateKey(privateKey);
        };
        this.validateAddress = (coinType, address) => {
            const coin = this.getCoin(coinType);
            return coin.validateAddress(address);
        };
        this.getAccountFromMnemonic = (coinType, ddress_index, mnemonic) => {
            const coin = this.getCoin(coinType);
            return coin.getAccountFromMnemonic(ddress_index, mnemonic);
        };
        this.getAccountFromHardware = (coinType, index, hardware) => {
            const coin = this.getCoin(coinType);
            return coin.getAccountFromHardware(index, hardware);
        };
    }
}
exports.default = KeystoreClient;
//# sourceMappingURL=keystoreClient.js.map