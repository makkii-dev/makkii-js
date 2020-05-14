"use strict";
exports.__esModule = true;
function isInstanceOfKeystoreClient(client) {
    var map = [
        "signTransaction",
        "generateMnemonic",
        "recoverKeyPairByPrivateKey",
        "validatePrivateKey",
        "validateAddress",
        "getAccountFromMnemonic",
        "getAccountFromHardware"
    ];
    return !map.some(function (i) { return !(i in client); });
}
var KeystoreClient = (function () {
    function KeystoreClient() {
        var _this = this;
        this.coins = {};
        this.addCoin = function (coinType, client) {
            if (!isInstanceOfKeystoreClient(client)) {
                throw new Error("not a keystore client!");
            }
            _this.coins[coinType.toLowerCase()] = client;
        };
        this.removeCoin = function (coinType) {
            if (_this.coins[coinType.toLowerCase()]) {
                delete _this.coins[coinType.toLowerCase()];
                return true;
            }
            return false;
        };
        this.getCoin = function (coinType) {
            var coin = _this.coins[coinType.toLowerCase()];
            if (!coin) {
                throw new Error("coin: [" + coinType + "] is not init or unsupported.");
            }
            return coin;
        };
        this.signTransaction = function (coinType, tx, signer, signerParams) {
            var coin = _this.getCoin(coinType);
            return coin.signTransaction(tx, signer, signerParams);
        };
        this.generateMnemonic = function (coinType) {
            var coin = _this.getCoin(coinType);
            return coin.generateMnemonic();
        };
        this.recoverKeyPairByPrivateKey = function (coinType, priKey, options) {
            var coin = _this.getCoin(coinType);
            return coin.recoverKeyPairByPrivateKey(priKey, options);
        };
        this.validatePrivateKey = function (coinType, privateKey) {
            var coin = _this.getCoin(coinType);
            return coin.validatePrivateKey(privateKey);
        };
        this.validateAddress = function (coinType, address) {
            var coin = _this.getCoin(coinType);
            return coin.validateAddress(address);
        };
        this.getAccountFromMnemonic = function (coinType, ddress_index, mnemonic) {
            var coin = _this.getCoin(coinType);
            return coin.getAccountFromMnemonic(ddress_index, mnemonic);
        };
        this.getAccountFromHardware = function (coinType, index, hardware) {
            var coin = _this.getCoin(coinType);
            return coin.getAccountFromHardware(index, hardware);
        };
    }
    return KeystoreClient;
}());
exports["default"] = KeystoreClient;
