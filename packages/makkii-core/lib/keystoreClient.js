"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isIntanceOfKeystoreClient(client) {
    const map = [
        "signTransaction",
        "getKey",
        "setMnemonic",
        "generateMnemonic",
        "recoverKeyPairByPrivateKey",
        "recoverKeyPairByWIF",
        "recoverKeyPairBykeyFile",
        "validatePrivateKey",
        "validateAddress",
        "getKeyFromMnemonic",
    ];
    return !map.some(i => !(i in client));
}
class KeystoreClient {
    constructor() {
        this.coins = {};
    }
    addCoin(coinType, client) {
        if (!isIntanceOfKeystoreClient(client)) {
            throw new Error('not a keystore client!');
        }
        this.coins[coinType.toLowerCase()] = client;
    }
    removeCoin(coinType) {
        if (this.coins[coinType.toLowerCase()]) {
            delete this.coins[coinType.toLowerCase()];
            return true;
        }
        return false;
    }
    getCoin(coinType) {
        const coin = this.coins[coinType.toLowerCase()];
        if (!coin) {
            throw new Error(`coin: [${coinType}] is not init or unsupported.`);
        }
        return coin;
    }
    signTransaction(coinType, tx) {
        const coin = this.getCoin(coinType);
        return coin.signTransaction(tx);
    }
    getKey(coinType, address_index) {
        const coin = this.getCoin(coinType);
        return coin.getKey(address_index);
    }
    setMnemonic(coinType, mnemonic, passphrase) {
        const coin = this.getCoin(coinType);
        return coin.setMnemonic(mnemonic, passphrase);
    }
    generateMnemonic(coinType) {
        const coin = this.getCoin(coinType);
        return coin.generateMnemonic();
    }
    recoverKeyPairByPrivateKey(coinType, priKey, options) {
        const coin = this.getCoin(coinType);
        return coin.recoverKeyPairByPrivateKey(priKey, options);
    }
    recoverKeyPairByWIF(coinType, WIF, options) {
        const coin = this.getCoin(coinType);
        return coin.recoverKeyPairByWIF(WIF, options);
    }
    recoverKeyPairBykeyFile(coinType, file, password) {
        const coin = this.getCoin(coinType);
        return coin.recoverKeyPairBykeyFile(file, password);
    }
    validatePrivateKey(coinType, privateKey) {
        const coin = this.getCoin(coinType);
        return coin.validatePrivateKey(privateKey);
    }
    validateAddress(coinType, address) {
        const coin = this.getCoin(coinType);
        return coin.validateAddress(address);
    }
    getKeyFromMnemonic(coinType, ddress_index, mnemonic) {
        const coin = this.getCoin(coinType);
        return coin.getKeyFromMnemonic(ddress_index, mnemonic);
    }
    getKeyByLedger(coinType, index) {
        const coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.getKeyByLedger(index);
        }
        throw new Error(`[${coinType}] getKeyByLedger is not implemented.`);
    }
    signByLedger(coinType, index, sender, msg) {
        const coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.signByLedger(index, sender, msg);
        }
        throw new Error(`[${coinType}] signByLedger is not implemented.`);
    }
    setLedgerTransport(coinType, transport) {
        const coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.setLedgerTransport(transport);
        }
        throw new Error(`[${coinType}] setLedgerTransport is not implemented.`);
    }
    getLedgerStatus(coinType) {
        const coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.getLedgerStatus();
        }
        throw new Error(`[${coinType}] getLedgerStatus is not implemented.`);
    }
}
exports.default = KeystoreClient;
//# sourceMappingURL=keystoreClient.js.map