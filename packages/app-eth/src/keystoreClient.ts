import * as bip39 from 'bip39';
import {IsingleKeystoreFullClient} from '@makkii/makkii-core/src/interfaces/keystoreClient'
import KEYSTORE from './lib_keystore';

export default class EthKeystoreClient implements IsingleKeystoreFullClient {

    ledgerSupport: boolean = true;

    mnemonic: string = '';

    signTransaction = (tx: any) => {
        return KEYSTORE.signTransaction(tx);
    }

    getAccount = (address_index: number) => {
        if (!bip39.validateMnemonic(this.mnemonic))
            throw new Error('Set Mnemonic first');
        return KEYSTORE.getAccountFromMnemonic(this.mnemonic, address_index);
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

    recoverKeyPairByKeyFile = (file: string, password: string) => {
        throw new Error("[eth] recoverKeyPairByKeyFile not implemented.");
    }

    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error("[eth] validatePrivateKey not implemented.");
    }

    validateAddress = (address: string) => {
        return KEYSTORE.validateAddress(address);
    }

    getAccountFromMnemonic = (address_index: number, mnemonic: string) => {
        return KEYSTORE.getAccountFromMnemonic(mnemonic, address_index);
    }

    getAccountByLedger = async (index: number) => {
        return KEYSTORE.getAccountByLedger(index);
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