"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_aion_1 = require("@makkii/app-aion");
const app_btc_1 = require("@makkii/app-btc");
const app_eth_1 = require("@makkii/app-eth");
const app_tron_1 = require("@makkii/app-tron");
class KeystoreClient {
    constructor(support_coin_lists, isTestNet = true) {
        support_coin_lists.forEach(c => {
            if (c.toLowerCase() === 'aion') {
                this.coins.aion = new app_aion_1.AionKeystoreClient();
            }
            else if (c.toLowerCase() === 'btc') {
                this.coins.btc = new app_btc_1.BtcKeystoreClient('btc', isTestNet);
            }
            else if (c.toLowerCase() === 'eth') {
                this.coins.eth = new app_eth_1.EthKeystoreClient();
            }
            else if (c.toLowerCase() === 'ltc') {
                this.coins.ltc = new app_btc_1.BtcKeystoreClient('ltc', isTestNet);
            }
            else if (c.toLowerCase() === 'trx') {
                this.coins.trx = new app_tron_1.TronKeystoreClient();
            }
            else {
                throw new Error(`coin: [${c}] is unsupported.`);
            }
        });
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