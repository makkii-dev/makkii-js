import * as bip39 from 'bip39';
import KYSTORE from './keystore';
import {keystoreClient, keystoreLedgerClient} from './interfaces/keystoreClient';

export default class BtcKeystoreClient  implements keystoreClient, keystoreLedgerClient{
    ledgerSupport: boolean = false;

    mnemonic: string;

    readonly coin: string;

    readonly isTestNet: boolean;

    constructor(coin: string = 'btc', isTestNet = false) {
        this.mnemonic = '';
        this.coin = coin;
        this.isTestNet = isTestNet;
        if(coin.toLowerCase() === 'btc'){
            this.ledgerSupport = true
        }
    }

    getCurrentNetwork(): string {
        const coin_ = this.coin.toUpperCase();
        const suffix = this.isTestNet ? 'TEST' : '';
        return coin_ + suffix
    }

    checkLedgerSupport(): boolean {
        return this.coin.toLowerCase() === 'btc'
    }

    signTransaction(tx: any): Promise<any> {
        const network = this.getCurrentNetwork();
        return KYSTORE.signTransaction(tx, network);
    }

    getKey(address_index: number): Promise<any> {
        if (!bip39.validateMnemonic(this.mnemonic))
            throw new Error('Set Mnemonic first');
        const network = this.getCurrentNetwork();
        return KYSTORE.getKeyByLedger(address_index, network)
    }

    setMnemonic(mnemonic: string, passphrase?: string): void {
        this.mnemonic = mnemonic;
    }

    generateMnemonic(): string {
        const mnemonic = bip39.generateMnemonic();
        this.mnemonic = mnemonic;
        return mnemonic;
    }

    recoverKeyPairByPrivateKey(priKey: string, options?: any): Promise<any> {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = KYSTORE.keyPair(priKey, { network, ...options });
            const { privateKey, publicKey, address, ...reset } = keyPair;
            return Promise.resolve({ private_key: privateKey, public_key: publicKey, address, ...reset })
        } catch (e) {
            return Promise.reject(new Error(`${this.coin} recover privKey failed: ${e}`));
        }
    }

    recoverKeyPairByWIF(WIF: string, options?: any): Promise<any> {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = KYSTORE.keyPairFromWIF(WIF, { network, ...options });
            const { privateKey, publicKey, address, ...reset } = keyPair;
            return Promise.resolve({ private_key: privateKey, public_key: publicKey, address, ...reset })
        } catch (e) {
            return Promise.reject(new Error(`${this.coin} recover privKey failed: ${e}`));
        }
    }

    recoverKeyPairBykeyFile(file: string, password: string): Promise<any> {
        throw new Error(`${this.coin} recoverKeyPairBykeyFile not implemented.`);
    }

    validatePrivateKey(privateKey: string | Buffer): boolean {
        throw new Error(`${this.coin} validatePrivateKey not implemented.`);
    }

    validateAddress(address: string): Promise<any> {
        return KYSTORE.validateAddress(address);
    }

    getKeyFromMnemonic(address_index: number, mnemonic: string): Promise<any> {
        return KYSTORE.getKeyFromMnemonic(mnemonic, address_index);
    }

    getKeyByLedger(index: number): Promise<any> {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} getKeyByLedger not implemented.`);
        }
        const network = this.getCurrentNetwork();
        return KYSTORE.getKeyByLedger(index, network);
    }

    signByLedger(index: number, sender: string, msg: Buffer): Promise<any> {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} signByLedger not implemented.`);
        }
        const network = this.getCurrentNetwork();
        return KYSTORE.signByLedger(index, sender, msg, network);
    }

    setLedgerTransport(transport: any): void {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} setLedgerTransport not implemented.`);
        }
        return KYSTORE.initWallet(transport);
    }

    getLedgerStatus(): boolean {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.coin} getLedgerStatus not implemented.`);
        }
        return KYSTORE.getWalletStatus();
    }


} 