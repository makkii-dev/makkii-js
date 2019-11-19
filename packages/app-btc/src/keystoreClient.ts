import * as bip39 from 'bip39';
import KYSTORE from './keystore';
import { keystoreClient, keystoreLedgerClient } from './interfaces/keystoreClient';

export default class BtcKeystoreClient implements keystoreClient, keystoreLedgerClient {
    ledgerSupport: boolean = false;

    mnemonic: string;

    readonly coin: string;

    readonly isTestNet: boolean;

    constructor(coin: string = 'btc', isTestNet = false) {
        this.mnemonic = '';
        this.coin = coin;
        this.isTestNet = isTestNet;
        if (coin.toLowerCase() === 'btc') {
            this.ledgerSupport = true
        }
    }

    getCurrentNetwork = () => {
        const coin_ = this.coin.toUpperCase();
        const suffix = this.isTestNet ? 'TEST' : '';
        return coin_ + suffix
    }

    checkLedgerSupport = () => {
        return this.coin.toLowerCase() === 'btc'
    }

    signTransaction = (tx: any) => {
        const network = this.getCurrentNetwork();
        return KYSTORE.signTransaction(tx, network);
    }

    getKey = (address_index: number) => {
        if (!bip39.validateMnemonic(this.mnemonic))
            throw new Error('Set Mnemonic first');
        const network = this.getCurrentNetwork();
        return KYSTORE.getKeyFromMnemonic(this.mnemonic, address_index, {network})
    }

    setMnemonic = (mnemonic: string, passphrase?: string) => {
        this.mnemonic = mnemonic;
    }

    generateMnemonic = () => {
        const mnemonic = bip39.generateMnemonic();
        this.mnemonic = mnemonic;
        return mnemonic;
    }

    recoverKeyPairByPrivateKey = (priKey: string, options?: any) => {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = KYSTORE.keyPair(priKey, { network, ...options });
            if (keyPair) {
                const { privateKey, publicKey, address, ...reset } = keyPair;
                return Promise.resolve({ private_key: privateKey, public_key: publicKey, address, ...reset })
            }
            return Promise.reject(new Error(`${this.coin} recover privKey failed`));
        } catch (e) {
            return Promise.reject(new Error(`${this.coin} recover privKey failed: ${e}`));
        }
    }

    recoverKeyPairByWIF = (WIF: string, options?: any) => {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = KYSTORE.keyPairFromWIF(WIF, { network, ...options });
            if (keyPair) {
                const { privateKey, publicKey, address, ...reset } = keyPair;
                return Promise.resolve({ private_key: privateKey, public_key: publicKey, address, ...reset })
            }
            return Promise.reject(new Error(`${this.coin} recover privKey failed`));
        } catch (e) {
            return Promise.reject(new Error(`${this.coin} recover privKey failed: ${e}`));
        }
    }

    recoverKeyPairBykeyFile = (file: string, password: string) => {
        throw new Error(`${this.coin} recoverKeyPairBykeyFile not implemented.`);
    }

    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error(`${this.coin} validatePrivateKey not implemented.`);
    }

    validateAddress = (address: string) => {
        const network = this.getCurrentNetwork();
        return KYSTORE.validateAddress(address, network);
    }

    getKeyFromMnemonic = (address_index: number, mnemonic: string) => {
        const network = this.getCurrentNetwork();
        return KYSTORE.getKeyFromMnemonic(mnemonic, address_index, {network});
    }

    getKeyByLedger = (index: number) => {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} getKeyByLedger not implemented.`);
        }
        const network = this.getCurrentNetwork();
        return KYSTORE.getKeyByLedger(index, network);
    }

    signByLedger = (index: number, sender: string, msg: Buffer) => {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} signByLedger not implemented.`);
        }
        const network = this.getCurrentNetwork();
        return KYSTORE.signByLedger(index, sender, msg, network);
    }

    setLedgerTransport = (transport: any) => {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} setLedgerTransport not implemented.`);
        }
        return KYSTORE.initWallet(transport);
    }

    getLedgerStatus = () => {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} getLedgerStatus not implemented.`);
        }
        return KYSTORE.getWalletStatus();
    }


} 