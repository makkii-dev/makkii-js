"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isIntanceOfKeystoreClient(client) {
    var map = [
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
    return !map.some(function (i) { return !(i in client); });
}
var KeystoreClient = (function () {
    function KeystoreClient() {
        this.coins = {};
    }
    KeystoreClient.prototype.addCoin = function (coinType, client) {
        if (!isIntanceOfKeystoreClient(client)) {
            throw new Error('not a keystore client!');
        }
        this.coins[coinType.toLowerCase()] = client;
    };
    KeystoreClient.prototype.removeCoin = function (coinType) {
        if (this.coins[coinType.toLowerCase()]) {
            delete this.coins[coinType.toLowerCase()];
            return true;
        }
        return false;
    };
    KeystoreClient.prototype.getCoin = function (coinType) {
        var coin = this.coins[coinType.toLowerCase()];
        if (!coin) {
            throw new Error("coin: [" + coinType + "] is not init or unsupported.");
        }
        return coin;
    };
    KeystoreClient.prototype.signTransaction = function (coinType, tx) {
        var coin = this.getCoin(coinType);
        return coin.signTransaction(tx);
    };
    KeystoreClient.prototype.getKey = function (coinType, address_index) {
        var coin = this.getCoin(coinType);
        return coin.getKey(address_index);
    };
    KeystoreClient.prototype.setMnemonic = function (coinType, mnemonic, passphrase) {
        var coin = this.getCoin(coinType);
        return coin.setMnemonic(mnemonic, passphrase);
    };
    KeystoreClient.prototype.generateMnemonic = function (coinType) {
        var coin = this.getCoin(coinType);
        return coin.generateMnemonic();
    };
    KeystoreClient.prototype.recoverKeyPairByPrivateKey = function (coinType, priKey, options) {
        var coin = this.getCoin(coinType);
        return coin.recoverKeyPairByPrivateKey(priKey, options);
    };
    KeystoreClient.prototype.recoverKeyPairByWIF = function (coinType, WIF, options) {
        var coin = this.getCoin(coinType);
        return coin.recoverKeyPairByWIF(WIF, options);
    };
    KeystoreClient.prototype.recoverKeyPairBykeyFile = function (coinType, file, password) {
        var coin = this.getCoin(coinType);
        return coin.recoverKeyPairBykeyFile(file, password);
    };
    KeystoreClient.prototype.validatePrivateKey = function (coinType, privateKey) {
        var coin = this.getCoin(coinType);
        return coin.validatePrivateKey(privateKey);
    };
    KeystoreClient.prototype.validateAddress = function (coinType, address) {
        var coin = this.getCoin(coinType);
        return coin.validateAddress(address);
    };
    KeystoreClient.prototype.getKeyFromMnemonic = function (coinType, ddress_index, mnemonic) {
        var coin = this.getCoin(coinType);
        return coin.getKeyFromMnemonic(ddress_index, mnemonic);
    };
    KeystoreClient.prototype.getKeyByLedger = function (coinType, index) {
        var coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.getKeyByLedger(index);
        }
        throw new Error("[" + coinType + "] getKeyByLedger is not implemented.");
    };
    KeystoreClient.prototype.signByLedger = function (coinType, index, sender, msg) {
        var coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.signByLedger(index, sender, msg);
        }
        throw new Error("[" + coinType + "] signByLedger is not implemented.");
    };
    KeystoreClient.prototype.setLedgerTransport = function (coinType, transport) {
        var coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.setLedgerTransport(transport);
        }
        throw new Error("[" + coinType + "] setLedgerTransport is not implemented.");
    };
    KeystoreClient.prototype.getLedgerStatus = function (coinType) {
        var coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.getLedgerStatus();
        }
        throw new Error("[" + coinType + "] getLedgerStatus is not implemented.");
    };
    return KeystoreClient;
}());
exports.default = KeystoreClient;
//# sourceMappingURL=keystoreClient.js.map