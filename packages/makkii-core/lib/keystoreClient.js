"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isIntanceOfKeystoreClient(client) {
    const map = [
        "signTransaction",
        "getAccount",
        "setMnemonic",
        "generateMnemonic",
        "recoverKeyPairByPrivateKey",
        "recoverKeyPairByWIF",
        "recoverKeyPairByKeyFile",
        "validatePrivateKey",
        "validateAddress",
        "getAccountFromMnemonic",
    ];
    return !map.some(i => !(i in client));
}
class KeystoreClient {
    constructor() {
        this.coins = {};
        this.addCoin = (coinType, client) => {
            if (!isIntanceOfKeystoreClient(client)) {
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
        this.signTransaction = (coinType, tx) => {
            const coin = this.getCoin(coinType);
            return coin.signTransaction(tx);
        };
        this.getAccount = (coinType, address_index) => {
            const coin = this.getCoin(coinType);
            return coin.getAccount(address_index);
        };
        this.setMnemonic = (coinType, mnemonic) => {
            const coin = this.getCoin(coinType);
            return coin.setMnemonic(mnemonic);
        };
        this.generateMnemonic = (coinType) => {
            const coin = this.getCoin(coinType);
            return coin.generateMnemonic();
        };
        this.recoverKeyPairByPrivateKey = (coinType, priKey, options) => {
            const coin = this.getCoin(coinType);
            return coin.recoverKeyPairByPrivateKey(priKey, options);
        };
        this.recoverKeyPairByWIF = (coinType, WIF, options) => {
            const coin = this.getCoin(coinType);
            return coin.recoverKeyPairByWIF(WIF, options);
        };
        this.recoverKeyPairByKeyFile = (coinType, file, password) => {
            const coin = this.getCoin(coinType);
            return coin.recoverKeyPairByKeyFile(file, password);
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
        this.getAccountByLedger = (coinType, index) => {
            const coin = this.getCoin(coinType);
            if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
                return coin.getAccountByLedger(index);
            }
            throw new Error(`[${coinType}] getAccountByLedger is not implemented.`);
        };
        this.signByLedger = (coinType, index, sender, msg) => {
            const coin = this.getCoin(coinType);
            if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
                return coin.signByLedger(index, sender, msg);
            }
            throw new Error(`[${coinType}] signByLedger is not implemented.`);
        };
        this.setLedgerTransport = (coinType, transport) => {
            const coin = this.getCoin(coinType);
            if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
                return coin.setLedgerTransport(transport);
            }
            throw new Error(`[${coinType}] setLedgerTransport is not implemented.`);
        };
        this.getLedgerStatus = (coinType) => {
            const coin = this.getCoin(coinType);
            if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
                return coin.getLedgerStatus();
            }
            throw new Error(`[${coinType}] getLedgerStatus is not implemented.`);
        };
    }
}
exports.default = KeystoreClient;
//# sourceMappingURL=keystoreClient.js.map