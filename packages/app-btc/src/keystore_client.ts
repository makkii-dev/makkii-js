import * as bip39 from 'bip39';
import {IsingleKeystoreFullClient } from '@makkii/makkii-core/src/interfaces/keystore_client';
import KYSTORE from './lib_keystore';

export default class BtcKeystoreClient implements IsingleKeystoreFullClient {
    ledgerSupport: boolean = false;

    mnemonic: string;

    network: 'BTC'|'BTCTEST'|'LTC'|'LTCTEST';

    constructor(network: 'BTC'|'BTCTEST'|'LTC'|'LTCTEST') {
        if(!(['BTC', 'BTCTEST', 'LTC', 'LTCTEST'].includes(network))){
            throw new Error(`BtcKeystoreClient Unsupport network: ${network}`)
        }
        this.mnemonic = '';
        this.network = network;
        if (network.match('BTC')) {
            this.ledgerSupport = true
        }
    }

    getCurrentNetwork = () => {
        return this.network;
    }

    checkLedgerSupport = () => {
        return this.ledgerSupport;
    }

    signTransaction = (tx: any) => {
        const network = this.getCurrentNetwork();
        return KYSTORE.signTransaction(tx, network);
    }

    getAccount = (address_index: number) => {
        if (!bip39.validateMnemonic(this.mnemonic))
            throw new Error('Set Mnemonic first');
        const network = this.getCurrentNetwork();
        return KYSTORE.getAccountFromMnemonic(this.mnemonic, address_index, {network})
    }

    setMnemonic = (mnemonic: string) => {
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
            return Promise.reject(new Error(`${this.network} recover privKey failed`));
        } catch (e) {
            return Promise.reject(new Error(`${this.network} recover privKey failed: ${e}`));
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
            return Promise.reject(new Error(`${this.network} recover privKey failed`));
        } catch (e) {
            return Promise.reject(new Error(`${this.network} recover privKey failed: ${e}`));
        }
    }

    recoverKeyPairByKeyFile = (file: string, password: string) => {
        throw new Error(`${this.network} recoverKeyPairByKeyFile not implemented.`);
    }

    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error(`${this.network} validatePrivateKey not implemented.`);
    }

    validateAddress = (address: string) => {
        const network = this.getCurrentNetwork();
        return KYSTORE.validateAddress(address, network);
    }

    getAccountFromMnemonic = (address_index: number, mnemonic: string) => {
        const network = this.getCurrentNetwork();
        return KYSTORE.getAccountFromMnemonic(mnemonic, address_index, {network});
    }

    getAccountByLedger = (index: number) => {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.network} getAccountByLedger not implemented.`);
        }
        const network = this.getCurrentNetwork();
        return KYSTORE.getAccountByLedger(index, network);
    }

    signByLedger = (index: number, sender: string, msg: Buffer) => {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.network} signByLedger not implemented.`);
        }
        const network = this.getCurrentNetwork();
        return KYSTORE.signByLedger(index, sender, msg, network);
    }

    setLedgerTransport = (transport: any) => {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.network} setLedgerTransport not implemented.`);
        }
        return KYSTORE.initWallet(transport);
    }

    getLedgerStatus = () => {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.network} getLedgerStatus not implemented.`);
        }
        return KYSTORE.getWalletStatus();
    }


} 