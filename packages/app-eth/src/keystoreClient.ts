import * as bip39 from 'bip39';
import KEYSTORE from './keystore';
import { keystoreClient, keystoreLedgerClient } from './interfaces/keystoreClient';

export default class EthKeystoreClient implements keystoreClient, keystoreLedgerClient {

    ledgerSupport: boolean = true;

    mnemonic: string = '';

    signTransaction = (tx: any) => {
        return KEYSTORE.signTransaction(tx);
    }

    getKey = (address_index: number) => {
        if (!bip39.validateMnemonic(this.mnemonic))
            throw new Error('Set Mnemonic first');
        return KEYSTORE.getKeyFromMnemonic(this.mnemonic, address_index);
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
        try {
            const keyPair = KEYSTORE.keyPair(priKey);
            const {
                privateKey, publicKey, address, ...reset
            } = keyPair;
            return Promise.resolve({
                private_key: privateKey, public_key: publicKey, address, ...reset,
            });
        } catch (e) {
            return Promise.reject(new Error(`recover privKey failed: ${e}`));
        }
    }

    recoverKeyPairByWIF = (WIF: string, options?: any) => {
        throw new Error("[eth] recoverKeyPairByWIF not implemented.");
    }

    recoverKeyPairBykeyFile = (file: string, password: string) => {
        throw new Error("[eth] recoverKeyPairBykeyFile not implemented.");
    }

    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error("[eth] validatePrivateKey not implemented.");
    }

    validateAddress = (address: string) => {
        return KEYSTORE.validateAddress(address);
    }

    getKeyFromMnemonic = (address_index: number, mnemonic: string) => {
        return KEYSTORE.getKeyFromMnemonic(mnemonic, address_index);
    }

    getKeyByLedger = async (index: number) => {
        return KEYSTORE.getKeyByLedger(index);
    }

    signByLedger = (index: number, sender: string, msg: Buffer) => {
        throw new Error("[eth] signByLedger not implemented.");
    }

    setLedgerTransport = (transport: any) => {
        KEYSTORE.initWallet(transport);
    }

    getLedgerStatus = () => {
        return KEYSTORE.getWalletStatus();
    }
}